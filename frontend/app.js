let editingId = null;

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

function toggleTheme() {
    document.body.classList.toggle("dark");
  
    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      document.getElementById("themeToggle").innerText = "☀️ Light Mode";
    } else {
      localStorage.setItem("theme", "light");
      document.getElementById("themeToggle").innerText = "🌙 Dark Mode";
    }
  }

// CREATE
async function addEntry() {
  const text = document.getElementById("entry").value;
  if (!text) return;

  await fetch("http://localhost:3000/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  document.getElementById("entry").value = "";
  loadEntries();
}

// LOAD
async function loadEntries() {
  const res = await fetch("http://localhost:3000/entries");
  const entries = await res.json();

  const container = document.getElementById("entries");
  container.innerHTML = "";

  entries.forEach(entry => {
    const div = document.createElement("div");
    div.className = "entry";

    div.innerHTML = `
      <small>${entry.date}</small>
      <div>${entry.text}</div>

      <div class="entry-actions">
        <button onclick="openEdit(${entry.id}, \`${entry.text.replace(/`/g, "")}\`)">Edit</button>
        <button onclick="deleteEntry(${entry.id})">Delete</button>
      </div>
    `;

    container.appendChild(div);
  });
}

// DELETE
async function deleteEntry(id) {
  await fetch(`http://localhost:3000/entries/${id}`, {
    method: "DELETE"
  });

  loadEntries();
}

// OPEN MODAL
function openEdit(id, text) {
  editingId = id;
  document.getElementById("editText").value = text;
  document.getElementById("editModal").classList.remove("hidden");
}

// CLOSE MODAL
function closeModal() {
  document.getElementById("editModal").classList.add("hidden");
}

// SAVE EDIT
async function saveEdit() {
  const newText = document.getElementById("editText").value;

  await fetch(`http://localhost:3000/entries/${editingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: newText })
  });

  closeModal();
  loadEntries();
}

loadEntries();

window.onload = () => {
    const btn = document.getElementById("themeToggle");
  
    if (document.body.classList.contains("dark")) {
      btn.innerText = "☀️ Light Mode";
    } else {
      btn.innerText = "🌙 Dark Mode";
    }
  
    loadEntries();
  };