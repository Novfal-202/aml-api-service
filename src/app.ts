import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import { NOT_FOUND } from 'http-status';
import { appConfiguration, AppDataSource } from './v1/config';
import { loggerConfiguration } from './v1/utils';
import bodyParser from 'body-parser';
import { router } from './v1/routes/router';

const { envPort } = appConfiguration;

const initializeServer = async (): Promise<void> => {
  try {
    // Create the Express application
    const app: Application = express();

    // Middleware for parsing JSON request body
    app.use(bodyParser.json({ limit: '5mb' }));

    app.use(bodyParser.urlencoded({ limit: '5mb', extended: true, parameterLimit: 50000 }));

    app.use(express.json({ limit: '5mb' }));

    // Middleware for parsing urlencoded request body
    app.use(express.urlencoded({ extended: true }));

    // Middleware to enable CORS
    app.use(cors());

    // Enable CORS preflight for all routes
    app.options('*', cors());

    //router
    app.use('/api/v1', router);

    // 404 handler for unknown API requests
    app.use((req: Request, res: Response, next: NextFunction) => {
      next({ statusCode: NOT_FOUND, message: 'Not found' });
    });

    //database connection
    await AppDataSource.authenticate()
      .then(() => loggerConfiguration.info('database connected successfully'))
      .catch((err: any) => loggerConfiguration.info(`error in database connection ${err}`));

    // Start the server
    const server = app.listen(envPort, () => {
      loggerConfiguration.info(`Listening on port ${envPort}...`);
    });

    // Graceful server shutdown
    const exitHandler = (): void => {
      server.close(() => {
        loggerConfiguration.info('Server closed');

        process.exit(0);
      });
    };

    // Handle uncaught exceptions and unhandled rejections
    const unexpectedErrorHandler = (error: Error): void => {
      loggerConfiguration.error('error', error);

      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);

    process.on('unhandledRejection', unexpectedErrorHandler);
  } catch (error) {
    loggerConfiguration.error('Failed to start server:', error);

    process.exit(1);
  }
};

// Start the server
void initializeServer();

//export for testing
export default initializeServer;
