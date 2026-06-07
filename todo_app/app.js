// ============================================
// TODO APP - Vanilla JavaScript
// ============================================

const form = document.querySelector("#todoForm");
const input = document.querySelector("#todoInput");
const todoList = document.querySelector("#todoList");
const clearCompleted = document.querySelector("#clearCompleted");
const filterBtns = document.querySelectorAll(".filter-btn");
const emptyState = document.querySelector("#emptyState");
const itemsLeft = document.querySelector("#itemsLeft");

let todos = [];
let currentFilter = "all";

// ============================================
// 1. LOAD FROM LOCALSTORAGE
// ============================================
function loadTodos() {
  const saved = localStorage.getItem("todos");
  if (saved) {
    todos = JSON.parse(saved);
    render();
  }
}

// ============================================
// 2. SAVE TO LOCALSTORAGE
// ============================================
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ============================================
// 3. ADD TODO
// ============================================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  const todo = {
    id: Date.now(),
    text: text,
    completed: false,
    editing: false,
  };

  todos.push(todo);
  saveTodos();
  render();
  input.value = "";
  input.focus();
});

// ============================================
// 4. RENDER TODOS
// ============================================
function render() {
  todoList.innerHTML = "";

  const filtered = getFilteredTodos();

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    todoList.style.display = "none";
  } else {
    emptyState.classList.add("hidden");
    todoList.style.display = "block";
  }

  filtered.forEach((todo) => {
    const li = createTodoElement(todo);
    todoList.appendChild(li);
  });

  updateStats();
}

// ============================================
// 5. CREATE TODO ELEMENT (Using createElement)
// ============================================
function createTodoElement(todo) {
  const li = document.createElement("li");
  li.className = "todo-item";
  li.dataset.id = todo.id;

  if (todo.completed) {
    li.classList.add("completed");
  }

  if (todo.editing) {
    // Edit mode
    const input = document.createElement("input");
    input.type = "text";
    input.className = "todo-edit-input";
    input.value = todo.text;
    input.focus();
    input.select();

    li.appendChild(input);

    const actions = document.createElement("div");
    actions.className = "todo-actions";

    const saveBtn = document.createElement("button");
    saveBtn.className = "btn-save";
    saveBtn.textContent = "Save";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "btn-cancel";
    cancelBtn.textContent = "Cancel";

    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);
    li.appendChild(actions);

    // Save on Enter
    input.addEventListener("keyup", (e) => {
      if (e.key === "Enter") saveBtn.click();
      if (e.key === "Escape") cancelBtn.click();
    });

    // Save button
    saveBtn.addEventListener("click", () => {
      const newText = input.value.trim();
      if (newText) {
        const todo = todos.find((t) => t.id == li.dataset.id);
        if (todo) {
          todo.text = newText;
          todo.editing = false;
          saveTodos();
          render();
        }
      }
    });

    // Cancel button
    cancelBtn.addEventListener("click", () => {
      const todo = todos.find((t) => t.id == li.dataset.id);
      if (todo) {
        todo.editing = false;
        render();
      }
    });
  } else {
    // Normal mode
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.completed;

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const actions = document.createElement("div");
    actions.className = "todo-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "btn-edit";
    editBtn.textContent = "✏️";
    editBtn.title = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "✕";
    deleteBtn.title = "Delete";

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(actions);

    // Checkbox: toggle completed
    checkbox.addEventListener("change", () => {
      toggleTodo(li.dataset.id);
    });

    // Double click text or click edit button: edit mode
    text.addEventListener("dblclick", () => {
      editTodo(li.dataset.id);
    });

    editBtn.addEventListener("click", () => {
      editTodo(li.dataset.id);
    });

    // Delete button
    deleteBtn.addEventListener("click", () => {
      deleteTodo(li.dataset.id);
    });
  }

  return li;
}

// ============================================
// 6. TOGGLE COMPLETED
// ============================================
function toggleTodo(id) {
  const todo = todos.find((t) => t.id == id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    render();
  }
}

// ============================================
// 7. DELETE TODO
// ============================================
function deleteTodo(id) {
  todos = todos.filter((t) => t.id != id);
  saveTodos();
  render();
}

// ============================================
// 8. EDIT TODO
// ============================================
function editTodo(id) {
  const todo = todos.find((t) => t.id == id);
  if (todo) {
    todo.editing = true;
    render();
  }
}

// ============================================
// 9. FILTER TODOS
// ============================================
function getFilteredTodos() {
  switch (currentFilter) {
    case "active":
      return todos.filter((t) => !t.completed);
    case "completed":
      return todos.filter((t) => t.completed);
    default:
      return todos;
  }
}

// ============================================
// 10. FILTER BUTTONS
// ============================================
filterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    currentFilter = e.target.dataset.filter;
    render();
  });
});

// ============================================
// 11. CLEAR COMPLETED
// ============================================
clearCompleted.addEventListener("click", () => {
  todos = todos.filter((t) => !t.completed);
  saveTodos();
  render();
});

// ============================================
// 12. UPDATE STATS
// ============================================
function updateStats() {
  const active = todos.filter((t) => !t.completed).length;
  const completed = todos.filter((t) => t.completed).length;

  itemsLeft.textContent = `${active} item${active !== 1 ? "s" : ""} left`;
  clearCompleted.disabled = completed === 0;
}

// ============================================
// 13. INITIAL LOAD
// ============================================
loadTodos();
