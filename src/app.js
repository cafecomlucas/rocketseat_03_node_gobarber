import 'dotenv/config';

import express from 'express';
import 'express-async-errors';
import Youch from 'youch';
import { resolve } from 'path';
// necessário importar com o * pois o Sentry não tem o export default
import * as Sentry from '@sentry/node';
import routes from './routes';
import sentryConfig from './config/sentry';

// conecta a base de dados
import './database';

/**
 * Estrutura da aplicação
 */

// Faz sentido utilizarmos classes (principalmente no back-end)
class App {
  // Método chamado ao instanciar essa classe
  constructor() {
    // cria uma instância do express
    this.server = express();

    // Inicializa o monitoramento dos possíveis erros
    Sentry.init(sentryConfig);

    // configura os middleares e as rotas
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  // método com a configuração de todos os middlewares
  middlewares() {
    // adiciona o monitoramento de erros antes da execução de qualquer middleware
    this.server.use(Sentry.Handlers.requestHandler());

    // middleware para receber requisições no formato JSON
    this.server.use(express.json());
    // Define rota de acesso aos arquivos estáticos (avatares dos usuários)
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  // método com a configuração de todas as rotas
  routes() {
    this.server.use(routes);

    // manipula os possíveis erros disparados
    this.server.use(Sentry.Handlers.errorHandler());
  }

  // retorna uma resposta no formato Json em caso de erro
  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      // responde com os erros apenas em desenvolvimento pois pode conter dados sensíveis
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }
      // em ambiente de produção, apenas retorna uma mensagem pro usuário
      return res.status(500).json({ error: 'Internal Server Error' });
    });
  }
}

// exporta a propriedade server da instância de App
export default new App().server;
