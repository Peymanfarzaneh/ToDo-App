# Task Manager Web Application

A feature-rich web-based task management application built with vanilla JavaScript, HTML, and CSS. This application helps you organize and track your tasks with a clean, intuitive interface and powerful management features.

## Features

1. **Task Management**
   - Add new tasks with categories (Work, Personal, Shopping, Other)
   - Set optional deadlines for tasks
   - Mark tasks as complete
   - Delete tasks
   - Easy task input with Enter key support
   - Search tasks by text or category
   - Filter tasks by status (All, Active, Completed)

2. **Task Organization**
   - Categorize tasks for better organization
   - Set and track task deadlines
   - Visual indicators for approaching and overdue deadlines
   - Desktop notifications for deadline reminders

3. **Completed Tasks**
   - View all completed tasks
   - Remove completed tasks from the list
   - Track completion dates
   - Filter and search through completed tasks

4. **Task History**
   - View a chronological history of all completed tasks
   - Displays your favorite task category based on completion statistics
   - Shows completion dates for historical reference
   - Clear history option with confirmation

5. **User Interface**
   - Dark/Light mode toggle
   - Responsive design for all devices
   - Smooth animations and transitions
   - Modern and clean interface
   - Task statistics dashboard

## Technical Features

- Responsive design that works on both desktop and mobile devices
- Local storage integration for persistent data
- Clean and modern UI with smooth transitions
- No external dependencies - pure JavaScript, HTML, and CSS
- Browser notifications support
- CSS variables for easy theming
- Efficient DOM manipulation with event delegation
- Automatic deadline checking and notifications

## How to Use

1. Simply open the `index.html` file in a modern web browser
2. Add new tasks by:
   - Typing in the input field
   - Selecting a category
   - (Optional) Setting a deadline
3. Use the search bar to find specific tasks
4. Use the category filter to view tasks by category
5. Use the view filters to switch between All, Active, and Completed tasks
6. Use the bottom navigation to switch between different views:
   - 📝 Current Tasks
   - ✅ Completed Tasks
   - 📊 Task History
7. Toggle between light and dark mode using the theme button

## Data Storage

All task data is stored locally in your browser's localStorage, ensuring your tasks persist between sessions without requiring a server or database.

## Browser Compatibility

This application works in all modern browsers that support:
- ES6+ JavaScript
- Local Storage
- CSS Flexbox
- CSS Grid
- CSS Variables
- Browser Notifications API

## Performance Optimizations

- DOM element caching for better performance
- Event delegation for efficient event handling
- Debounced search functionality
- Optimized localStorage usage
- Efficient task filtering and rendering 