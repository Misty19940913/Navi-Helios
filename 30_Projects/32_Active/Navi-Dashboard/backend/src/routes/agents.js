/**
 * Agents Routes
 * Proxies OpenClaw Gateway agent endpoints
 */

import openclawService from '../services/openclaw.js';

/**
 * GET /api/gateway/status
 * Get OpenClaw Gateway status
 */
export async function getGatewayStatus(req, res) {
  try {
    const status = await openclawService.getStatus();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(status));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

/**
 * GET /api/agents
 * List all agents
 */
export async function listAgents(req, res) {
  try {
    const agents = await openclawService.listAgents();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(agents));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

/**
 * GET /api/agents/:id/status
 * Get single agent status
 */
export async function getAgentStatus(req, res) {
  try {
    const status = await openclawService.getAgentStatus(req.params.id);
    if (!status.ok) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: status.error }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(status));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

/**
 * GET /api/sessions
 * List all sessions
 */
export async function listSessions(req, res) {
  try {
    const sessions = await openclawService.listSessions();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(sessions));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

/**
 * GET /api/sessions/:id
 * Get single session details
 */
export async function getSession(req, res) {
  try {
    const result = await openclawService.getSession(req.params.id);
    if (!result.ok) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: result.error }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result.session));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}
