import logger from "./utils/logger";
import app from './server';

import * as express from "express";
import db from "./database/Database";
import errorHandler from "./utils/error.handler";

import "reflect-metadata";

import { StudentController } from './controllers/StudentController';
import container from './inversify';


// App bootstrap
async function bootstrap() {

    // Configure express middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Hide server information
    app.disable('x-powered-by');

    // Connect to database
    if (!db.isConnected()) await db.connect();

    // Get controllers instances
    const StudentControllerInstance = container.get<StudentController>(StudentController);

    // Register routes
    app.post('/student', StudentControllerInstance.create.bind(StudentControllerInstance));
    app.post('/student/list', StudentControllerInstance.list.bind(StudentControllerInstance));
    // I'm using post method for the listing endpoint to allow passing complex objects in the request ..
    // .. for filtering, ordering and sorting purposes

    // Handle errors
    errorHandler(app);
}

// Need for integration testing
export default app;

// Invoking the bootstrap function
bootstrap()
    .then(() => {
        logger.log('Server is up');
    })
    .catch((error) => {
        logger.log('Unknown error. ' + error.message);
    });
