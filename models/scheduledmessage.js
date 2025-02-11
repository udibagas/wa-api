"use strict";
const { CronJob, CronTime } = require("cron");
const { Model, Op } = require("sequelize");
const sendWhatsAppMessage = require("../utils/sendWhatsAppMessage");
const { jobs } = require("../jobs");

module.exports = (sequelize, DataTypes) => {
  class ScheduledMessage extends Model {
    static associate(models) {
      ScheduledMessage.belongsTo(models.User);
    }

    createJob() {
      const { id, time, name, recurring } = this;
      console.log("Creating job", name);

      const existingJob = jobs.findIndex((job) => job.id === id);

      if (existingJob > -1) {
        jobs[existingJob].cronJob.stop();
        jobs.splice(existingJob, 1);
      }

      const cronJob = CronJob.from({
        cronTime: time,
        start: true,
        timeZone: "Asia/Jakarta",
        unrefTimeout: true,
        onTick: () => this.proceed(),
      });

      cronJob.runOnce = !recurring;
      jobs.push({ id, cronJob });
    }

    async proceed() {
      console.log(new Date().toLocaleTimeString(), this.name);

      // const recipients = await sequelize.models.Recipient.findAll({
      //   where: { id: { [Op.in]: this.recipients } },
      // });

      // if (recipients.length === 0) {
      //   console.log("Recipients not found");
      // }

      // for (const recipient of recipients) {
      //   await sendWhatsAppMessage({
      //     type: "text", // sementara text dulu
      //     message: this.message,
      //     caption: this.message,
      //     phoneNumber: recipient.phoneNumber,
      //   });
      // }
    }
  }

  ScheduledMessage.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      file: DataTypes.JSON,
      recipients: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      recurring: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "ScheduledMessage",
    }
  );

  ScheduledMessage.afterSave((instance) => {
    instance.createJob();
  });

  return ScheduledMessage;
};
