import {BaseService} from "./BaseService";
import {EntityManager, QueryRunner} from "typeorm";
import { BankAccountRepository } from "../repositories/BankAccountRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { UserService } from "./UserService";
import { Repository } from "../utils/decorators/Repository";

export class BankTransferService extends BaseService{
    @Repository
    private bankAccountRepository: BankAccountRepository;

    @Repository
    private transactionRepository: TransactionRepository;

    constructor(entityManagerOrRunner?: EntityManager | QueryRunner) {
        super(entityManagerOrRunner);
        this.bankAccountRepository = new BankAccountRepository(this.connection);
        this.transactionRepository = new TransactionRepository(this.connection);
    }

    /**
     * Transfer money from one account to another
     * @param fromAccountId
     * @param toAccountId
     * @param amount
     */
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
        await this.transaction.run(async (queryRunner) => {
            const bankTransaction = await this.transactionRepository.save({
                from_account_id: fromAccountId,
                to_account_id: toAccountId,
                amount
            });
            await this.bankAccountRepository.decreaseBalance(fromAccountId, amount);
            await this.bankAccountRepository.increaseBalance(toAccountId, amount);

            // Update daily transfered and deposited amount for each account's user
            const userService = new UserService(queryRunner);
            await userService.updateDailyTransactionedAmount(bankTransaction);
        });
    }

}