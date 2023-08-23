import { EntityManager, QueryRunner } from 'typeorm';
import dataSource from '../typeorm/data-source';
import { BaseRepository } from '../repositories/BaseRepository';
import { REPOSITORIES_METADATA_KEY } from '../utils/decorators/Repository';

/**
 * Adding custom properties to the EntityManager interface
 * to identify the owner of the instance and the services and repositories that use it
 */
interface TraceableEntityManager extends EntityManager {
	owner: string;
	usedIn: { services: string[]; repositories: string[] };
}

export class BaseService {
	private _connection: EntityManager;
	private queryRunner: QueryRunner | undefined;

	/**
	 * To use class' methods within an existing transaction from a "query runner",
	 * the corresponding QueryRunner must be provided.
	 * If parameter is provided as an EntityManager, it will be used to berform
	 * all operations within the service and its repositories
	 */
	constructor(entityManagerOrRunner?: EntityManager | QueryRunner) {
		if (!entityManagerOrRunner) {
			this._connection = dataSource.manager;
			// Property "manager" is only available in a QueryRunner
		} else if ('manager' in entityManagerOrRunner) {
			this._connection = entityManagerOrRunner.manager;
			// If a transaction is active, use it within the service
			if (entityManagerOrRunner.isTransactionActive) {
				this.useActiveTransaction(entityManagerOrRunner);
			}
		} else {
			this._connection = entityManagerOrRunner;
		}
	}

	/**
	 * Helper function to assign the provided manager to all repositories
	 * marked with the @Repository decorator
	 * @param manager
	 * @private
	 */
	private assignManagerToRepositories(manager: EntityManager) {
		const repositories = Reflect.getMetadata(
			REPOSITORIES_METADATA_KEY,
			this.constructor,
		) as string[];
		repositories.forEach((propertyKey) => {
			const repository = this[
				propertyKey as keyof this
			] as {} as BaseRepository<{}>;
			repository.connection = manager;
			(manager as TraceableEntityManager)?.usedIn?.repositories?.push(
				`${this.constructor.name}.${propertyKey}`,
			);
		});
	}

	get connection(): EntityManager {
		// Any available QueryRunner will be used as connection manager to ensure
		// Any active transactions run within the same runner
		if (this.queryRunner && !this.queryRunner.isReleased) {
			return this.queryRunner.manager;
		}
		return this._connection;
	}

	/**
	 * Removes QueryRunner from class instance and
	 * if existing runner has not yet been released it will relase it
	 */
	private async releaseQueryRunner(): Promise<void> {
		if (this.queryRunner && !this.queryRunner.isReleased) {
			await this.queryRunner.release();
		}
		this.queryRunner = undefined;
	}

	/**
	 * Helper function to use existing query runner, if provided, or initialize
	 * and assign a new Query Runner to the class' instance
	 * @private
	 */
	private createQueryRunner(): QueryRunner {
		if (!this.queryRunner) {
			this.queryRunner = dataSource.createQueryRunner();

			// This will help identify the owner of the query runner
			Object.assign(this.queryRunner.manager, {
				owner: this.constructor.name,
				usedIn: { services: [this.constructor.name], repositories: [] },
			});
		}
		return this.queryRunner;
	}

	// Will only start transaction if one is not started yet
	private startTransaction = async (): Promise<QueryRunner> => {
		if (!this.transaction.isTransactionActive) {
			const runner = this.createQueryRunner();
			await runner.startTransaction();
			this.transaction.isTransactionActive = true;
			this.transaction.isOwner = true;
			this.assignManagerToRepositories(runner.manager);
			this.transaction.log.start();
			return runner;
		}

		if (!this.queryRunner) {
			throw new Error(
				`Transaction already started but no query runner available`,
			);
		}

		this.transaction.log.startSkipped();
		this.assignManagerToRepositories(this.queryRunner.manager);
		return this.queryRunner;
	};

