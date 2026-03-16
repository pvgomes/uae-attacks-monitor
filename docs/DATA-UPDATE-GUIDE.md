# Data Update Guide for UAE Attacks Monitor

This guide explains how to securely update data in the Supabase database.

## 🔑 Key Concepts

1. **Anon Key** (Public): Read-only access, used in the frontend
2. **Service Role Key** (Secret): Full access, used for data updates
3. **GitHub Actions**: Automated way to update data securely

## 🚀 Setup Instructions

### Step 1: Get Your Service Role Key

1. Go to your Supabase project
2. Navigate to **Settings** → **API**
3. Find the **service_role** key (keep this SECRET!)
4. Never commit this key to your repository

### Step 2: Add GitHub Secret

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add a new repository secret:
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Your service role key from Step 1

### Step 3: Choose Your Update Method

## 📊 Method 1: GitHub Actions (Recommended)

### Manual Updates via GitHub UI

1. Go to **Actions** tab in your repository
2. Click on **"Update Attack Data"** workflow
3. Click **"Run workflow"**
4. Fill in the form:
   - Date (optional, defaults to today)
   - Number of UAV attacks
   - Number of Cruise attacks
   - Number of Ballistic attacks
5. Click **"Run workflow"**

### Scheduled Updates

To enable daily automatic updates:

1. Edit `.github/workflows/update-data.yml`
2. Uncomment the schedule section:
   ```yaml
   schedule:
     - cron: '0 23 * * *'  # Runs at 23:00 UTC daily
   ```
3. Implement a data source for automatic fetching

## 💻 Method 2: Local Scripts

### Using Python Script

1. Install dependencies:
   ```bash
   pip install supabase python-dotenv
   ```

2. Create `.env` file (never commit this!):
   ```env
   VITE_SUPABASE_URL=https://xyeshxlnlompwrzzcaqf.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. Run the script:
   ```bash
   # Interactive mode
   python scripts/update-data.py

   # Direct update
   python scripts/update-data.py --date 2024-03-15 --uav 10 --cruise 2 --ballistic 5

   # Show recent data
   python scripts/update-data.py --show 7

   # Update from CSV
   python scripts/update-data.py --csv data.csv
   ```

### Using Node.js Script

1. Install dependencies:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Set environment variables:
   ```bash
   export VITE_SUPABASE_URL=https://xyeshxlnlompwrzzcaqf.supabase.co
   export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. Run the script:
   ```bash
   # Interactive mode
   node scripts/update-data.js

   # Update specific date
   node scripts/update-data.js --date 2024-03-15

   # Bulk import from data.json
   node scripts/update-data.js --bulk
   ```

## 📁 CSV Format for Bulk Updates

Create a CSV file with this format:

```csv
date,uav,cruise,ballistic
2024-03-01,541,2,165
2024-03-02,148,0,89
2024-03-03,200,1,100
```

Then run:
```bash
python scripts/update-data.py --csv your-data.csv
```

## 🔒 Security Best Practices

1. **Never commit the service role key** to your repository
2. **Use GitHub Secrets** for automated workflows
3. **Use environment variables** for local scripts
4. **Add `.env` to `.gitignore`** if using dotenv files
5. **Rotate keys regularly** in production
6. **Monitor usage** in Supabase dashboard

## 🛠️ Troubleshooting

### Common Issues

1. **"Missing required environment variables"**
   - Ensure you've set `SUPABASE_SERVICE_ROLE_KEY`
   - Check that `VITE_SUPABASE_URL` is correct

2. **"Permission denied" errors**
   - Verify you're using the service role key, not the anon key
   - Check that the key hasn't been revoked

3. **Data not appearing on website**
   - The website caches data; wait a few minutes
   - Check Supabase dashboard to confirm data was inserted
   - Verify RLS policies allow reading the data

### Verifying Updates

Check your data in Supabase:

1. Go to Supabase dashboard
2. Navigate to **Table Editor**
3. Select the `attack_data` table
4. Verify your updates appear

## 📈 Advanced: API Endpoint

For more advanced use cases, you could create a secure API endpoint:

```javascript
// Example Vercel API route (api/update-data.js)
export default async function handler(req, res) {
  // Verify API key
  if (req.headers.authorization !== `Bearer ${process.env.UPDATE_API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Update logic here
  // ...
}
```

## 🔄 Data Flow

```
GitHub Actions / Local Script
    ↓ (Service Role Key)
Supabase Database
    ↓ (Anon Key - Read Only)
Website Frontend
```

## 📞 Need Help?

- Check Supabase logs for detailed error messages
- Review GitHub Actions logs for workflow issues
- Ensure all environment variables are correctly set