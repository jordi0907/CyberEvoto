import { Router } from "express";
import { getPublicKeyRSA,descifrarRSA,cifrarRSA,signRSA, votarRSA} from '../controller/rsa.controller';


const router = Router();


router.get('/clave', getPublicKeyRSA);
router.post('/mensajeD', descifrarRSA);
router.post('/mensajeC', cifrarRSA);
router.post('/signServer', signRSA);
router.post('/votarServ', votarRSA);

//router.get('/clave', getPublica);



export default router;