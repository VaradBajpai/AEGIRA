const CONTACTS_KEY = "aegira_trusted_contacts";

export const getTrustedContacts = () => {
  const contacts = localStorage.getItem(CONTACTS_KEY);

  if (!contacts) {
    return [];
  }

  return JSON.parse(contacts);
};

export const saveTrustedContacts = (contacts) => {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
};