import express from 'express';
import routes from './routes';

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

    // configura os middleares e as rotas
    this.middlewares();
    this.routes();
  }

  // método com a configuração de todos os middlewares
  middlewares() {
    // middleware para receber requisições no formato JSON
    this.server.use(express.json());
  }

  // método com a configuração de todas as rotas
  routes() {
    this.server.use(routes);
  }
}

// exporta a propriedade server da instância de App
export default new App().server;
