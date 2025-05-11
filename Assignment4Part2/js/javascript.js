const API_URL = 'http://localhost:3000';
let authToken = '';

// Register
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

// Logout
document.getElementById('logoutButton').addEventListener('click', async () => {
    const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (response.ok) {
        authToken = '';
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        showAuth();
    } else {
        alert('Logout failed');
    }
});

// Add Todo
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
        incrementMoves();
    } else {
        alert('Failed to add todo');
    }
});

// Fetch Todos
async function fetchTodos() {
    const response = await fetch(`${API_URL}/todos`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (response.ok) {
        const todos = await response.json();
        document.getElementById('todoList').innerHTML = ''; // Clear list before re-rendering
        todos.forEach(addTodoToList);
    } else {
        alert('Failed to fetch todos');
    }
}

// Add Todo to UI
function addTodoToList(todo) {
    const todoList = document.getElementById('todoList');
    const li = document.createElement('li');
    li.textContent = `${todo.title} - ${todo.description}`;
    li.classList.toggle('completed', todo.completed);

    // Complete Button
    const completeBtn = document.createElement('button');
    completeBtn.textContent = todo.completed ? 'Undo' : 'Complete';
    completeBtn.onclick = () => toggleComplete(todo.id, !todo.completed);
    
    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editTodo(todo.id, todo.title, todo.description);
    
    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteTodo(todo.id);

    li.appendChild(completeBtn);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
}

// Edit Todo
async function editTodo(id, currentTitle, currentDescription) {
    const newTitle = prompt('Edit Title:', currentTitle);
    const newDescription = prompt('Edit Description:', currentDescription);

    if (newTitle === null) return; // User canceled

    const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle, description: newDescription })
    });

    if (response.ok) {
        fetchTodos();
        incrementMoves();
    } else {
        alert('Failed to update todo');
    }
}

// Delete Todo
async function deleteTodo(id) {
    const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (response.ok) {
        fetchTodos();
        incrementMoves();
    } else {
        alert('Failed to delete todo');
    }
}

// Toggle Completion
async function toggleComplete(id, isCompleted) {
    const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: isCompleted })
    });

    if (response.ok) {
        fetchTodos();
        incrementMoves();
    } else {
        alert('Failed to update completion status');
    }
}

// Track Moves Across Tabs
function incrementMoves() {
    let totalMoves = parseInt(localStorage.getItem('totalMoves')) || 0;
    totalMoves++;
    localStorage.setItem('totalMoves', totalMoves);
    console.log(`Total moves across tabs: ${totalMoves}`);
}

// Show Todo App
function showTodoApp() {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('todoApp').style.display = 'block';
    fetchTodos();
}

// Show Auth
function showAuth() {
    document.getElementById('auth').style.display = 'block';
    document.getElementById('todoApp').style.display = 'none';
}

// Auto-login if cookie exists
document.addEventListener('DOMContentLoaded', () => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('authToken='));
    if (cookie) {
        authToken = cookie.split('=')[1];
        showTodoApp();
    } else {
        showAuth();
    }
});
