import { Router } from 'express';

// importa o Controller de User
import UserController from './app/controllers/UserController';
// importa o Controller de Session
import SessionController from './app/controllers/SessionController';

/**
 * Configuração do Roteamento que será utilizado pela aplicação
 */

const routes = new Router();

// Rota para criar um novo usuário
routes.post('/users', UserController.store);

// Rota para criar uma nova sessão de usuário
routes.post('/sessions', SessionController.store);

// Rota para atualizar um usuário
routes.put('/users', UserController.update);

export default routes;
