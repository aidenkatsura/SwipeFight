___Developer Documentation___

1. __Obtain the source code__

   Clone the SwipeFight repository on the main branch using the command:
   ```
   git clone https://github.com/aidenkatsura/SwipeFight.git
   ```

 2. __Directory structure__

    Source code: ./app

    Testing: ./testing

    Documentation: ./reports

    Data files: ./data

4. __Build the software__
   
   eas build --profile development --platform ios

   After cloning the repository, run the command:
   ```
   npm install
   npx expo start
   ```
5. __Test the software__
   
   To test, run the command:
   ```
   npm test
   ```
   And the test suite will show all tests along with pass/fails

6. __Add new tests__

   Navigate to ./test/test.ts and all tests will be displayed. When adding a test for an existing feature, add a specific test within the associated feature. 
   ```
   it("<test description here>", function () {
      <test code here>
   }
   ```

   If adding a test for a brand new feature, add a new suite function using:
   ```
   describe("<Feature name>", function () {
      it(...) {...}
   }
   ```
   

   
