import { Input } from "antd";
import React, { useEffect, useState } from "react";
import ContactItem from "./ContactItem";
import { ContactType } from "../types";
import { gql } from "@apollo/client";
import apolloClient from "../apollo/client";
import { useQuery } from "@tanstack/react-query";

const ContactList: React.FC<{ onSelect: (contact: ContactType) => void }> = ({ onSelect }) => {
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

  const [search, setSearch] = useState<string>('');
  const [filteredContacts, setFilteredContacts] = useState<ContactType[]>([]);

  useEffect(() => {
    if (!contacts) return;

    if (!search) {
      setFilteredContacts(contacts);
      return;
    }

    const filtered = contacts.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredContacts(filtered);
  }, [contacts, search]);

  function onClick(contact: ContactType) {
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
        {filteredContacts?.map((r) => (
          <ContactItem key={r.id} contact={r} onClick={onClick} />
        ))}
      </div>
    </div>
  );
}

export default ContactList;