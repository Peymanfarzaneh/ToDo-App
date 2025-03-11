// Initialize tasks from localStorage or create empty arrays
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
let taskHistory = JSON.parse(localStorage.getItem('taskHistory')) || [];

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    localStorage.setItem('taskHistory', JSON.stringify(taskHistory));
    updateFavoriteCategory();
}

// Function to add a new task
function addTask() {
    const taskInput = document.getElementById('new-task');
    const categorySelect = document.getElementById('task-category');
    const taskText = taskInput.value.trim();
    const category = categorySelect.value;

    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            category: category,
            date: new Date().toISOString()
        };

        tasks.push(task);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }
}

// Function to complete a task
function completeTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        const completedTask = {
            ...tasks[taskIndex],
            completedDate: new Date().toISOString()
        };
        
        completedTasks.push(completedTask);
        taskHistory.push(completedTask);
        tasks.splice(taskIndex, 1);
        
        saveTasks();
        renderTasks();
        renderCompletedTasks();
        renderTaskHistory();
    }
}

// Function to delete a task
function deleteTask(taskId, taskType) {
    if (taskType === 'current') {
        tasks = tasks.filter(task => task.id !== taskId);
    } else if (taskType === 'completed') {
        completedTasks = completedTasks.filter(task => task.id !== taskId);
    }
    
    saveTasks();
    renderTasks();
    renderCompletedTasks();
}

// Function to render current tasks
function renderTasks() {
    const tasksList = document.getElementById('tasks-list');
    tasksList.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = createTaskElement(task, 'current');
        tasksList.appendChild(taskElement);
    });
}

// Function to render completed tasks
function renderCompletedTasks() {
    const completedTasksList = document.getElementById('completed-tasks-list');
    completedTasksList.innerHTML = '';

    completedTasks.forEach(task => {
        const taskElement = createTaskElement(task, 'completed');
        completedTasksList.appendChild(taskElement);
    });
}

// Function to render task history
function renderTaskHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    taskHistory.slice().reverse().forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <div class="task-content">
                <div>${task.text}</div>
                <div class="task-category">${task.category} - Completed: ${new Date(task.completedDate).toLocaleDateString()}</div>
            </div>
        `;
        historyList.appendChild(taskElement);
    });
}

// Function to create task element
function createTaskElement(task, type) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    
    const taskContent = `
        <div class="task-content">
            <div>${task.text}</div>
            <div class="task-category">${task.category}</div>
        </div>
        <div class="task-actions">
    `;

    let actions = '';
    if (type === 'current') {
        actions = `
            <button class="complete-btn" data-task-id="${task.id}">Complete</button>
            <button class="delete-btn" data-task-id="${task.id}" data-type="current">Delete</button>
        `;
    } else if (type === 'completed') {
        actions = `
            <button class="delete-btn" data-task-id="${task.id}" data-type="completed">Remove</button>
        `;
    }

    taskElement.innerHTML = taskContent + actions + '</div>';
    return taskElement;
}

// Function to update favorite category
function updateFavoriteCategory() {
    const categoryCount = {};
    completedTasks.forEach(task => {
        categoryCount[task.category] = (categoryCount[task.category] || 0) + 1;
    });

    let favoriteCategory = 'No tasks completed yet';
    let maxCount = 0;

    for (const category in categoryCount) {
        if (categoryCount[category] > maxCount) {
            maxCount = categoryCount[category];
            favoriteCategory = `${category} (${maxCount} tasks)`;
        }
    }

    document.getElementById('favorite-category-display').textContent = favoriteCategory;
}

// Function to change pages
function changePage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="changePage('${pageId}')"]`).classList.add('active');
}

// Function to clear history
function clearHistory() {
    if (confirm('Are you sure you want to clear all task history? This cannot be undone.')) {
        taskHistory = [];
        saveTasks();
        renderTaskHistory();
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for task actions
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('complete-btn')) {
            const taskId = parseInt(e.target.dataset.taskId);
            completeTask(taskId);
        } else if (e.target.classList.contains('delete-btn')) {
            const taskId = parseInt(e.target.dataset.taskId);
            const taskType = e.target.dataset.type;
            deleteTask(taskId, taskType);
        }
    });

    renderTasks();
    renderCompletedTasks();
    renderTaskHistory();
    updateFavoriteCategory();

    // Add enter key support for task input
    document.getElementById('new-task').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
}); 