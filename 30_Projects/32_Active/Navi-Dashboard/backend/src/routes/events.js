/**
 * Events Routes
 * Server-Sent Events (SSE) for real-time updates
 */

import openclawService from '../services/openclaw.js';
import taskStore from '../services/taskStore.js';

/**
 * GET /api/events/stream
 * SSE event stream for real-time updates
 */
export async function streamEvents(req, res) {
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', time: new Date().toISOString() })}\n\n`);

  // Keep connection alive with heartbeat
  const heartbeat = setInterval(() => {
    res.write(`: heartbeat\n\n`);
  }, 30000);

  // Agent status changes
  const agentCallback = (agent) => {
    res.write(`data: ${JSON.stringify({ type: 'agent:status', data: agent, time: new Date().toISOString() })}\n\n`);
  };
  openclawService.on('agent:status', agentCallback);
  openclawService.on('agent:online', agentCallback);
  openclawService.on('agent:offline', agentCallback);

  // Task changes
  const taskCallback = (event, task) => {
    res.write(`data: ${JSON.stringify({ type: event, data: task, time: new Date().toISOString() })}\n\n`);
  };
  const unsubscribe = taskStore.addObserver(taskCallback);

  // Cleanup on client disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    openclawService.off('agent:status', agentCallback);
    openclawService.off('agent:online', agentCallback);
    openclawService.off('agent:offline', agentCallback);
    unsubscribe();
  });
}

/**
 * GET /api/events/health
 * Get current system health status (non-SSE)
 */
export async function getHealth(req, res) {
  try {
    const gatewayStatus = await openclawService.getStatus();
    const agents = openclawService.getAllCachedAgents();
    const sessions = openclawService.getAllCachedSessions();
    const tasks = await taskStore.getAll();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      gateway: gatewayStatus,
      agents: {
        count: agents.length,
        list: agents
      },
      sessions: {
        count: sessions.length
      },
      tasks: {
        count: tasks.length
      },
      timestamp: new Date().toISOString()
    }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}
