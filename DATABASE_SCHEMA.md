# BookShelf Database Schema

## Collections

### 1. Users Collection
```javascript
{
  uid: string,                    // Firebase Auth UID
  name: string,                   // User's full name
  email: string,                  // User's email
  avatar: string,                 // Avatar URL
  bio: string,                    // User biography
  createdAt: timestamp,           // Account creation date
  followers: array<string>,       // Array of follower UIDs
  following: array<string>,       // Array of following UIDs
  preferences: {
    theme: 'light' | 'dark',     // UI theme preference
    notifications: boolean,       // Email notifications enabled
    privacy: 'public' | 'private' // Library visibility
  }
}
```

### 2. Books Collection
```javascript
{
  id: string,                     // Auto-generated book ID
  userId: string,                 // Owner's UID
  title: string,                  // Book title
  author: string,                 // Author name
  genre: string,                  // Book category/genre
  isbn: string (optional),        // ISBN number
  coverImages: array<string>,     // Array of cover image URLs (max 5)
  purchaseDate: timestamp,        // Date of purchase
  purchasePrice: number,          // Purchase amount
  purchaseReceipt: string (optional), // Receipt image URL
  notes: string,                  // Personal notes about the book
  status: string,                 // 'unread', 'reading', 'read'
  rating: number (1-5),          // Personal rating
  createdAt: timestamp,           // Date added to library
  updatedAt: timestamp,           // Last modification date
  tags: array<string>,           // Custom tags
  isPublic: boolean              // Visibility in public library
}
```

### 3. Rentals Collection
```javascript
{
  id: string,                     // Auto-generated rental ID
  bookId: string,                 // Reference to Books collection
  ownerId: string,                // Book owner's UID
  borrowerId: string (optional),  // Borrower's UID (if registered)
  borrowerEmail: string,          // Borrower's email
  borrowerName: string,           // Borrower's name
  startDate: timestamp,           // Rental start date
  dueDate: timestamp,             // Expected return date
  returnedAt: timestamp (optional), // Actual return date
  status: string,                 // 'active', 'returned', 'overdue'
  notes: string,                  // Additional notes
  createdAt: timestamp,           // Rental creation date
  notificationsSent: array<timestamp> // Track notification history
}
```

### 4. Libraries Collection (Public Profiles)
```javascript
{
  id: string,                     // Auto-generated library ID
  userId: string,                 // User's UID
  name: string,                   // Library name
  description: string,            // Library description
  isPublic: boolean,              // Public visibility
  bookCount: number,              // Total books in library
  likes: number,                  // Number of likes
  views: number,                  // View count
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 5. Likes Collection
```javascript
{
  id: string,                     // Auto-generated like ID
  libraryId: string,              // Reference to Libraries collection
  userId: string,                 // User who liked
  createdAt: timestamp
}
```

### 6. Comments Collection
```javascript
{
  id: string,                     // Auto-generated comment ID
  libraryId: string,              // Reference to Libraries collection
  userId: string,                 // Comment author's UID
  userName: string,               // Comment author's name
  userAvatar: string,             // Comment author's avatar
  comment: string,                // Comment text
  createdAt: timestamp,
  likes: number                   // Comment likes
}
```

### 7. Follows Collection
```javascript
{
  id: string,                     // Auto-generated follow ID
  followerId: string,             // User who follows
  followingId: string,            // User being followed
  createdAt: timestamp
}
```

### 8. Notifications Collection
```javascript
{
  id: string,                     // Auto-generated notification ID
  userId: string,                 // Recipient's UID
  type: string,                   // 'rental_due', 'rental_overdue', 'new_follower', 'like', 'comment'
  message: string,                // Notification message
  link: string,                   // Link to relevant page
  read: boolean,                  // Read status
  createdAt: timestamp,
  data: object                    // Additional data specific to notification type
}
```

## Indexes

### Recommended Firestore Indexes:

1. **Books Collection**
   - userId (Ascending) + status (Ascending)
   - userId (Ascending) + createdAt (Descending)
   - genre (Ascending) + rating (Descending)

2. **Rentals Collection**
   - ownerId (Ascending) + status (Ascending)
   - borrowerId (Ascending) + status (Ascending)
   - status (Ascending) + dueDate (Ascending)

3. **Notifications Collection**
   - userId (Ascending) + read (Ascending) + createdAt (Descending)

4. **Comments Collection**
   - libraryId (Ascending) + createdAt (Descending)

5. **Follows Collection**
   - followerId (Ascending) + createdAt (Descending)
   - followingId (Ascending) + createdAt (Descending)

## Storage Structure

```
/book-covers/
  /{bookId}/
    /cover-1.jpg
    /cover-2.jpg
    ...

/receipts/
  /{bookId}/
    /receipt.jpg

/avatars/
  /{userId}/
    /avatar.jpg
```

## Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Books collection
    match /books/{bookId} {
      allow read: if resource.data.isPublic == true || 
                     request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.userId;
    }
    
    // Rentals collection
    match /rentals/{rentalId} {
      allow read: if request.auth.uid == resource.data.ownerId || 
                     request.auth.uid == resource.data.borrowerId;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.ownerId;
      allow delete: if request.auth.uid == resource.data.ownerId;
    }
    
    // Libraries collection
    match /libraries/{libraryId} {
      allow read: if resource.data.isPublic == true || 
                     request.auth.uid == resource.data.userId;
      allow write: if request.auth != null && 
                      request.auth.uid == resource.data.userId;
    }
    
    // Likes collection
    match /likes/{likeId} {
      allow read: if true;
      allow create, delete: if request.auth != null;
    }
    
    // Comments collection
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
    
    // Follows collection
    match /follows/{followId} {
      allow read: if true;
      allow create, delete: if request.auth != null && 
                               request.auth.uid == request.resource.data.followerId;
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read, update: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

## Cloud Functions

### Recommended Cloud Functions:

1. **checkOverdueRentals** - Scheduled function to check for overdue books daily
2. **sendRentalReminders** - Send email/notification 2 days before due date
3. **updateLibraryStats** - Update library statistics when books are added/removed
4. **notifyOnNewFollower** - Send notification when someone follows you
5. **notifyOnComment** - Send notification when someone comments on your library
6. **notifyOnLike** - Send notification when someone likes your library

## API Endpoints (if using REST API)

```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout

GET    /api/books
POST   /api/books
PUT    /api/books/:id
DELETE /api/books/:id

GET    /api/rentals
POST   /api/rentals
PUT    /api/rentals/:id/return

GET    /api/users/:id/library
GET    /api/users/:id/followers
POST   /api/users/:id/follow

POST   /api/libraries/:id/like
POST   /api/libraries/:id/comment

GET    /api/notifications
PUT    /api/notifications/:id/read
```
