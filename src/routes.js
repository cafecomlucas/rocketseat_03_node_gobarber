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
// importa o Controller de Available (que é um Provider)
import AvailableController from './app/controllers/AvailableController';
// importa o Controller de Appointment
import AppointmentController from './app/controllers/AppointmentController';
// importa o Controller de Schedule
import ScheduleController from './app/controllers/ScheduleController';
// importa o Controller de Notification
import NotificationController from './app/controllers/NotificationController';

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

// Inicializa o multer
const upload = multer(multerConfig);

// Rota para upload de um arquivo
// Define como middleware o método do multer para upload de um único arquivo
routes.post('/files', upload.single('file'), FileController.store);

// Rota para listar todos os Usuários prestadores de serviço
routes.get('/providers', ProviderController.index);
// Rota para listar todos os horários disponíveis de um Usuário prestador específico
routes.get('/providers/:providerId/available', AvailableController.index);

// Rota para listar Agendamentos de um Usuário Comum
routes.get('/appointments', AppointmentController.index);
// Rota para criar um Agendamento com um Usuário prestador de serviço
routes.post('/appointments', AppointmentController.store);
// Rota para cancelar um Agendamento feito com um Usuário prestador de serviço
routes.delete('/appointments/:id', AppointmentController.delete);

// Rota para listar Agendamentos de um Usuário prestador de serviço
routes.get('/schedule', ScheduleController.index);

// Rota para listar Notificações de Agendamento de um Usuário prestador de serviço
routes.get('/notifications', NotificationController.index);
// Rota para atualizar uma Notificação (pra marcar como lida)
routes.put('/notifications/:id', NotificationController.update);

export default routes;
