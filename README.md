# UAE Attacks Monitor 🇦🇪

A professional, frontend-only dashboard visualizing munition detections based on data released by the UAE Ministry of Interior (MOI).

> **⚠️ DISCLAIMER:** This is an **unofficial** project. It is not affiliated with, endorsed by, or connected to the UAE government. All data is manually transcribed from official public statements at [moi.gov.ae](https://moi.gov.ae).

## 🚀 The Philosophy
This project follows a **Strict Docker Philosophy**:
- **Zero Local Dependencies:** No Node.js or NPM required on your host machine.
- **Infrastructure-less:** Hosted entirely on GitHub Pages.
- **Static Truth:** Data is stored in a simple JSON file for transparency and easy updates.

## 🛠 How to Run Locally

### 1. Preview the Production Build
If you have already built the project, run this to see exactly what the world sees:
```bash
docker run --rm -it -p 8080:80 -v $(pwd)/dist:/usr/share/nginx/html nginx:alpine
```

Visit: http://localhost:8080

### 2. Development Mode (Hot Reload)
To make changes to the code or data and see them instantly:

Bash
```bash
docker run --rm -it -p 5173:5173 -v $(pwd):/app -w /app node:20-alpine npx vite --host
```

Visit: http://localhost:5173

### 3. Rebuild the Project
To verify the TypeScript and Tailwind compilation:

```bash
docker run --rm -v $(pwd):/app -w /app node:20-alpine sh -c "npm install && npx vite bu
```

📈 Updating Data
Open [public/data.json](/public/data.json)

Append the latest daily statistics.

Commit and push: git commit -am "data: update stats" && git push.

GitHub Actions will automatically redeploy the site.