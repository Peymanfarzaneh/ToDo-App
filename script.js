// DOM Elements cache
const DOM = {
    newTask: document.getElementById('new-task'),
    taskCategory: document.getElementById('task-category'),
    tasksList: document.getElementById('tasks-list'),
    completedTasksList: document.getElementById('completed-tasks-list'),
    historyList: document.getElementById('history-list'),
    favoriteCategory: document.getElementById('favorite-category-display'),
    searchInput: document.getElementById('search-input'),
    filterCategory: document.getElementById('filter-category'),
    totalTasks: document.getElementById('total-tasks'),
    activeTasks: document.getElementById('active-tasks'),
    completedCount: document.getElementById('completed-count'),
    viewFilters: document.querySelectorAll('.filter-btn')
};

// State management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
let taskHistory = JSON.parse(localStorage.getItem('taskHistory')) || [];
let currentView = 'all';
let searchTerm = '';
let categoryFilter = 'all';

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    localStorage.setItem('taskHistory', JSON.stringify(taskHistory));
    updateFavoriteCategory();
    updateTaskStats();
}

// Function to update task statistics
function updateTaskStats() {
    const total = tasks.length + completedTasks.length;
    const active = tasks.length;
    const completed = completedTasks.length;

    DOM.totalTasks.textContent = `Total: ${total}`;
    DOM.activeTasks.textContent = `Active: ${active}`;
    DOM.completedCount.textContent = `Completed: ${completed}`;
}

// Function to filter and search tasks
function filterAndSearchTasks() {
    let filteredTasks = [];
    
    // First, combine tasks based on view filter
    switch(currentView) {
        case 'active':
            filteredTasks = [...tasks];
            break;
        default:
            filteredTasks = [...tasks];
    }

    // Then apply category filter
    if (categoryFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.category === categoryFilter);
    }

    // Finally, apply search term
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredTasks = filteredTasks.filter(task => 
            task.text.toLowerCase().includes(term) || 
            task.category.toLowerCase().includes(term)
        );
    }

    return filteredTasks;
}

// Function to render filtered tasks
function renderFilteredTasks() {
    const filteredTasks = filterAndSearchTasks();
    DOM.tasksList.innerHTML = '';
    const fragment = document.createDocumentFragment();

    filteredTasks.forEach(task => {
        const isCompleted = completedTasks.some(t => t.id === task.id);
        const taskElement = createTaskElement(task, isCompleted ? 'completed' : 'current');
        fragment.appendChild(taskElement);
    });

    DOM.tasksList.appendChild(fragment);
}

// Function to update view filters
function updateViewFilters(view) {
    currentView = view;
    DOM.viewFilters.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    renderFilteredTasks();
}

// Function to add a new task
function addTask() {
    const taskText = DOM.newTask.value.trim();
    const category = DOM.taskCategory.value;

    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            category: category,
            date: new Date().toISOString()
        };

        tasks.push(task);
        saveTasks();
        renderFilteredTasks();
        DOM.newTask.value = '';
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
        renderFilteredTasks();
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
    renderFilteredTasks();
    renderCompletedTasks();
}

// Function to render completed tasks
function renderCompletedTasks() {
    DOM.completedTasksList.innerHTML = '';
    const fragment = document.createDocumentFragment();

    completedTasks.forEach(task => {
        const taskElement = createTaskElement(task, 'completed');
        fragment.appendChild(taskElement);
    });

    DOM.completedTasksList.appendChild(fragment);
}

// Function to render task history
function renderTaskHistory() {
    DOM.historyList.innerHTML = '';
    const fragment = document.createDocumentFragment();

    taskHistory.slice().reverse().forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.dataset.category = task.category;
        taskElement.innerHTML = `
            <div class="task-content">
                <div>${task.text}</div>
                <div class="task-category">${task.category} - Completed: ${new Date(task.completedDate).toLocaleDateString()}</div>
            </div>
        `;
        fragment.appendChild(taskElement);
    });

    DOM.historyList.appendChild(fragment);
}

// Function to create task element
function createTaskElement(task, type) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.dataset.category = task.category;
    
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

    DOM.favoriteCategory.textContent = favoriteCategory;
}

// Function to change pages
function changePage(pageId) {
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-btn');
    
    pages.forEach(page => page.classList.remove('active'));
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(pageId).classList.add('active');
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
    // Event delegation for task actions
    document.addEventListener('click', function(e) {
        const target = e.target;
        if (target.classList.contains('complete-btn')) {
            const taskId = parseInt(target.dataset.taskId);
            completeTask(taskId);
        } else if (target.classList.contains('delete-btn')) {
            const taskId = parseInt(target.dataset.taskId);
            const taskType = target.dataset.type;
            deleteTask(taskId, taskType);
        } else if (target.classList.contains('filter-btn')) {
            updateViewFilters(target.dataset.view);
        }
    });

    // Search input handler
    DOM.searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderFilteredTasks();
    });

    // Category filter handler
    DOM.filterCategory.addEventListener('change', (e) => {
        categoryFilter = e.target.value;
        renderFilteredTasks();
    });

    // Add enter key support for task input
    DOM.newTask.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Initial render
    renderFilteredTasks();
    renderCompletedTasks();
    renderTaskHistory();
    updateFavoriteCategory();
    updateTaskStats();
}); 