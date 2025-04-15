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

SwipeFight/
├── README.md                  # Project overview, setup, and docs
├── .gitignore                 # Files and folders to ignore by Git

├── frontend/                  # React Native mobile app
│   ├── App.js
│   ├── assets/                # Images, icons, logos
│   ├── components/            # Reusable UI components
│   ├── screens/               # App screens (Home, Chat, Leaderboard, etc.)
│   ├── navigation/            # Navigation config (React Navigation)
│   ├── context/               # Global state providers (Auth, User, etc.)
│   ├── services/              # API calls to backend
│   └── styles/                # App-wide styles and themes

├── backend/                   # Node.js + Express API
│   ├── index.js               # Entry point
│   ├── routes/                # Route definitions (users, matches, chat, etc.)
│   ├── controllers/           # Logic for each route
│   ├── models/                # DB models / Prisma schema
│   ├── middleware/            # Auth, validation, logging, etc.
│   ├── sockets/               # Socket.io real-time logic
│   ├── config/                # DB and Firebase configs
│   └── utils/                 # Helper functions

├── database/
│   ├── schema.prisma          # Prisma schema for PostgreSQL
│   ├── seed.js                # Script to populate test data
│   └── migrations/            # Migration files

├── public/                    # Static assets (if any for marketing or docs)
│   └── logo.png

├── scripts/                   # Deployment, cleanup, or utility scripts
│   └── deploy.sh

├── .env                       # Environment variables (for local dev)
└── LICENSE

