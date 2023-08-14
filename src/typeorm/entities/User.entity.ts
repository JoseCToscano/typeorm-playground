import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {BaseEntity} from "./BaseEntity.entity";
import {BankAccount} from "./BankAccount.entity";

@Entity('users')
export class User extends BaseEntity {

    @Column({ type: 'varchar', length: 45, nullable: false, unique: true})
    username!: string;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true})
    email!: string;

    @OneToMany(() => BankAccount, bankAccount => bankAccount.user_id)
    bankAccounts?: BankAccount[];
}