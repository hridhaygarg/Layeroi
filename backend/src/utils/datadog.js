import { logger } from './logger.js';

const DATADOG_ENABLED = !!(process.env.DATADOG_API_KEY && process.env.DATADOG_APP_KEY);

export function initDatadog() {
  if (!DATADOG_ENABLED) {
    logger.warn('Datadog not configured');
    return;
  }
  logger.info('Datadog integration initialized');
}

export function recordMetric(metricName, value, tags = {}) {
  if (!DATADOG_ENABLED) return;

  const tagsArray = Object.entries(tags).map(([k, v]) => `${k}:${v}`);

  // In production, send to Datadog API
  // For now, log for demonstration
  logger.info('Metric recorded', {
    metric: metricName,
    value,
    tags: tagsArray.join(','),
  });
}

export function recordEvent(eventTitle, text, tags = {}) {
  if (!DATADOG_ENABLED) return;

  logger.info('Event recorded', {
    title: eventTitle,
    text,
    tags,
  });
}

export function recordSpan(spanName, duration, tags = {}) {
  if (!DATADOG_ENABLED) return;

  logger.info('Span recorded', {
    span: spanName,
    duration_ms: duration,
    tags,
  });
}

// Middleware for Datadog APM
export const datadogMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    recordSpan(`${req.method} ${req.path}`, duration, {
      method: req.method,
      path: req.path,
      status: res.statusCode,
    });

    // Record metrics
    recordMetric('request.count', 1, {
      method: req.method,
      status: res.statusCode,
    });
    recordMetric('request.duration', duration, {
      method: req.method,
    });
  });

  next();
};
