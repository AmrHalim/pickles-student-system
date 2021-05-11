import logger from "../utils/logger";

// Import sequelize-typescript needed classes
import { Repository, Sequelize, Model } from 'sequelize-typescript'

// Import Datbase Interface
import IDatabase from './IDatabase';
import { injectable } from "inversify";
import { StudentModel } from "../models/StudentModel";
import { ServerError } from "../errors/Errors";

/**
 * This class is the implementation of the Database Interface
 * It uses in its implementation sequelize-typescript module
 */
@injectable()
class Database implements IDatabase<Repository<Model>> {

    // Define connection properties
    connection: Sequelize;

    dialect: string;
    password: string;
    user: string;
    host: string;
    dbName: string;

    connectionString: string;

    constructor() {
        this.dialect = 'MySQL';
        this.password = process.env.DB_PWD || '';
        this.user = process.env.DB_USER || '';
        this.host = process.env.DB_HOST || 'localhost:27017';
        this.dbName = process.env.DB_NAME || 'my-db';
        this.connectionString = `mysql://${this.user}:${this.password}@${this.host}/${this.dbName}`;
    }

    connect() {

        if (this.isConnected()) {

            logger.log("[Database] Database Already connected.")
            return;
        }

        try {

            this.connection = new Sequelize(this.dbName, this.user, this.password, {
                dialect: 'mysql',
                repositoryMode: true
            })

            this.connection.addModels([StudentModel]);

            logger.log(`[Database] Database is connected using: ${this.dialect} on: ${this.connectionString} `);

        } catch (err) {
            logger.log(err.message)

            throw new ServerError(`Can't connect to database: ${err.message}`);
        }
    }

    disconnect() {

        if (!this.connection) {
            logger.log(`[Database] disconnect() no connection.`)
        }

        this.connection.close();

        return Promise.resolve();
    }

    isConnected() {
        const connected = this.connection ? true : false;
        return connected;
    }

    getConnectionString() {
        return this.connectionString;
    }
}

const db = new Database();

export default db;