import { Router } from 'express';

// importa o Controller de User
import UserController from './app/controllers/UserController';

/**
 * Configuração do Roteamento que será utilizado pela aplicação
 */

const routes = new Router();

routes.post('/users', UserController.store);

export default routes;
