const { User, App, MessageTemplate, Group, Recipient } = require("../models");

exports.resolver = {
  users: async () => await User.findAll({ order: [["name", "asc"]] }),
  apps: async () => await App.findAll({ order: [["id", "asc"]] }),
  templates: async () =>
    await MessageTemplate.findAll({ order: [["id", "asc"]] }),
  groups: async () => await Group.findAll({ order: [["id", "asc"]] }),
  recipients: async () => {
    return await Recipient.findAll({ order: [["name", "asc"]] });
  },
};
