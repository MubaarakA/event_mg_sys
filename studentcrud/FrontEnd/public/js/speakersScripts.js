document.addEventListener("DOMContentLoaded", function () {
    const speakersTable = document.getElementById("speakersTable");
  
    async function fetchSpeakers() {
        try {
            const response = await fetch("/speakers/api"); // Fetch from API
            const speakers = await response.json();
            const speakersTable = document.getElementById("speakersTable");
            speakersTable.innerHTML = "";
    
            speakers.forEach((speaker, index) => {
                speakersTable.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${speaker.fullName}</td>
                        <td>${speaker.email}</td>
                        <td>${speaker.phone}</td>
                        <td>${speaker.topic}</td>
                        <td>${speaker.eventName}</td>
                        <td>
                            <button class="btn btn-warning btn-sm" 
                                onclick="showEditSpeakerModal(${speaker.speakerID}, '${speaker.fullName}', '${speaker.email}', '${speaker.phone}', '${speaker.topic}', ${speaker.eventID})">
                                Edit
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteSpeaker(${speaker.speakerID})">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;
            });
        } catch (error) {
            console.error("Error fetching speakers:", error);
        }
    }
    

    async function fetchEventsForDropdown() {
        try {
          const response = await fetch("/speakers/events");
          const events = await response.json();
          const eventSelect = document.getElementById("eventID");
    
          eventSelect.innerHTML = `<option value="">Select Event</option>`;
          events.forEach(event => {
            eventSelect.innerHTML += `<option value="${event.eventID}">${event.eventName}</option>`;
          });
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      }
    
      // 
      // Show Add Speaker Modal
      window.showAddSpeakerModal = () => {
        fetchEventsForDropdown();
        bootstrap.Modal.getOrCreateInstance(document.getElementById("addSpeakerModal")).show();
      };
    
      //  Handle Add Speaker Form Submission
      document.getElementById("addSpeakerForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const speaker = {
          fullName: document.getElementById("speakerName").value,
          email: document.getElementById("speakerEmail").value,
          phone: document.getElementById("speakerPhone").value,
          topic: document.getElementById("speakerTopic").value,
          eventID: document.getElementById("eventID").value,
        };
    
        try {
          const response = await fetch("/speakers/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(speaker),
          });
    
          if (response.ok) {
            fetchSpeakers(); // Refresh table after adding speaker
            bootstrap.Modal.getInstance(document.getElementById("addSpeakerModal")).hide();
          } else {
            console.error("Failed to add speaker");
          }
        } catch (error) {
          console.error("Error adding speaker:", error);
        }
      });

      
      //  Function to Populate Edit Modal with Row Data
window.showEditSpeakerModal = async (id, fullName, email, phone, topic, eventID) => {
    document.getElementById("editSpeakerID").value = id;
    document.getElementById("editFullName").value = fullName;
    document.getElementById("editEmail").value = email;
    document.getElementById("editPhone").value = phone;
    document.getElementById("editTopic").value = topic;
  
    // Fetch and populate event dropdown
    try {
      const response = await fetch("/speakers/events");
      const events = await response.json();
      const eventSelect = document.getElementById("editEventID");
  
      eventSelect.innerHTML = `<option value="">Select Event</option>`;
      events.forEach(event => {
        eventSelect.innerHTML += `<option value="${event.eventID}" ${event.eventID == eventID ? "selected" : ""}>${event.eventName}</option>`;
      });
  
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  
    bootstrap.Modal.getOrCreateInstance(document.getElementById("editSpeakerModal")).show();
  };
  
  //  Handle Update Speaker Form Submission
  document.getElementById("editSpeakerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const id = document.getElementById("editSpeakerID").value;
    const updatedSpeaker = {
      fullName: document.getElementById("editFullName").value,
      email: document.getElementById("editEmail").value,
      phone: document.getElementById("editPhone").value,
      topic: document.getElementById("editTopic").value,
      eventID: document.getElementById("editEventID").value
    };
  
    try {
      await fetch(`/speakers/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSpeaker),
      });
  
      fetchSpeakers(); // Refresh the table
      bootstrap.Modal.getInstance(document.getElementById("editSpeakerModal")).hide();
    } catch (error) {
      console.error("Error updating speaker:", error);
    }
  });
  

  //deletion 
  window.deleteSpeaker = async (id) => {
    if (!confirm("Are you sure you want to delete this speaker?")) return;
    
    try {
        await fetch(`/speakers/delete/${id}`, { method: "DELETE" });
        fetchSpeakers();
    } catch (error) {
        console.error("Error deleting speaker:", error);
    }
};

  
    // Fetch speakers when page loads
    fetchSpeakers();
  });
  