import * as express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

import logger from './utils/logger';

const app = express();

/**
 * Setup listener port
 */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    logger.log(`App is running on port ${PORT}`);
});

export default app;
