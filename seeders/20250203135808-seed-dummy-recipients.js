"use strict";

const { update } = require("../controllers/templates.controller");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert(
      "Recipients",
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
    await queryInterface.bulkDelete("Recipients", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  },
};
