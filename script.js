// ===============================
// Student Management System (JS)
// ===============================

// Get form elements from HTML using their IDs
const studentForm = document.getElementById("studentForm");
const studentIdInput = document.getElementById("studentId");
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const gradeInput = document.getElementById("grade");
const courseInput = document.getElementById("course");

const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

const studentTbody = document.getElementById("studentTbody");
const message = document.getElementById("message");
const searchInput = document.getElementById("searchInput");

// -------------------------------
// Load students from localStorage
// -------------------------------
// If data exists, parse JSON into an array.
// If not, start with an empty array.
let students = JSON.parse(localStorage.getItem("students")) || [];

// -----------------------------------
// Save students array to localStorage
// -----------------------------------
function saveStudents() {
  // Convert JS object/array to JSON string and store it
  localStorage.setItem("students", JSON.stringify(students));
}

// ---------------------------
// Show message to the user
// ---------------------------
function showMessage(text, color = "green") {
  message.textContent = text;   // Set message text
  message.style.color = color;  // Set message color
  // Clear the message after 2 seconds
  setTimeout(() => (message.textContent = ""), 2000);
}

// ------------------------------------------
// Render student list into the HTML table
// ------------------------------------------
function renderStudents(list = students) {
  // Clear table body first (so it doesn't duplicate rows)
  studentTbody.innerHTML = "";

  // If no students, show a row saying "No data"
  if (list.length === 0) {
    studentTbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;">No students found.</td>
      </tr>
    `;
    return;
  }

  // Loop through students and create table rows
  list.forEach((student, index) => {
    const tr = document.createElement("tr"); // Create row element

    // Fill row with student data
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.name}</td>
      <td>${student.age}</td>
      <td>${student.grade}</td>
      <td>${student.course}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editStudent('${student.id}')">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteStudent('${student.id}')">Delete</button>
      </td>
    `;

    // Add the row into the table body
    studentTbody.appendChild(tr);
  });
}

// ------------------------------------
// Generate a unique ID for each student
// ------------------------------------
function generateId() {
  // Example: "1700000000000-ab12cd"
  return Date.now().toString() + "-" + Math.random().toString(16).slice(2);
}

// ---------------------------
// Clear all form inputs
// ---------------------------
function clearForm() {
  studentIdInput.value = ""; // Clear hidden id
  nameInput.value = "";
  ageInput.value = "";
  gradeInput.value = "";
  courseInput.value = "";

  // Reset form mode back to "Add"
  submitBtn.textContent = "Add Student";
  cancelBtn.disabled = true;
}

// -----------------------------------------
// Add / Update student when form is submitted
// -----------------------------------------
studentForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Stop page reload

  // Get values from inputs
  const name = nameInput.value.trim();
  const age = ageInput.value.trim();
  const grade = gradeInput.value.trim();
  const course = courseInput.value.trim();

  // Basic validation
  if (!name || !age || !grade || !course) {
    showMessage("Please fill all fields!", "red");
    return;
  }

  // If studentIdInput has a value, we are updating an existing student
  if (studentIdInput.value) {
    // Find student by id
    const id = studentIdInput.value;

    // Update that student
    students = students.map((s) => {
      if (s.id === id) {
        // Return updated object
        return { id, name, age, grade, course };
      }
      // Return unchanged student
      return s;
    });

    saveStudents();         // Save updated list
    renderStudents();       // Display updated list
    showMessage("Student updated successfully!");
    clearForm();            // Reset form
  } else {
    // Otherwise, we are adding a new student
    const newStudent = {
      id: generateId(), // Unique id
      name,
      age,
      grade,
      course,
    };

    students.push(newStudent); // Add to array
    saveStudents();            // Save to localStorage
    renderStudents();          // Show list
    showMessage("Student added successfully!");
    clearForm();               // Clear inputs
  }
});

// ---------------------------
// Edit student function
// ---------------------------
// This function is called when user clicks Edit button
window.editStudent = function (id) {
  // Find student by id
  const student = students.find((s) => s.id === id);

  // If student not found, stop
  if (!student) return;

  // Fill form inputs with student data
  studentIdInput.value = student.id; // store id in hidden input
  nameInput.value = student.name;
  ageInput.value = student.age;
  gradeInput.value = student.grade;
  courseInput.value = student.course;

  // Change button text to "Update"
  submitBtn.textContent = "Update Student";

  // Enable cancel edit button
  cancelBtn.disabled = false;
};

// ---------------------------
// Delete student function
// ---------------------------
// This function is called when user clicks Delete button
window.deleteStudent = function (id) {
  // Confirm before deleting
  const confirmDelete = confirm("Are you sure you want to delete this student?");
  if (!confirmDelete) return;

  // Remove student with matching id
  students = students.filter((s) => s.id !== id);

  saveStudents();   // Save new list
  renderStudents(); // Re-render table
  showMessage("Student deleted successfully!", "orange");

  // If we were editing this student, reset form
  if (studentIdInput.value === id) {
    clearForm();
  }
};

// ---------------------------
// Cancel edit button
// ---------------------------
cancelBtn.addEventListener("click", function () {
  clearForm(); // Reset form back to add mode
  showMessage("Edit cancelled.", "gray");
});

// ---------------------------
// Search feature (filter list)
// ---------------------------
searchInput.addEventListener("input", function () {
  const query = searchInput.value.trim().toLowerCase();

  // Filter students by name or course
  const filtered = students.filter((s) => {
    return (
      s.name.toLowerCase().includes(query) ||
      s.course.toLowerCase().includes(query)
    );
  });

  renderStudents(filtered); // Render filtered results
});

// ---------------------------
// Render students on page load
// ---------------------------
renderStudents();
