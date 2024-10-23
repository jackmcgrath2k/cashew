
# Cashew

### A budgeting app made in React using supabase and TailwindCSS with realtime subscription. 

## Features
1. Authentication & User Management
- Sign Up/Sign In: Users can create an account by providing basic details like email, username, and password.
- Secure Authentication: User sessions are managed securely using authentication services.
- Profile Management: Users can update their profile information, including display name and username.


2. Budget Management
- Create: Users can create new budgets and populate with expenses.
- Read: View lists of all budgets created.
- Update: Edit existing budgets to account for changes.
- Delete: Remove budgets when no longer needed.

 Expenses
- CRUD Functionality also implemented
- Logs date of creation and name of user who created it.
- Category/Tags functionality.

3. User Interface & Experience
- Using TailwindCSS and MUIcons, the user design is sleek and simple to use for anybody to start budgeting.

4. Social Features (WIP)

- User Search: Users can search for other users by their display name or username.
- Friendship system (WIP): Users will be able to be friends with other users.

5. Data Security & Permissions
- Row-Level Security (RLS): Protects user data by ensuring users can only access and modify their own budgets.

- Authorization Checks: Ensures only authenticated users can access and modify specific data.

6. Error Handling & Validation
- Form Validation: Input fields are validated to ensure required information is provided.
- Error Messages:  Error messages for actions like failed sign-ins or invalid inputs.

7. Future Enhancements
- Notifications
- Statistics & Analytics
- Group budgeting



## FAQ

#### What is Cashew?

A budgeting app. Currently functioning only for personal budgets, in the development process of allowing for group budgets, incorporating a friendship system.

#### Why supabase?

I decided to use supabase over Firebase as a personal challenge to learn an alternate BaaS, having previous experience with Firebase in college. Supabase also was chosen to fit the scale of this personal project, it was very easy to use.



