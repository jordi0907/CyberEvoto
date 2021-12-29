//donde se lanza la aplicacion

import app from './app'
import './database';
import {rsaInit} from './controller/rsa.controller';




app.listen(app.get('port'));
console.log('servidor en puerto', app.get('port'));
rsaInit();

