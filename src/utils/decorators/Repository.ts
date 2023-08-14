import {BaseService} from "../../services/BaseService";

export const REPOSITORIES_METADATA_KEY = Symbol('repositories');
// Decorator to mark repositories
export function Repository(target: BaseService, propertyKey: string) {
    const repositories: string[] =
        (Reflect.getMetadata(
            REPOSITORIES_METADATA_KEY,
            target.constructor
        ) as string[]) ?? [];

    repositories.push(propertyKey);

    Reflect.defineMetadata(
        REPOSITORIES_METADATA_KEY,
        repositories,
        target.constructor
    );
}
