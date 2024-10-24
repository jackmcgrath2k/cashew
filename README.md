
# Cashew V1

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
- Filtering system



## FAQ

#### What is Cashew?

A budgeting app. Currently functioning only for personal budgets, in the development process of allowing for group budgets, incorporating a friendship system.

#### Why supabase?

I decided to use supabase over Firebase as a personal challenge to learn an alternate BaaS, having previous experience with Firebase in college. Supabase also was chosen to fit the scale of this personal project, it was very easy to use.

## Preview
![c6](https://github.com/user-attachments/assets/de2d11c2-2c3e-46a1-8f17-93c9db97643b)
![c5](https://github.com/user-attachments/assets/e92164a1-e3f9-43cf-9f94-cfe5ef0b9ff8)
![c4](https://github.com/user-attachments/assets/eb477d42-4d88-47d1-9567-0d2f783e4a7b)
![c3](https://github.com/user-attachments/assets/d65f6f81-21fb-4be5-87a2-a81a85dd3a1e)
![c2](https://github.com/user-attachments/assets/eb22252c-aa5b-49fc-8389-34f9e0c05d94)
![c1](https://github.com/user-attachments/assets/32e60f58-9bff-40f2-a22e-5d8b5fa6b57d)
