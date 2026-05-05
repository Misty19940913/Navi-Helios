/**
 * Task Store Service - Zero dependencies
 * Simple JSON file-based task persistence
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../../data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

class TaskStore {
  constructor() {
    this.tasks = [];
    this.observers = [];
  }

  async init() {
    // Ensure data directory exists
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
      logger.info('Created data directory:', DATA_DIR);
    }

    // Load existing tasks
    if (existsSync(TASKS_FILE)) {
      try {
        const data = await readFile(TASKS_FILE, 'utf-8');
        this.tasks = JSON.parse(data);
        logger.info(`Loaded ${this.tasks.length} tasks from disk`);
      } catch (err) {
        logger.error('Failed to load tasks:', err.message);
        this.tasks = [];
      }
    } else {
      logger.info('No existing tasks file, starting fresh');
      await this._save();
    }
  }

  async _save() {
    try {
      await writeFile(TASKS_FILE, JSON.stringify(this.tasks, null, 2), 'utf-8');
    } catch (err) {
      logger.error('Failed to save tasks:', err.message);
      throw err;
    }
  }

  // CRUD Operations
  async getAll() {
    return [...this.tasks];
  }

  async getById(id) {
    return this.tasks.find(t => t.id === id) || null;
  }

  async create(data) {
    const task = {
      id: randomUUID(),
      title: data.title || 'Untitled Task',
      description: data.description || '',
      status: data.status || 'pending',
      priority: data.priority || 'medium',
      assignee: data.assignee || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      due_date: data.due_date || null,
      tags: data.tags || []
    };

    this.tasks.push(task);
    await this._save();
    this._notify('task:create', task);
    return task;
  }

  async update(id, data) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    const task = this.tasks[index];
    const updated = {
      ...task,
      ...data,
      id: task.id, // Prevent ID change
      created_at: task.created_at, // Prevent creation time change
      updated_at: new Date().toISOString()
    };

    this.tasks[index] = updated;
    await this._save();
    this._notify('task:update', updated);
    return updated;
  }

  async delete(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;

    const deleted = this.tasks.splice(index, 1)[0];
    await this._save();
    this._notify('task:delete', deleted);
    return true;
  }

  // Observer pattern for SSE
  addObserver(callback) {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter(cb => cb !== callback);
    };
  }

  _notify(event, data) {
    this.observers.forEach(cb => {
      try {
        cb(event, data);
      } catch (err) {
        logger.error('Observer callback error:', err.message);
      }
    });
  }
}

// Singleton instance
const taskStore = new TaskStore();

export default taskStore;
export { TaskStore };
