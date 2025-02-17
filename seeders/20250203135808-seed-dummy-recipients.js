"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Contacts",
      Array.from({ length: 50 }, (_, i) => ({
        name: `John Doe ${i}`,
        phoneNumber: `628123456789${i}`,
        dateOfBirth: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Contacts", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
