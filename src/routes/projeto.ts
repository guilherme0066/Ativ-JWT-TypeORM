import { Router } from "express";
import {projeto} from "../controllers";
import { authAdmin } from "../middlewares";
const routes = Router();

routes.post('/', authAdmin, projeto.create);
routes.put('/', authAdmin, projeto.update);
routes.delete('/', authAdmin, projeto.delete);
routes.get('/:status', projeto.list);

export default routes;