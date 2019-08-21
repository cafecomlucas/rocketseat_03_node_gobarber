import Sequelize, { Model } from 'sequelize';

// cria a classe User como filha da classe Model
class User extends Model {
  // método de inicialização (chamado automaticamente pelo sequelize)
  static init(sequelize) {
    // chama o método init da classe pai (Model)
    super.init(
      {
        // Aqui só vão as colunas que são preenchidas pelo usuário do sistema;
        // Não é necessário indicar chaves primárias, chaves estrangeiras
        // ou campos automáticos como o created_at e updated_ad
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        // necessário informar o objeto do sequelize
        // (também aceita outros objetos como o
        // `tableName` que muda o nome da tabela)
        sequelize,
      }
    );
  }
}

export default User;
