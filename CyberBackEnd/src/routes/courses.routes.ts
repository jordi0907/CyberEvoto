import { Router } from "express";
import {courses} from '../controller/courses.controller';

/* import { courses } from "../controllers/courses.controller"; */

const router = Router();

router.get('/', courses);

export default router;