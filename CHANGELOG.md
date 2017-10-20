# October 12, 2017
    - Add Dashboard

# September 30, 2017
    - Implement Audit Logs

# September 20, 2017
    - Reports
        - Raw ingredients reports

# September 07, 2017
    - Reports
        - Allow generation of reports for a given date

# August 26, 2017
    - Display username and role on main header navbar dropdown
    - Add navigation for admin console
    - Prevent unauthorized access for admin console
    - Admin Console
        - Close add modal after employee registration
    - Add account-verified page
    - Add page title
    - Scrum Board
        - Prevent done tasks to be dragged to another section.
    - Products Module
        - Sort products by name in ascending order
    -Subscriptions Module
        - Sort subscription by 'subscriptionDate' in descending order

# August 25, 2017
    - add 'angular-material' module
    - Login
        - Add indeterminate progress bar component)
        - Field validation
    - Accounts module
        - Implement password strength validation

# July 03, 2017
    - Reports Module
        - Create 'Receipts' template on reporting server (jsreport)
        - Implement 'exportToPDF' functionality on receiptsCtrl
        - Re-implement functionalities of receiptsCtrl
        - Improve content receiptsView

# July 01, 2017
    - Add 'reports' factory for generating reports
    - Reports Module
        - Create 'Daily Production' template on reporting server (jsreport)
        - Create 'Delivery List' template on reporting server (jsreport)
        - Implement 'exportToPDF' functionality of productionCtrl
        - Implement 'exportToPDF' functionality of deliveriesCtrl
        - Order subscriptions by mealPlanId on state resolve
        - Re-implement functionalities of deliveriesCtrl
        - Improve content deliveriesView

# June 30, 2017
    - Reports Module
        - Re-implement functionalities of productionCtrl
        - Improve content productionCtrl
    - Subscriptions Module
        - Add filter in state resolve to include 'user' and 'mealPlan'

# June 28, 2017
    - Code Refactor
        - Wrap productionCtrl in an IIFE
        - Optimized functionalities implementations of productionCtrl
        - Code cleanup on productionCtrl
        - Improve content of productionView
    - Products Module
        - Fix module declaration of productionCtrl
        - Add filter on productionCtrl state resolve

# June 24, 2017
    - Code Refactor
        - Resolve 'meal_plan_meals_data' in state resove to improve performance
        - Code cleanup on meal_plans_editCtrl
        - Optimized functionalities implementations of meal_plans_editCtrl
        - Improve content of meal_plans_editView
    - Products Module
        - Change '$save' method to '$upsert' on meal_plans_editCtrl
        - Fix implementation of 'set' breakfast, lunch, dinner, and snack function on meal_plans_addCtrl and meal_plans_editCtrl
        - Remove deleted mealPlan on meal_plans_data (meal_plans_listCtrl)

# June 23, 2017
    - Code Refactor
        - Code cleanup on meal_plans_addCtrl
        - Optimized functionalities implementations of meal_plans_addCtrl
        - Improve content of meal_plans_addView
    - Products Module
        - Implement Create functionality on meal plans module
    - Generate new 'lb-services.js'

# June 22, 2017
    - Products Module
        - Implement CRUD functionality on meals module

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
