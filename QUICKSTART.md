# QuickStart Guide - BookShelf

## Get Started in 5 Minutes!

### Option 1: Demo Mode (Instant)

1. **Open the application**
   - Double-click `index.html` or
   - Open it in your browser

2. **Explore the landing page**
   - See the design and features
   - Click "Sign Up" to see the auth flow

3. **View the dashboard**
   - Open `dashboard.html` directly to see the interface
   - (Authentication is simulated for demo)

### Option 2: Live Server (Recommended)

#### Using Python
```bash
# Navigate to the project folder
cd path/to/bookshelf

# Start server
python -m http.server 8000

# Open browser
# Visit: http://localhost:8000
```

#### Using Node.js
```bash
# Install http-server (one time)
npm install -g http-server

# Start server
http-server

# Visit: http://localhost:8080
```

#### Using VS Code
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

### Option 3: Full Firebase Setup (Production)

See `DEPLOYMENT.md` for complete Firebase integration.

## File Structure

```
bookshelf/
├── index.html           ← Landing page (START HERE)
├── login.html           ← Login page
├── signup.html          ← Signup page
├── dashboard.html       ← Main app (after login)
├── styles.css           ← Global styles
├── auth.css             ← Auth page styles
├── dashboard.css        ← Dashboard styles
├── landing.js           ← Landing page logic
├── auth.js              ← Authentication logic
├── dashboard.js         ← Dashboard functionality
├── firebase-config.js   ← Firebase setup
├── book-covers/         ← Demo book images
├── README.md            ← Full documentation
├── DATABASE_SCHEMA.md   ← Database structure
└── DEPLOYMENT.md        ← Deployment guide
```

## Quick Customization

### Change Colors
Edit `styles.css`:
```css
:root {
    --primary: #YourColor;
    --accent: #YourAccent;
}
```

### Change Fonts
Edit HTML `<head>` sections:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont" rel="stylesheet">
```

### Add Your Logo
Replace the SVG logo in:
- `index.html` (line ~10)
- `dashboard.html` (line ~15)

## Demo Features Available

✅ Beautiful landing page  
✅ Auth pages (login/signup)  
✅ Dashboard with statistics  
✅ Book grid display  
✅ Category organization  
✅ AI recommendations UI  
✅ Dark/Light mode toggle  
✅ Responsive design  

## Connect to Firebase

1. Create Firebase project: https://console.firebase.google.com
2. Get your config from Project Settings
3. Update `firebase-config.js` with your credentials
4. Enable Authentication (Email + Google)
5. Create Firestore database
6. Enable Storage
7. Copy security rules from `DATABASE_SCHEMA.md`

## Testing Flow

1. **Landing Page** → Click "Sign Up"
2. **Sign Up** → Enter details → Creates account
3. **Dashboard** → See your library
4. **Add Books** → Upload book details
5. **Rent** → Lend books to friends
6. **Discover** → See recommendations

## Browser Requirements

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Getting Help

- See `README.md` for full features
- See `DATABASE_SCHEMA.md` for database structure
- See `DEPLOYMENT.md` for going live
- Check browser console for errors

## What's Included

📱 Fully responsive design  
🎨 Custom UI (not generic AI aesthetic)  
🔒 Firebase authentication ready  
💾 Complete database schema  
📊 Analytics and statistics  
👥 Social features framework  
📚 Book management system  
📅 Rental tracking system  
🌙 Dark mode support  

## Next Steps

1. Customize colors and branding
2. Add your Firebase credentials
3. Test locally
4. Deploy to Firebase Hosting
5. Share with friends!

---

**Need help?** Check the other MD files for detailed guides!

**Ready to deploy?** See `DEPLOYMENT.md`

**Want to understand the code?** See `README.md`

Enjoy building your library! 📚✨
