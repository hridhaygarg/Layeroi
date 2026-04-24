# Layeroi PHASE 2: Backend Infrastructure - Implementation Plan

> **For agentic workers:** Execute using superpowers:subagent-driven-development. Tasks 5-30 with two-stage review (spec compliance, code quality). This phase builds core backend services enabling all downstream work.

**Goal:** Implement backend infrastructure (logging, database client, error handling, authentication, REST APIs) on PostgreSQL + Express.js foundation from PHASE 1.

**Architecture:** Express.js service layer pattern. Auth middleware → Database client → Logging/Error handling. All endpoints follow TDD + proper error handling.

**Tech Stack:** Express.js, PostgreSQL, Supabase, Winston (logging), JWT, Bcrypt, Speakeasy (MFA), TanStack Query compatibility.

---

## PHASE 2 Tasks (5-30)

### Task 5: Logger Setup (Winston + Datadog)
- Create: `backend/src/utils/logger.js`
- Test: `backend/src/utils/__tests__/logger.test.js`
- Structured JSON logging, Winston transport, Datadog integration
- Log levels: debug, info, warn, error, fatal

### Task 6: Database Client (Supabase)
- Create: `backend/src/db/client.js`
- Test: `backend/src/db/__tests__/client.test.js`
- Supabase client singleton, connection pooling, proper initialization
- Reusable across all database operations

### Task 7: Error Handling Middleware
- Create: `backend/src/middleware/errorHandler.js`
- Test: `backend/src/middleware/__tests__/errorHandler.test.js`
- Global error handler, standardized responses, logging integration
- HTTP status codes, error codes, user messages

### Task 8: JWT Token Management
- Create: `backend/src/auth/jwt.js`
- Test: `backend/src/auth/__tests__/jwt.test.js`
- Token generation/verification, refresh tokens, expiry management
- Async signing with proper error handling

### Task 9: Password Hashing (Bcrypt)
- Create: `backend/src/auth/password.js`
- Test: `backend/src/auth/__tests__/password.test.js`
- Secure hashing (salt rounds: 12), verification, timing-attack safe

### Task 10: OAuth Providers (Google, GitHub)
- Create: `backend/src/auth/oauth.js`
- Test: `backend/src/auth/__tests__/oauth.test.js`
- OAuth2 callback handlers, token exchange, user creation

### Task 11: MFA Setup (TOTP)
- Create: `backend/src/auth/mfa.js`
- Test: `backend/src/auth/__tests__/mfa.test.js`
- TOTP secret generation, verification, backup codes

### Task 12: RBAC Enforcement
- Create: `backend/src/auth/rbac.js`
- Test: `backend/src/auth/__tests__/rbac.test.js`
- Role checking middleware, permission validation, scope-based API keys

### Task 13: Auth Endpoints (Register, Login, Logout)
- Create: `backend/src/api/auth.routes.js`
- Test: `backend/src/api/__tests__/auth.test.js`
- POST /register, /login, /logout, /refresh, /oauth/:provider
- Request validation, session management

### Task 14-15: Auth Tests & Session Management
- Redis session store, 24hr TTL, proper cleanup
- Integration tests for full auth flow

### Task 16-19: Prospect CRUD Endpoints
- GET/POST/PATCH/DELETE /api/prospects
- Filtering, pagination, soft deletes
- Bulk import with validation

### Task 20-22: Outreach Queue Endpoints
- GET /api/outreach/queue, POST /send, /sequences
- Email tracking, automation triggering

### Task 23-25: Analytics Endpoints
- GET /api/analytics/dashboard, /metrics, /export
- Real-time metrics, custom reports

### Task 26-28: Integration Endpoints
- GET/POST /api/integrations, /connect, /sync
- OAuth flow handlers, sync status tracking

### Task 29-30: Webhook Endpoints
- GET/POST /api/webhooks, /logs, /retry, /test
- HMAC signing, event routing, delivery tracking

---

## Execution Approach

1. **Dispatch implementer per task** with full TDD specification
2. **Two-stage review:** spec compliance first, code quality second
3. **Fix issues and re-review** until both pass
4. **Mark complete and move to next**
5. **All within same session** with subagent-driven development

---

## Success Criteria

- All tests passing (target: 100+ tests by end of PHASE 2)
- All endpoints documented (OpenAPI spec)
- Proper error handling on all routes
- Security: Auth middleware, input validation, rate limiting hooks
- Performance: Response times <100ms p95

---

**Starting with Tasks 5-7 (Infrastructure Layer)**
