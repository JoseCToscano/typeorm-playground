import { BaseRepository } from "./BaseRepository";
import { Transaction } from "../typeorm/entities/Transaction.entity";

export class TransactionRepository extends BaseRepository<Transaction> {

    entity = Transaction;
}