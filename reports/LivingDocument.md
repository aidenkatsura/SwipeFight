# Living Document
## Team Info
### Members and Roles
 - Aiden => Project Coordinator
   - Organized with deadlines and understanding responsibilities of project and assignments
 - Brian => Main Tester
   - Experience in developing, testing and debugging mobile apps
 - Calvin => Lead Designer
   - Experience in Figma, Canva and other visual designing software
 - Josh => Product Manager
   - Creative
   - Able to see the bigger picture of projects
   - Currently taking the product management course
 - Sam => Co-lead Developer (Front-end)
   - Experience with similar cross-platform mobile framework (Flutter)
 - Yashveer => Co-lead Developer (Back-end)
   - Experience with backend web development (331)

### Relevant Links
 - Repository: https://github.com/aidenkatsura/SwipeFight

### Communication Channels/Tools
 - Slack
   - Follow class [Slack Rules](https://homes.cs.washington.edu/~rjust/courses/CSE403/project/slack_rules.html)
   - Use when communicating with staff
 - Group Chat
   - Primary form of communication


## Product Description
### Project Proposal
__Abstract__ <br />
SwipeFight is an application that helps martial artists connect with local sparring partners in a
fun and competitive way. Inspired by Tinder’s intuitive swipe interface, users swipe right if they
think they can beat an opponent and left if not. If two users swipe right on each other, they
match and can coordinate a sparring session. The app includes a martial arts-specific matching
system, a skill-based rating system, and filters by location and discipline. By blending
gamification with community, SwipeFight offers a fresh way to build connections and sharpen
fighting skills. <br /><br />
__Goal__ <br />
We are developing an application to help fighters find possible sparring partners which will
accelerate improvement and foster connection in the local martial-arts community. <br /><br />
__Current Practice__ <br />
Most people find sparring partners from their dojo or organized tournaments. This results in
people sparring against the same style every week which doesn’t adequately prepare them for
all the new styles they might face in a competitive setting. <br /><br />
__Novelty__ <br />
Currently, there are no apps like ours. The closest ones are Martial Match which is more like a
directory that simply lists people rather than an interactive, fun app. FightMatch is another app
but is solely focused on helping fighters find sanctioned tournaments and bouts rather than
casual sparring partners. <br /><br />
__Effects__ <br />
This application will be beneficial to martial artists so they can continue to hone their skills. If our
app finds usage, it will raise the level of fighters in the area and create a more tight-knit martial
arts community spanning across different martial arts as well. <br /><br />
__Technical Approach__ <br />
We plan to use React Native to support both iOS and Android with one codebase. Our backend
will be built with Node.js and Express, providing REST APIs for user data, matches, and filters.
Socket.io can handle real-time features like chat and match notifications. We'll use PostgreSQL
with Prisma for our database, including PostGIS for location-based matchmaking. <br />
Authentication and push notifications will be managed through Firebase, while images and
videos will be stored with Cloudinary. We’ll implement an ELO-inspired rating system to keep
matches balanced and competitive. The app will be deployed using platforms like Render for the
backend and Expo for mobile builds. <br /><br />
__Risks__ <br />
This project has the potential for a ton of features that are complicated to implement. I think one
hurdle we may face is prioritizing the most important features first and ensuring we create a
solid MVP rather than trying to implement too many features at once. One specific feature that
may pose a risk is the geographic matching and live chatting. These seem like tough features to
implement and will likely require additional research to figure out.

### Major Features
 - __Swiping Feature__
   - Swiping to the left means no and to the right means yes for matching. If two people both swipe to the right, that means it's a match.
 - __Multiple Tabs__
   - One for each martial arts discipline, filtering out each profile by what users are wanting.
 - __Profile__
   - Includes personal information such as desired discipline, location, ranking (belt color/elo) and some description of themself.
 - __Live Chat__
   - Allows matching partners to coordinate meeting details
 - __Set Location-based Matching__
   - Different than a user's permanent location/origin

### Stretch Goals
 - __User Ratings__
   - Users can rate each other after fights
 - __Monetization__
   - Reswipe, ads, etc.
 - __Page for users that swiped right on you__
 - __Banned Phrase Filter__
 - __Clans__

## Use Cases (Functional Requirements)
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
<summary>Use Case 2 (Editing Profile Information)</summary>
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
<summary>Use Case 3 (Initial Profile Setup)</summary>
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
   2. User selects sign up option
   3. User is presented profile fields
   4. User inputs information (email, password)
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
<summary>Use Case 5 (Changing Location)</summary>
<br>

1. Actors
   - Primary Actor: User
2. Triggers
   - When a user clicks on the location edit button on the swiping screen, which acts as a filter for user cards
3. Preconditions
   - User is currently on the swiping page
   - User has location permissions available
4. Postconditions (success scenario)
   - User selects city and travel radius and only is able to swipe other users within that radius
5. List of Steps (success scenario)
   1. User navigates to the swiping page
   2. User clicks location button which displays the location and radius currently set
   3. User selects a city or edits radius
   4. User’s swiping cards are updated and refreshed to match the location/radius
6. Extensions/Variations of the Success Scenario
   - If the user enters the location editing menu but makes no changes, the current swiping cards are kept the same
7. Exceptions: Failure Conditions and Scenarios
   - If the user selects a bogus location (like the middle of the ocean) and there are no available users, there will be a warning that suggests changing location

</details>
<details>
<summary>Use Case 6 (Live Chat)</summary>
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

## Non-Functional Requirements
 - __Scalability__
   - Handle a growing userbase with stress testing
   - Handle a limited userbase in terms of available partners
 - __Usability__
   - The app must run smoothly with a clean UI/UX and have clear/simple usability or tutorials
 - __Security__
   - Users should have username and password protected accounts


## External Requirements
 - Robustness against errors
   - Detailed in exceptions section of **_Use Cases_**
 - Product must be installable by user
      - App Store
 - Software should be buildable
   - Prerequisites
     - Clone repo (https://github.com/aidenkatsura/SwipeFight)
     - Install the Expo Go app and make an account
     - Have npm/Node.js installed in terminal
   - In terminal, run
      ```
      npm install
      npx expo start
      ```
   - Scan the generated QR code with the camera app which will open SwipeFight in Expo Go
 - Scope
   - Approved by teaching staff


## Team Process Description
### Software toolset
   - Typescript: Familiar language and used for app development
   - React-Native: Embedded integration for iOS, Android and web apps
   - Firebase: Extremely easy to integrate, free to use
   - Socket.io: Useful for real-time chatting, abstracts a lot of implementation
### Member roles
   - See [Members and Roles](#members-and-roles)
### Project Schedule
   - __4/22 - 4/29__
     - Aiden: Write report for the week, assist in front-end development
     - Brian: Test front-end and communicate potential changes to team
     - Calvin: Create design of profile page
     - Josh: Make changes to existing skeleton for front-end to eliminate bugs
     - Sam: Assist in front-end development
     - Yashveer: Make changes to existing skeleton for front-end to eliminate bugs
   - __4/29 - 5/6__
     - Aiden: Draft full MVP feature list and outline risk mitigation plan
     - Brian: Begin testing profile page design and live chat prototype (if available)
     - Calvin: Finalize profile page design, start swipe card designs (match cards, animations)
     - Josh: Implement initial location filter functionality in front-end
     - Sam: Develop basic swiping interface (left/right swipe functionality, card rendering)
     - Yashveer: Set up backend for user profile creation and location-based filtering endpoint
   - __5/6 - 5/13__
     - Aiden: Write weekly report, assist on bug fixes and front-end support
     - Brian: Test swiping functionality and provide feedback on animations/UX
     - Calvin: Finalize swipe card designs, begin live chat UI mockups
     - Josh: Implement swiping animations and integrate with backend endpoint
     - Sam: Connect swiping interface with location filtering logic
     - Yashveer: Build backend logic for swipe matching and match storage
   - __5/13 - 5/20__
     - Aiden: Draft preliminary user testing survey/questions, gather early feedback
     - Brian: Test live chat UI and backend message sending functionality
     - Calvin: Complete live chat UI design, adjust based on early feedback
     - Josh: Integrate live chat front-end with backend sockets
     - Sam: Polish swiping and matching UX, handle edge cases (no matches, bad location, etc.)
     - Yashveer: Set up chat backend using Socket.io and connect to front-end
   - __5/20 - 5/27__
     - Aiden: Collect and summarize user feedback from testing sessions
     - Brian: Test profile editing functionality and swiping + chat interactions
     - Calvin: Polish final UI elements and animations
     - Josh: Implement error handling and UI notifications for swipe/chat failures
     - Sam: Optimize front-end performance and fix outstanding bugs
     - Yashveer: Finalize backend database structure and API endpoints for launch
   - __5/27 - 6/3__
     - Aiden: Write final report, compile project documentation
     - Brian: Final system testing and compile final test cases
     - Calvin: Finalize UI design adjustments based on last feedback round
     - Josh: Final code cleanup and confirm full app functionality
     - Sam: Assist in final debugging, ensure all front-end features are responsive
     - Yashveer: Deploy final backend to production environment and test live connections

### Risks / Risk Assessment
   1. Potential learning curve with new technologies
      - Our choice of tech stack involves technologies that are new or unfamiliar to many group members (e.g., React Native), so it will be important to adapt to potential struggle
      - High likelihood of occuring
        - Many group memebers are learning the technologies as we've started working
      - Medium impact if it occurs
        - We've been quick to learn the frontend so far, however the backend could pose a potential struggle.
      - We've shared resources so all of us can learn the tools and have been helping eachother learn.
      - To get better estimates, we will closely monitor any difficulties when it comes to learning the new technologies.
      - For this problem, its detection can come from a group member not knowing how to do something or from a member finding gaps in anothers knowledge.
      - If it occurs, either have the group member individually learn, or have another teach them.
      
   2. Difficulty in implementing the matching algorithm, specifically when it comes to the complexity of geographic/location-based matching.
      - Swiping is the main motivator behind our system, therefore it has a high risk of occuring.
      - If we do not implement the matching algorithm correctly, the user will be unhappy with the product and will not find it useful.
      - We base the complexity of geographic matching with the fact that we will need several parameters so user's can specify how far to search.
      - To reduce the impact of the matching algorithm, we are building several alternate matching algorithms to find the best version.
      - To detect the problem, we will first run the matching algorithm with our mock fighters and then expand the userbase.
      - If the geographic matching does not work as expected, we can reduce the searching algorithm to rating and discipline.

   3. Being too ambitious given the limited timeframe of the project (trying to implement stretch goals like user rating too early, implementing too many features/feature creep)
      - Medium likelihood of occuring
        - SwipeFight has many exciting and unique features that can be implemented.
        - We don't have much experience with projects with deadlines like this.
      - High impact if it occurs
        - Would push development behind
        - Could lead to rushing core features.
      - We've set a focus on implementing core features first and made sure to label certain features as stretch goals
      - To get better estimates, we will closely monitor progress on each goal and feature
      - To detect the problem, we will check if we are falling behind on progress or have started stretch goals too early
      - If it occurs, we will cut the non-essential goal/feature and focus on the the most important parts of the project.
   4. User feedback is out of scope
      - Medium chance of occuring
        - Peers are used to high-end apps and may expect features that are not in our scope
      - Low impact if it occurs
        - We will not be able to implement the feature but it will impact us more because we are losing valuable feedback
      - We have experienced this in previous projects where the feedback does not align with our vision
      - To reduce the likelihood and impact of this problem, we will include our goals in the feedback form/survey/demo and disregard anything that is too far out of scope
      - We will not be able to detect this problem until it occurs. However, by sticking to our plan we can eliminate the need for further implementation
      - If this occurs, we will expand our feedback circle to receive more feedback and data
   5. Dependency Roadblocks
      - High likelihood of occuring
      - High impact if it occurs
      - We have already encountered roadblocks, such as needing to implement the backend and page transitions before implementing subpages
      - We are making schedules and plans to outline what dependencies exist and what order to do tasks
      - To detect this, we will use formal planning and anticipate these problems
      - Should it occur, we will allocate more people to implement the feature until we are caught up

   Since submitting the requirements document, we've been able to come up with more risks that might pose a challenge.

__Describe at what point in your process external feedback will be most useful and how you will get that feedback__
After implementing each feature, we should have outside members test our app and give feedback on bugs, unintuitive UX or app interactions, or any additional desired changes

### Documentation Plan
__User Guide__ outlines:
  - How to login/sign up
  - How to navigate tabs
  - How to change profile information
  - How to swipe/filter
  - Steps to take after matching
  - How to contact us

## Software Architecture
__Identify and describe the major software components and their functionality at a conceptual level__
 - Mobile Client (iOS/Android): Provides interface between user and app
 - Backend API Server: Manages communication between components
 - Database Server: Holds persistent data
 - Real-Time Messaging: Allows users to communicate with each other after matching
   
__Specify the interfaces between components__
   - Mobile Client <=> Backend API Server: Tapping or swiping sends request to server which sends response back
   - Backend API Server <=> Database Server: Saving profile, matches, messages
   - Backend API Server <=> Real-Time Messaging: Send and receive messages

__Describe in detail what data your system stores, and how. If it uses a database, give the high level database schema. If not, describe how you are storing the data and its organization__
   - Using Firebase for the database
   - Firebase will hold user profile information, matches, all users, messages

__If there are particular assumptions underpinning your chosen architecture, identify and describe them__
   - The information should be secure which means we need to have a secure database
   - User information will not change as frequently as other aspects
   - Interactions are isolated until users match
   - Messaging is only available after matching

__For each of two decisions pertaining to your software architecture, identify and briefly describe an alternative. For each of the two alternatives, discuss its pros and cons compared to your choice__
   - choice 1
   - choice 2


## Software Design
__Provide a detailed definition of each of the software components you identified above__
 - Mobile Client
   - What packages, classes, or other units of abstraction form these components?
   - What are the responsibilities of each of those parts of a component?
 - Backend API Server
   - What packages, classes, or other units of abstraction form these components?
   - What are the responsibilities of each of those parts of a component?
 - Database Server
   - What packages, classes, or other units of abstraction form these components?
   - What are the responsibilities of each of those parts of a component?
 - Real-Time Messaging
   - What packages, classes, or other units of abstraction form these components?
   - What are the responsibilities of each of those parts of a component?


## Coding Design
 - TypeScript [Coding Style Guide](https://docs.aws.amazon.com/prescriptive-guidance/latest/best-practices-cdk-typescript-iac/typescript-best-practices.html)
