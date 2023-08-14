import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany} from 'typeorm';
import { BaseEntity } from "./BaseEntity.entity";
import {User} from "./User.entity";
import {Transaction} from "./Transaction.entity";

@Entity('bank_accounts')
export class BankAccount extends BaseEntity {

    @Column({ type: 'int', nullable: false, unique: false })
    balance!: number;

    @Column({type: "int", nullable: false, unique: false})
    user_id!: number;

    @ManyToOne(() => User, user => user.bankAccounts)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    user?: User;

    @OneToMany(() => Transaction, transaction => transaction.from_account)
    transfers?: Transaction[];

    @OneToMany(() => Transaction, transaction => transaction.to_account)
    deposits?: Transaction[];

}