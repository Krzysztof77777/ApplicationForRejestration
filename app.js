import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import {
    fileURLToPath
} from 'url';
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import {
    router as indexRoute
} from './routes/index.js';
import {
    router as loginRoute
} from './routes/login.js';

import mongoose from './server/mongooseServer.js';
import startWebsocketServer from './server/websocketServer.js';
import {
    startRouting,
    startRoutingFor404Error
} from './server/routingServer.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'html');

startWebsocketServer(app, PORT);

startRouting(app);

app.use('/', indexRoute);
app.use('/pracownik', indexRoute);
app.use('/changepassword=pracownik', indexRoute);
app.use('/admin/day/:day', indexRoute);
app.use('/pracownik/day/:day', indexRoute);
app.use('/admin', indexRoute);
app.use('/login', loginRoute);

startRoutingFor404Error(app);