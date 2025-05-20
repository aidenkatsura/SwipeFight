# User Documentation

## Abstract

SwipeFight is an application that helps martial artists connect with local sparring partners in a fun and competitive way. Inspired by Tinder’s intuitive swipe interface, users swipe right if they think they can beat an opponent and left if not. If two users swipe right on each other, they match and can coordinate a sparring session. The app includes a martial arts specific matching system, a skill-based rating system, and filters by location (WIP) and discipline. By blending gamification with community, SwipeFight offers a fresh way to build connections and sharpen fighting skills.

## Install

[How to install the software. If your system has prerequisites (e.g., tools, libraries, emulators, third-party applications, etc.), your instructions should list all of them and indicate how to install and configure them. Make sure to indicate what specific version requirements these prerequisites must satisfy. If running the system requires the installation of, e.g., a virtual machine, a database, or an emulator, make sure to provide clear step-by-step instructions.]: #


## Run

The app can be accessed through this link: (https://swipefight--ia08c3d7xj.expo.app)

## Using the App

Upon entering the app, you will be brought to the [User Authentication Page](#user-authentication-page).

### User Authentication Page

From here, you should enter your email and password. If you do not already have a SwipeFight account, press the 'Create Account' button to be brought to the [Profile Creation Page](#profile-creation-page). If have already signed up for a SwipeFight account, press the 'Login' button to enter the app and be brought to the [Swiper Page](#swiper-page). If you do not remember your password, enter your email and click the 'Forgot Password?' button and a password reset link will be sent to your email.

<img src="/reports/Pictures/Login_Page.png" alt="Login Page" width="300" height="600"/>

### Profile Creation Page

[Maybe add back button]: #

When first creating an account, you may set up your Profile Picture, Name, Age, Location, and Discipline. A default Profile Picture is provided if one is not entered, however, the rest of the information must be entered. Once your profile is to your liking, press the 'Complete Setup' button to enter the app and be brought to the [Swiper Page](#swiper-page).

<img src="/reports/Pictures/Profile_Creation_Page.png" alt="Profile Creation Page" width="300" height="600"/>

### Navigation

SwipeFight contains four main tabs that you can access once authenticated. These include:

 - [Swiper Page (Fight)](#swiper-page)
 - [Chats Page (Chat)](#chats-page)
 - [Leaderboard Page (Leaders)](#leaderboard-page)
 - [Profile Page (Profile)](#profile-page)

### Swiper Page

The Swiper Page is the main page of the SwipeFight app and allows users to find possible sparring partners. This page holds a list of possible fighters and filters.

<img src="/reports/Pictures/Swiper_Page.png" alt="Swiper Page" width="300" height="600"/>

__Swiping__

Swiping the fighter card to the left or pressing the red running man will skip the fighter. On the other hand, swiping the fighter card to the right or pressing the green boxing glove will challenge the fighter. Once there are no further fighters to view in your selected filter or overall, the page will reflect this.

<div class="row">
 <img src="/reports/Pictures/Skip.png" alt="Skip" width="300" height="600"/>
 <img src="/reports/Pictures/Challenge.png" alt="Challenge" width="300" height="600"/>
 <img src="/reports/Pictures/Empty_Swiper.png" alt="Empty Swiper" width="300" height="600"/>
</div>

__Filtering__

On the top of the page, there is a scrollable list of filters that filter through the possible fighters that you can see. Multiple filters may be pressed at once and it will combine the filters together (Pressing Aikido and BJJ filters will only show fighters that practice Aikido __OR__ BJJ). Pressing the 'All' filter will reset all of the filters and show all possible fighters. The list of fighters that may appear on your list do not include any users that you have already skipped or challenged.

<img src="/reports/Pictures/Filter.png" alt="Filter Swiper" width="300" height="600"/>

### Chats Page

The Chats Page is where you can communicate with the other users you have matched with and coordinate a sparring session. Before you match with any users, your Chats Page will be empty. Once you match with a fighter, your chats page will automatically populate with an empty chat with that user. From there, you can click on a chat and start messaging with that user.

<div class="row">
 <img src="/reports/Pictures/Empty_Chat.png" alt="Empty Chat List" width="300" height="600"/>
 <img src="/reports/Pictures/List_Chats.png" alt="List of Chats" width="300" height="600"/>
 <img src="/reports/Pictures/Chat.png" alt="Conversation" width="300" height="600"/>
</div>

This page also allows you to report the result of the match. When you press the 'Report Result' button, it will open up a pop-up where you can select which of the participants won the match or if it resulted in a draw. This will properly update each user's record and rating. After submitting a match result, there is a cooldown until another result for the two fighters can be entered.

<div class="row">
 <img src="/reports/Pictures/Report_Result_Default.png" alt="Report Result Default" width="300" height="600"/>
 <img src="/reports/Pictures/Report_Result_Pick.png" alt="Report Result Pick" width="300" height="600"/>
 <img src="/reports/Pictures/Timeout.png" alt="Timeout" width="300" height="600"/>
</div>

### Leaderboard Page

The Leaderboard Page is where you can view the best of the best. The 'All' option shows the at most, the top three users in each discipline ranked by their rating. Clicking on any single filter will only show the top three fighters in that discipline. 

<div class="row">
 <img src="/reports/Pictures/Leaderboard_All.png" alt="Leaderboard" width="300" height="600"/>
 <img src="/reports/Pictures/Leaderboard_Filter.png" alt="Filtered Leaderboard" width="300" height="600"/>
</div>

If you want a better look at another user beyond the summary that is presented, you can click the profile which will navigate you to the [Other User's Profile Page](#other-user's-profile-page).

### Profile Page

The final tab on the main screen is the Profile Page. This page contains the authenticated user's profile information. Clicking the 'Log Out' button at the bottom of the screen will bring the user back to the [User Authentication Page](#user-authentication-page).

<img src="/reports/Pictures/Profile.png" alt="Profile" width="300" height="600"/>

Clicking the pencil next to the user's profile picture will allow users to edit their profile information. From this page, you can edit your information as desired and pressing 'Cancel' will return you back to the Profile Page without saving. On the other hand, pressing 'Save' will save the user's information and then redirect them to the Profile Page.

<img src="/reports/Pictures/Edit_Profile.png" alt="Profile Editor" width="300" height="600"/>

### Other User's Profile Page

This page allows you to visit the profiles of other users. It shares the same information as the authenticated user's profile page except without the ability to edit the profile or log out. Pressing the back arrow will return the user to the [Leaderboard Page](#leaderboard-page).

<img src="/reports/Pictures/Other_Profile.png" alt="Other Profile" width="300" height="600"/>

## Report Bugs

[How to report a bug. This should include not just the mechanics (a pointer to your issue tracker), but also what information is needed. You can set up a bug-report template in your issue tracker, or you can reference a resource about how to write a good bug report. Here is an example for bug reporting guidelines.]: #

## Known Bugs

[Known bugs. Known bugs or limitations should be documented in the bug tracker. A user testing the implemented use case(s) should not encounter trivial bugs (e.g., NPEs) or a large number of bugs that are unlisted in your bug tracker.]: #
