import express from 'express';
import Sequelize from 'sequelize';
import routes from './routes';
import databaseConfig from './config/database';
/**
 * Estrutura da aplicação
 */

// Faz sentido utilizarmos classes (principalmente no back-end)
class App {
  // Método chamado ao instanciar essa classe
  constructor() {
    // cria uma instância do express
    this.server = express();

    // conecta a base de dados
    this.database();

    // configura os middleares e as rotas
    this.middlewares();
    this.routes();
  }

  // método que faz a conexão com a base de dados
  database() {
    this.connection = new Sequelize(databaseConfig);

    this.connection
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });
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
