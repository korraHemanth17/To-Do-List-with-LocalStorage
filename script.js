
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");

let tasks = [];

try {
  const savedTasks = JSON.parse(
    localStorage.getItem("todoTasks") || "[]"
  );

  if (Array.isArray(savedTasks)) {
    tasks = savedTasks.filter(task =>
      task &&
      typeof task.id === "string" &&
      typeof task.text === "string" &&
      typeof task.completed === "boolean"
    );
  }
} catch {
  tasks = [];
}

function saveTasks() {
  try {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
  } catch {
    alert("Unable to save tasks in this browser.");
  }
}

function renderTasks() {
  taskList.replaceChildren();

  const remaining = tasks.filter(task => !task.completed).length;
  taskCount.textContent =
    `${tasks.length} tasks · ${remaining} remaining`;

  if (tasks.length === 0) {
    const message = document.createElement("li");
    message.className = "empty-message";
    message.textContent = "No tasks yet. Add your first task!";
    taskList.appendChild(message);
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute(
      "aria-label",
      `Complete ${task.text}`
    );

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute(
      "aria-label",
      `Delete ${task.text}`
    );

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.append(checkbox, span, deleteButton);
    taskList.appendChild(li);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: crypto.randomUUID(),
    text,
    completed: false
  });

  saveTasks();
  renderTasks();

  input.value = "";
  input.focus();
});

renderTasks();
