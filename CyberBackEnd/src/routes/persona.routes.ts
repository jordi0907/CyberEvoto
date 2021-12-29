import { Router } from "express";
import {getPersona, getPersonas, updatePersona, newPersona} from '../controller/persona.controller';


const router = Router();

router.get('/', getPersonas);
router.post('/', newPersona);
router.put('/:id', updatePersona);
router.get('/:id', getPersona);
//router.delete('/:id', deleteCopiaSeguridad)

export default router;