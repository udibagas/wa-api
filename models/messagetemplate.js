"use strict";
const { Model } = require("sequelize");
const mailer = require("../service/mailer");

module.exports = (sequelize, DataTypes) => {
  class MessageTemplate extends Model {
    static associate(models) {
      MessageTemplate.belongsTo(models.App, {
        foreignKey: "appId",
        onDelete: "SET NULL",
      });
    }
  }

  MessageTemplate.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Name is required" },
          notEmpty: { msg: "Name is required" },
        },
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "Body is required" },
          notEmpty: { msg: "Body is required" },
          len: {
            args: [1, 4096],
            msg: "Body length must be between 1 and 4096 characters",
          },
        },
      },
      components: DataTypes.JSON,
      appId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "App is required" },
          notEmpty: { msg: "App is required" },
        },
      },
      file: DataTypes.JSON,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "MessageTemplate",
    }
  );

  MessageTemplate.afterUpdate((instance) => {
    if (instance.changed("status") && instance.status === "submitted") {
      mailer
        .sendMail({
          from: process.env.SMTP_USER || "udibagas@gmail.com",
          to: "udibagas@gmail.com",
          subject: `Template Submitted: ${instance.name}`,
          html: `
        <h3>Dear Admin,</h3>

        <p>Message template has been submitted with the following details:</p>
        
        <p>
          Name: <br />
          <strong>${instance.name}</strong>
        </p>

        <p>
          Body:<br />
          <pre>${instance.body}</pre>
        </p>

        <p>
          Components:<br />
          ${JSON.stringify(instance.components)}
        </p>
        

        <p>Please submit the template for review.</p>

        Regards,
        <br />
        <br />
        <br />
        <strong>BlastIt! Team</strong>
      `,
        })
        .then(() => {
          console.log("Email sent");
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  });

  MessageTemplate.afterDestroy((instance) => {
    mailer
      .sendMail({
        from: process.env.SMTP_USER || "udibagas@gmail.com",
        to: "udibagas@gmail.com",
        subject: `Template Deleted: ${instance.name}`,
        html: `
      <h3>Dear Admin,</h3>
      <p>Message template has been deleted with the following details:</p>

      <p>
        Name: <br />
        <strong>${instance.name}</strong>
      </p>

      <br />

      <p>Please remove the template from the system.<p>
      <br />

      Regards,
      <br />
      <br />
      <br />
      <strong>BlastIt! Team</strong>
      `,
      })
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error.message);
      });
  });

  return MessageTemplate;
};
