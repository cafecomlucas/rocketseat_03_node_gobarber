import { Router } from 'express';

// importa o Controller de User
import UserController from './app/controllers/UserController';
// importa o Controller de Session
import SessionController from './app/controllers/SessionController';

// importa o middleware de autenticação
import authMiddleware from './app/middlewares/auth';

/**
 * Configuração do Roteamento que será utilizado pela aplicação
 */

const routes = new Router();

// Rota para criar um novo usuário
routes.post('/users', UserController.store);

// Rota para criar uma nova sessão de usuário
routes.post('/sessions', SessionController.store);

// middleware global para todas as rotas
// que precisam de autenticação (daqui pra baixo)
routes.use(authMiddleware);

// Rota para atualizar um usuário
routes.put('/users', UserController.update);
// caso auth fosse um middleware local,
// seria definido na própria chamada do método put:
// routes.put('/users', authMiddleware, UserController.update);

export default routes;
