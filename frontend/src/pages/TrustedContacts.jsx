import { useEffect, useState } from "react";


const STORAGE_KEY =
  "aegira_trusted_contacts";


function TrustedContacts() {

  const [contacts, setContacts] =
    useState([]);


  const [form, setForm] =
    useState({
      name: "",
      phone: "",
      relationship: "",
      telegramChatId: "",
    });


  // ========================================
  // LOAD CONTACTS
  // ========================================

  useEffect(() => {

    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );


    if (saved) {

      try {

        setContacts(
          JSON.parse(saved)
        );

      } catch {

        setContacts([]);

      }

    }

  }, []);


  // ========================================
  // SAVE
  // ========================================

  const saveContacts = (
    updatedContacts
  ) => {

    setContacts(
      updatedContacts
    );


    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        updatedContacts
      )
    );

  };


  // ========================================
  // INPUT
  // ========================================

  const handleChange = (
    event
  ) => {

    const {
      name,
      value
    } = event.target;


    setForm(
      previous => ({
        ...previous,
        [name]: value
      })
    );

  };


  // ========================================
  // ADD CONTACT
  // ========================================

  const handleSubmit = (
    event
  ) => {

    event.preventDefault();


    if (
      !form.name.trim()
      ||
      !form.telegramChatId.trim()
    ) {

      alert(
        "Name and Telegram Chat ID are required."
      );

      return;

    }


    const newContact = {

      id: Date.now(),

      name:
        form.name.trim(),

      phone:
        form.phone.trim(),

      relationship:
        form.relationship.trim(),

      telegramChatId:
        form.telegramChatId.trim()

    };


    const updated = [
      ...contacts,
      newContact
    ];


    saveContacts(
      updated
    );


    setForm({
      name: "",
      phone: "",
      relationship: "",
      telegramChatId: "",
    });

  };


  // ========================================
  // DELETE
  // ========================================

  const removeContact = (
    id
  ) => {

    const updated =
      contacts.filter(
        contact =>
          contact.id !== id
      );


    saveContacts(
      updated
    );

  };


  return (

    <div>

      <div className="report-heading">

        <span className="hero-badge">
          TRUSTED CIRCLE
        </span>

        <h2>
          People you trust
        </h2>

        <p>
          Add trusted contacts who can
          receive AEGIRA emergency
          notifications and your location.
        </p>

      </div>


      <div className="privacy-banner">

        <div>

          <strong>
            Telegram safety alerts
          </strong>

          <p>
            Each trusted contact must open
            the AEGIRA Telegram bot and
            press Start once before alerts
            can be delivered.
          </p>

        </div>

        <div className="privacy-icon">
          ✈️
        </div>

      </div>


      <hr />


      <form
        onSubmit={handleSubmit}
      >

        <div className="report-row">

          <div className="report-field">

            <label>
              Contact Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Aayush"
            />

          </div>


          <div className="report-field">

            <label>
              Relationship
            </label>

            <input
              type="text"
              name="relationship"
              value={
                form.relationship
              }
              onChange={handleChange}
              placeholder="e.g. Friend"
            />

          </div>

        </div>


        <div className="report-row">

          <div className="report-field">

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91XXXXXXXXXX"
            />

          </div>


          <div className="report-field">

            <label>
              Telegram Chat ID *
            </label>

            <input
              type="text"
              name="telegramChatId"
              value={
                form.telegramChatId
              }
              onChange={handleChange}
              placeholder="e.g. 123456789"
              required
            />

          </div>

        </div>


        <p className="helper-text">

          To get a Chat ID, the contact
          must first send a message to the
          AEGIRA Telegram bot.

        </p>


        <button
          type="submit"
        >
          + Add Trusted Contact
        </button>

      </form>


      <hr />


      <h3>
        Trusted Contacts
      </h3>


      {contacts.length === 0 ? (

        <p>
          No trusted contacts added yet.
        </p>

      ) : (

        <div className="contact-grid">

          {contacts.map(
            contact => (

              <div
                className="contact-card"
                key={contact.id}
              >

                <h3>
                  {contact.name}
                </h3>


                {contact.relationship && (

                  <p>
                    <strong>
                      Relationship:
                    </strong>{" "}
                    {
                      contact.relationship
                    }
                  </p>

                )}


                {contact.phone && (

                  <p>
                    <strong>
                      Phone:
                    </strong>{" "}
                    {contact.phone}
                  </p>

                )}


                <p>
                  <strong>
                    Telegram:
                  </strong>{" "}
                  Connected
                </p>


                <button
                  className="danger-button"
                  onClick={() =>
                    removeContact(
                      contact.id
                    )
                  }
                >
                  Remove
                </button>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

}


export default TrustedContacts;