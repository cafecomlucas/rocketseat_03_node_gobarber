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

        // Campo gerado automáticamente, quando os dados
        // de um Arquivo específico são requisitados
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3333/files/${this.path}`;
          },
        },
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
