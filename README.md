# SwipeFight 🥊

[![Node.js CI](https://github.com/aidenkatsura/SwipeFight/actions/workflows/node.js.yml/badge.svg)](https://github.com/aidenkatsura/SwipeFight/actions/workflows/node.js.yml)

SwipeFight is a mobile app that connects martial artists with local sparring partners through a fun, swipe-based matchmaking experience. Users can view profiles, challenge opponents, chat to coordinate fight sessions, and compete for rankings on the leaderboard.

<div align="center">
  <b>Relevant Links:</b>
</div>

<br/>

<div align="center">
  <a href="https://swipefight--t77u5pi7in.expo.app">SwipeFight</a> |
  <a href="./documentation/UserManual.md">User Manual</a> |
  <a href="./documentation/DeveloperDocumentation.md">Developer Documentation</a>
</div>

## Features

- 😀 Create a customizable password protected account
- 🔄 Swipe to challenge fighters you think you can beat
- 🧑‍🤝‍🧑 Match with fighters based on discipline, location, and rating
- 💬 Live in-app chat to coordinate sparring sessions
- 🥇 Global leaderboard to track fighter rankings
- 🥋 Supports multiple disciplines like Boxing, Jiu-Jitsu, Muay Thai, and more
- 🏆 Earn achievements as you progress

---

## Building the App

- Prerequisites
     - Clone repo (https://github.com/aidenkatsura/SwipeFight)
     - Install Expo Go (SDK52) and create an account if building on physical device
     - Have npm/Node.js (npm 9+, Node 18+) installed in terminal
- In terminal, run
   ```
   npm install
   npx expo start
   ```
- If running on phone, scan the generated QR code with the camera app which will open SwipeFight in Expo Go
- If running on web, open localhost with the proper port
- If running on simulator, click 'i' in terminal to open iOS or 'a' to open Android

---

## Testing the App

To see our automated tests, navigate to the terminal and run the command 
   ```
   npm test
   ```

---

## Operational Use Cases

<details>
<summary>Use Case 1 (Filtering)</summary>
<br>
     
1. Actors
   - Primary Actor: User
2. Triggers
   - The user clicks on a filter(s)
3. Preconditions
   - User is currently on swiping page to find new partners
   - Filters exist and are visible to the user
4. Postconditions (success scenario)
   - System filters out other users that don’t match the primary user’s specification and updates to display a list composed only of possible matches
5. List of Steps (success scenario)
   1. The user navigates to the swipe page to look for new partners
   2. The user clicks their desired filter(s)
   3. The system presents the updated partner list with only the desired potential matches in view
6. Extensions/Variations of the Success Scenario
   - Generates a minimum number of closest matches if there are no users in the database that match the user's specification
   - Rotates the list of matches so the user doesn’t see the same group of matches for a certain filter specification
   - Create a clear all filters button that resets all filters
   - Multiple types of filters (binary, range)
7. Exceptions: Failure Conditions and Scenarios
   - If the user becomes unauthenticated (session expires), they are asked to login again
   - If no matches are found, user notified and asked to modify/clear filters and try again or be shown the closest possible matches
   - If there is a frontend (UI) or backend (server) failure, the system will attempt to resend the request
</details>

<details>
<summary>Use Case 2 (Initial Profile Setup)</summary>
<br>
     
1. Actors
   - Primary Actor: User (without an account)
2. Triggers
   - User opens the app for the first time
3. Preconditions
   - User does not have an account
4. Postconditions (success scenario)
   - User's information is reflected in their profile page
      - For the user themselves
      - For users that interact with the user's profile
5. List of Steps (success scenario)
   1. User opens app
   2. User inputs information (email, password)
   3. User selects sign up option
   4. User is presented profile fields
   5. User creates account
   6. System confirms account creation (informing the user of success), opens home
6. Extensions/Variations of the Success Scenario
   - User can select images from their camera roll
7. Exceptions: Failure Conditions and Scenarios
   - User wants to choose profile image(s), but app does not have camera roll permissions
      - If the app has not previously asked for camera roll permissions, user is presented with the option to enable camera roll permissions
      - If the user has denied permissions, display a message directing them to change their settings, then return to editing page
   - User exits app without saving profile changes
     - Changes are lost, not updated on system
   - Backend failure prevents saving of changes
     - System informs user of save issue, presents option to retry or exit without saving
     - User can keep retrying or exit back to the profile page with no changes made
   - User inputs banned phrase
     - System informs user of use and prevents account creation
</details>

<details>
<summary>Use Case 3 (Editing Profile Information)</summary>
<br>
     
1. Actors
   - Primary actor: User (with an existing account)
2. Triggers
   - User selects 'edit' on profile page
3. Preconditions
   - User has an existing profile
   - User is currently authenticated/signed in to the app
4. Postconditions (success scenario)
   - User's updated information is reflected in their profile page
      - For the user themselves
      - For users that interact with the user's profile
5. List of steps (success scenario)
   1. User navigates to profile page
   2. User selects 'edit'
   3. User is presented editable profile info fields
   4. User inputs updated profile info
   5. User saves changes
   6. System confirms changes (informing the user of success), navigates back to profile page
6. Extensions/variations of the success scenario
   - User chooses to edit profile image(s)
      - User can select images from camera roll
7. Exceptions: failure conditions and scenarios  
   - User wants to edit profile image(s), but app does not have camera roll permissions
      - If the app has not previously asked for camera roll permissions, user is presented with option to enable camera roll permissions
      - If user has denied permissions, display a message directing them to change their settings, then return to editing page
   - User exits app without saving profile changes
      - Changes are lost, not updated on system
   - Backend failure prevents saving of changes
      - System informs user of save issue, presents option to retry or exit without saving
      - User can keep retrying, or exit back to profile page with no changes made
</details>

<details>
<summary>Use Case 4 (Swiping)</summary>
<br>
     
1. Actors
   - Primary Actor: User
2. Triggers
   - The user swipes left or right on a potential sparring partner
3. Preconditions
   - User’s account is set up
   - User is on the home/swiping page
   - User has swipes remaining
4. Postconditions (success scenario)
   - If swiped right and other user previously swiped right: The users are matched and a live chat is created in the chats page
   - If swiped right and other user has not seen: Your profile should show up in the challengers page of the other user
   - If swiped left: The potential match will go away and will be replaced by a new partner
     - They will not appear on your page again for a while
5. List of Steps (success scenario)
   1. The user swipes right or left on another user
   2. The correct behavior as expressed by _Postconditions_ occurs
6. Extensions/Variations of the Success Scenario
   - If there are no more matches to show, there should be a screen that indicates this
   - There should be some animation to indicate a match and differentiate from a “like” when they have not swiped on you yet
7. Exceptions: Failure Conditions and Scenarios
   - If the user becomes unauthenticated (session expires), they are asked to login again
   - If the app is closed, the same person should be on the screen
   - If a decision is rolled back (undo button), the result of the first swipe must be reversible
</details>

<details>
<summary>Use Case 5 (Live Chat)</summary>
<br>

1. Actors
   - Primary Actors: User, Other User
2. Triggers
   - When two users swipe right on each other's profiles, it triggers a match and puts them into a live chat, allowing for people to exchange information
3. Preconditions
   - System detects two users match on each others profiles
   - If either users did not match, chat feature should never occur between users
4. Postconditions (success scenario)
   - Matched users are automatically connected into the same chat as soon as they are matched
5. List of Steps (success scenario)
   1. User 1 swipes right on user 2
   2. User 2 swipes right on user 1
   3. System detects users are matched
   4. Create a private chat between users
   5. Users exchange information and schedule their time to meet
6. Extensions/Variations of the Success Scenario
   - Chat feature will show a visual and sound notification when a new message is received
   - Multiple chats could be created and held by a single user
   - Chats are maintained until one of the two users decides to disconnect
   - Image or video sending feature within chat
7. Exceptions: Failure Conditions and Scenarios
   - Chats are only accessible if session is connected and uninterrupted
   - Detection of failed message sent, prompting users to retry
</details>

<details>
<summary>Use Case 6 (Changing Location)</summary>
<br>

1. Actors
   - Primary Actor: User
2. Triggers
   - When a user enters a location on the profile creation/editing screen
3. Preconditions
   - User is currently on the profile creation/editing screen
4. Postconditions (success scenario)
   - New location is displayed
5. List of Steps (success scenario)
   1. User navigates to the profile creation/editing page
   2. User types in city
   3. User selects city
   4. User creates/saves profile
6. Extensions/Variations of the Success Scenario
   - If the user enters the location and cancels, the information is not changed
7. Exceptions: Failure Conditions and Scenarios
   - If the user types a location but does not click the location, the information will not be saved.
</details>

## Tech Stack

- **Frontend**: React Native
- **Backend**: Firebase
- **Database**: Firestore
- **Real-time Messaging**: Firestore
- **Authentication**: Firebase Auth
- **Hosting**: Expo/eas

---
   
## Goals
1) Create connections for marital artists within local community.
2) Accelerate improvement and experience after matching and meeting people on the app.
3) Users open the app at least once a week to find partners and meet new fighters.
4) Clean, intuitive, and appealing UI/UX.
5) Same level skill matching for users in their correct discipline.

