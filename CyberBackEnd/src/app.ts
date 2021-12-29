//config de la aplicacion/servidor

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from'body-parser';
 import * as bcu from 'bigint-crypto-utils'
import * as bigintConversion from 'bigint-conversion' 

import rsaRoutes from './routes/rsa.routes';
import * as rsa from "./models/rsa";



//inicializations
const app = express();

// settings
app.set('port', process.env.PORT || 3000);


// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());



 app.use('/rsa', rsaRoutes ); 

 

export default app;
