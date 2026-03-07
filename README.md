# BookShelf - Social Library Management System

A comprehensive web application for managing personal book collections with social features, built with HTML, CSS, JavaScript, and Firebase.

## Features

### 📚 Library Management
- Track unlimited books in your personal collection
- Mark books as Read, Reading, or Unread
- Add multiple cover photos (up to 5) and purchase receipts
- Rate and review your books
- Organize by categories and tags

### 📊 Smart Analytics
- AI-powered reading recommendations based on your collection
- Visual statistics and reading goals
- Track reading progress over time
- Genre distribution insights

### 🤝 Social Features
- Share your library publicly
- Follow other book collectors
- Like and comment on libraries
- Direct messaging between users
- Community discovery

### 📅 Rental Management
- Lend books to friends with automatic tracking
- Set due dates and rental periods
- Automatic notifications for due/overdue books
- Track rental history
- Send reminders to borrowers

### 🎨 Modern UI/UX
- Beautiful, distinctive design (not generic AI aesthetic)
- Dark mode and light mode support
- Fully responsive for mobile, tablet, and desktop
- Smooth animations and transitions
- Intuitive navigation

## Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox, animations
- **JavaScript (ES6+)**: Vanilla JS, no framework dependencies
- **Fonts**: Playfair Display (headings), Work Sans (body)

### Backend (Firebase)
- **Authentication**: Email/password and Google OAuth
- **Firestore**: NoSQL database for all data
- **Storage**: Cloud storage for images
- **Cloud Functions**: Automated notifications and tasks
- **Hosting**: Firebase Hosting for deployment

## Project Structure

```
bookshelf/
├── index.html              # Landing page
├── login.html              # Login page
├── signup.html             # Signup page
├── dashboard.html          # Main application
├── styles.css              # Global styles
├── auth.css                # Authentication pages styles
├── dashboard.css           # Dashboard styles
├── landing.js              # Landing page scripts
├── auth.js                 # Authentication logic
├── dashboard.js            # Dashboard functionality
├── firebase-config.js      # Firebase configuration
├── DATABASE_SCHEMA.md      # Complete database schema
└── README.md               # This file
```

## Setup Instructions

### 1. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password and Google)
3. Create a Firestore database
4. Enable Storage
5. Copy your Firebase config

### 2. Configuration

1. Open `firebase-config.js`
2. Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 3. Firestore Security Rules

Copy the security rules from `DATABASE_SCHEMA.md` to your Firebase Console under Firestore > Rules.

### 4. Local Development

```bash
# Option 1: Python HTTP Server
python -m http.server 8000

# Option 2: Node.js HTTP Server
npx http-server

# Option 3: VS Code Live Server extension
# Install "Live Server" extension and click "Go Live"
```

Visit `http://localhost:8000` in your browser.

### 5. Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init

# Deploy
firebase deploy
```

## Database Schema

See `DATABASE_SCHEMA.md` for the complete database structure including:
- Users collection
- Books collection
- Rentals collection
- Libraries collection
- Social features (likes, comments, follows)
- Notifications

## Features Implementation Guide

### Adding Books

1. Click "Add Books" in the sidebar
2. Fill in book details:
   - Title (required)
   - Author (required)
   - Genre/Category
   - ISBN (optional)
   - Purchase date and price
   - Upload up to 5 cover photos
   - Add personal notes
3. Click "Add to Library"

### Renting Books

1. Click "Rent" in the sidebar
2. Select a book from your library
3. Enter borrower details:
   - Name
   - Email (for notifications)
   - Due date
   - Additional notes
4. System automatically:
   - Sends notification to borrower (if registered)
   - Sets reminders 2 days before due date
   - Marks as overdue if not returned on time

### Social Features

1. **Share Library**: Toggle public/private in settings
2. **Follow Users**: Browse top collectors and click "Follow"
3. **Like & Comment**: Visit public libraries
4. **Messaging**: Direct message other users

### Dark Mode

Click the settings icon and toggle "Dark Mode" to switch themes. Your preference is saved automatically.

## API Integration (Optional)

For external book data, you can integrate:
- **Google Books API**: For book metadata
- **Open Library API**: For additional book information
- **ISBN DB**: For ISBN lookups

## Customization

### Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary: #2B4C7E;
    --accent: #D4AF37;
    /* Add your custom colors */
}
```

### Typography

Change fonts in the HTML `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font" rel="stylesheet">
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Lazy loading for images
- Debounced search
- Optimized Firebase queries
- CSS animations use GPU acceleration
- Responsive images with WebP support

## Security

- Firebase security rules enforce user permissions
- All uploads are scanned for malware
- XSS protection via content sanitization
- HTTPS enforced in production
- Rate limiting on API calls

## Future Enhancements

- [ ] Reading challenges and achievements
- [ ] Book club features
- [ ] Barcode scanning for quick adds
- [ ] Export library to CSV/PDF
- [ ] Integration with Goodreads
- [ ] Mobile app (React Native)
- [ ] Collaborative libraries
- [ ] Book swaps and trades

## Troubleshooting

### Books not loading?
- Check Firebase configuration
- Verify Firestore rules
- Check browser console for errors

### Images not uploading?
- Ensure Storage is enabled in Firebase
- Check file size (max 5MB per image)
- Verify storage rules

### Authentication errors?
- Enable Email/Password auth in Firebase Console
- For Google auth, configure OAuth consent screen
- Check redirect URLs

## Contributing

This is a demo project. Feel free to fork and customize for your needs!

## License

MIT License - Feel free to use for personal or commercial projects

## Support

For issues and questions:
- Check `DATABASE_SCHEMA.md` for database structure
- Review Firebase documentation
- Check browser console for errors

## Credits

- Design: Custom UI/UX
- Icons: Custom SVG icons
- Fonts: Google Fonts (Playfair Display, Work Sans)
- Backend: Firebase

---

Built with ❤️ for book lovers and collectors
