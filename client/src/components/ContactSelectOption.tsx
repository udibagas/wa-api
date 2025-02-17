import { Select } from "antd";
import { ContactType } from "../types";
import { useQuery } from "@tanstack/react-query";
import apolloClient from "../apollo/client";
import { gql } from "@apollo/client";
import React from "react";

type ContactSelectOptionProps = {
  id: string,
  value: number[],
  onChange: (value: number[]) => void
}

const ContactSelectOption: React.FC<ContactSelectOptionProps> = ({ onChange }) => {
  const { data: contacts } = useQuery({
    queryKey: ['allContacts'],
    staleTime: 1000 * 60 * 10, // 10 minutes
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: gql`
          query GetAllContacts {
            contacts {
              id
              name
              phoneNumber
            }
          }
        `
      });

      const contacts: ContactType[] = data.contacts;
      return contacts;
    },
  });

  return (
    <Select
      allowClear
      onChange={onChange}
      mode="multiple"
      placeholder="Enter contact name/phone number"
      options={contacts?.map((t) => ({ label: `${t.name} - ${t.phoneNumber}`, value: t.id }))}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      optionRender={({ label }) => {
        const [name, phoneNumber] = (label as string)?.split(' - ') ?? [];
        return (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{name}</span>
            <i style={{ color: '#999' }}>+{phoneNumber}</i>
          </div>
        );
      }}
    >
    </Select>
  )
}

export default ContactSelectOption;