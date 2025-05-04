const API_URL = "http://localhost:3000"; // Updated API URL

document.addEventListener("DOMContentLoaded", () => {
    checkAuthStatus(); // Ensure auth persistence on refresh

    document.getElementById("register-form").addEventListener("submit", registerUser);
    document.getElementById("login-form").addEventListener("submit", loginUser);
    document.getElementById("logout-button").addEventListener("click", logoutUser);
    document.getElementById("todo-form").addEventListener("submit", createTodo);
});

// ✅ Register User
async function registerUser(event) {
    event.preventDefault();
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            alert("User registered!");
        } else {
            throw new Error("Registration failed");
        }
    } catch (error) {
        alert(error.message);
    }
}

// ✅ Login User & Store Token in Cookie
async function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            document.cookie = `authToken=${data.token};path=/`;
            checkAuthStatus();
        } else {
            throw new Error("Login failed");
        }
    } catch (error) {
        alert(error.message);
    }
}

// ✅ Logout User
function logoutUser() {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    checkAuthStatus();
}

// ✅ Check Authentication & Load Todo List
function checkAuthStatus() {
    const token = getCookie("authToken");
    if (token) {
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("todo-container").style.display = "block";
        document.getElementById("logout-button").style.display = "block";
        loadTodos();
    } else {
        document.getElementById("auth-container").style.display = "block";
        document.getElementById("todo-container").style.display = "none";
        document.getElementById("logout-button").style.display = "none";
    }
}

// ✅ Get Todo List
async function loadTodos() {
    const token = getCookie("authToken");

    try {
        const response = await fetch(`${API_URL}/todos`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to load todos");

        const todos = await response.json();
        const list = document.getElementById("todo-list");
        list.innerHTML = "";

        todos.forEach(todo => {
            const li = document.createElement("li");
            li.classList.add("todo-item");
            li.innerHTML = `
                ${todo.title} - ${todo.completed ? "✅" : "❌"}
                <button onclick="deleteTodo('${todo._id}')">Delete</button>
            `;
            list.appendChild(li);
        });
    } catch (error) {
        alert(error.message);
    }
}

// ✅ Create Todo
async function createTodo(event) {
    event.preventDefault();
    const title = document.getElementById("todo-title").value;
    const description = document.getElementById("todo-description").value;
    const token = getCookie("authToken");

    try {
        await fetch(`${API_URL}/todos`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ title, description })
        });

        loadTodos();
    } catch (error) {
        alert("Failed to create todo");
    }
}

// ✅ Delete Todo
async function deleteTodo(id) {
    const token = getCookie("authToken");

    try {
        await fetch(`${API_URL}/todos/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        loadTodos();
    } catch (error) {
        alert("Failed to delete todo");
    }
}

// ✅ Helper: Get Cookie Value
function getCookie(name) {
    return document.cookie.split("; ").find(row => row.startsWith(name))?.split("=")[1];
}
