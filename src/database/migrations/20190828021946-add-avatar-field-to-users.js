module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      // se o registro de 'files' for alterado, atualiza o campo 'avatar_id'
      onUpate: 'CASCADE',
      // se o registro de 'files' for deletado, seta o campo 'avatar_id' como nulo
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: queryInterface => queryInterface.removeColumn('users', 'avatar_id'),
};
