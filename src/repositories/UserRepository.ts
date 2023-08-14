import {BaseRepository} from "./BaseRepository";
import {User} from "../typeorm/entities/User.entity";

export class UserRepository extends BaseRepository<User>{
    entity = User;

}