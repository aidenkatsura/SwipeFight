# SwipeFight 🥊

SwipeFight is a mobile app that connects martial artists with local sparring partners through a fun, swipe-based matchmaking experience. Users can view profiles, challenge opponents, chat to coordinate fight sessions, and compete for rankings on the leaderboard.

---

## Features

- 🔄 Swipe to challenge fighters you think you can beat
- 🧑‍🤝‍🧑 Match with fighters based on style, location, and rating
- 💬 In-app chat to coordinate sparring sessions
- 🥇 Global leaderboard to track fighter rankings
- 🥋 Support for multiple disciplines like Boxing, Jiu-Jitsu, Muay Thai, and more

---

## Tech Stack

- **Frontend**: React Native
- **Backend/API**: Node.js + Express
- **Database**: PostgreSQL
- **Real-time Messaging**: Socket.io
- **Authentication**: Firebase Auth
- **Storage**: Cloudinary
- **Hosting**: Render

---

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/swipefight.git
   cd swipefight
   
---
   
## Goals
1) Create connections for marital artists within local community.
2) Accelerate improvement and experience after matching and meeting people on the app.
3) Users open the app at least once a week to find partners and meet new fighters.
4) Clean, intuitive, and appealing UI/UX.
5) Same level skill matching for users in their correct discipline.

---

## Proposed Repository Layout

```bash
SwipeFight/
├── README.md                    # Overview, setup, and documentation
├── .gitignore                   # Files and folders to ignore in Git
├── frontend/                    # React Native mobile application
│   ├── App.js
│   ├── assets/                  # Images, icons, and logos
│   ├── components/              # Reusable UI components
│   ├── screens/                 # App screens (Home, Chat, Leaderboard, etc.)
│   ├── navigation/              # Navigation configuration (e.g., React Navigation)
│   ├── context/                 # Global state providers (e.g., Auth, User)
│   ├── services/                # API call logic to interact with the backend
│   └── styles/                  # Application-wide styles and themes
├── backend/                     # Node.js + Express API server
│   ├── index.js                 # Server entry point
│   ├── routes/                  # API route definitions (users, matches, chat, etc.)
│   ├── controllers/             # Business logic for each route
│   ├── models/                  # Database models / Prisma schema
│   ├── middleware/              # Authentication, validation, logging, etc.
│   ├── sockets/                 # Real-time functionalities (Socket.io)
│   ├── config/                  # Configuration files (database, Firebase, etc.)
│   └── utils/                   # Helper functions
├── database/                    # Database related files
│   ├── schema.prisma            # Prisma schema for PostgreSQL
│   ├── seed.js                  # Script to seed initial test data
│   └── migrations/              # Database migration files
├── public/                      # Static assets for web pages or documentation
│   └── logo.png                 # App logo
├── scripts/                     # Deployment, cleanup, or other utility scripts
│   └── deploy.sh
├── .env                         # Environment variables for local development
└── LICENSE                      # Project license
