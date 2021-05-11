import { Application, Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors/Errors';
import logger from './logger';

export default (app: Application) => {

    // If you are lost
    app.use(() => {
        throw new NotFoundError("Resource not found.");
    });

    // Log all errors
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {

        // Log error
        logger.log(`Error occured`);

        // Define status
        let status: number;

        // Define message
        let message: string;

        // Check if error has a code
        if (err.code) {

            // Use code and message from the err object
            status = err.code;
            message = err.message;
        } else {

            // Send 500 status with default message
            status = 500;
            message = "Internal server error."
        }

        // Check if headers wasn't sent already
        if (!res.headersSent) {

            // Send response back
            return res.status(status).send({
                message
            });
        }

        next(err);
    });
}
