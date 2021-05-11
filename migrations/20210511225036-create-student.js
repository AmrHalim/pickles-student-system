'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('student', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.NUMBER
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('student');
  }
};