import { BaseRepository } from "./BaseRepository";
import { BankTransaction } from "../typeorm/entities/Transaction.entity";

export class TransactionRepository extends BaseRepository<BankTransaction> {

    entity = BankTransaction;

}