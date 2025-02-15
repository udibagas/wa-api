import { Input } from "antd";
import React, { useEffect, useState } from "react";
import ContactItem from "./ContactItem";
import { RecipientType } from "../types";
import { gql } from "@apollo/client";
import apolloClient from "../apollo/client";
import { useQuery } from "@tanstack/react-query";

const ContactList: React.FC<{ onSelect: (contact: RecipientType) => void }> = ({ onSelect }) => {
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

  const [search, setSearch] = useState<string>('');
  const [filteredRecipients, setFilteredRecipients] = useState<RecipientType[]>([]);

  useEffect(() => {
    if (!recipients) return;

    if (!search) {
      setFilteredRecipients(recipients);
      return;
    }

    const filtered = recipients.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredRecipients(filtered);
  }, [recipients, search]);

  function onClick(contact: RecipientType) {
    onSelect(contact);
  }

  return (
    <div style={{ width: 320, flexShrink: 0 }}>
      <Input.Search
        placeholder="Search contacts"
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 20 }}
        allowClear
      />

      <div style={{ height: 'calc(100vh - 265px)', overflowY: 'auto' }}>
        {filteredRecipients?.map((r) => (
          <ContactItem key={r.id} contact={r} onClick={onClick} />
        ))}
      </div>
    </div>
  );
}

export default ContactList;