import { BaseService } from "./BaseService";
import { Repository } from "../utils/decorators/Repository";
import { UserRepository } from "../repositories/UserRepository";
import { QueryRunner, EntityManager } from "typeorm";
import { User } from "../typeorm/entities/User.entity";

export class UserService extends BaseService{
    @Repository
    userRepository: UserRepository;

    constructor(entityManagerOrRunner?: EntityManager | QueryRunner) {
        super(entityManagerOrRunner);
        this.userRepository = new UserRepository(this.connection);
    }

    async getSingleUser(id: number): Promise<User>{
        const [user] = await this.userRepository.find({where: {id}, take: 1});
        if(!user){
            throw new Error('User not found');
        }
        return user;
    }

}