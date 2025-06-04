# User Manual

## Abstract

SwipeFight is an application that helps martial artists connect with local sparring partners in a fun and competitive way. Inspired by Tinder’s intuitive swipe interface, users swipe right if they think they can beat an opponent and left if not. If two users swipe right on each other, they match and can coordinate a sparring session. The app includes a martial arts specific matching system, a skill-based rating system, and sorts by location and filters by discipline. By blending gamification with community, SwipeFight offers a fresh way to build connections and sharpen fighting skills.

## Install

[How to install the software. If your system has prerequisites (e.g., tools, libraries, emulators, third-party applications, etc.), your instructions should list all of them and indicate how to install and configure them. Make sure to indicate what specific version requirements these prerequisites must satisfy. If running the system requires the installation of, e.g., a virtual machine, a database, or an emulator, make sure to provide clear step-by-step instructions.]: #

To install the app on your device you must:
 1. Clone the GitHub Repository and cd into it (https://github.com/aidenkatsura/SwipeFight)
 2. Install the [Expo Go](https://expo.dev/go) app (SDK 52, currently have issues running with SDK 53+) and make an account
 3. Install an simulator on [Windows](https://docs.expo.dev/tutorial/eas/android-development-build/) or [Mac](https://docs.expo.dev/workflow/ios-simulator/).
 4. Install [Node.js/npm](https://nodejs.org/en/download) (npm version 9+, Node version 18+)
 5. In the terminal, run
```
npm install
npx expo start
```

## Run

The latest release of the app can be accessed on any web-enabled device through this link: (https://swipefight--2k325zsceh.expo.app)

After running 'npx expo start' the app can be opened by:
 - Scanning the generated QR code with the camera app which will open SwipeFight in Expo Go.
 - Pressing 'a' will open Android simulator
 - Pressing 'i' will open iOS simulator
 - Pressing 'w' will open web

## Using the App

Upon entering the app, you will be brought to the [User Authentication Page](#user-authentication-page).

### User Authentication Page

From here, you should enter your email and password. If you do not already have a SwipeFight account, press the 'Create Account' button to be brought to the [Profile Creation Page](#profile-creation-page). If have already signed up for a SwipeFight account, press the 'Login' button to enter the app and be brought to the [Swiper Page](#swiper-page). If you do not remember your password, enter your email and click the 'Forgot Password?' button and a password reset link will be sent to your email.

<img src="/documentation/Pictures/Login_Page.png" alt="Login Page" width="300" height="600"/>

### Profile Creation Page

[Maybe add back button]: #

When first creating an account, you may set up your Profile Picture, Name, Age, Location, Discipline and Rank. A default Profile Picture is provided if one is not entered, however, the rest of the information must be entered. To enter your location, begin typing in a city name and then click on the city from the dropdown that opens. Once your profile is to your liking, press the 'Complete Setup' button to enter the app and be brought to the [Swiper Page](#swiper-page).

<div class="row">
 <img src="/documentation/Pictures/Profile_Creation_1.png" alt="Profile Creation Page 1" width="300" height="600"/>
 <img src="/documentation/Pictures/Profile_Creation_2.png" alt="Profile Creation Page 2" width="300" height="600"/>
 <img src="/documentation/Pictures/Location_Filter.png" alt="Location" width="300" height="600"/>
</div>

### Navigation

SwipeFight contains four main tabs that you can access once authenticated. These include:

 - [Swiper Page (Fight)](#swiper-page)
 - [Chats Page (Chat)](#chats-page)
 - [Leaderboard Page (Leaders)](#leaderboard-page)
 - [Profile Page (Profile)](#profile-page)

### Swiper Page

The Swiper Page is the main page of the SwipeFight app and allows users to find possible sparring partners. This page holds a list of possible fighters and filters.

<img src="/documentation/Pictures/Swiper_Page.png" alt="Swiper Page" width="300" height="600"/>

__Swiping__

Swiping the fighter card to the left or pressing the red running man will skip the fighter. On the other hand, swiping the fighter card to the right or pressing the green boxing glove will challenge the fighter. Once there are no further fighters to view in your selected filter or overall, the page will reflect this. When you swipe on a fighter that has already challenged you, you will be alerted that you have matched with them and should check the [Chats Page](#chats-page) to coordinate your sparring session.

<div class="row">
 <img src="/documentation/Pictures/Skip.png" alt="Skip" width="300" height="600"/>
 <img src="/documentation/Pictures/Challenge.png" alt="Challenge" width="300" height="600"/>
 <img src="/documentation/Pictures/Empty_Swiper.png" alt="Empty Swiper" width="300" height="600"/>
 <img src="/documentation/Pictures/Match.png" alt="Match" width="300" height="600"/>
</div>

__Sorting and Filtering__

The list of fighters that the user sees is automatically sorted by location so that nearby users are seen first. In addition to this, the top of the page holds a scrollable list of discipline filters that filter through the possible fighters that you can see. Multiple filters may be pressed at once and it will combine the filters together (Pressing Aikido and BJJ filters will only show fighters that practice Aikido __OR__ BJJ). Pressing the 'All' filter will reset all of the filters and show all possible fighters. The list of fighters that may appear on your list do not include any users that you have already skipped or challenged.

<img src="/documentation/Pictures/Filter.png" alt="Filter Swiper" width="300" height="600"/>

### Chats Page

The Chats Page is where you can communicate with the other users you have matched with and coordinate a sparring session. Before you match with any users, your Chats Page will be empty. Once you match with a fighter, your chats page will automatically populate with an empty chat with that user. From there, you can click on a chat and start messaging with that user. Chats are first ordered by the number of unread messages then by most recent.

<div class="row">
 <img src="/documentation/Pictures/Empty_Chat.png" alt="Empty Chat List" width="300" height="600"/>
 <img src="/documentation/Pictures/Chat_List.png" alt="List of Chats" width="300" height="600"/>
 <img src="/documentation/Pictures/Chat.png" alt="Conversation" width="300" height="600"/>
</div>

This page also allows you to report the result of the match. When you press the 'Report Result' button, it will open up a pop-up where you can select which of the participants won the match or if it resulted in a draw. This will properly update each user's record and rating. After submitting a match result, there is a cooldown until another result between the two fighters can be entered. Clicking the other user's profile picture will open up their [profile](#other-users-profile-page).

<div class="row">
 <img src="/documentation/Pictures/Report_Result_Default.png" alt="Report Result Default" width="300" height="600"/>
 <img src="/documentation/Pictures/Report_Result_Pick.png" alt="Report Result Pick" width="300" height="600"/>
 <img src="/documentation/Pictures/Timeout.png" alt="Timeout" width="300" height="600"/>
</div>

### Leaderboard Page

The Leaderboard Page is where you can view the best of the best. The 'All' option shows every user associated with SwipeFight based on sorted by their rating. Clicking on any of the filters will only show the fighters of the selected discipline(s). 

<div class="row">
 <img src="/documentation/Pictures/Leaderboard_All.png" alt="Leaderboard" width="300" height="600"/>
 <img src="/documentation/Pictures/Leaderboard_Filter.png" alt="Filtered Leaderboard" width="300" height="600"/>
</div>

If you want a better look at another user beyond the summary that is presented, you can click the profile which will navigate you to the [Other User's Profile Page](#other-users-profile-page).

### Profile Page

The final tab on the main screen is the Profile Page. This page contains the authenticated user's profile information as well as their recent achievements and matches. Clicking the 'Log Out' button at the bottom of the screen will bring the user back to the [User Authentication Page](#user-authentication-page).

<img src="/documentation/Pictures/Profile.png" alt="Profile" width="300" height="600"/>

Clicking the pencil next to the user's profile picture will allow users to edit their profile information. From this page, you can edit your information as desired and pressing 'Cancel' will return you back to the Profile Page without saving. On the other hand, pressing 'Save' will save the user's information and then redirect them to the Profile Page.

<div class="row">
 <img src="/documentation/Pictures/Profile_Edit_1.png" alt="Profile Editor" width="300" height="600"/>
 <img src="/documentation/Pictures/Profile_Edit_1.png" alt="Profile Editor" width="300" height="600"/>
</div>

### Other User's Profile Page

This page allows you to visit the profiles of other users. It shares the same information as the authenticated user's profile page except without the ability to edit the profile or log out. Pressing the back arrow will return the user to the [Leaderboard Page](#leaderboard-page) or [Chat](chats-page).

<img src="/documentation/Pictures/Other_Profile.png" alt="Other Profile" width="300" height="600"/>

## Report Bugs

[How to report a bug. This should include not just the mechanics (a pointer to your issue tracker), but also what information is needed. You can set up a bug-report template in your issue tracker, or you can reference a resource about how to write a good bug report. Here is an example for bug reporting guidelines.]: #

If you encounter any bugs while using SwipeFight, let us know using our GitHub Issues following these steps:
 1. Navigate to SwipeFight's [GitHub Issues](https://github.com/aidenkatsura/SwipeFight/issues)
 2. Click the "New Issue" button
 3. Fill in the [Bug Report template](https://github.com/aidenkatsura/SwipeFight/issues/new?template=issue_template.md)

    - Use a title that is clear, concise and descriptive
    - Describe the expected and actual behavior
    - Describe how to replicate the bug
    - Describe the device used when the bug occured
    - Attach any photos if possible

 4. Submit the report for review