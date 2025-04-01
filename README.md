# Magic Prep - Student Application Platform

## Demo Mode (No Backend Required)

This version of the application runs in **Demo Mode** with mock data, so you don't need to set up or connect to a backend server.

### Features Available in Demo Mode:

- **University Browser**: Browse and search universities
- **Document Creation**: Create CV, SoP, and PHS documents
- **Mentor Feedback**: View simulated mentor feedback on your documents
- **University Bucket**: Add universities to your bucket and track application deadlines
- **Educational Games**: Play quizzes and educational games

## Quick Start

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```
3. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Important Notes

- You will be automatically logged in as a demo student
- All data is simulated and stored in memory - changes will be lost on page refresh
- Uploading files works, but they aren't actually sent to a backend
- The mentor dashboard integration is simulated with pre-defined responses

## Technology Stack

- React + TypeScript
- Vite
- TailwindCSS
- shadcn/ui components
- React Router for navigation
- Context API for state management

## Acknowledgments

This project was created as part of the Stanford HAI initiative.
