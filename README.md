# Roast Mutton 🍖

Share your journey through Middle-earth with a reading buddy! Track your progress through The Hobbit and The Lord of the Rings trilogy, write journal entries, and see how your friend is doing on their own adventure.

## Features

### Core Reading Experience
- **Progress Tracking**: Track your reading progress through all four books with visual progress bars
- **Daily Reading Goals**: Set and monitor your daily page reading targets (default: 30 pages)
- **Journal Entries**: Write reflections and thoughts about each chapter as you complete them
- **Custom Page Counts**: Adjust chapter page counts to match your specific edition
- **Book-to-Movie Correlation**: See which extended edition films correspond to each chapter
- **Statistics & Insights**: View detailed statistics about your journey including reading streaks and pages read

### Multi-User Features
- **Reading Buddies**: Connect with one friend using a simple invite code (e.g., `MUTTON-XK7P`)
- **Shared Journal Entries**: See your buddy's thoughts and reflections (entries are shared by default)
- **Privacy Controls**: Mark specific journal entries as private when you want to keep them to yourself
- **Buddy Progress Tracking**: See what book and chapter your friend is currently reading
- **Shared Statistics**: View combined stats and friendly comparisons of your reading journeys
- **Real-time Sync**: All data syncs instantly between you and your buddy

### Design
- **Beautiful UI**: Tolkien-inspired design with warm, Middle-earth aesthetic
- **Responsive**: Works great on desktop and mobile devices

## Getting Started

### Prerequisites
- Node.js 18+ installed
- A Firebase account (free tier is perfect for this app)

### Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project" and follow the wizard
   - Name it something like "roast-mutton" or "middle-earth-reading"

