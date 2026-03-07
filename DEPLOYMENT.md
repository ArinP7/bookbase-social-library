# Deployment Guide

## Quick Start (Firebase Hosting)

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Your Project

```bash
# Navigate to your project directory
cd /path/to/bookshelf

# Initialize Firebase
firebase init

# Select:
# - Hosting
# - Firestore
# - Storage
# - Functions (optional, for notifications)
```

### Step 4: Configure firebase.json

Create/update `firebase.json`:

```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### Step 5: Set Up Firestore Rules

Create `firestore.rules` (copy from DATABASE_SCHEMA.md)

### Step 6: Deploy

```bash
firebase deploy
```

Your site will be live at `https://your-project.web.app`

## Alternative Hosting Options

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

### Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy`
3. Follow prompts

### GitHub Pages

1. Create a repo
2. Push your code
3. Enable GitHub Pages in settings
4. Site will be at `https://username.github.io/repo-name`

## Environment Variables

For production, set these in your hosting platform:

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

## Custom Domain

### Firebase Hosting

```bash
firebase hosting:sites:create your-domain
firebase target:apply hosting your-domain your-domain
firebase deploy --only hosting
```

Then add your custom domain in Firebase Console.

### SSL Certificate

Firebase automatically provisions SSL certificates. For other hosts:
- Vercel: Automatic
- Netlify: Automatic
- Others: Use Let's Encrypt

## Performance Optimization

### Before Deployment

1. **Minify CSS/JS**
```bash
npm install -g clean-css-cli terser
cleancss -o styles.min.css styles.css dashboard.css auth.css
terser landing.js dashboard.js auth.js -o bundle.min.js
```

2. **Optimize Images**
```bash
npm install -g imagemin-cli
imagemin uploads/*.jpg --out-dir=optimized
```

3. **Enable Compression**
Add to `firebase.json`:
```json
{
  "hosting": {
    "headers": [
      {
        "source": "**/*.@(css|js)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

## Monitoring

### Firebase Performance

Add to your HTML:

```html
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-performance.js"></script>
```

### Google Analytics

Add to your HTML:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## Backup Strategy

### Automatic Firestore Backups

Set up Cloud Scheduler:

```bash
gcloud firestore export gs://your-bucket/backups
```

### Manual Backup

```bash
firebase firestore:export backup-$(date +%Y%m%d)
```

## Scaling Considerations

### Firestore

- Use compound indexes for complex queries
- Implement pagination for large collections
- Cache frequently accessed data

### Storage

- Use CDN for images
- Implement lazy loading
- Compress images before upload

### Functions

- Set appropriate memory limits
- Use regional deployment
- Implement retry logic

## Security Checklist

- [ ] Environment variables set
- [ ] Firestore rules configured
- [ ] Storage rules configured
- [ ] CORS configured if needed
- [ ] API keys restricted
- [ ] HTTPS enforced
- [ ] Content Security Policy set

## Testing Before Deploy

```bash
# Run local Firebase emulators
firebase emulators:start

# Test in different browsers
# Check mobile responsiveness
# Verify all forms work
# Test image uploads
# Check authentication flow
```

## Post-Deployment

1. Test all features in production
2. Monitor error logs
3. Check performance metrics
4. Set up uptime monitoring
5. Configure backup schedule

## Troubleshooting

### Deploy fails?
- Check Firebase CLI version
- Verify project permissions
- Check firebase.json syntax

### 404 errors?
- Check rewrites in firebase.json
- Verify file paths

### Slow performance?
- Enable caching headers
- Optimize images
- Use CDN

## Cost Optimization

### Free Tier Limits
- Firestore: 50k reads/day
- Storage: 5GB
- Hosting: 10GB bandwidth/month

### Monitor Usage
```bash
firebase projects:list
firebase use project-id
firebase quota:list
```

## Support

- Firebase Status: https://status.firebase.google.com
- Documentation: https://firebase.google.com/docs
- Community: https://firebase.google.com/community

---

Your BookShelf app is now ready for the world! 🚀
