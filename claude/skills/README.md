# Skills Directory

This directory contains skills that define specific workflows and best practices for the UAE Attacks Monitor project.

## Available Skills

### 1. [verification-testing.md](./verification-testing.md)
**Purpose:** Always run tests to verify code changes are working correctly  
**When to use:** After any code changes, before commits, when debugging, or when asked "is everything ok?"  
**Key action:** Run `docker-compose run --rm test` to verify all tests pass

## Adding New Skills

When creating new skills, follow this structure:
1. Clear purpose statement
2. When to apply the skill
3. Required actions with specific commands
4. Key verification points
5. Response templates for common scenarios

## Important Notes

- All commands must be run in Docker containers
- Never use local npm installations
- Always verify with actual test runs, never assume