2. **Enable Realtime Database**
   - In your Firebase project, go to "Build" → "Realtime Database"
   - Click "Create Database"
   - Start in **test mode** for now (we'll add security rules next)
   - Choose a database location close to you

3. **Set Up Security Rules**
   - In the Realtime Database, go to the "Rules" tab
   - Replace the rules with the following:

```json
{
  "rules": {
    "users": {
      "$userId": {
        ".read": "auth != null && auth.uid == $userId",
        ".write": "auth != null && auth.uid == $userId"
      }
    },
    "readingGroups": {
      "$groupId": {
        ".read": "auth != null && data.child('members').val().indexOf(auth.uid) >= 0",
        ".write": "auth != null && (!data.exists() || data.child('createdBy').val() == auth.uid)"
      }
    },
    "journalEntries": {
      ".indexOn": ["groupId", "userId"],
      "$entryId": {
        ".read": "auth != null && (data.child('userId').val() == auth.uid || (data.child('isPrivate').val() == false && root.child('readingGroups').child(data.child('groupId').val()).child('members').val().indexOf(auth.uid) >= 0))",
        ".write": "auth != null && (!data.exists() && newData.child('userId').val() == auth.uid || data.child('userId').val() == auth.uid)"
      }
    }
  }
}
```

4. **Enable Authentication**
   - Go to "Build" → "Authentication"
   - Click "Get Started"
   - Click on "Email/Password" and enable it
   - Also enable "Email link (passwordless sign-in)"

5. **Get Your Firebase Config**
   - Go to Project Settings (gear icon) → "General"
   - Scroll down to "Your apps"
   - Click the web icon (`</>`) to add a web app
   - Register the app with nickname "Roast Mutton"
   - Copy the `firebaseConfig` object

### Local Development Setup

1. **Clone and Install**
   ```bash
   cd "Journey through Arda"  # or wherever you have this project
   npm install
   ```

2. **Create Environment File**
   ```bash
   cp .env.local.example .env.local
   ```

3. **Add Your Firebase Credentials**
   - Open `.env.local` in your editor
   - Paste your Firebase config values:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   - Navigate to `http://localhost:5173` (or whatever port Vite shows)
   - You should see the sign-in screen!

## Using the App

### First Time Setup

1. **Sign In**
   - Enter your email address
   - Check your email for the magic link
   - Click the link to sign in (no password needed!)

2. **Connect with Your Reading Buddy**

   **Option A: Create a Group**
   - Click "Create Group"
   - Copy the invite code (e.g., `MUTTON-XK7P`)
   - Share it with your friend

   **Option B: Join Your Friend's Group**
   - Get the invite code from your friend
   - Enter it in the "Join Group" section
   - Click "Join Group"

3. **Start Reading!**
   - Click on "The Hobbit" to begin
   - Mark chapters as complete as you finish them
   - Write journal entries to share your thoughts

### Privacy Settings

By default, all journal entries are **shared** with your reading buddy. When writing a new entry:

- **Shared Entry**: Keep the "Share with reading buddy" checkbox **checked**
- **Private Entry**: **Uncheck** the box to keep the entry private

You can also edit existing entries to change their privacy setting.

### Viewing Buddy's Progress

From the dashboard, you'll see:
- Your buddy's current book and chapter
- Their completed chapter count
- Number of journal entries they've shared

Click "Buddy's Journal" to read their shared entries, or "Shared Stats" to see combined statistics!

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables (same as your `.env.local`)
   - Click "Deploy"

3. **Share the URL**
   - Vercel will give you a URL like `roast-mutton.vercel.app`
   - Share this with your reading buddy!

### Firebase Hosting (Alternative)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

## Data Migration

If you were using the old localStorage-only version:
- Your data will automatically migrate to Firebase on first sign-in
- Look for `arda-progress-migrated` in localStorage to confirm migration
- The old data remains in localStorage as a backup

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Firebase Realtime Database
- **Authentication**: Firebase Auth (Email Magic Links)
- **Icons**: Lucide React
- **Styling**: Custom CSS with Tolkien-inspired design
- **Hosting**: Vercel (recommended) or Firebase Hosting

## Project Structure

```
src/
├── components/         # React components
│   ├── Dashboard.jsx   # Main dashboard with book selection
│   ├── BookView.jsx    # Chapter list and progress for a book
│   ├── JournalView.jsx # All your journal entries
│   ├── StatsView.jsx   # Personal statistics
│   ├── BuddyJournalView.jsx  # Buddy's shared entries
│   ├── SharedStatsView.jsx   # Combined statistics
│   ├── GroupSetup.jsx  # Create/join reading groups
│   └── AuthModal.jsx   # Sign-in modal
├── hooks/              # Custom React hooks
│   ├── useAuth.js      # Authentication state
│   ├── useProgress.js  # Reading progress sync
│   ├── useJournal.js   # Journal entries CRUD
│   ├── useReadingGroup.js  # Group management
│   └── useBuddyData.js # Fetch buddy's data
├── data/
│   └── books.js        # Book and chapter data
└── lib/
    └── firebase.js     # Firebase initialization
```

## Troubleshooting

### "Cannot connect to Firebase"
- Check your `.env.local` file has all the correct values
- Make sure the values don't have quotes around them
- Restart the dev server after changing `.env.local`

### "Permission denied" errors
- Make sure you've set up the security rules in Firebase Console
- Check that you're signed in with a valid email
- Verify the rules match the ones in this README

### Magic link emails not arriving
- Check your spam folder
- Make sure the email address is correct
- Verify "Email link (passwordless sign-in)" is enabled in Firebase Auth

### Buddy can't see my journal entries
- Make sure entries are not marked as private
- Verify you're both in the same reading group
- Check that your buddy has signed in recently

## Cost

This app runs on **100% free tiers**:
- **Firebase Free Tier**: 1GB storage, 10GB/month data transfer, 100 concurrent connections
- **Vercel Free Tier**: Unlimited personal projects, 100GB bandwidth

For 2 users with text-only journal entries, you'll stay comfortably within the free tier limits.

## Future Ideas

- [ ] Comments on journal entries
- [ ] Reading challenges and goals
- [ ] Export journal as PDF
- [ ] Support for more than 2 reading buddies
- [ ] Mobile app
- [ ] Book discussion threads

## Contributing

This is a personal project, but if you have ideas or find bugs, feel free to open an issue!

## License

MIT

---

**"I don't know half of you half as well as I should like; and I like less than half of you half as well as you deserve."** - Bilbo Baggins

Enjoy your journey through Middle-earth! ⚔️ 🗡️ 🏔️
