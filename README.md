## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Environment Variables Setup:**
   ```bash
   # Copy environment variables template
   cp .env.example .env
   ```

   Update `.env` with your production values:
   ```env
   VITE_API_URL=https://your-backend-domain.com
   VITE_WS_URL=wss://your-backend-domain.com
   NODE_ENV=production
   ```

2. **Deploy to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel

   # Or push to GitHub and connect to Vercel dashboard
   ```

3. **Deploy to Netlify (Alternative):**
   ```bash
   # Install Netlify CLI
   npm i -g netlify-cli

   # Deploy
   netlify deploy --prod --dir=dist
   ```

4. **Required Environment Variables:**
   - `VITE_API_URL`: Your backend API URL (required)
   - `VITE_WS_URL`: Your WebSocket server URL (optional)
   - `NODE_ENV`: Set to 'production' for production builds

### Backend Deployment

1. **Environment Variables Setup:**
   ```bash
   # Copy environment variables template
   cp .env.example .env
   ```

   Update `server/.env` with your production values:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lms
   PORT=3000
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   ```

2. **Deploy Backend:**
   - **Railway**: Connect your GitHub repo and deploy
   - **Render**: Connect your GitHub repo and deploy
   - **DigitalOcean**: Use App Platform or Droplets
   - **AWS/Heroku**: Use their respective deployment services

3. **Update Frontend Environment:**
   After deploying your backend, update the `VITE_API_URL` in your frontend environment variables to point to your deployed backend URL.

---

## 🔧 Environment Variables

### Frontend (.env)
```env
# Required
VITE_API_URL=https://your-backend-domain.com

# Optional
VITE_WS_URL=wss://your-backend-domain.com
NODE_ENV=production

# Development only
REACT_APP_USE_MOCK_USER=true
```

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lms

# Server
PORT=3000
NODE_ENV=production

# Security
JWT_SECRET=your-super-secret-jwt-key-here
COOKIE_SECRET=your-cookie-secret-here

# CORS
FRONTEND_URL=https://your-frontend-domain.vercel.app
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## 🧑‍💻 User Stories

Each user story is designed to gradually increase in difficulty — starting simple and progressing to advanced features.

---

### 🥉 Bronze Level (Basic Functionality)

#### **User Story 1 – User Registration & Login**
- As a new user, I want to register with my **name, email, password, and role (Student/Teacher)** so that I can create an account.  
- As a user, I want to **log in using my email and password** so that I can access the system.  
- As a system, I want to **store user data securely** in a database.  

#### **User Story 2 – Course Management (Teacher Role)**
- As a teacher, I want to **create a course** by providing a title, description, and duration so that students can see available courses.  
- As a student, I want to **view a list of available courses** on the homepage so that I can choose one to enroll in.

---

### 🥈 Silver Level (Intermediate Functionality)

#### **User Story 3 – Course Enrollment**
- As a student, I want to **enroll in a course** so that I can participate in it.  
- As a student, I want to **see a list of courses I am enrolled in**.  
- As a teacher, I want to **see a list of students enrolled** in my course so that I can track participation.

---

### 🥇 Gold Level (Advanced Functionality)

#### **User Story 4 – Assignment Submission**
- As a teacher, I want to **create assignments** for a course so that students can complete them.  
- As a student, I want to **submit my assignments** to the course so that the teacher can evaluate them.  
- As a teacher, I want to **see all submissions** for a course so that I can review and grade them.

---

### 💎 Platinum Level (Expert Functionality)

#### **User Story 5 – Grading System**
- As a teacher, I want to **grade student assignments** so that students receive feedback.  
- As a student, I want to **view my grades** so that I can track my performance.  
- As a system, I want to **calculate and display overall grades** for each student.

#### **User Story 6 – Optional Advanced Features**
- As a student/teacher, I want a **course discussion forum** so that we can share knowledge and questions.  
- As a teacher, I want to **upload course materials (PDF, PPT, etc.)** so that students can access them.  
- As a user, I want to **receive notifications** for new assignments, grades, and updates so that I don’t miss important information.
