function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if (u === "olebogeng" && p === "molefe") {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("error").innerText = "Invalid credentials!";
  }
}

function checkAuth() {
  if (localStorage.getItem("loggedIn") !== "true") {
    alert("Please login first.");
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}

function startCamera() {
  const video = document.getElementById("video");
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(err => console.error("Camera error:", err));
}

function capturePhoto() {
  const canvas = document.getElementById("canvas");
  const video = document.getElementById("video");
  canvas.width = 320;
  canvas.height = 240;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL();
  document.getElementById("capturedImage").src = dataUrl;
  document.getElementById("capturedImage").style.display = "block";

  document.getElementById("employeeForm").onsubmit = function (e) {
    e.preventDefault();
    const employee = {
      id: document.getElementById("idNumber").value,
      name: document.getElementById("name").value,
      surname: document.getElementById("surname").value,
      contact: document.getElementById("contact").value,
      dept: document.getElementById("department").value,
      photo: dataUrl
    };
    localStorage.setItem(`employee_${employee.id}`, JSON.stringify(employee));
    document.getElementById("saveMessage").innerText = "Employee saved successfully!";
    this.reset();
    video.srcObject.getTracks().forEach(track => track.stop());
  };
}

function loadEmployees() {
  const table = document.getElementById("employeeTable");
  table.innerHTML = "";
  for (let key in localStorage) {
    if (key.startsWith("employee_")) {
      const e = JSON.parse(localStorage.getItem(key));
      table.innerHTML += `
        <tr>
          <td><img src="${e.photo}" width="60" height="50"></td>
          <td>${e.id}</td>
          <td>${e.name}</td>
          <td>${e.surname}</td>
          <td>${e.contact}</td>
          <td>${e.dept}</td>
          <td>
            <button onclick="editEmployee('${e.id}')">Edit</button>
            <button onclick="deleteEmployee('${e.id}')">Delete</button>
          </td>
        </tr>
      `;
    }
  }
}

function deleteEmployee(id) {
  if (confirm("Delete this employee?")) {
    localStorage.removeItem(`employee_${id}`);
    loadEmployees();
  }
}

function editEmployee(id) {
  const e = JSON.parse(localStorage.getItem(`employee_${id}`));
  const params = new URLSearchParams({
    id: e.id,
    name: e.name,
    surname: e.surname,
    contact: e.contact,
    dept: e.dept,
    photo: e.photo
  });
  window.location.href = `add-employee.html?${params.toString()}`;
}

function prefillForm() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("id")) {
    document.getElementById("idNumber").value = params.get("id");
    document.getElementById("name").value = params.get("name");
    document.getElementById("surname").value = params.get("surname");
    document.getElementById("contact").value = params.get("contact");
    document.getElementById("department").value = params.get("dept");
    document.getElementById("capturedImage").src = params.get("photo");
    document.getElementById("capturedImage").style.display = "block";
  }
}
