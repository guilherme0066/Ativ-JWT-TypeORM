import { Router } from "express";
import {cliente} from "../controllers";
import { authAdmin } from "../middlewares";
const routes = Router();

routes.post('/', authAdmin, cliente.create);
routes.put('/', authAdmin, cliente.update);
routes.delete('/', authAdmin, cliente.delete);
routes.get('/:status', cliente.list);

export default routes;