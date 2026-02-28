# 🎬 KTOUR - Kosmos Media Production

A fully production-ready, modern, responsive website for KTOUR Media Production, specializing in Google 360° virtual tours, 360° photos, 360° videos, and media creation services.

<br>

<p align="center">
  <img src="https://github.com/user-attachments/assets/3d7e2dc9-243e-4302-ab63-a892b1746589" height="600" style="vertical-align: top;" />
  <img src="https://github.com/user-attachments/assets/3fb02a16-b901-4210-98ac-e260d8007cd2" width="300" height="600" style="vertical-align: top;"/>
</p>

<br>

## ✨ Features

### 🌐 Public Website
- **Home Page** with 360° video hero background
- **About Page** with company story, mission, vision, and timeline
- **Services Page** with detailed service offerings
- **Portfolio/Albums Gallery** with 360° media viewer
- **Contact Page** with working contact form
- **Get a Quote Modal** accessible throughout the site
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations with Framer Motion
- Glassmorphism UI effects

### 🔐 Admin Dashboard
- **Secure Firebase Authentication** (Email: ktour@world.com, Password: ktour@58575)
- **Dashboard Overview** with statistics
- **Album Management**:
  - Create albums with title and thumbnail
  - Edit album details
  - Delete albums
  - Upload multiple 360° images and videos to albums
  - View and manage all media in albums
- **Contact Requests Management** with status tracking
- **Quote Requests Management** with status tracking
- Modern, intuitive admin interface

### 📧 Email Notifications
- Automatic email notifications to ktour58575@gmail.com for:
  - Contact form submissions
  - Quote requests
- Professional HTML email templates

### 🎥 360° Media Features
- Interactive 360° image viewer using PhotoSphere Viewer
- 360° video playback support
- Fullscreen viewer with navigation
- Drag and gyroscope support

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **UI Components**: Shadcn/UI
- **Backend**: Firebase
  - Authentication
  - Firestore Database
  - Storage
- **Email**: Nodemailer
- **360° Viewer**: Photo Sphere Viewer
- **Form Validation**: React Hook Form + Zod

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ktour-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   The `.env.local` file has been created with placeholders. Update it with your Firebase and email credentials:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Email Configuration
   EMAIL_USER=ktour58575@gmail.com
   EMAIL_PASS=your_gmail_app_password_here

   # Admin Email for Notifications
   ADMIN_EMAIL=ktour58575@gmail.com
   ```

## 🔥 Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Follow the setup wizard

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Enable **Email/Password** sign-in method
4. Create an admin user:
   - Email: `ktour@world.com`
   - Password: `ktour@58575`

### 3. Setup Firestore Database

1. Go to **Firestore Database**
2. Click "Create Database"
3. Choose **Production mode** (or Test mode for development)
4. Select your region

The following collections will be created automatically:
- `albums` - Stores album information
- `media` - Stores 360° images and videos
- `contactRequests` - Stores contact form submissions
- `quoteRequests` - Stores quote form submissions

### 4. Setup Firebase Storage

1. Go to **Storage**
2. Click "Get Started"
3. Choose security rules (start in test mode for development)

The app will create these folders automatically:
- `thumbnails/` - Album thumbnails
- `images/` - 360° images
- `videos/` - 360° videos

### 5. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`)
4. Register your app
5. Copy the configuration values to your `.env.local` file

## 📧 Email Setup (Gmail)

### 1. Enable 2-Factor Authentication

1. Go to your Google Account settings
2. Enable 2-Factor Authentication

### 2. Generate App Password

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Other (Custom name)"
3. Name it "KTOUR Website"
4. Copy the generated 16-character password
5. Add it to `.env.local` as `EMAIL_PASS`

## 🏃 Running the Project

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
ktour-website/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Home page
│   │   ├── about/page.tsx           # About page
│   │   ├── services/page.tsx        # Services page
│   │   ├── portfolio/
│   │   │   ├── page.tsx             # Portfolio gallery
│   │   │   └── [id]/page.tsx        # Single album viewer
│   │   ├── contact/page.tsx         # Contact page
│   │   ├── admin/
│   │   │   ├── page.tsx             # Admin dashboard
│   │   │   ├── login/page.tsx       # Admin login
│   │   │   ├── albums/page.tsx      # Album management
│   │   │   ├── contacts/page.tsx    # Contact requests
│   │   │   └── quotes/page.tsx      # Quote requests
│   │   ├── api/
│   │   │   ├── send-contact-email/  # Contact email API
│   │   │   └── send-quote-email/    # Quote email API
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── Navigation.tsx           # Main navigation
│   │   ├── Footer.tsx               # Footer component
│   │   ├── GetQuoteModal.tsx        # Quote modal
│   │   ├── Viewer360.tsx            # 360° viewer
│   │   └── ui/                      # Shadcn UI components
│   ├── contexts/
│   │   └── AuthContext.tsx          # Firebase auth context
│   └── lib/
│       └── firebase.ts              # Firebase configuration
├── .env.local                       # Environment variables
└── package.json
```

## 🎯 Key Features Usage

### Admin Dashboard

1. **Login**: Navigate to `/admin/login`
   - Email: `ktour@world.com`
   - Password: `ktour@58575`

2. **Create Album**:
   - Go to Albums page
   - Click "Add Album"
   - Enter title and select thumbnail
   - Click "Create Album"

3. **Upload Media to Album**:
   - Click "Media" button on any album
   - Select multiple 360° images or videos
   - Click "Upload Files"

4. **Manage Requests**:
   - View contact requests in Contacts page
   - View quote requests in Quotes page
   - Update status: New → In Progress → Closed

### Public Website

- Browse portfolio at `/portfolio`
- Click any album to view 360° media
- Click individual media items for fullscreen 360° viewer
- Use "Get a Quote" button to request services
- Fill contact form on `/contact` page

## 🔒 Security

- Admin routes are protected with Firebase Authentication
- All form submissions are validated with Zod schemas
- Email credentials are stored in environment variables
- Firebase Security Rules should be configured appropriately

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud
- Azure

Remember to set all environment variables on your hosting platform.

## 📝 Environment Variables Summary

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key | `AIza...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | `my-project` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID | `1:123...` |
| `EMAIL_USER` | Gmail address for sending emails | `ktour58575@gmail.com` |
| `EMAIL_PASS` | Gmail app password | `abcd efgh ijkl mnop` |
| `ADMIN_EMAIL` | Email to receive notifications | `ktour58575@gmail.com` |

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify all Firebase environment variables are correct
- Check Firebase project settings
- Ensure Firestore and Storage are enabled

### Email Not Sending
- Verify Gmail app password is correct
- Check Gmail 2FA is enabled
- Verify EMAIL_USER and EMAIL_PASS in .env.local

### 360° Viewer Not Loading
- Check media URL is accessible
- Verify file format (JPEG/PNG for images, MP4 for videos)
- Check browser console for errors

### Admin Login Issues
- Verify admin user exists in Firebase Authentication
- Check credentials: `ktour@world.com` / `ktour@58575`
- Clear browser cache and try again

## 📞 Support

For support or questions:
- Email: ktour58575@gmail.com
- Admin Login: ktour@world.com

## 📄 License

All rights reserved © 2024 KTOUR - Kosmos Media Production

---

**Built with ❤️ for KTOUR Media Production**
