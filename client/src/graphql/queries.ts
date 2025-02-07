import { gql } from "@apollo/client";

export const GET_MASTER_DATA = gql`
  query GetMasterData {
    templates {
      id
      name
      body
    }
    groups {
      id
      name
    }
    recipients {
      id
      name
      phoneNumber
    }
  }
`;
