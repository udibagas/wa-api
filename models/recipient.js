"use strict";
const { Model, Op } = require("sequelize");
const sendWhatsAppMessage = require("../utils/sendWhatsAppMessage");
const { CronJob } = require("cron");
const jobs = [];

module.exports = (sequelize, DataTypes) => {
  class Recipient extends Model {
    static associate(models) {
      Recipient.belongsToMany(models.Group, {
        through: models.RecipientGroup,
        foreignKey: "RecipientId",
        as: "groups",
      });
    }

    get age() {
      if (!this.dateOfBirth) return null;

      const today = new Date();
      const birthDate = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();

      if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age -= 1;
      }

      return age;
    }

    deleteExistingJob() {
      const existingJob = jobs.findIndex((job) => job.id === this.id);

      if (existingJob > -1) {
        jobs[existingJob].cronJob.stop();
        jobs.splice(existingJob, 1);
      }
    }

    createJob() {
      // create job only if dateOfBirth is set
      if (!this.dateOfBirth) return;
      console.log("Creating job", this.name);
      this.deleteExistingJob();
      const time = new Date(this.dateOfBirth);
      const day = time.getDate();
      const month = time.getMonth() + 1; // month is 0-based

      const cronJob = CronJob.from({
        cronTime: `0 53 11 ${day} ${month} *`,
        start: true,
        timeZone: "Asia/Jakarta",
        unrefTimeout: true,
        onTick: () => this.sendHappyBirthdayMessage(),
      });

      cronJob.runOnce = false;
      jobs.push({ id: this.id, cronJob });
    }

    async sendHappyBirthdayMessage() {
      let message = `
      🎉 *Selamat ulang tahun ${this.name}!
      
      Semoga panjang umur, sehat selalu, dan segala impian serta harapan dapat terwujud. 
      Semoga hari ini membawa kebahagiaan dan kesuksesan di masa depan.
      
      Salam hangat,

      TPKS
      `;

      const template = await sequelize.models.MessageTemplate.findOne({
        where: {
          name: {
            [Op.or]: [
              { [Op.iLike]: "%birthday%" },
              { [Op.iLike]: "%ulang tahun%" },
            ],
          },
        },
      });

      if (template) {
        message = template.body.replace("{{name}}", this.name);
      }

      sendWhatsAppMessage({
        message,
        type: "text",
        phoneNumber: this.phoneNumber,
        file: template?.file ?? null,
      });
    }

    toJSON() {
      return { ...this.get(), age: this.age };
    }
  }

  Recipient.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name is required",
          },
          notEmpty: {
            msg: "Name is required",
          },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Phone number already exists",
        },
        validate: {
          notNull: {
            msg: "Phone number is required",
          },
          notEmpty: {
            msg: "Phone number is required",
          },
        },
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        validate: {
          isDate: { msg: "Invalid date format" },
        },
      },
    },
    {
      sequelize,
      modelName: "Recipient",
    }
  );

  Recipient.afterSave((recipient) => {
    recipient.createJob();
  });

  Recipient.afterDestroy((recipient) => {
    recipient.deleteExistingJob();
  });

  return Recipient;
};
