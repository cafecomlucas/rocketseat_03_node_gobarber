import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

// classe que faz a conexão com a base de dados
class Database {
  constructor() {
    this.init();
  }

  init() {
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
}

export default new Database();
