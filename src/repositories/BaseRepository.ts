import {EntityManager, EntityTarget, FindManyOptions} from "typeorm";
import dataSource from "../typeorm/data-source";

export abstract class BaseRepository<R> {

    connection: EntityManager;

    abstract entity: EntityTarget<R>;

    get Repository() {
        return this.connection.getRepository(this.entity);
    }

    constructor(entityManager?: EntityManager) {
        if(!entityManager){
            this.connection = dataSource.manager;
        }else{
            this.connection = entityManager;
        }
    }


    async find(options: FindManyOptions<R>): Promise<R[]>{
        return this.Repository.find(options);
    }

    async findOneOrFail(options: FindManyOptions<R>): Promise<R>{
        return this.Repository.findOneOrFail(options);
    }

   async save(entity: Partial<R>): Promise<R>{
       return this.Repository.save(entity as R);
    }
}