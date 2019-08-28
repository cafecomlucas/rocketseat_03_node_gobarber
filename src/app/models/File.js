import Sequelize, { Model } from 'sequelize';

// cria a classe File como filha da classe Model
class File extends Model {
  // método de inicialização (chamado automaticamente pelo sequelize)
  static init(sequelizeConnection) {
    // chama o método init da classe pai (Model)
    super.init(
      {
        // Campos preenchidos pelo usuário do sistema
        name: Sequelize.STRING,
        path: Sequelize.STRING,
      },
      {
        // necessário informar o objeto de conexão do sequelize
        sequelize: sequelizeConnection,
      }
    );

    // retorna o próprio Model
    return this;
  }
}

export default File;
