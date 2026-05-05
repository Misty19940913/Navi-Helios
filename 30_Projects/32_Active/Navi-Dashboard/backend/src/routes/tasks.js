/**
 * Tasks Routes
 * CRUD operations for tasks
 */

import taskStore from '../services/taskStore.js';

/**
 * GET /api/tasks
 * List all tasks
 */
export async function listTasks(req, res) {
  try {
    const tasks = await taskStore.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tasks));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

/**
 * GET /api/tasks/:id
 * Get single task
 */
export async function getTask(req, res) {
  try {
    const task = await taskStore.getById(req.params.id);
    if (!task) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Task not found' }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(task));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

/**
 * POST /api/tasks
 * Create new task
 */
export async function createTask(req, res) {
  try {
    const task = await taskStore.create(req.body || {});
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(task));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

/**
 * PATCH /api/tasks/:id
 * Update task
 */
export async function updateTask(req, res) {
  try {
    const task = await taskStore.update(req.params.id, req.body || {});
    if (!task) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Task not found' }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(task));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

/**
 * DELETE /api/tasks/:id
 * Delete task
 */
export async function deleteTask(req, res) {
  try {
    const deleted = await taskStore.delete(req.params.id);
    if (!deleted) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Task not found' }));
    }
    res.writeHead(204);
    res.end();
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}
