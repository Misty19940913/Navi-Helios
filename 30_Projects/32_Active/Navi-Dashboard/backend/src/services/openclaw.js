/**
 * OpenClaw Gateway Service - Zero dependencies
 * Proxies requests to OpenClaw Gateway API
 */

import http from 'http';
import https from 'https';
import { EventEmitter } from 'events';
import logger from '../utils/logger.js';

const GATEWAY_HOST = process.env.OPENCLAW_HOST || '127.0.0.1';
const GATEWAY_PORT = process.env.OPENCLAW_PORT || 18789;
const GATEWAY_BASE = `http://${GATEWAY_HOST}:${GATEWAY_PORT}`;

class OpenClawService extends EventEmitter {
  constructor() {
    super();
    this.agents = new Map();
    this.sessions = new Map();
    this.healthInterval = null;
  }

  /**
   * Make HTTP request to OpenClaw Gateway
   */
  async _request(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, GATEWAY_BASE);
      
      const options = {
        method,
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 5000
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(data ? JSON.parse(data) : null);
            } catch {
              resolve(data);
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  }

  /**
   * Get Gateway status
   */
  async getStatus() {
    try {
      const data = await this._request('GET', '/api/status');
      return { ok: true, ...data };
    } catch (err) {
      logger.warn('Gateway status check failed:', err.message);
      return { ok: false, error: err.message };
    }
  }

  /**
   * List all agents
   */
  async listAgents() {
    try {
      const data = await this._request('GET', '/api/agents');
      const agents = Array.isArray(data) ? data : [];
      
      // Update cache
      agents.forEach(agent => {
        this.agents.set(agent.id, {
          ...agent,
          last_seen: new Date().toISOString()
        });
      });
      
      return agents;
    } catch (err) {
      logger.warn('List agents failed:', err.message);
      return [];
    }
  }

  /**
   * Get single agent status
   */
  async getAgentStatus(agentId) {
    try {
      const data = await this._request('GET', `/api/agents/${agentId}/status`);
      return { ok: true, ...data };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  /**
   * List all sessions
   */
  async listSessions() {
    try {
      const data = await this._request('GET', '/api/sessions');
      const sessions = Array.isArray(data) ? data : [];
      
      // Update cache
      sessions.forEach(session => {
        this.sessions.set(session.id, session);
      });
      
      return sessions;
    } catch (err) {
      logger.warn('List sessions failed:', err.message);
      return [];
    }
  }

  /**
   * Get single session details
   */
  async getSession(sessionId) {
    try {
      const data = await this._request('GET', `/api/sessions/${sessionId}`);
      return { ok: true, session: data };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  /**
   * Start health monitoring (polls periodically)
   */
  startHealthMonitor(intervalMs = 30000) {
    if (this.healthInterval) {
      clearInterval(this.healthInterval);
    }

    const poll = async () => {
      const prevAgents = new Map(this.agents);
      
      await this.listAgents();
      await this.listSessions();
      
      // Detect changes
      this.agents.forEach((agent, id) => {
        const prev = prevAgents.get(id);
        if (!prev) {
          this.emit('agent:online', agent);
        } else if (prev.status !== agent.status) {
          this.emit('agent:status', agent);
        }
      });
      
      prevAgents.forEach((agent, id) => {
        if (!this.agents.has(id)) {
          this.emit('agent:offline', agent);
        }
      });
    };

    poll(); // Initial poll
    this.healthInterval = setInterval(poll, intervalMs);
    logger.info('Health monitor started');
  }

  /**
   * Stop health monitoring
   */
  stopHealthMonitor() {
    if (this.healthInterval) {
      clearInterval(this.healthInterval);
      this.healthInterval = null;
      logger.info('Health monitor stopped');
    }
  }

  /**
   * Get cached agent by ID
   */
  getCachedAgent(agentId) {
    return this.agents.get(agentId) || null;
  }

  /**
   * Get all cached agents
   */
  getAllCachedAgents() {
    return Array.from(this.agents.values());
  }

  /**
   * Get all cached sessions
   */
  getAllCachedSessions() {
    return Array.from(this.sessions.values());
  }
}

// Singleton instance
const openclawService = new OpenClawService();

export default openclawService;
export { OpenClawService };
