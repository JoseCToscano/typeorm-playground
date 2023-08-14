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


    find(options: FindManyOptions<R>): Promise<R[]>{
        return this.Repository.find(options);
    }
}