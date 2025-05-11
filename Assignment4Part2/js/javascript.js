
const API_URL = 'http://localhost:3000';
let authToken = '';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        authToken = data.token;
        document.cookie = `authToken=${authToken}`;
        showTodoApp();
    } else {
        alert('Registration failed');
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        authToken = data.token;
        document.cookie = `authToken=${authToken}`;
        showTodoApp();
    } else {
        alert('Login failed');
    }
});

document.getElementById('logoutButton').addEventListener('click', async () => {
    const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (response.ok) {
        authToken = '';
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        showAuth();
    } else {
        alert('Logout failed');
    }
});

document.getElementById('todoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('todoTitle').value;
    const description = document.getElementById('todoDescription').value;

    const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ title, description })
    });

    if (response.ok) {
        const todo = await response.json();
        addTodoToList(todo);
    } else {
        alert('Failed to add todo');
    }
});

async function fetchTodos() {
    const response = await fetch(`${API_URL}/todos`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    });

    if (response.ok) {
        const todos = await response.json();
        todos.forEach(addTodoToList);
    } else {
        alert('Failed to fetch todos');
    }
}

function addTodoToList(todo) {
    const todoList = document.getElementById('todoList');
    const li = document.createElement('li');
    li.textContent = `${todo.title} - ${todo.description}`;
    li.classList.toggle('completed', todo.completed);
    todoList.appendChild(li);
}

function showTodoApp() {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('todoApp').style.display = 'block';
    fetchTodos();
}

function showAuth() {
    document.getElementById('auth').style.display = 'block';
    document.getElementById('todoApp').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('authToken='));
    if (cookie) {
        authToken = cookie.split('=')[1];
        showTodoApp();
    } else {
        showAuth();
    }
});
