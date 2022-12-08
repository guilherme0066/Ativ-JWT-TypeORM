import { Router } from "express";
import {colaborador} from "../controllers";
import { authAdmin, authGestor } from "../middlewares";

const routes = Router();

routes.post('/', authAdmin, colaborador.create);
routes.put('/', authAdmin, colaborador.update);
routes.put('/password', colaborador.updatePassword);
routes.delete('/', authAdmin, colaborador.delete);
routes.get('/:perfil', authGestor, colaborador.list);


export default routes;