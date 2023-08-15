import { BaseService } from "./BaseService";
import { Repository } from "../utils/decorators/Repository";
import { UserRepository } from "../repositories/UserRepository";
import { QueryRunner, EntityManager } from "typeorm";
import { BankAccountRepository } from "../repositories/BankAccountRepository";
import { BankTransaction } from "../typeorm/entities/BankTransaction.entity";

export class UserService extends BaseService{
    @Repository
    private userRepository: UserRepository;

    @Repository
    private bankAccountRepository: BankAccountRepository;

    constructor(entityManagerOrRunner?: EntityManager | QueryRunner) {
        super(entityManagerOrRunner);
        this.userRepository = new UserRepository(this.connection);
        this.bankAccountRepository = new BankAccountRepository(this.connection);
    }


    /**
     * Update daily transfered and deposited amount
     * @param transaction
     */
    async updateDailyTransactionedAmount(transaction: BankTransaction): Promise<void> {
    const senderAccount = await this.bankAccountRepository.findOneOrFail({where: {id: transaction.from_account_id}});
    const receiverAccount = await this.bankAccountRepository.findOneOrFail({where: {id: transaction.to_account_id}});


    await this.transaction.run(async () => {
            await this.userRepository
                .increaseDailyTransferedAmount(senderAccount.user_id, transaction.amount);
            await this.userRepository
                .increaseDailyDepositedAmount(receiverAccount.user_id, transaction.amount);
        })
    }
}