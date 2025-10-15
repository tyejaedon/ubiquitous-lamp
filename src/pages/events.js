import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/tile";
import event1 from "../assets/event1.jpeg";
import event2 from "../assets/events2.jpeg";
import event3 from "../assets/event3.png";
import DonationModal from "../components/popup";

const EventsPage = (modalstatus) => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [event, setEvent] = useState({});

  
  useEffect(() => {
    // Fetch organisation data from the API
    axios.get("https://tyjaedon.me/api/organisations")
      .then((response) => {
        const organisationData = response.data;  // assuming the API returns an array of organisations
        console.log("Organisation data:", organisationData);
        
        // Static event data
        const staticEvents = [
          {
            id: 4,
            name: "Food Drive for Street Families",
            usage_of_funds: "Funds will be used to purchase food and distribute to the homeless in Nairobi.",
            amount_raised: 5000.00,
            summary: "A food drive organized to provide essential food supplies to homeless families in Nairobi.",
            created_at: "2025-03-15T00:00:00Z",  // You can adjust this date as needed
            org_photo: event1,  // Image of the organisation
          },
          {
            id: 2,
            name: "School Supplies Donation",
            usage_of_funds: "The money will be spent on purchasing school books, uniforms, and stationery.",
            amount_raised: 3000.00,
            summary: "Helping underprivileged kids with school supplies such as books, uniforms, and stationery.",
            created_at: "2025-04-10T00:00:00Z",
            org_photo: event2,
          },
          {
            id: 3,
            name: "Medical Aid Camp",
            usage_of_funds: "Funds will be used to buy medicines and set up medical camps in Mombasa.",
            amount_raised: 7000.00,
            summary: "Organizing free medical checkups and distributing essential medicines for those in need.",
            created_at: "2025-05-05T00:00:00Z",
            org_photo: event3,
          },
        ];
        organisationData.forEach((event, index) => {
          event.org_photo = "https://tyjaedon.me" + event.org_photo;  // Assuming the API returns the image path
        });
    
        // Merge organisation data with the static events (you can customize this as needed)
        const updatedEvents = [...staticEvents, ...organisationData];
        

        setEvents(updatedEvents);  // Update state with the merged data
        console.log("Updated events:", updatedEvents);
      })
      .catch((error) => {
        console.error("Error fetching organisation data:", error);
      });
  }, []);
  modalstatus = (status) => {
    setIsModalOpen(status)
  }
  const sendevent = (event) => {
    setEvent(event)
  }

  return (
    <>
    <div className={`events-container ${isModalOpen ? "blurred" : ""}`}>
      <h1 className="page-title">Upcoming Charity Events</h1>
      <div className="events-grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} modalstatus={modalstatus} sendevent={sendevent} />
        ))}
      </div>
    </div>
          {/* Donation Modal */}
          {isModalOpen && <DonationModal event={event} onClose={() => {setIsModalOpen(false)
      modalstatus(false)
      }
    } />}
    </>
  );
};

export default EventsPage;
