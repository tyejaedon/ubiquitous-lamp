import React, { useState } from "react";

import DonationModal from "./popup";

const EventCard = ({ event , modalstatus,sendevent}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="event-card">
      <div className="event-image">
        <img src={event.org_photo} alt={event.name} />
      </div>
      <div className="event-content">
        <h2>{event.name}</h2>
        <p className="event-date">
          {new Date(event.created_at).toLocaleDateString()}
        </p>
        <p className="event-summary">{event.summary}</p>
        <p className="event-usage">Usage of Funds: {event.usage_of_funds}</p>
        <p className="amount-raised">Amount Raised: ${event.amount_raised}</p>

        {/* Donate Button */}
        <button className="donate-btn" onClick={() => {
          sendevent(event)
          

          modalstatus(true)
          }}>
          Donate Now
        </button>
      </div>


    </div>
  );
};

export default EventCard;
