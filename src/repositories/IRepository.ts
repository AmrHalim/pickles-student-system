export interface IRepository<T> {

    instance: any;

    insert(obj: T): Promise<T>;

    findAll(filter?: any[], sort?: any, pagination?: any): Promise<T[]>;

    count(filter?: any[]): Promise<number>;
}