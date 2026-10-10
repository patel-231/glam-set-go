# Deploying Glam Set Go to Vercel via GitHub

Follow these steps to deploy your **Glam Set Go** website and salon management platform to Vercel with automatic continuous deployment from GitHub.

---

### Step 1: Initialize Git and Push to GitHub

1. If you haven't initialized git in your local project folder yet, open your terminal in the project root:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Glam Set Go salon platform"
   ```

2. Create a new repository on [GitHub](https://github.com/new) (e.g., named `glam-set-go`). Do **not** check "Initialize with a README" since you already have files.

3. Link your local repo to GitHub and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git
   git push -u origin main
   ```

---

### Step 2: Import into Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Under **Import Git Repository**, find and select your newly created GitHub repository (`glam-set-go`).
4. Vercel will automatically detect your project framework settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. (Optional) Under **Environment Variables**, if you use any custom keys (like Google Analytics or Gemini), add them here.
6. Click **Deploy**.

---

### Step 3: Verify SPA Routing

The included `vercel.json` already contains the SPA rewrite configuration:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
This guarantees that direct URLs, refreshing deep pages, or accessing `/admin` will never trigger a `404 Not Found` error on Vercel.

---

### Step 4: Automatic CI/CD

From now on, whenever you push changes to your `main` branch on GitHub:
```bash
git add .
git commit -m "Update salon details"
git push
```
Vercel will automatically trigger a new production build and update your live URL in seconds.
