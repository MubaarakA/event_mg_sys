document.addEventListener("DOMContentLoaded", function () {
  const usersTable = document.getElementById("usersTable");

  //  Sidebar Toggle Functionality
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("content");
  const toggleBtn = document.getElementById("toggle-btn");

  toggleBtn.addEventListener("click", function () {
    sidebar.classList.toggle("collapsed");
    content.classList.toggle("expanded");
  });

  //  Fetch Users and Populate Table
  async function fetchUsers() {
    try {
      const response = await fetch("/users/api");
      const users = await response.json();
      usersTable.innerHTML = "";

      users.forEach((user, index) => {
        usersTable.innerHTML += `
          <tr>
            <td>${index + 1}</td>
            <td>${user.fullName}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.status}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="showEditUserModal(${user.userID}, '${user.fullName}', '${user.username}', '${user.email}', '${user.role}', '${user.status}')">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.userID})">Delete</button>
            </td>
          </tr>
        `;
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  //  Show Add User Modal
  window.showAddUserModal = () => {
    bootstrap.Modal.getOrCreateInstance(document.getElementById("addUserModal")).show();
  };

  //  Handle Add User Form Submission
  document.getElementById("addUserForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
  
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }
  
    const user = {
      fullName: document.getElementById("fullName").value,
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: password, // Send password to backend for hashing
      role: document.getElementById("role").value,
      status: document.getElementById("status").value,
    };
  
    try {
      const response = await fetch("/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
  
      if (response.ok) {
        location.reload(); // Reload the page to update the user list
      } else {
        alert("Error adding user.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  });
  
  //  Show Edit User Modal
  window.showEditUserModal = (id, fullName, username, email, role, status) => {
    document.getElementById("editUserID").value = id;
    document.getElementById("editFullName").value = fullName;
    document.getElementById("editUsername").value = username;
    document.getElementById("editEmail").value = email;
    document.getElementById("editRole").value = role;
    document.getElementById("editStatus").value = status;
    
    bootstrap.Modal.getOrCreateInstance(document.getElementById("editUserModal")).show();
  };

  //  Handle Update User Form Submission
  document.getElementById("editUserForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const userID = document.getElementById("editUserID").value;
    const updatedUser = {
      fullName: document.getElementById("editFullName").value,
      username: document.getElementById("editUsername").value,
      email: document.getElementById("editEmail").value,
      role: document.getElementById("editRole").value,
      status: document.getElementById("editStatus").value
    };

    try {
      await fetch(`/users/update/${userID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      fetchUsers(); // Refresh Users Table
      bootstrap.Modal.getInstance(document.getElementById("editUserModal")).hide(); // Close Modal
    } catch (error) {
      console.error("Error updating user:", error);
    }
  });

  //  Handle Delete User
  window.deleteUser = async (userID) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await fetch(`/users/delete/${userID}`, {
          method: "DELETE",
        });

        fetchUsers(); // Refresh Users Table
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  //  Fetch Users When Page Loads
  fetchUsers();
});
