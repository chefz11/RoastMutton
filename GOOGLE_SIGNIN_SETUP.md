# Google Sign-In Setup for Roast Mutton

## Why Google Sign-In?

Google Sign-In provides:
- No email quota limits (unlimited sign-ins)
- Instant authentication (no waiting for email)
- Better user experience
- No additional cost

## Step 1: Enable Google Sign-In in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **Roast Mutton** project
3. Click **Authentication** in the left sidebar
4. Click the **Sign-in method** tab
5. Find **Google** in the provider list
6. Click **Google** to expand it
7. Toggle **Enable** to ON
8. Under "Project support email", select your email from dropdown
9. Click **Save**

**That's it!** No API keys or additional configuration needed for Google Sign-In.

## Step 2: Deploy Updated Code

The code has been updated to support Google Sign-In. To deploy:

```bash
git push
```

Vercel will automatically detect the changes and redeploy.

## Step 3: Test Google Sign-In

1. Go to your deployed app
2. You should see two sign-in options:
   - **Continue with Google** (new!)
   - **Sign in with Email** (existing)
3. Click "Continue with Google"
4. Choose your Google account
5. You'll be signed in immediately

## How It Works

### For Users:
- Click "Continue with Google"
- Choose Google account
- Instantly signed in (no email waiting)
- Your Google email is used as your account

### For You:
- No quota limits
- Cheaper than email authentication
- Users can still use email sign-in if they prefer
- All data is linked to the same account regardless of sign-in method

## Troubleshooting

### "This app is blocked"

If you see this message when testing:
1. This is normal for local development
2. Click "Advanced" → "Go to [your domain] (unsafe)"
3. In production (Vercel), this won't happen

### "Unauthorized domain"

If you see this error:
1. Go to Firebase Console → Authentication → Settings
2. Scroll to "Authorized domains"
3. Add your domain:
   - For Vercel: `your-app.vercel.app`
   - For local testing: `localhost`
4. Save and try again

### Google Sign-In button not showing

Check browser console for errors:
- Look for Firebase configuration errors
- Verify you enabled Google Sign-In in Firebase Console
- Make sure you deployed the latest code

## Email Quota Issue

If you're still seeing "exceeded quota" for email sign-in:

### Immediate Solution:
Use Google Sign-In instead (no quotas!)

### Long-term Solutions:

**Option 1: Upgrade to Blaze Plan (Recommended)**
1. Firebase Console → Upgrade
2. Select "Blaze (Pay as you go)"
3. Benefits:
   - Still get all free tier limits
   - Only pay for excess usage
   - Email auth costs: ~$0.05 per 1,000 emails
   - Very cheap for personal use

**Option 2: Wait for Reset**
- Free tier quotas reset every 24 hours
- Check usage: Firebase Console → Authentication → Usage

**Option 3: Keep Email + Google**
- Most users use Google (no quota)
- Email available for those who prefer it
- Spread usage across both methods

## Current Quota Limits (Free Tier)

- Email sign-in: **100 emails per day**
- Google Sign-In: **Unlimited** (no quota)
- Other providers (GitHub, etc.): Vary by provider

## Best Practice

For production apps, I recommend:
1. ✅ Enable Google Sign-In (instant, unlimited)
2. ✅ Keep email sign-in as backup
3. ✅ Upgrade to Blaze plan when you launch ($0-5/month typical)
4. ✅ Monitor usage in Firebase Console

## Next Steps

1. ✅ Enable Google Sign-In in Firebase Console (2 minutes)
2. ✅ Deploy code: `git push`
3. ✅ Test on your deployed app
4. (Optional) Upgrade to Blaze plan for higher limits
