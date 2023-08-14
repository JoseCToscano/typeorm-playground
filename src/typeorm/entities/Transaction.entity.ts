import { BaseEntity } from "./BaseEntity.entity";
import { Column, JoinColumn, ManyToOne } from "typeorm";
import { BankAccount } from "./BankAccount.entity";

export class Transaction extends BaseEntity {

    @Column({ type: 'int', nullable: false, unique: false })
    amount!: number;

    @Column({type: "int", nullable: false, unique: false})
    from_account_id!: number;

    @Column({type: "int", nullable: false, unique: false})
    to_account_id!: number;

    @ManyToOne(() => BankAccount, bankAccount => bankAccount.transfers)
    @JoinColumn({ name: 'from_account_id', referencedColumnName: 'id' })
    from_account?: BankAccount;

    @ManyToOne(() => BankAccount, bankAccount => bankAccount.deposits)
    @JoinColumn({ name: 'to_account_id', referencedColumnName: 'id' })
    to_account?: BankAccount;
}