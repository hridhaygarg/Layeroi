export const extractAgentName = (req, res, next) => {
  req.agentName = req.headers['x-agent-name'] || req.query.agent || 'unknown';
  next();
};
