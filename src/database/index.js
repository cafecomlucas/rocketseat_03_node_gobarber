import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../app/models/User';

// Guarda todos os Models em um Array
const models = [User];

// Classe que faz a conexão com a base de dados
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    // inicializa cada Model através do método 'init'
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
