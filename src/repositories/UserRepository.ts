import {BaseRepository} from "./BaseRepository";
import {User} from "../typeorm/entities/User.entity";

export class UserRepository extends BaseRepository<User>{
    entity = User;

    async increaseDailyDepositedAmount(userId: number, amount: number) {
        return this.Repository
            .createQueryBuilder()
            .update(User)
            .set({ dailyDepositedAmount: () => `dailyDepositedAmount + ${amount}` })
            .where("id = :id", { id: userId })
            .execute();
    }

    async increaseDailyTransferedAmount(userId: number, amount: number) {
        return this.Repository
            .createQueryBuilder()
            .update(User)
            .set({ dailyDepositedAmount: () => `dailyTransferedAmount + ${amount}` })
            .where("id = :id", { id: userId })
            .execute();
    }
}