import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

// cria a classe User como filha da classe Model
class User extends Model {
  // método de inicialização (chamado automaticamente pelo sequelize)
  static init(sequelizeConnection) {
    // chama o método init da classe pai (Model)
    super.init(
      {
        // Aqui só vão as colunas que são preenchidas pelo usuário do sistema;
        // Não é necessário indicar chaves primárias, chaves estrangeiras
        // ou campos automáticos como o created_at e updated_ad
        // Portanto, não precisa refletir exatamente a tabela do banco de dados
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        // necessário informar o objeto de conexão do sequelize
        // (também aceita outros objetos como o
        // `tableName` que muda o nome da tabela)
        sequelize: sequelizeConnection,
      }
    );

    // Configura um Hook
    // antes de salvar o usuário (criação ou edição)
    this.addHook('beforeSave', async user => {
      // se o campo virtual password foi preenchido
      if (user.password) {
        // Encripta a senha recebida no campo virtual
        // e armazena na coluna password_hash da base de dados
        // O primeiro argumento do método 'hash' recebe o dado que será encriptado
        // O segundo arqumento do método 'hash' recebe a força da encriptação (8 é um bom número)
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    // retorna o próprio Model
    return this;
  }

  // Verifica se a senha informada é igual a senha da base de dados
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
