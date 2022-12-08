import { Router } from "express";
import {turno} from "../controllers";
import { authAdmin } from "../middlewares";
const routes = Router();

routes.post('/', authAdmin, turno.create);
routes.put('/', authAdmin, turno.update);
routes.delete('/', authAdmin, turno.delete);
routes.get('/', turno.list);

export default routes;