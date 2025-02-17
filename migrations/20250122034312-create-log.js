"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Logs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ContactId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Contacts",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      response: {
        type: Sequelize.JSON,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "pending",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Logs");
  },
};
