import { MigrationInterface, QueryRunner } from "typeorm";

export class BankAccountsAndBankTransactions1692075240396 implements MigrationInterface {
    name = 'BankAccountsAndBankTransactions1692075240396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`bank_accounts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP, \`is_active\` tinyint NOT NULL DEFAULT 1, \`balance\` int NOT NULL, \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`bank_transactions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP, \`is_active\` tinyint NOT NULL DEFAULT 1, \`amount\` int NOT NULL, \`from_account_id\` int NOT NULL, \`to_account_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`dailyDepositedAmount\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`dailyTransferedAmount\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`bank_accounts\` ADD CONSTRAINT \`FK_29146c4a8026c77c712e01d922b\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bank_transactions\` ADD CONSTRAINT \`FK_662375c05064a17e9a0b1b293ff\` FOREIGN KEY (\`from_account_id\`) REFERENCES \`bank_accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`bank_transactions\` ADD CONSTRAINT \`FK_ce36b99b52983c77db82e19d540\` FOREIGN KEY (\`to_account_id\`) REFERENCES \`bank_accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`bank_transactions\` DROP FOREIGN KEY \`FK_ce36b99b52983c77db82e19d540\``);
        await queryRunner.query(`ALTER TABLE \`bank_transactions\` DROP FOREIGN KEY \`FK_662375c05064a17e9a0b1b293ff\``);
        await queryRunner.query(`ALTER TABLE \`bank_accounts\` DROP FOREIGN KEY \`FK_29146c4a8026c77c712e01d922b\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`dailyTransferedAmount\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`dailyDepositedAmount\``);
        await queryRunner.query(`DROP TABLE \`bank_transactions\``);
        await queryRunner.query(`DROP TABLE \`bank_accounts\``);
    }

}
