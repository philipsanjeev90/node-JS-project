// Middleware for Application
import ContentTypeMiddleware from 'app/global/middlewares/ContentType';
import EmptyContentMiddleware from 'app/global/middlewares/EmptyContent';
import CsrfMiddleware from 'app/global/middlewares/csrfMiddleware';

import config_server from 'app/global/config';
import express from 'express';
import body_parser from 'body-parser';
/* adding some security to express app */
import express_session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import csrf from 'csurf';


let middleware = function(app) {
    // setting port for application 
    app.set('port', process.env.PORT || config_server.PORT);
    // adding security fixes
    app.disable('x-powered-by');
    app.use(helmet())
    app.use(helmet.noCache({ noEtag: true })); //set Cache-Control header
    app.use(helmet.noSniff()); // set X-Content-Type-Options header
    app.use(helmet.frameguard()); // set X-Frame-Options header
    app.use(helmet.xssFilter()); // set X-XSS-Protection header

    app.enable('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])
        // enabled express session
    app.use(express_session({
            name: 'SESS_ID',
            secret: config_server.EXPRESS_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: true,
                httpOnly: true
            }
        }))
        // added Middleware to extract body data if requitred 
    app.use(body_parser.urlencoded({
        extended: false
    })); // parse application/x-www-form-urlencoded
    app.use(body_parser.json()); // parse application/json
    /**
     * enable CORS support. // Cross-Origin Request Support
     */
    // register all custom Middleware
    app.use(cors({
        optionsSuccessStatus: 200
    }));
    // registering security Middleware for application
    app.use(ContentTypeMiddleware);
    app.use(EmptyContentMiddleware);
    app.use(CsrfMiddleware);

}

export default middleware;