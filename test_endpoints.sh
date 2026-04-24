#!/bin/bash

# Layeroi v2.0 — Endpoint Test Suite
# Usage: ./test_endpoints.sh https://api.layeroi.com

API_URL=${1:-http://localhost:5000}
TIMESTAMP=$(date +%s%N | cut -b1-13)
TEST_EMAIL="test-$TIMESTAMP@layeroi.com"

echo "🧪 Testing Layeroi Endpoints"
echo "API URL: $API_URL"
echo "================================\n"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

test_endpoint() {
  local name=$1
  local method=$2
  local path=$3
  local data=$4
  local auth=$5

  echo -n "Testing: $name... "

  if [ "$method" = "POST" ]; then
    response=$(curl -s -X POST "$API_URL$path" \
      -H "Content-Type: application/json" \
      ${auth:+-H "Authorization: Bearer $auth"} \
      ${auth:+-H "X-API-Key: $auth"} \
      -d "$data")
  else
    response=$(curl -s -X GET "$API_URL$path" \
      ${auth:+-H "Authorization: Bearer $auth"} \
      ${auth:+-H "X-API-Key: $auth"})
  fi

  # Check if response contains error
  if echo "$response" | grep -q '"error"' && ! echo "$response" | grep -q '"status":"success"'; then
    echo -e "${RED}FAILED${NC}"
    echo "  Response: $response\n"
    ((FAILED++))
  else
    echo -e "${GREEN}PASSED${NC}"
    echo "  Response: $(echo $response | head -c 100)...\n"
    ((PASSED++))
  fi
}

# === HEALTH CHECKS ===
echo -e "${YELLOW}=== HEALTH CHECKS ===${NC}"
test_endpoint "GET /health" "GET" "/health"

# === AUTHENTICATION ===
echo -e "${YELLOW}=== AUTHENTICATION ===${NC}"
test_endpoint "POST /auth/signup" "POST" "/auth/signup" \
  "{\"name\":\"Test User\",\"email\":\"$TEST_EMAIL\",\"company\":\"Test Company\"}"

# Extract API key from signup response
SIGNUP_RESPONSE=$(curl -s -X POST "$API_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"API Test\",\"email\":\"api-$TIMESTAMP@test.com\",\"company\":\"Test\"}")

API_KEY=$(echo "$SIGNUP_RESPONSE" | grep -o '"apiKey":"[^"]*' | cut -d'"' -f4)
echo "Generated API Key: $API_KEY"

if [ -z "$API_KEY" ]; then
  echo -e "${RED}Failed to generate API key${NC}\n"
else
  echo -e "${GREEN}API key generated successfully${NC}\n"
fi

# === API ENDPOINTS (Protected) ===
echo -e "${YELLOW}=== PROTECTED ENDPOINTS ===${NC}"

# Should fail without auth
echo -n "Testing: GET /v2/agents (no auth, should fail)... "
response=$(curl -s -X GET "$API_URL/v2/agents")
if echo "$response" | grep -q "401\|Unauthorized"; then
  echo -e "${GREEN}PASSED (correctly rejected)${NC}\n"
  ((PASSED++))
else
  echo -e "${RED}FAILED (should require auth)${NC}\n"
  ((FAILED++))
fi

# Should succeed with API key
test_endpoint "GET /v2/agents (with API key)" "GET" "/v2/agents" "" "$API_KEY"
test_endpoint "GET /v2/costs (with API key)" "GET" "/v2/costs" "" "$API_KEY"

# === AUTOMATIONS ===
echo -e "${YELLOW}=== AUTOMATIONS ===${NC}"
test_endpoint "POST /automations/seo" "POST" "/automations/seo" "{}"
test_endpoint "POST /automations/email" "POST" "/automations/email" "{}"
test_endpoint "POST /automations/free-tier" "POST" "/automations/free-tier" "{}"
test_endpoint "POST /automations/intent" "POST" "/automations/intent" "{}"

# === DOCUMENTATION ===
echo -e "${YELLOW}=== DOCUMENTATION ===${NC}"
test_endpoint "GET /docs" "GET" "/docs"
test_endpoint "GET /docs/api" "GET" "/docs/api"
test_endpoint "GET /v2/openapi.json" "GET" "/v2/openapi.json"

# === SUMMARY ===
echo -e "${YELLOW}================================${NC}"
echo "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"

if [ $FAILED -eq 0 ]; then
  echo -e "\n${GREEN}✅ ALL TESTS PASSED${NC}"
  exit 0
else
  echo -e "\n${RED}❌ SOME TESTS FAILED${NC}"
  exit 1
fi