---

## Current Repository Layout

```bash
SwipeFight/
├── README.md                    # Overview, setup, and documentation
├── .gitignore                   # Files and folders to ignore in Git
├── .expo/                       # Expo app and router
├── .github/workflows/           # Continous Integration
├── app/                         # React Native mobile application
│   ├── (auth)/                  # User Authentication
│   ├── (tabs)/                  # App screens (Home, Chat, Leaderboard, etc.)
│   ├── chat/                    # Live chat
│   ├── other_profile/           # Other users' profile page
│   ├── profile-editor/          # Edit User Profile
├── assets/images/               # Logos
├── components/                  # UI Components
├── context/                     # Context/provider components
├── data/                        # Mock data (for testing)
├── documentation/               # User Manual and Developer Documentation
├── hooks/                       # Hooks for React
├── ios/                         # To run on iOS with Xcode
├── reports/                     # Progress Reports and Living Document
├── styles/                      # Theme
├── test/                        # Jest tests (UI, Firebase, and unit)
├── types/                       # Data types
├── utils/                       # Helper methods (e.g., Firebase interactions, filtering)
├── test/                        # Frontend/Backend Tests
├── types/                       # Data types
├── utils/                       # Methods
└── LICENSE                      # Project license
```

## Contributors
 - [Aiden Katsuragawa](https://github.com/aidenkatsura) - Project Coordinator
 - [Brian Dinh](https://github.com/brian-dinh-tung)
 - [Calvin Tsai](https://github.com/calvin-tsai)
 - [Josh Chou](https://github.com/jcthewizard)
 - [Sam Zappa](https://github.com/zzzappy) - Lead Developer
 - [Yashveer Paul](https://github.com/YashveerP) - Backend Developer
