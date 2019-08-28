import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

// importa o Controller de User
import UserController from './app/controllers/UserController';
// importa o Controller de Session
import SessionController from './app/controllers/SessionController';
// importa o Controller de Arquivo
import FileController from './app/controllers/FileController';
// importa o Controller de Provider (que também é User)
import ProviderController from './app/controllers/ProviderController';

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

routes.get('/providers', ProviderController.index);

// Inicializa o multer
const upload = multer(multerConfig);

// Rota para upload de um arquivo
// Define como middleware o método do multer para upload de um único arquivo
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
