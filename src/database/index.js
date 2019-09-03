import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

// Guarda todos os Models em um Array
const models = [User, File, Appointment];

// Classe que faz a conexão com a base de dados
class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    // inicializa cada Model através do método 'init'
    models
      .map(model => model.init(this.connection))
      // executa o método 'associate' de cada Model (caso esse método exista)
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    mongoose.connect('mongodb://192.168.99.100:27017/gobarber', {
      useNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}

export default new Database();
