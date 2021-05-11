import { IRepository } from "./IRepository";
import { injectable, unmanaged } from "inversify";
import { ModelCtor } from "sequelize-typescript";
import db from "../database/Database";
import { Filter, Paginate, Sort } from "../dto/FilterSortPagination";
import { DatabaseSortDirections, RequestSortDirections, FilterOperations } from "../enums";
import { Op } from "sequelize";
import { ServerError } from "../errors/Errors";

@injectable()
export default class Repository<T> implements IRepository<T> {

    // Specify the type of instance to be of ModelCtor to be used in the implementation
    instance: ModelCtor;

    // Get the model instance from each repository
    constructor(@unmanaged() instance: ModelCtor) {

        // Set the model to 
        this.instance = instance;
    }

    // Private function to prepare filter data
    // To be used for any function that has Filter parameter
    private prepareFilter(filter: Filter[]) {

        // Define where object
        let where = {};

        // Check if filter is sent
        if (filter.length > 0) {

            // Map filter array to populate where condition
            for (let filterObject of filter) {

                // Define operator
                let operator = Op.eq; // Equal to operator by default

                // Switch fitlerObject.operator
                switch (filterObject.operator) {
                    case FilterOperations.GREATER_THAN:
                        operator = Op.gt;
                        break;

                    case FilterOperations.LESS_THAN:
                        operator = Op.lt;
                        break;
                }

                // Add this field to the where query
                where[filterObject.field] = {
                    [operator]: filterObject.value
                }
            }
        }

        // Return where
        return where;
    }

    // Create function
    public async insert(obj: T): Promise<T> {

        // Get repository object from this repository instance
        const repository = await db.connection.getRepository(this.instance);

        // Run create query on the respository
        const doc = await repository.create(obj).catch(err => {

            throw new ServerError(`Can't create object: ${err.message}`)
        });

        // Map document to the type of the used repo
        let object = (doc.toJSON() as unknown) as T;

        // Return created object
        return Promise.resolve(object);
    }

    // Get function
    public async findAll(filter?: Filter[], sort?: Sort, pagination?: Paginate): Promise<T[]> {

        // Get repository object from this repository instance
        const repository = await db.connection.getRepository(this.instance);

        // Define query
        let where = this.prepareFilter(filter);

        // Prepare sort
        let sortObject = [];

        // Check if sort is sent
        if (sort) {

            // Define sort direction
            let sortDirection = sort.direction === RequestSortDirections.ASC ?
                DatabaseSortDirections.ASC :
                DatabaseSortDirections.DESC;

            // Add sortObject
            sortObject.push([sort.field, sortDirection]);
        }

        // Find data
        let results = await repository.findAll({
            where,
            limit: pagination.limit,
            offset: pagination.skip,
            order: sortObject
        }).catch(err => {

            throw new ServerError(`Can't list objects: ${err.message}`)
        });

        // Map objects to match type of the used repo
        let objects = results.map(result => {
            return (result.toJSON() as unknown) as T;
        })

        // Return found list
        return Promise.resolve(objects);
    }

    // Count records with criteria
    public async count(filter?: Filter[]): Promise<number> {

        // Get repository object from this repository instance
        const repository = await db.connection.getRepository(this.instance);

        // Define query
        let where = this.prepareFilter(filter);

        let count = await repository.count({ where }).catch(err => {
            throw new ServerError(`Can't count objects: ${err.message}`)
        });

        return Promise.resolve(count);
    }
}