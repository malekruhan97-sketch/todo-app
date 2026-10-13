// tasks localStorage me save hote hai, refresh karne par bhi rahenge
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const list = document.getElementById("taskList");
const input = document.getElementById("taskInput");

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render() {
  list.innerHTML = "";
  const shown = tasks.filter(function (t) {
    if (currentFilter === "pending") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });

  if (shown.length === 0) {
    list.innerHTML = '<li class="list-group-item text-secondary">Koi task nahi hai.</li>';
  }

  shown.forEach(function (t) {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = `
      <input type="checkbox" class="form-check-input" ${t.done ? "checked" : ""}>
      <span class="task-text ${t.done ? "done-text" : ""}"></span>
      <button class="btn btn-sm btn-outline-secondary edit">Edit</button>
      <button class="btn btn-sm btn-outline-danger del">Delete</button>`;
    li.querySelector(".task-text").textContent = t.text; // textContent se XSS se bachav

    li.querySelector("input").addEventListener("change", function () {
      t.done = !t.done; save(); render();
    });
    li.querySelector(".edit").addEventListener("click", function () {
      const newText = prompt("Task badlo:", t.text);
      if (newText && newText.trim() !== "") { t.text = newText.trim(); save(); render(); }
    });
    li.querySelector(".del").addEventListener("click", function () {
      tasks = tasks.filter(function (x) { return x.id !== t.id; });
      save(); render();
    });
    list.appendChild(li);
  });

  const left = tasks.filter(function (t) { return !t.done; }).length;
  document.getElementById("count").textContent = left + " task baaki hai";
}

function addTask() {
  const text = input.value.trim();
  if (text === "") return;
  tasks.push({ id: Date.now(), text: text, done: false });
  input.value = "";
  save(); render();
}

document.getElementById("addBtn").addEventListener("click", addTask);
input.addEventListener("keypress", function (e) { if (e.key === "Enter") addTask(); });

document.getElementById("filters").addEventListener("click", function (e) {
  if (!e.target.dataset.filter) return;
  currentFilter = e.target.dataset.filter;
  document.querySelectorAll("#filters button").forEach(function (b) { b.classList.remove("active"); });
  e.target.classList.add("active");
  render();
});

document.getElementById("clearDone").addEventListener("click", function () {
  tasks = tasks.filter(function (t) { return !t.done; });
  save(); render();
});

render();
