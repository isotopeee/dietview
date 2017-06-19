# June 19, 2017
    - Add 'angular animate' module
    - Add 'angular-toastr' module
    - Code Refactor
        - Wrap user_profileCtrl in an IIFE
        - Wrap user_editCtrl in an IIFE
        - Wrap meals_listCtrl initialization code in 'activate' function
    - Products Module
        - Implement 'toast' notification (toastr)
    - User profile
        - Fix module declaration on user_profileCtrl
        - Fix module declaration on user_editCtrl
        - Implement 'toast' notification (toastr)

# June 17, 2017
    - Code Refactor
        - Use function declaration (subscriptions_listCtrl)
        - Remove unused codes (subscriptions_listCtrl)
    - Subscriptions
        - Fix implementation of 'approve' function
# June 13, 2017
    - Add template components for Subscriptions functionality
    - Generate new 'lb-services.js'
    - Code Refactor
        - Wrap subscription controller in an IIFE
        - Use the 'getter syntax' for module declaration (scrum_boardController.js)
        - Include 'angularjs-dragula' script in index.html
        - Declare 'angularjs-dragula' dependency on main app module (app.js)
    - Daily Activities
        - Change implementation to make data persistent
    - Subscription (Management)
        - Fix module name

# May 23, 2017
    - Code Refactor
        - Fix jshint warnings

# May 17, 2017
    - Login
        - Change alert implementation
    - Code Refactor
        - Change main app module name
        - Code clean-up on meal plans module (details, add, update)
        - Fix jshint warnings

# May 14, 2017
    - Products Module
        - Fix change selected implementation

# May 10, 2017
    - Reset Password
        - Fix reset password implementation
        - Fix controls in view
    - Code Refactor
        - Wrap Angular components in an Immediately Invoked Function Expression (IIFE)
        - Change function expressions to function declarations
