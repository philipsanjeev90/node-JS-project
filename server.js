'use strict';
import 'app-module-path/register';
import { addPath } from 'app-module-path';
addPath(__dirname);
import config_server from 'app/global/config';
import AppRoutes from 'app/routes';
import AppMiddleware from 'app/middleware';

import express from 'express';
import winston from 'winston';
// setting debug level for winston logger
// enable detailed logging by putting log level to info
winston.level = process.env.LOG_LEVEL || 'error'
//winston.level = process.env.LOG_LEVEL || 'info'

let app4 = express();
//---------------------------------------------//
//@ invoke Middleware by passing express object
//@ invoke routes and register to express instance
new AppMiddleware(app);
new AppRoutes(app, express);
//---------------------------------------------//

// Finally start HTTP server with Express
let server = app.listen(
    app.get('port'),
    () => {
        const port = server.address().port;
        winston.log('info', `Node API running at http://localhost:${port}`)
        console.log('Node API running at http://localhost:' +port)
    }
);
export default app;
