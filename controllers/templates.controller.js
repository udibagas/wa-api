const { MessageTemplate, App } = require("../models");
const mailer = require("../service/mailer");

exports.index = async (req, res, next) => {
  try {
    const messageTemplates = await MessageTemplate.findAll({
      order: [["id", "asc"]],
      include: {
        model: App,
        attributes: ["id", "name"],
      },
    });
    res.status(200).json(messageTemplates);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const messageTemplate = await MessageTemplate.create(req.body);
    res.status(201).json(messageTemplate);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const messageTemplate = await MessageTemplate.findByPk(req.params.id);

    if (!messageTemplate) {
      const error = new Error("Message Template not found");
      error.status = 404;
      throw error;
    }

    let status = messageTemplate.status;

    if (
      messageTemplate.name != req.body.name ||
      messageTemplate.body != req.body.body
    ) {
      status = "draft";
    }

    await messageTemplate.update({ ...req.body, status });
    res.status(200).json(messageTemplate);
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const messageTemplate = await MessageTemplate.findByPk(req.params.id);

    if (!messageTemplate) {
      const error = new Error("Message Template not found");
      error.status = 404;
      throw error;
    }

    await messageTemplate.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.submit = (req, res, next) => {
  MessageTemplate.findByPk(req.params.id)
    .then((messageTemplate) => {
      if (!messageTemplate) {
        const error = new Error("Message Template not found");
        error.status = 404;
        throw error;
      }

      messageTemplate.status = "submitted";
      return messageTemplate.save();
    })
    .then((messageTemplate) => {
      res.status(200).json(messageTemplate);
      const { name, body, components } = messageTemplate;

      return mailer.sendMail({
        from: process.env.SMTP_USER || "udibagas@gmail.com",
        to: "udibagas@gmail.com",
        subject: `Template Submitted: ${name}`,
        html: `
            <h3>Dear Admin,</h3>

            <p>Message template has been submitted with the following details:</p>
            
            <p>
              Name: <br />
              <strong>${name}</strong>
            </p>

            <p>
              Body:<br />
              <pre>${body}</pre>
            </p>

            <p>
              Components:<br />
              ${JSON.stringify(components)}
            </p>
            

            <p>Please submit the template for review.</p>

            Regards,
            <br />
            <br />
            <br />
            <strong>BlastIt! Team</strong>
          `,
      });
    })
    .then(() => {
      console.log("Email sent");
    })
    .catch(next);
};
