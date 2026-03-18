# Verification Testing Skill

## Purpose
Always run tests to verify that everything is working correctly after making changes to the codebase.

## When to Apply
- After any code modifications
- Before committing changes
- When debugging issues
- When asked "is everything ok?" or "does it work?"
- After adding new features
- After fixing bugs
- After refactoring

## Required Actions

### 1. ALWAYS Run Tests in Docker
Never run npm or tests locally. Use Docker containers:

```bash
# Quick verification - run all tests
docker-compose run --rm test

# If tests fail, run with more detail
docker-compose run --rm npm run test -- --reporter=verbose
```

### 2. Check Different Test Aspects

For comprehensive verification, run:

```bash
# Unit tests
docker-compose run --rm test -- src/__tests__/Dashboard.test.tsx

# Integration tests  
docker-compose run --rm test -- src/__tests__/ChartIntegration.test.tsx

# Data service tests
docker-compose run --rm test -- src/__tests__/dataService.test.ts

# Full test suite with coverage
docker-compose run --rm npm run test:coverage
```

### 3. Verify Build Process

Also check that the build works:

```bash
# Build the application
docker-compose run --rm npm run build

# Run the dev server to manually verify
docker-compose up app
```

## Key Verification Points

When checking if everything is ok, verify:

1. **All tests pass** - No failing tests
2. **No TypeScript errors** - Build completes successfully
3. **Chart rendering** - Charts display with data
4. **Data fetching** - Supabase/local fallback works
5. **Interactions work** - Log scale toggle, pagination, etc.
6. **No console errors** - Check browser console when running

## Response Template

When asked to verify everything is working:

1. First run: `docker-compose run --rm test`
2. Report results clearly:
   - "✅ All X tests passing"
   - "❌ Y tests failing - [specific issues]"
3. If issues found, provide specific fixes
4. Run build to ensure no TypeScript errors
5. Confirm: "Everything is working correctly" or list specific issues

## Important Reminders

- NEVER say "everything should be working" without actually running tests
- ALWAYS use Docker containers, not local npm
- If tests haven't been run recently, run them before confirming
- Include test execution output in responses when relevant