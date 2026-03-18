# UAE Attacks Monitor 🇦🇪

A professional, frontend-only dashboard visualizing munition detections based on data released by the UAE Ministry of Interior (MOI).

> **⚠️ DISCLAIMER:** This is an **unofficial** project. It is not affiliated with, endorsed by, or connected to the UAE government. All data is manually transcribed from official public statements at [moi.gov.ae](https://moi.gov.ae).

## 🚀 The Philosophy
This project follows a **Strict Docker Philosophy**:
- **Zero Local Dependencies:** No Node.js or NPM required on your host machine.
- **Infrastructure-less:** Hosted entirely on GitHub Pages.
- **Static Truth:** Data is stored in a simple JSON file for transparency and easy updates.

## 🛠 How to Run Locally

### Run the container:
```bash
docker compose up app
```

Visit: http://localhost:5173

### With container running, run the tests:
```bash
docker compose run test
```

### Stop container:
```bash
docker compose down
```

## 📈 Updating Data
Open [public/data.json](/public/data.json)

Append the latest daily statistics.

Commit and push: `git commit -am "data: update stats" && git push`

GitHub Actions will automatically redeploy the site.