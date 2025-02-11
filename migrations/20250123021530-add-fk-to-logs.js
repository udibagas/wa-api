"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Logs", "MessageTemplateId", {
      type: Sequelize.INTEGER,
      references: {
        model: "MessageTemplates",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("Logs", "AppId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Apps",
        key: "id",
      },
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Logs", "MessageTemplateId");
    await queryInterface.removeColumn("Logs", "AppId");
  },
};
