import { Router } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { getPublicKeyRSA,descifrarRSA,cifrarRSA,signRSA, votarRSA, signIn, registrar, recuento} from '../controller/rsa.controller';
import passport from "passport";


const router = Router();


router.get('/clave', getPublicKeyRSA);
router.post('/mensajeD', descifrarRSA);
router.post('/mensajeC', cifrarRSA);
router.post('/signServer', passport.authenticate("jwt", {session: false}), signRSA);
router.post('/votarServ', votarRSA);
router.post('/signIn', signIn);
//router.post('/registrar', registrar);
router.post('/registrar', passport.authenticate("jwt", {session: false}), registrar);
router.get('/recuento', recuento);


//router.get('/clave', getPublica);



export default router;