# Vercel Auto-Deploy Setup Checklist

## To enable automatic deployments when pushing to the remote branch:

### 1. **Vercel Dashboard Setup**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Navigate to your project: `strategy-dashboard-new`
   - Go to **Settings** → **Git**

### 2. **Git Integration Check**
   - Verify the repository is connected: `karenpiper/strategy-dashboard-new`
   - Ensure **Production Branch** is set to `main`
   - Check that **Automatic deployments from Git** is **enabled**

### 3. **Email Verification (Critical)**
   - Go to **Settings** → **Account** → **Email**
   - Verify your email address is confirmed (check for verification email)
   - Go to **Settings** → **Notifications**
   - Ensure deployment notifications are enabled
   - Check that your email can receive Vercel notifications

### 4. **GitHub Integration**
   - In Vercel: **Settings** → **Git** → **GitHub App**
   - Verify the GitHub integration is properly connected
   - Check that Vercel has access to the repository
   - In GitHub: Go to repository **Settings** → **Integrations** → **Vercel**
   - Verify Vercel has the necessary permissions

### 5. **Deployment Settings**
   - In Vercel: **Settings** → **Git**
   - **Production Branch**: Should be `main`
   - **Automatic deployments**: Should be **ON**
   - **Preview deployments**: Can be enabled for pull requests

### 6. **Test the Setup**
   - Make a small change and push to `main` branch
   - Check Vercel dashboard for automatic deployment trigger
   - Verify you receive email notifications (if enabled)

## Common Issues:

- **No automatic deployments**: Check Git integration is connected
- **Email not verified**: Verify email in Vercel account settings
- **GitHub permissions**: Re-authorize Vercel GitHub app if needed
- **Branch mismatch**: Ensure production branch matches your default branch

## Quick Verification Command:
If you have Vercel CLI installed:
```bash
vercel link
vercel inspect
```

