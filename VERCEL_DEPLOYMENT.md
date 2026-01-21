# Vercel Deployment Configuration Guide

## Firebase Environment Variables Setup

Your app requires the following Firebase environment variables to be configured in Vercel. Without these, authentication and database operations will fail silently.

### Required Environment Variables

Go to your Vercel project settings → Environment Variables and add:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Where to Find These Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon (⚙️) → Project Settings
4. Scroll to "Your apps" section
5. Select your web app or create one if needed
6. Copy the values from the Firebase config object

### Steps to Configure in Vercel

1. Go to https://vercel.com/dashboard
2. Select your Roast Mutton project
3. Go to Settings → Environment Variables
4. Add each variable one by one:
   - Variable name: `VITE_FIREBASE_API_KEY`
   - Value: (paste from Firebase)
   - Environment: Select all (Production, Preview, Development)
   - Click "Save"
5. Repeat for all 7 variables

### Important Notes

- **All variables must start with `VITE_`** - This is required for Vite to expose them to your app
- **Select all environments** - Make sure each variable is available in Production, Preview, AND Development
- **Redeploy after adding variables** - After adding all variables, trigger a new deployment:
  - Go to Deployments tab
  - Click the three dots (⋯) on the latest deployment
  - Click "Redeploy"

### Firebase Authentication Domain Setup

For Firebase Auth to work with your Vercel domain, you need to authorize it:

1. Go to Firebase Console → Authentication → Settings
2. Scroll to "Authorized domains"
3. Click "Add domain"
4. Add your Vercel domain (e.g., `roast-mutton.vercel.app`)
5. Save

### Firebase Realtime Database Rules

Make sure your database rules allow authenticated users to read/write:

```json
{
  "rules": {
    "journalEntries": {
      "$entryId": {
        ".read": "auth != null && (data.child('userId').val() === auth.uid || data.child('groupId').val() != null)",
        ".write": "auth != null && (data.child('userId').val() === auth.uid || !data.exists())"
      }
    },
    "progress": {
      "$userId": {
        ".read": "auth != null && ($userId === auth.uid || root.child('readingGroups').child(data.child('groupId').val()).child('members').child(auth.uid).exists())",
        ".write": "auth != null && $userId === auth.uid"
      }
    },
    "readingGroups": {
      "$groupId": {
        ".read": "auth != null && data.child('members').child(auth.uid).exists()",
        ".write": "auth != null && data.child('members').child(auth.uid).exists()"
      }
    },
    "chapterCustomizations": {
      "$userId": {
        ".read": "auth != null && $userId === auth.uid",
        ".write": "auth != null && $userId === auth.uid"
      }
    }
  }
}
```

## Debugging Checklist

If your app is not working in production:

### 1. Check Browser Console

Open your deployed app and check the browser console (F12 → Console tab):

**Expected logs:**
```
Firebase Config Status: {
  hasApiKey: true,
  hasAuthDomain: true,
  hasDatabaseURL: true,
  hasProjectId: true,
  ...
}
Firebase initialized successfully
Auth state changed: { isAuthenticated: true, email: "...", uid: "..." }
```

**Bad signs:**
```
CRITICAL: Firebase configuration missing!
hasApiKey: false
hasDatabaseURL: false
```
→ **Solution**: Environment variables not configured in Vercel

### 2. Check Authentication

After signing in via email link:

**Expected:**
```
Auth state changed: { isAuthenticated: true, email: "your@email.com", uid: "..." }
```

**If you see:**
```
Auth state changed: { isAuthenticated: false, email: undefined, uid: undefined }
```
→ **Solutions**:
- Check that your Vercel domain is in Firebase authorized domains
- Check that auth environment variables are correct
- Try signing in again with a fresh email link

### 3. Check Journal Save Operations

When you save a journal entry:

**Expected console logs:**
```
addEntry called: { userId: "...", hasGroupId: true/false, entry: {...} }
Attempting to save journal entry: {...}
Journal entry saved successfully: "unique-entry-id"
```

**If you see:**
```
addEntry failed: No userId
```
→ **Solution**: User not authenticated - check step 2

**If you see:**
```
Failed to save journal entry: Error: ...
```
→ **Solution**: Check Firebase database rules and databaseURL

### 4. Network Tab Check

Open DevTools → Network tab:

- Look for requests to `firebaseio.com` or `firebasedatabase.app`
- Check for 401 (Unauthorized) or 403 (Forbidden) errors
- If you see no Firebase network requests at all, environment variables are likely missing

### 5. Test Locally First

Before debugging production, test locally with production environment variables:

```bash
# Create .env.local file with your Firebase config
cat > .env.local << EOF
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
EOF

# Run dev server
npm run dev
```

If it works locally but not in production, the issue is with Vercel environment variables.

## Quick Test

After deploying and configuring everything:

1. Open your deployed app
2. Open browser console (F12)
3. Look for "Firebase Config Status" log
4. Verify all values show `true`
5. Sign in via email link
6. Look for "Auth state changed" with your email
7. Try saving a journal entry
8. Look for "Journal entry saved successfully" message
9. Check that the success toast notification appears

## Common Issues & Solutions

### Issue: "Nothing happens when I click save"

**Likely causes:**
1. Not authenticated (check console for userId)
2. Firebase database URL missing/incorrect
3. Database rules blocking write access

**Debug steps:**
1. Check console for "addEntry called" log
2. Check for error logs
3. Verify environment variables in Vercel
4. Check Firebase database rules

### Issue: "Can't tell if I'm logged in"

**Solution:**
- The app now shows your email in the top-right corner of the dashboard
- Click the logout icon to sign out
- If you don't see your email, you're not authenticated

### Issue: "Session doesn't persist after refresh"

**Likely causes:**
1. Firebase auth not properly configured
2. Browser blocking cookies/local storage

**Debug steps:**
1. Check console after page load for "Auth state changed"
2. Check browser console → Application → Local Storage
3. Look for Firebase auth tokens
4. Try in incognito mode to rule out extensions

### Issue: "Email sign-in link doesn't work"

**Likely causes:**
1. Vercel domain not in Firebase authorized domains
2. Wrong redirect URL in auth settings

**Solution:**
1. Add your Vercel domain to Firebase authorized domains
2. Make sure the `actionCodeSettings.url` in code matches your domain
3. The URL should be `https://your-domain.vercel.app/auth/complete`

## Still Having Issues?

If problems persist after following this guide:

1. **Check Vercel deployment logs:**
   - Go to Deployments → Click on deployment → View Function Logs
   - Look for build errors or warnings

2. **Verify Firebase project status:**
   - Make sure Firebase project is active
   - Check Firebase Console → Database → Data tab to see if writes are happening
   - Check Firebase Console → Authentication → Users to verify sign-ins

3. **Test with a fresh browser session:**
   - Clear browser cache and cookies
   - Try in incognito/private mode
   - Test on a different device

4. **Contact support with:**
   - Browser console logs (screenshot)
   - Network tab showing Firebase requests
   - Description of exact steps taken
