# Deployment to GitHub Pages

This guide walks you through deploying your Gaze dashboard to GitHub Pages using the included GitHub Actions workflow.

## Prerequisites

- A GitHub repository for your project
- GitHub Pages enabled for your repository
- (Optional) API keys for widgets that require external data

## Quick Start

### 1. Update Astro Configuration

Edit `astro.config.mjs` and replace `<YOUR_USERNAME>` with your GitHub username:

```javascript
export default defineConfig({
  site: 'https://YOUR_GITHUB_USERNAME.github.io',
  base: '/gaze',
  // ... rest of config
})
```

**Note**: If you renamed the repository, update the `base` value to match your repository name.

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

### 3. Configure Secrets (If Needed)

If your widgets require API keys or environment variables, add them as repository secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add your secrets with appropriate names (e.g., `API_KEY`, `SERVICE_TOKEN`)

Update `.github/workflows/deploy.yml` to pass these secrets to the build:

```yaml
- name: Build with Astro
  run: bun run build
  env:
    YOUR_SECRET_NAME: ${{ secrets.YOUR_SECRET_NAME }}
    # Add other secrets here
```

### 4. Deploy

Push your changes to the `main` branch:

```bash
git add .
git commit -m "feat: configure GitHub Pages deployment"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Install dependencies with Bun
2. Build your Astro site (fetching widget data during build)
3. Deploy to GitHub Pages

## Accessing Your Site

After deployment completes (usually 1-2 minutes), your site will be available at:

```
https://YOUR_GITHUB_USERNAME.github.io/gaze
```

## Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`) includes:

- **Trigger**: Runs on push to `main` branch or manual trigger
- **Build Job**:
  - Sets up Bun runtime
  - Installs dependencies
  - Runs `bun run build` (includes TypeScript checking and data fetching)
  - Uploads build artifacts
- **Deploy Job**:
  - Deploys the `dist/` folder to GitHub Pages
  - Updates the deployment URL

## Customization

### Custom Domain

To use a custom domain:

1. Add a `public/CNAME` file with your domain:
   ```
   dashboard.yourdomain.com
   ```

2. Update `astro.config.mjs`:
   ```javascript
   export default defineConfig({
     site: 'https://dashboard.yourdomain.com',
     base: '/', // Remove base path for custom domain
     // ...
   })
   ```

3. Configure DNS records with your domain provider (see [GitHub's custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site))

### Scheduled Rebuilds

To refresh your dashboard data automatically, add a schedule trigger to the workflow:

```yaml
on:
  push:
    branches: ['main']
  schedule:
    - cron: '0 */6 * * *'  # Rebuild every 6 hours
  workflow_dispatch:
```

This ensures your widget data stays fresh without manual intervention.

## Troubleshooting

### Build Fails

- Check the **Actions** tab in your repository for error logs
- Ensure all required secrets are configured
- Verify `bun run build` works locally before pushing

### 404 Error After Deployment

- Confirm the `base` path in `astro.config.mjs` matches your repository name
- Check that GitHub Pages source is set to "GitHub Actions"
- Wait a few minutes for DNS propagation

### Widget Data Not Loading

- Verify API keys are correctly set as GitHub secrets
- Check that secrets are passed to the build step in the workflow
- Review build logs for data fetching errors

## Local Preview

To preview the production build locally:

```bash
bun run build
bun run preview
```

Navigate to the URL shown (usually `http://localhost:4321`) to see how your site will look when deployed.

## Additional Resources

- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
