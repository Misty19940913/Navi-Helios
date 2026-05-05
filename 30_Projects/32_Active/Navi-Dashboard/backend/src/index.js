/**
 * Navi-Dashboard Backend
 * Node.js standard library only - zero npm dependencies
 */

import http from 'http';
import url from 'url';
import logger from './utils/logger.js';
import openclawService from './services/openclaw.js';
import taskStore from './services/taskStore.js';
import * as agentsRoutes from './routes/agents.js';
import * as tasksRoutes from './routes/tasks.js';
import * as eventsRoutes from './routes/events.js';

const PORT = process.env.PORT || 7892;
const HOST = process.env.HOST || '0.0.0.0';

/**
 * Route map - direct mapping of paths to handlers
 */
const routes = {
  'GET': {},
  'POST': {},
  'PATCH': {},
  'DELETE': {}
};

function registerRoutes() {
  // Gateway routes
  routes['GET']['/api/gateway/status'] = agentsRoutes.getGatewayStatus;
  
  // Agent routes
  routes['GET']['/api/agents'] = agentsRoutes.listAgents;
  routes['GET']['/api/agents/:id/status'] = agentsRoutes.getAgentStatus;
  
  // Session routes
  routes['GET']['/api/sessions'] = agentsRoutes.listSessions;
  routes['GET']['/api/sessions/:id'] = agentsRoutes.getSession;
  
  // Task routes
  routes['GET']['/api/tasks'] = tasksRoutes.listTasks;
  routes['GET']['/api/tasks/:id'] = tasksRoutes.getTask;
  routes['POST']['/api/tasks'] = tasksRoutes.createTask;
  routes['PATCH']['/api/tasks/:id'] = tasksRoutes.updateTask;
  routes['DELETE']['/api/tasks/:id'] = tasksRoutes.deleteTask;
  
  // Event routes
  routes['GET']['/api/events/stream'] = eventsRoutes.streamEvents;
  routes['GET']['/api/events/health'] = eventsRoutes.getHealth;
}

registerRoutes();

/**
 * Match route and extract params
 */
function matchRoute(method, pathname) {
  const methodRoutes = routes[method] || {};
  
  // Direct match
  if (methodRoutes[pathname]) {
    return { handler: methodRoutes[pathname], params: {} };
  }
  
  // Pattern match /tasks/:id, /agents/:id/status, etc.
  for (const [pattern, handler] of Object.entries(methodRoutes)) {
    if (!pattern.includes(':')) continue;
    
    const patternParts = pattern.split('/');
    const pathParts = pathname.split('/');
    
    if (patternParts.length !== pathParts.length) continue;
    
    const params = {};
    let match = true;
    
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        match = false;
        break;
      }
    }
    
    if (match) {
      return { handler, params };
    }
  }
  
  return null;
}

/**
 * Parse JSON body from request
 */
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Create HTTP server
 */
function createServer() {
  return http.createServer(async (req, res) => {
    const parsed = url.parse(req.url, true);
    const { pathname, query } = parsed;

    // CORS preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end();
      return;
    }

    // Parse JSON body for non-GET requests
    let body = {};
    if (['POST', 'PATCH', 'DELETE'].includes(req.method)) {
      try {
        body = await parseBody(req);
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
        return;
      }
    }

    // Match route
    const route = matchRoute(req.method, pathname);
    
    if (route) {
      req.params = route.params;
      req.query = query;
      req.body = body;
      logger.debug(`${req.method} ${pathname}`);
      route.handler(req, res);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found', path: pathname }));
    }
  });
}

/**
 * Main entry point
 */
async function main() {
  logger.info('='.repeat(50));
  logger.info('Navi-Dashboard Backend Starting...');
  logger.info('='.repeat(50));

  // Initialize task store
  await taskStore.init();
  logger.info('Task store initialized');

  // Start OpenClaw health monitor
  openclawService.startHealthMonitor(30000);
  logger.info('OpenClaw health monitor started');

  // Create and start server
  const server = createServer();

  server.listen(PORT, HOST, () => {
    logger.info(`Server running at http://${HOST}:${PORT}/`);
    logger.info('Available endpoints:');
    logger.info('  GET  /api/gateway/status');
    logger.info('  GET  /api/agents');
    logger.info('  GET  /api/agents/:id/status');
    logger.info('  GET  /api/sessions');
    logger.info('  GET  /api/sessions/:id');
    logger.info('  GET  /api/tasks');
    logger.info('  POST /api/tasks');
    logger.info('  PATCH /api/tasks/:id');
    logger.info('  DELETE /api/tasks/:id');
    logger.info('  GET  /api/events/stream (SSE)');
    logger.info('  GET  /api/events/health');
    logger.info('='.repeat(50));
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    logger.info('Shutting down...');
    openclawService.stopHealthMonitor();
    process.exit(0);
  });
}

main().catch(err => {
  logger.error('Fatal error:', err);
  process.exit(1);
});
