import {Entity, Column, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import { BaseEntity } from "./BaseEntity.entity";
import {User} from "./User.entity";
import {BankTransaction} from "./BankTransaction.entity";

@Entity('bank_accounts')
export class BankAccount extends BaseEntity {

    @Column({ type: 'int', nullable: false, unique: false })
    balance!: number;

    @Column({type: "int", nullable: false, unique: false})
    user_id!: number;

    @ManyToOne(() => User, user => user.bankAccounts)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user?: User;

    @OneToMany(() => BankTransaction, bankTransaction => bankTransaction.from_account)
    transfers?: BankTransaction[];

    @OneToMany(() => BankTransaction, bankTransaction => bankTransaction.to_account)
    deposits?: BankTransaction[];


}