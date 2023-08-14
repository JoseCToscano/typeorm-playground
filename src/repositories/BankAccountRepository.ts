import { BaseRepository } from "./BaseRepository";
import { BankAccount } from "../typeorm/entities/BankAccount.entity";

export class BankAccountRepository extends BaseRepository<BankAccount>{
    entity = BankAccount;

    decreaseBalance(id: number, amount: number) {
        return this.Repository
            .createQueryBuilder()
            .update(BankAccount)
            .set({ balance: () => `balance - ${amount}` })
            .where("id = :id", { id })
            .execute();
    }

    increaseBalance(id: number, amount: number) {
        return this.Repository
            .createQueryBuilder()
            .update(BankAccount)
            .set({ balance: () => `balance + ${amount}` })
            .where("id = :id", { id })
            .execute();
    }
}