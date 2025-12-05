# 📧 Email Setup Guide for KTOUR

## Problem
You're not receiving emails when users submit contact forms or quote requests because Gmail requires an **App Password** (not your regular Gmail password) for security.

## Solution: Set Up Gmail App Password

Follow these steps to get your Gmail App Password:

### Step 1: Enable 2-Step Verification
1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "How you sign in to Google", click **2-Step Verification**
4. Follow the prompts to enable 2-Step Verification (if not already enabled)

### Step 2: Generate App Password
1. After enabling 2-Step Verification, go back to **Security**
2. Under "How you sign in to Google", click **App passwords**
3. You may need to sign in again
4. In the "Select app" dropdown, choose **Mail**
5. In the "Select device" dropdown, choose **Other (Custom name)**
6. Type "KTOUR Website" or any name you prefer
7. Click **Generate**
8. Google will show you a 16-character password (like: `abcd efgh ijkl mnop`)

### Step 3: Update Your .env.local File
1. Copy the 16-character App Password (without spaces)
2. Open your `.env.local` file
3. Replace `your_gmail_app_password_here` with your actual App Password:

```env
EMAIL_PASS=abcdefghijklmnop
```

**Important:** Remove all spaces from the App Password when pasting it!

### Step 4: Restart Your Development Server
After updating `.env.local`, restart your development server for the changes to take effect.

## Testing
After setup, test the email functionality by:
1. Go to the Contact page on your website
2. Fill out and submit the contact form
3. Check your email at ktour58575@gmail.com
4. You should receive the form submission within seconds

## ✅ Album Management Fixed
The admin album page has been updated with a better workflow:

### Creating Albums
1. Go to Admin Dashboard → Manage Albums
2. Click "Create Album"
3. Fill in:
   - Album Title (e.g., "Luxury Hotel Tour")
   - Thumbnail Image (cover photo)
   - 360° Images & Videos (select multiple files at once)
4. Click "Create Album"

### Managing Media
- Each album card now shows the media count
- Click "Manage Media" to view/add/delete media files
- You can add more files to existing albums anytime

## Need Help?
If you're still experiencing issues:
1. Make sure 2-Step Verification is enabled on your Gmail account
2. Double-check that the App Password is copied correctly (no spaces)
3. Restart the development server after updating .env.local
4. Check the browser console and server logs for any error messages
