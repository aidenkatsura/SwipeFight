# Requirements & Team Policies

## Team Info
### Members and Roles
 - Aiden =>
 - Brian =>
 - Calvin =>
 - Josh =>
 - Sam =>
 - Yashveer =>

### Relevant Links
 - Repository: https://github.com/aidenkatsura/SwipeFight

### Communication Channels/Tools
 - Slack
 - Group Chat

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
 - __Multiple Tabs__
 - __Profile__
 - 

### Stretch Goals
 - __Live Chat__
 - 

## Use Cases (Functional Requirements)
### Use Case 1 (Filtering)
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
### Use Case 2
1. Actors
2. Triggers
3. Preconditions
4. Postconditions (success scenario)
5. List of Steps (success scenario)
6. Extensions/Variations of the Success Scenario
7. Exceptions: Failure Conditions and Scenarios
### Use Case 3
1. Actors
2. Triggers
3. Preconditions
4. Postconditions (success scenario)
5. List of Steps (success scenario)
6. Extensions/Variations of the Success Scenario
7. Exceptions: Failure Conditions and Scenarios
### Use Case 4
1. Actors
2. Triggers
3. Preconditions
4. Postconditions (success scenario)
5. List of Steps (success scenario)
6. Extensions/Variations of the Success Scenario
7. Exceptions: Failure Conditions and Scenarios
### Use Case 5
1. Actors
2. Triggers
3. Preconditions
4. Postconditions (success scenario)
5. List of Steps (success scenario)
6. Extensions/Variations of the Success Scenario
7. Exceptions: Failure Conditions and Scenarios
### Use Case 6
1. Actors
2. Triggers
3. Preconditions
4. Postconditions (success scenario)
5. List of Steps (success scenario)
6. Extensions/Variations of the Success Scenario
7. Exceptions: Failure Conditions and Scenarios
## Non-Functional Requirements
 -
 -
 -
## External Requirements

## Team Process Description
