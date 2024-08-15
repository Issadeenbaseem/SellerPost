import React, { useEffect, useState } from "react";
import { errorHandler } from "../../../api/utils/error";
import { Link } from "react-router-dom";

const ContactForm = ({ listing }) => {
  const [owner, setOwner] = useState({});
  const [message, setMessage] = useState();

  useEffect(() => {
    try {
      const fetchOwnerDetails = async () => {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setOwner(data);
      };

      fetchOwnerDetails();
    } catch (error) {
      errorHandler(error);
    }
  }, [listing.userRef]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="font-semibold">
        Contact {owner.username} for {listing.address}
      </p>

      <textarea
        rows={2}
        id="message"
        name="message"
        onChange={handleMessageChange}
        placeholder="Enter your message...."
        className="p-3 rounded-lg shadow-lg max-w-screen-2xl"
      />

      <Link
        to={`mailto:${owner.email}?subject=Regarding ${listing.name}&body=${message}`}
        className="p-3 bg-slate-700 rounded-lg text-white uppercase text-center max-w-screen-2xl mb-5 shadow-lg"
      >
        Click Here to sent the message
      </Link>
    </div>
  );
};

export default ContactForm;