	// Will only commit if transaction is active with existing query runner
	private commitTransaction = async () => {
		if (!this.transaction.isOwner) {
			this.transaction.log.commitSkipped();
			return;
		}

		// Only owner can commit
		if (this.transaction.isTransactionActive && this.queryRunner) {
			await this.queryRunner.commitTransaction();
			this.transaction.log.commit();
			await this.releaseQueryRunner();
			this.transaction.isTransactionActive = false;
			this.transaction.isOwner = false;
		} else {
			throw new Error(
				`Attempted to commit transaction that is not active or no query runner available`,
			);
		}
	};

	// Will only rollback if transaction is active with existing query runner
	private rollbackTransaction = async () => {
		// Any service can rollback a transaction, not necessarily the owner
		if (this.transaction.isTransactionActive && this.queryRunner) {
			await this.queryRunner.rollbackTransaction();
			this.transaction.log.rollback();
			await this.releaseQueryRunner();
			this.transaction.isTransactionActive = false;
			this.transaction.isOwner = false;
		}
	};

	/**
	 * Method to assign an existing Query Runner to this Service
	 * which should be used for further queries.
	 * @param queryRunner
	 */
	private useActiveTransaction = (queryRunner: QueryRunner) => {
		this.transaction.isTransactionActive = true;
		this.transaction.isOwner = false;
		(queryRunner.manager as TraceableEntityManager).usedIn?.services?.push(
			this.constructor.name,
		);
		this.queryRunner = queryRunner;
	};

	/**
	 * Helper to handle database transactions
	 */
	public transaction = {
		isOwner: false,
		isTransactionActive: false,
		// Transaction context provider
		run: async <T>(
			callback: (queryRunner: QueryRunner) => Promise<T>,
		): Promise<T> => {
			const queryRunner = await this.startTransaction();
			try {
				const result = await callback(queryRunner);
				await this.commitTransaction();
				return result;
			} catch (error) {
				await this.rollbackTransaction();
				throw error;
			}
		},

		log: {
			start: () => {
				this.log(`${this.constructor.name}: Transaction started`);
			},
			startSkipped: () => {
				this.log(
					`${this.constructor.name}: Using existing transaction from ${(
						this.queryRunner?.manager as TraceableEntityManager
					)?.owner}`,
				);
			},
			commitSkipped: () => {
				if (!this.transaction.isOwner) {
					this.log(
						`${
							this.constructor.name
						}: Attempted to commit transaction without being the owner. Transaction should be commited by owner (${(
							this.queryRunner?.manager as TraceableEntityManager
						)?.owner})`,
					);
				}
			},
			commit: () => {
				const data = {
					owner: (this.queryRunner?.manager as TraceableEntityManager)?.owner,
					usedIn: (this.queryRunner?.manager as TraceableEntityManager)?.usedIn,
				};

				this.log(
					`${this.constructor.name}: Transaction committed\n`,
					`Transaction owner: ${data.owner}\n`,
					'Transaction used in:\n',
					`Services: \n\t\t${data.usedIn?.services.join('\n\t\t')}\n`,
					`Repositories: \n\t\t${data.usedIn?.repositories.join('\n\t\t')}\n`,
				);
			},
			rollback: () => {
				const data = {
					owner: (this.queryRunner?.manager as TraceableEntityManager)?.owner,
					usedIn: (this.queryRunner?.manager as TraceableEntityManager)?.usedIn,
				};

				this.log(
					`${this.constructor.name}: Transaction rollbacked\n`,
					`Transaction owner: ${data.owner}\n`,
					'Transaction used in:\n',
					`Services: \n\t\t${data.usedIn?.services.join('\n\t\t')}\n`,
					`Repositories: \n\t\t${data.usedIn?.repositories.join('\n\t\t')}\n`,
				);
			},
		},
	};

	private log = (message?: {}, ...optionalParams: {}[]) => {
		if (process.env.SERVICE_TRANSACTIONS_LOGGER === 'all') {
			// eslint-disable-next-line no-console
			console.log(message, ...optionalParams);
		}
	};
}
