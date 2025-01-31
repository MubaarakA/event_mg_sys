document.addEventListener("DOMContentLoaded", function () {
    const registrationsTable = document.getElementById("registrationsTable");
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");
    const toggleBtn = document.getElementById("toggle-btn");
  
    //  Sidebar Toggle Functionality
    toggleBtn.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
      content.classList.toggle("expanded");
    });
  
    //  Fetch and Populate Registrations Table
    async function fetchRegistrations() {
      try {
        const response = await fetch("/registrations/api");
        const registrations = await response.json();
        registrationsTable.innerHTML = "";
  
        registrations.forEach((registration, index) => {
          registrationsTable.innerHTML += `
            <tr>
              <td>${index + 1}</td>
              <td>${registration.attendeeName}</td>
              <td>${registration.eventName}</td>
              <td>${new Date(registration.registeredOn).toLocaleString()}</td>
              <td>${registration.status}</td>
              <td>
                <button class="btn btn-warning btn-sm" 
                  onclick="showEditRegistrationModal(${registration.registrationID}, '${registration.attendeeName}', '${registration.eventID}', '${registration.registeredOn}', '${registration.status}')">
                  Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteRegistration(${registration.registrationID})">
                  Delete
                </button>
              </td>
            </tr>
          `;
        });
      } catch (error) {
        console.error("Error fetching registrations:", error);
      }
    }
  
    // Fetch Events for Dropdown
    async function fetchEventsForDropdown(selectElementID) {
      try {
        const response = await fetch("/registrations/events");
        const events = await response.json();
        const eventSelect = document.getElementById(selectElementID);
        eventSelect.innerHTML = `<option value="">Select Event</option>`;
  
        events.forEach(event => {
          eventSelect.innerHTML += `<option value="${event.eventID}">${event.eventName}</option>`;
        });
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }
  
    //  Show Add Registration Modal
    window.showAddRegistrationModal = () => {
      fetchEventsForDropdown("eventID"); // Fetch events before opening the modal
      bootstrap.Modal.getOrCreateInstance(document.getElementById("addRegistrationModal")).show();
    };
  
    //  Handle Add Registration Form Submission
    document.getElementById("addRegistrationForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const registration = {
        attendeeName: document.getElementById("attendeeName").value,
        eventID: document.getElementById("eventID").value,
        registeredOn: document.getElementById("registeredOn").value,
        status: document.getElementById("registrationStatus").value,
      };
  
      try {
        const response = await fetch("/registrations/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registration),
        });
  
        if (response.ok) {
          fetchRegistrations(); // Refresh table
          bootstrap.Modal.getInstance(document.getElementById("addRegistrationModal")).hide();
        } else {
          console.error("Failed to add registration");
        }
      } catch (error) {
        console.error("Error adding registration:", error);
      }
    });
  
    //  Show Edit Registration Modal with Data
    window.showEditRegistrationModal = async (id, attendeeName, eventID, registeredOn, status) => {
      document.getElementById("editRegistrationID").value = id;
      document.getElementById("editAttendeeName").value = attendeeName;
      document.getElementById("editRegisteredOn").value = new Date(registeredOn).toISOString().slice(0, 16);
      document.getElementById("editRegistrationStatus").value = status;
  
      // Fetch events for dropdown and pre-select the event
      try {
        const response = await fetch("/registrations/events");
        const events = await response.json();
        const eventSelect = document.getElementById("editEventID");
        eventSelect.innerHTML = `<option value="">Select Event</option>`;
  
        events.forEach(event => {
          eventSelect.innerHTML += `<option value="${event.eventID}" ${event.eventID == eventID ? "selected" : ""}>${event.eventName}</option>`;
        });
      } catch (error) {
        console.error("Error fetching events:", error);
      }
  
      bootstrap.Modal.getOrCreateInstance(document.getElementById("editRegistrationModal")).show();
    };
  
    //  Handle Update Registration Form Submission
    document.getElementById("editRegistrationForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("editRegistrationID").value;
      const updatedRegistration = {
        attendeeName: document.getElementById("editAttendeeName").value,
        eventID: document.getElementById("editEventID").value,
        registeredOn: document.getElementById("editRegisteredOn").value,
        status: document.getElementById("editRegistrationStatus").value,
      };
  
      try {
        await fetch(`/registrations/update/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedRegistration),
        });
  
        fetchRegistrations(); // Refresh table
        bootstrap.Modal.getInstance(document.getElementById("editRegistrationModal")).hide();
      } catch (error) {
        console.error("Error updating registration:", error);
      }
    });
  
    //  Handle Delete Registration
    window.deleteRegistration = async (id) => {
      if (!confirm("Are you sure you want to delete this registration?")) return;
  
      try {
        await fetch(`/registrations/delete/${id}`, { method: "DELETE" });
        fetchRegistrations();
      } catch (error) {
        console.error("Error deleting registration:", error);
      }
    };
  
    //  Fetch Registrations on Page Load
    fetchRegistrations();
  });
  