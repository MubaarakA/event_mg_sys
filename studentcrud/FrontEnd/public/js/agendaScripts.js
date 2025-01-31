document.addEventListener("DOMContentLoaded", function () {
    const agendaTable = document.getElementById("agendaTable");
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");
    const toggleBtn = document.getElementById("toggle-btn");
  
    //  Sidebar Toggle Functionality
    toggleBtn.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
      content.classList.toggle("expanded");
    });
  
    //  Function to Fetch Agendas and Populate Table
    async function fetchAgendas() {
      try {
        const response = await fetch("/agenda/api"); // Fetch data from API
        const agendas = await response.json();
        console.log("we will enter here");
        console.log(agendas);
        
        
        agendaTable.innerHTML = ""; // Clear table before populating
  
        agendas.forEach((agenda, index) => {
            agendaTable.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${agenda.eventName}</td>
                    <td>${agenda.sessionTitle}</td> <!--  Correct -->
                    <td>${agenda.speakerName}</td> <!--  Correct -->
                    <td>${new Date(agenda.startTime).toLocaleString()}</td>
                    <td>${new Date(agenda.endTime).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" 
                            onclick="showEditAgendaModal(${agenda.agendaID}, '${agenda.eventName}', '${agenda.speakerName}', '${agenda.sessionTitle}', '${agenda.startTime}', '${agenda.endTime}')">
                            Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteAgenda(${agenda.agendaID})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });
    }
         catch (error) {
        console.error("Error fetching agendas:", error);
      }
    }




    async function fetchEventsForDropdown() {
        try {
          const response = await fetch("/agenda/events");
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
    
      //  Fetch Speakers for Dropdown
      async function fetchSpeakersForDropdown() {
        try {
          const response = await fetch("/agenda/speakers");
          const speakers = await response.json();
          const speakerSelect = document.getElementById("speakerID");
          speakerSelect.innerHTML = `<option value="">Select Speaker</option>`;
    
          speakers.forEach(speaker => {
            speakerSelect.innerHTML += `<option value="${speaker.speakerID}">${speaker.fullName}</option>`;
          });
        } catch (error) {
          console.error("Error fetching speakers:", error);
        }
      }


      async function fetchDropdownEditEvents(selectedEventName) {
        try {
            const response = await fetch("/agenda/events");
            const events = await response.json();
            const eventSelect = document.getElementById("editEventID");
    
            eventSelect.innerHTML = `<option value="">Select Event</option>`;
            events.forEach(event => {
                eventSelect.innerHTML += `<option value="${event.eventID}" ${event.eventName === selectedEventName ? "selected" : ""}>${event.eventName}</option>`;
            });
    
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }
    
    
    // Fetch Speakers for Dropdown and Preselect Value
    async function fetchDropdownEditSpeakers(selectedSpeakerName) {
        try {
            const response = await fetch("/agenda/speakers");
            const speakers = await response.json();
            const speakerSelect = document.getElementById("editSpeakerID");
    
            speakerSelect.innerHTML = `<option value="">Select Speaker</option>`;
            speakers.forEach(speaker => {
                speakerSelect.innerHTML += `<option value="${speaker.speakerID}" ${speaker.fullName === selectedSpeakerName ? "selected" : ""}>${speaker.fullName}</option>`;
            });
        } catch (error) {
            console.error("Error fetching speakers:", error);
        }
    }
    
    
      //  Show Add Agenda Modal
      window.showAddAgendaModal = () => {
        fetchEventsForDropdown();
        fetchSpeakersForDropdown();
        bootstrap.Modal.getOrCreateInstance(document.getElementById("addAgendaModal")).show();
      };
    
      //  Handle Add Agenda Form Submission
      document.getElementById("addAgendaForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const agenda = {
          eventID: document.getElementById("eventID").value,
          speakerID: document.getElementById("speakerID").value,
          sessionTitle: document.getElementById("sessionTitle").value,
          startTime: document.getElementById("startTime").value,
          endTime: document.getElementById("endTime").value,
        };
    
        try {
          const response = await fetch("/agenda/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(agenda),
          });
    
          if (response.ok) {
            fetchAgendas(); // Refresh table
            bootstrap.Modal.getInstance(document.getElementById("addAgendaModal")).hide();
          } else {
            console.error("Failed to add agenda");
          }
        } catch (error) {
          console.error("Error adding agenda:", error);
        }
      });



     //  Show Edit Agenda Modal
window.showEditAgendaModal = async (id, eventName, speakerName, sessionTitle, startTime, endTime) => {
    document.getElementById("editAgendaID").value = id;
    document.getElementById("editSessionTitle").value = sessionTitle;
    document.getElementById("editStartTime").value = new Date(startTime).toISOString().slice(0, 16);
    document.getElementById("editEndTime").value = new Date(endTime).toISOString().slice(0, 16);

    //  Fetch Dropdowns & Select the Correct Values
    await fetchDropdownEditEvents(eventName);
    await fetchDropdownEditSpeakers(speakerName);

    bootstrap.Modal.getOrCreateInstance(document.getElementById("editAgendaModal")).show();
};

    
//  Handle Edit Agenda Form Submission
document.getElementById("editAgendaForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const id = document.getElementById("editAgendaID").value;
    const updatedAgenda = {
        eventID: document.getElementById("editEventID").value,
        speakerID: document.getElementById("editSpeakerID").value,
        sessionTitle: document.getElementById("editSessionTitle").value,
        startTime: document.getElementById("editStartTime").value,
        endTime: document.getElementById("editEndTime").value,
    };

    try {
        const response = await fetch(`/agenda/update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedAgenda),
        });

        if (response.ok) {
            fetchAgendas(); // Refresh table
            bootstrap.Modal.getInstance(document.getElementById("editAgendaModal")).hide();
        } else {
            console.error("Failed to update agenda");
        }
    } catch (error) {
        console.error("Error updating agenda:", error);
    }
});


//  Delete Agenda Function
window.deleteAgenda = async (id) => {
    if (confirm("Are you sure you want to delete this agenda?")) {
        try {
            const response = await fetch(`/agenda/delete/${id}`, { method: "DELETE" });

            if (response.ok) {
                fetchAgendas(); // Refresh the table after deletion
            } else {
                console.error("Failed to delete agenda");
            }
        } catch (error) {
            console.error("Error deleting agenda:", error);
        }
    }
};

  
    //  Call fetchAgendas when page loads
    fetchAgendas();
  });
  