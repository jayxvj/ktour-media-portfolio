# 🔥 Firebase Security Rules Setup Guide

Your admin panel cannot create albums because Firebase security rules are not configured. Follow these steps to fix it:

---

## 📋 Quick Setup Steps

### Step 1: Open Firebase Console
1. Go to **[Firebase Console](https://console.firebase.google.com/)**
2. Select your project: **ktour-mp**

---

### Step 2: Configure Firestore Security Rules

1. In the left sidebar, click **"Firestore Database"**
2. Click the **"Rules"** tab at the top
3. **Delete all existing rules** in the editor
4. **Copy and paste** the following rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Albums collection - only authenticated admins can write
    match /albums/{albumId} {
      allow read: if true;
      allow create, update, delete: if isAuthenticated();
    }
    
    // Media collection - only authenticated admins can write
    match /media/{mediaId} {
      allow read: if true;
      allow create, update, delete: if isAuthenticated();
    }
    
    // Contact requests
    match /contactRequests/{requestId} {
      allow create: if true;
      allow read, update, delete: if isAuthenticated();
    }
    
    // Quote requests
    match /quoteRequests/{requestId} {
      allow create: if true;
      allow read, update, delete: if isAuthenticated();
    }
    
    // Admin users
    match /adminUsers/{userId} {
      allow read: if isAuthenticated();
      allow write: if false;
    }
  }
}
```

5. Click **"Publish"** button

---

### Step 3: Configure Storage Security Rules

1. In the left sidebar, click **"Storage"**
2. Click the **"Rules"** tab at the top
3. **Delete all existing rules** in the editor
4. **Copy and paste** the following rules:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Thumbnails folder
    match /thumbnails/{allPaths=**} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    // Images folder
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    // Videos folder
    match /videos/{allPaths=**} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
  }
}
```

5. Click **"Publish"** button

---

## ✅ Testing

After deploying the rules:

1. **Refresh your admin page**: http://localhost:3000/admin/albums
2. **Log in** with your admin credentials:
   - Email: `ktour@world.com`
   - Password: `ktour@58575`
3. **Try creating a new album** with images/videos
4. **It should work instantly!** ✨

---

## 🔐 What These Rules Do

### Firestore Rules:
- ✅ **Public can view** albums and media (for portfolio page)
- ✅ **Only authenticated admins can create/edit/delete** albums and media
- ✅ **Anyone can submit** contact and quote forms
- ✅ **Only admins can view** submitted forms

### Storage Rules:
- ✅ **Public can view** all uploaded images/videos
- ✅ **Only authenticated admins can upload** new files
- ✅ **Organized by folders**: thumbnails, images, videos

---

## 🚨 Important Notes

1. **You must be logged in** to the admin panel to create albums
2. **Test mode rules expire** - These production rules are permanent
3. **Security**: Only authenticated users (your admin account) can modify data
4. **Public access**: Portfolio visitors can view albums without login

---

## 💡 Troubleshooting

### Still getting "permission denied" errors?

1. **Check if you're logged in**: Look for logout button in admin panel
2. **Clear browser cache** and refresh page
3. **Check Firebase Console**: 
   - Go to Firestore → Rules
   - Make sure rules are published (green checkmark)
4. **Check Storage Rules**:
   - Go to Storage → Rules
   - Make sure rules are published (green checkmark)

### Rules not applying?

- Wait 1-2 minutes after publishing
- Hard refresh browser: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Check browser console for specific error messages

---

## 📞 Need Help?

If you're still having issues after following these steps, check:
- Firebase Console → Usage & Billing (make sure project is active)
- Browser console for specific error messages
- Make sure you're using the correct admin email/password

---

**After completing these steps, your admin panel will work perfectly!** 🎉
