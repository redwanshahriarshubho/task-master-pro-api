// In-memory database (for demo purposes)
// In production, use MongoDB, PostgreSQL, etc.

export let users = [];
export let tasks = [];

let userIdCounter = 1;
let taskIdCounter = 1;

// User functions
export const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

export const createUser = ({ name, email, password }) => {
  const user = {
    id: userIdCounter++,
    name,
    email,
    password,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  return user;
};

// Task functions
export const getUserTasks = (userId) => {
  return tasks.filter(task => task.userId === userId);
};

export const createTask = ({ userId, title, description, status }) => {
  const task = {
    id: taskIdCounter++,
    userId,
    title,
    description,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  tasks.push(task);
  return task;
};

export const updateTask = (taskId, updates) => {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return null;

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  return tasks[taskIndex];
};

export const deleteTask = (taskId) => {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return false;

  tasks.splice(taskIndex, 1);
  return true;
};
