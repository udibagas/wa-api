const { buildSchema } = require("graphql");

exports.schema = buildSchema(`
  type Query {
    users: [User]
    apps: [App]
    templates: [Template]
    groups: [Group]
    recipients: [Recipient]
  }

  type User {
    id: Int!
    name: String!
    email: String
    role: String
  }

  type App {
    id: Int!
    name: String!
  }

  type Template {
    id: Int!
    name: String!
  }

  type Group {
    id: Int!
    name: String!
  }

  type Recipient {
    id: Int!
    name: String!
    phoneNumber: String!
    age: Int
    dateOfBirth: String
  }
`);
