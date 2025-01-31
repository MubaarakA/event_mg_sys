document.addEventListener("DOMContentLoaded", function () {
  console.log("asc");
  
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");
    const toggleBtn = document.getElementById("toggle-btn");
  
    // Sidebar toggle functionality
    toggleBtn.addEventListener("click", function () {
      sidebar.classList.toggle("collapsed");
      content.classList.toggle("expanded");
    });
  
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://eventmanagement-chi-swart.vercel.app/events/api");
        const events = await response.json();
        console.log("Fetched Events:", events);
        const eventsTable = document.getElementById("eventsTable");
  
        eventsTable.innerHTML = ""; // Clear table before populating
  
        events.forEach((event, index) => {
          eventsTable.innerHTML += `
            <tr>
              <td>${index + 1}</td>
              <td>${event.eventName}</td>
              <td>${event.description}</td>
              <td>${new Date(event.eventDate).toLocaleString()}</td>
              <td>${event.location}</td>
              <td>${event.capacity}</td>
              <td>${event.status}</td>
              <td>
                <button class="btn btn-warning btn-sm" onclick="showEditEventModal(${event.eventID}, '${event.eventName}', '${event.description}', '${event.location}', '${event.eventDate}', ${event.capacity}, '${event.status}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteEvent(${event.eventID})">Delete</button>
              </td>
            </tr>
          `;
        });
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    // Show Add Event Modal
    window.showAddEventModal = () => {
      bootstrap.Modal.getOrCreateInstance(document.getElementById("addEventModal")).show();
    };
  
    // Add event functionality
    document.getElementById("addEventForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const event = {
        eventName: document.getElementById("eventName").value,
        description: document.getElementById("description").value,
        location: document.getElementById("location").value,
        eventDate: document.getElementById("eventDate").value,
        capacity: document.getElementById("capacity").value,
        status: document.getElementById("status").value,
      };
  
      try {
        await fetch("/events/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(event),
        });
        fetchEvents();
        bootstrap.Modal.getInstance(document.getElementById("addEventModal")).hide();
      } catch (error) {
        console.error("Error adding event:", error);
      }
    });

 
    // Show Edit Event Modal
    window.showEditEventModal = (id, name, description, location, date, capacity, status) => {
      // Populate the form fields
      document.getElementById("editEventID").value = id;
      document.getElementById("editEventName").value = name;
      document.getElementById("editDescription").value = description;
      document.getElementById("editLocation").value = location;
      document.getElementById("editEventDate").value = new Date(date).toISOString().slice(0, 16);
      document.getElementById("editCapacity").value = capacity;
      document.getElementById("editStatus").value = status;
    
      // Show the modal
      bootstrap.Modal.getOrCreateInstance(document.getElementById("editEventModal")).show();
    };

  
    // Delete event functionality
    window.deleteEvent = async (id) => {
      try {
        await fetch(`/events/delete/${id}`, { method: "DELETE" });
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    };
  
    // Initial fetch
    fetchEvents();
  });
  