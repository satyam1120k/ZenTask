# 📝 ZenTask - AI-Powered Task Management

<div align="center">

![ZenTask](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

**A modern, AI-enhanced task management application with real-time sync and intelligent insights.**

[Live Demo](https://satyam1120k.github.io/ZenTask/) | [Report Bug](https://github.com/satyam1120k/ZenTask/issues) | [Request Feature](https://github.com/satyam1120k/ZenTask/issues)

</div>

---

## ✨ Features

### Core Functionality
- ✅ **Task Management** - Create, edit, delete, and organize tasks with ease
- 🔄 **Real-time Sync** - Firebase Firestore integration for cloud synchronization
- 🏷️ **Priority Levels** - Categorize tasks as High, Medium, or Low priority
- 📅 **Due Dates** - Set and track task deadlines
- ✔️ **Task Completion** - Mark tasks as complete/incomplete with visual feedback

### Dashboard & Analytics
- 📊 **Progress Visualizer** - Interactive donut chart showing completion status
- 📈 **Statistics Cards** - Quick metrics for Total, Done, Overdue, and Completion Rate
- 🎨 **Dark Mode** - Beautiful dark/light theme support with smooth transitions

### AI-Powered Insights
- 🤖 **AI Performance Coach** - Generate personalized productivity insights using Google's Gemini AI
- 💡 **Smart Recommendations** - Get intelligent suggestions based on your task list
- ⚡ **Real-time Analysis** - Instant feedback on your productivity patterns

### User Experience
- 🎯 **Intuitive Interface** - Clean, modern UI built with React and Tailwind CSS
- 📱 **Responsive Design** - Seamless experience across desktop and mobile devices
- 🔍 **Visual Indicators** - Color-coded priorities and overdue warnings
- 🌈 **Smooth Animations** - Polished micro-interactions for enhanced UX

---

## 🛠️ Tech Stack

### Frontend
- **React** (v19.2.0) - UI library for building component-based interfaces
- **TypeScript** (v5.8.2) - Type-safe JavaScript for better developer experience
- **Vite** (v6.2.0) - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework (via inline styles)

### Backend & Services
- **Firebase** (v12.6.0)
  - **Firestore** - Real-time NoSQL database for task storage
  - **Authentication** (ready for future implementation)
- **Google Generative AI** (v1.30.0) - Gemini API integration for AI insights

### UI Components & Libraries
- **Recharts** (v3.4.1) - Chart library for data visualization
- **Lucide React** (v0.554.0) - Beautiful icon library

### Development Tools
- **gh-pages** (v6.3.0) - Automated GitHub Pages deployment
- **@vitejs/plugin-react** - React plugin for Vite

---

## 📁 Project Structure

```
ZenTask/
├── components/               # React components
│   ├── Dashboard.tsx        # Main dashboard with stats and charts
│   └── TaskItem.tsx         # Individual task component
├── services/                # External service integrations
│   ├── firebase.ts          # Firebase configuration and initialization
│   └── geminiService.ts     # Google Gemini AI service
├── public/                  # Static assets
│   └── test_firebase.html   # Firebase connection test
├── dist/                    # Production build output
├── App.tsx                  # Main application component
├── index.tsx                # Application entry point
├── types.ts                 # TypeScript type definitions
├── vite-env.d.ts           # Vite environment type declarations
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables (not committed)
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

### Key Files Description

#### Components
- **Dashboard.tsx** - Displays task statistics, progress visualizer, and AI insights
- **TaskItem.tsx** - Renders individual task cards with edit/delete functionality

#### Services
- **firebase.ts** - Configures Firebase and exports Firestore instances
- **geminiService.ts** - Handles AI-powered task insights generation

#### Core Files
- **App.tsx** - Main app logic, task state management, and Firebase CRUD operations
- **types.ts** - TypeScript interfaces for Task and DashboardStats
- **vite.config.ts** - Build configuration with GitHub Pages base path

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **Firebase Account** ([firebase.google.com](https://firebase.google.com))
- **Google AI API Key** ([ai.google.dev](https://ai.google.dev))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/satyam1120k/ZenTask.git
   cd ZenTask
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your_project_id.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Google AI Configuration
   VITE_GOOGLE_API_KEY=your_gemini_api_key
   ```

4. **Set up Firebase**
   - Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database
   - Copy your Firebase config to `.env`

5. **Get Google AI API Key**
   - Visit [ai.google.dev](https://ai.google.dev)
   - Create an API key for Gemini
   - Add it to `.env` as `VITE_GOOGLE_API_KEY`

### Running Locally

```bash
npm run dev
```

Your app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

### Deploying to GitHub Pages

```bash
npm run deploy
```

This will build and deploy your app to GitHub Pages automatically.

---

## 🔧 Configuration

### Firebase Security Rules

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Vite Configuration

The `vite.config.ts` includes:
- Base path for GitHub Pages deployment
- React plugin for Fast Refresh
- Path aliases for cleaner imports
- Environment variable loading

---

## 📊 Features Deep Dive

### Task Management
Each task includes:
- **Title** - Task description
- **Completed** - Boolean status
- **Priority** - High (red), Medium (yellow), Low (green)
- **Due Date** - Optional deadline with overdue detection
- **Timestamps** - Creation and update tracking

### Dashboard Analytics
- **Total Tasks** - Count of all tasks
- **Completed** - Successfully finished tasks
- **Overdue** - Past-deadline incomplete tasks
- **Completion Rate** - Percentage of finished tasks

### Progress Visualizer
- Donut chart with distinct colors
- Center label showing completion percentage
- Legend for Completed, Pending, and Overdue segments
- Responsive design adapting to screen size

### AI Performance Coach
- Analyzes your task list patterns
- Provides motivational insights
- Suggests next steps based on priorities
- Uses Gemini 2.5 Flash model for fast responses

---

## 🎨 Customization

### Theme Colors
The app uses a carefully crafted color palette:
- **Primary** - Blue (`#3b82f6`) for completed tasks
- **Success** - Green for done status
- **Warning** - Yellow/Orange for medium priority
- **Danger** - Red for high priority and overdue
- **Dark Mode** - Slate-based palette for reduced eye strain

### Adding New Features

1. **New Task Properties** - Update `types.ts` interface
2. **UI Components** - Add to `components/` directory
3. **Firebase Collections** - Create in Firestore and update service
4. **AI Prompts** - Customize in `geminiService.ts`

---

## 🐛 Troubleshooting

### Common Issues

**Firebase Connection Error**
- Verify `.env` variables are correct
- Check Firebase project settings
- Ensure Firestore is enabled

**AI Insights Not Working**
- Confirm `VITE_GOOGLE_API_KEY` is set
- Check API quota limits
- Verify network connectivity

**Build Errors**
- Run `npm install` to update dependencies
- Clear `node_modules` and reinstall
- Check Node.js version compatibility

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Satyam** - [@satyam1120k](https://github.com/satyam1120k)

---

## 🙏 Acknowledgments

- Firebase for real-time database infrastructure
- Google Gemini AI for intelligent insights
- Recharts for beautiful data visualization
- Lucide for clean, consistent icons
- Vite team for blazing-fast development experience

---

<div align="center">

**Made with ❤️ and ☕**

[⬆ Back to top](#-zentask---ai-powered-task-management)

</div>
