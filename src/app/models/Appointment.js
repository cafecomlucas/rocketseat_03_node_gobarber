import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

// cria a classe Appointment como filha da classe Model
class Appointment extends Model {
  // método de inicialização (chamado automaticamente pelo sequelize)
  static init(sequelizeConnection) {
    // chama o método init da classe pai (Model)
    super.init(
      {
        // Campos preenchidos pelo usuário do sistema
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        // Aqui não são necessários os campos do relacionamento
        // pois serão criados abaixo através do método associate

        // campos virtuais utilizados pelo cliente
        // indica se a data é antiga
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        // indica se é possível cancelar o agendamento
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
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

  // Define o relacionamento entre este Model e o Model User
  // (gerando assim os campos de relacionamento automaticamente)
  static associate(models) {
    // o apelido (alias) precisa ser definido na propriedae 'as'
    // quando existe mais de um relacionamento com o mesmo Model/tabela
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
