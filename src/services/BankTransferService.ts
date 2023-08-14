import {BaseService} from "./BaseService";
import {EntityManager, QueryRunner} from "typeorm";
import {UserRepository} from "../repositories/UserRepository";
import { BankAccountRepository } from "../repositories/BankAccountRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";

export class BankTransferService extends BaseService{

    private userRepository: UserRepository;

    private bankAccountRepository: BankAccountRepository;

    private transactionRepository: TransactionRepository;

    constructor(entityManagerOrRunner?: EntityManager | QueryRunner) {
        super(entityManagerOrRunner);
        this.userRepository = new UserRepository(this.connection);
        this.bankAccountRepository = new BankAccountRepository(this.connection);
        this.transactionRepository = new TransactionRepository(this.connection);
    }

    async transferMoney(fromAccountId: number, toAccountId: number, amount: number): Promise<void> {

        // Simple validation
        if(fromAccountId === toAccountId) {
            throw new Error("Cannot transfer money to the same account");
        }

        const senderAccount = await this.bankAccountRepository.findOneOrFail({where: {id: fromAccountId}});

        if(senderAccount.balance < amount) {
            throw new Error("Insufficient funds");
        }

        await this.bankAccountRepository.findOneOrFail({where: {id: toAccountId}});

        // Transaction should be atomic: either all operations succeed or all fail
        await this.transaction.run(async () => {
            // TODO: call banking service to mock a transaction
            // TODO: create banking service that needs a transaction to be passed
            await this.transactionRepository.save({
                from_account_id: fromAccountId,
                to_account_id: toAccountId,
                amount
            });
            await this.bankAccountRepository.decreaseBalance(fromAccountId, amount);
            await this.bankAccountRepository.increaseBalance(toAccountId, amount);
        });
    }

}