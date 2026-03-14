# AI Development Guidelines

## Project Context
- **Name:** uae-attacks-monitor
- **Stack:** Vite, React, TypeScript, Tailwind CSS v4, Recharts.
- **Data Source:** Official MOI (Ministry of Interior) statistics.

## Strict Developer Rules
1. **Docker Only:** Never suggest commands to be run directly on the host OS. All node, npm, or npx actions must be wrapped in a Docker container: 
   `docker run --rm -v $(pwd):/app -w /app node:20-alpine ...`
2. **Frontend Only:** Do not suggest adding a backend, database, or API. The "database" is `public/data.json`.
3. **Tailwind v4:** Note that this project uses Tailwind v4. Configuration is handled via `@tailwindcss/postcss` and `@import "tailwindcss"` in CSS.
4. **Zsh Compatibility:** When providing shell commands, ensure special characters (like `!`) are escaped or handled via single quotes/Heredocs to prevent "event not found" errors.

## Data Schema
Maintain the following structure in `public/data.json`:
```json
{
  "date": "MMM DD",
  "uav": number,
  "cruise": number,
  "ballistic": number
}
```

---

### Next Step
1. Create these two files in your root directory.
2. Run your `git push`.
3. Check the **Actions** tab on GitHub to see your first official "infra-free" deployment.

**Would you like me to help you double-check the `.github/workflows/deploy.yml` content to ensure it’s perfectly aligned with these new files before you push?**