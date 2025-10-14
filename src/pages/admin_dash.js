import React, { useState, useEffect } from "react";
import AdminDonations from "../components/admin_don";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const AdminDashboard = () => {
    const [cmiData, setCmiData] = useState([]);
    const [organisationData, setOrganisationData] = useState([]);
    const navigate = useNavigate();
    const [newCmi, setNewCmi] = useState({ mpesa_info: "", donation_total: 0, goal: 0 });
    const [newEvent, setNewEvent] = useState({
        name: "",
        usage_of_funds: "",
        amount_raised: 0,
        summary: "",
        event_image: null
    });
    const [error, setError] = useState("");
    const [editingEvent, setEditingEvent] = useState(null); // State to track which event is being edited
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [CMIid, setCMIid] = useState(null);

  const handleEditClick = (record) => {
    setCMIid(record.id);
    setNewCmi({ 
      mpesa_info: record.mpesa_info, 
      donation_total: record.donation_total, 
      goal: record.goal 
    });
  };

 
    // Fetch all CMI and Organisation records
    useEffect(() => {
        axios.get("/api/cmi")
            .then((response) => {
                setCmiData(response.data);
            })
            .catch((error) => console.error("There was an error fetching CMI records", error));

        axios.get("/api/organisations")
            .then((response) => {
                setOrganisationData(response.data);
            })
            .catch((error) => console.error("There was an error fetching Organisation records", error));
    }, []);

    // Handle input changes for CMI and Organisation forms
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setNewEvent((prevState) => ({
            ...prevState,
            event_image: e.target.files[0], // Store the file for uploading later
        }));
    };
    const handlerecordchange = (e) => {
        const { name, value } = e.target;
        setNewCmi((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle adding new Event record
    const handleAddEvent = () => {
        const formData = new FormData();

        formData.append("org_photo", newEvent.event_image);
        formData.append("jsonData", JSON.stringify(newEvent));

        axios.post("/api/organisations", formData, 
        { headers: 
    {   Authorization: `Bearer ${token}`},
            credentials: "include", })
            .then((response) => {
                alert(response.data.message);
                setNewEvent({ name: "", usage_of_funds: "", amount_raised: 0, summary: "", event_image: null });
                // Reload the Organisation data
                axios.get("/api/organisations").then((res) => setOrganisationData(res.data));
            })
            .catch((error) =>{
                setError("There was an error adding the event.");
                 console.error("Error adding event", error)});
    };
   const handleAddRecord = () => {
    axios.post("/api/cmi", newCmi)
        .then((response) => {
            alert(response.data.message);
            setNewCmi({ mpesa_info: "", donation_total: 0, goal: 0 });
            // Reload the CMI data
            axios.get("/api/cmi")
                .then((res) => setCmiData(res.data))
                .catch((error) => console.error("Error fetching CMI records", error));
        })
        .catch((error) => {
            console.error("Error adding CMI record", error);
            alert("There was an error adding the record.");
        });
};
const handleDeleteRecord = (id) => {
    axios.delete(`/api/organisations/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
            alert(response.data.message);
            // Reload the Organisation data
            axios.get("/api/organisations").then((res) => setOrganisationData(res.data));
        })
        .catch((error) => {
            setError("There was an error deleting the event.");
            console.error("Error deleting event", error);
        }); 
};
 


    
// Handle editing an Event
const handleEditEvent = (id) => {
    const eventToEdit = organisationData.find((event) => event.id === id);
    setEditingEvent(eventToEdit); // Set the event being edited
    setNewEvent({
        name: eventToEdit.name,
        usage_of_funds: eventToEdit.usage_of_funds,
        amount_raised: eventToEdit.amount_raised,
        summary: eventToEdit.summary,
        event_image: null, // Leave the image blank for now
    });
};
const handleUpdateEvent = () => {
    const formData = new FormData();
    formData.append("org_photo", newEvent.event_image);
    formData.append("jsonData", JSON.stringify(newEvent)); // Ensure JSON data is passed correctly

    axios.put(`/api/organisations/${editingEvent.id}`, formData, { headers: { "Content-Type": "multipart/form-data" , Authorization: `Bearer ${token}`, },
        credentials: "include" })
        .then((response) => {
            alert(response.data.message);
            // Reload the Organisation data
            axios.get("/api/organisations").then((res) => setOrganisationData(res.data));
            setEditingEvent(null); // Clear editing state after updating
            setNewEvent({ name: "", usage_of_funds: "", amount_raised: 0, summary: "", event_image: null });
        })
        .catch((error) => {
            setError("There was an error updating the event.");
            console.error("Error updating event", error)});
};
    // Handle deleting a CMI record
    const handleChange = (e) => {
        setNewCmi({ ...newCmi, [e.target.name]: e.target.value });
      };

      const handleUpdateRecord = (id, updatedData) => {
        axios.put(`/api/cmi/${id}`, updatedData)
          .then(() => {
            // Refresh data after update
            setCmiData((prevData) =>
              prevData.map((record) =>
                record.id === id ? { ...record, ...updatedData } : record
              )
            );
          })
          .catch((error) => console.error("Error updating record:", error));
      };
    
      const handleSave = (id) => {
        handleUpdateRecord(id, newCmi);
        setCMIid(null); // Exit edit mode
      };

    const refreshDonations = async () => {
        setLoading(true);
        try {
          const response = await axios.post(
            "/api/admin/update-donations",
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          );
          
          alert(response.data.message); // Show success message
          axios.get("/api/cmi")
          .then((response) => {
              setCmiData(response.data);
          })
          .catch((error) => console.error("There was an error fetching CMI records", error));

        } catch (error) {
          console.error("Error refreshing donations:", error);
          alert("Failed to update donations");
        } finally {
          setLoading(false);
        }
      };
    

    return (
        <div className="dashboard-container">
            <h1>Admin Dashboard</h1>
            <button className="logout-btn" onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}>Logout</button>
           
            

            <h3>Existing CMI Records</h3>
            <div className="table-container">

            <table>
                <thead>
                    <tr>
                        <th>Mpesa Info</th>
                        <th>Donation Total</th>
                        <th>Goal</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {cmiData.map((record) => (
          <tr key={record.id}>
            {CMIid === record.id ? (
              <>
                <td>
                  <input 
                    type="text" 
                    name="mpesa_info" 
                    value={newCmi.mpesa_info} 
                    onChange={handleChange} 
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    name="donation_total" 
                    value={newCmi.donation_total} 
                    onChange={handleChange} 
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    name="goal" 
                    value={newCmi.goal} 
                    onChange={handleChange} 
                  />
                </td>
                <td>
                  <button onClick={() => handleSave(record.id)}>Save</button>
                  <button onClick={() => setCMIid(null)}>Cancel</button>
                </td>
              </>
            ) : (
              <>
                <td>{record.mpesa_info}</td>
                <td>{'Ksh ' + record.donation_total}</td>
                <td>{'Ksh ' + record.goal}</td>
                <td>
                  <button onClick={() => handleEditClick(record)}>Edit</button>
                </td>
              </>
            )}
          </tr>
        ))}
                </tbody>
            </table>
            </div>

            <h2>Manage Organisation Events</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="add-event-form">
                <h3>{editingEvent ? "Edit Event" : "Add New Event"}</h3>
                <input
                    type="text"
                    name="name"
                    placeholder="Event Name"
                    value={newEvent.name}
                    onChange={handleInputChange}
                />
                <textarea
                    name="usage_of_funds"
                    placeholder="Usage of Funds"
                    value={newEvent.usage_of_funds}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="amount_raised"
                    placeholder="Amount Raised"
                    value={newEvent.amount_raised}
                    onChange={handleInputChange}
                />
                <textarea
                    name="summary"
                    placeholder="Event Summary"
                    value={newEvent.summary}
                    onChange={handleInputChange}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <button onClick={editingEvent ? handleUpdateEvent : handleAddEvent}>
                    {editingEvent ? "Update Event" : "Add Event"}
                </button>
            </div>
       

            <h3>Existing Organisation Events</h3>
            <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Event Name</th>
                        <th>Usage of Funds</th>
                        <th>Amount Raised</th>
                        <th>Summary</th>
                        <th>Event Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {organisationData.map((record) => (
                        <tr key={record.id}>
                            <td>{record.name}</td>
                            <td>{record.usage_of_funds}</td>
                            <td>{record.amount_raised}</td>
                            <td>{record.summary}</td>
                            <td>
                                {record.org_photo && (
                                    <img
                                        src={'/'+ record.org_photo}
                                        alt={record.name}
                                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                    />
                                )}
                            </td>
                            <td>
                                <button onClick={() => handleEditEvent(record.id)}>Edit</button>
                                <button onClick={() => handleDeleteRecord(record.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <button onClick={refreshDonations} disabled={loading}>
        {loading ? "Updating..." : "Refresh Donations"}
      </button>
            <AdminDonations/>
        </div>
    );
};
export default AdminDashboard;