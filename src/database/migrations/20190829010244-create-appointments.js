module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpate: 'CASCADE',
        // Se um Usuário for excluído de 'users', mantém o
        // agendamento pra ter um histórico pro Prestador
        // (por isso 'SET NULL' ao invés de 'CASCADE')
        onDelete: 'SET NULL',
        allowNull: true,
      },
      provider_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpate: 'CASCADE',
        // Se um Provedor for excluído de 'users', mantém o
        // agendamento pra ter um histórico pro Usuário
        // (por isso 'SET NULL' ao invés de 'CASCADE')
        onDelete: 'SET NULL',
        allowNull: true,
      },
      canceled_at: {
        type: Sequelize.DATE,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => queryInterface.dropTable('appointments'),
};
