import { Select } from "antd";
import { RecipientType } from "../types";
import { useQuery } from "@tanstack/react-query";
import apolloClient from "../apollo/client";
import { gql } from "@apollo/client";
import React from "react";

type RecipientSelectOptionProps = {
  id: string,
  value: number[],
  onChange: (value: number[]) => void
}

const RecipientSelectOption: React.FC<RecipientSelectOptionProps> = ({ onChange }) => {
  const { data: recipients } = useQuery({
    queryKey: ['allRecipients'],
    staleTime: 1000 * 60 * 10, // 10 minutes
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: gql`
          query GetAllRecipients {
            recipients {
              id
              name
              phoneNumber
            }
          }
        `
      });

      const recipients: RecipientType[] = data.recipients;
      return recipients;
    },
  });

  return (
    <Select
      allowClear
      onChange={onChange}
      mode="multiple"
      placeholder="Enter recipient name/phone number"
      options={recipients?.map((t) => ({ label: `${t.name} - ${t.phoneNumber}`, value: t.id }))}
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

export default RecipientSelectOption;