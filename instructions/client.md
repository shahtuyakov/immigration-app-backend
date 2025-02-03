App Description:
The Immigration News Client App is a cross-platform mobile application built using React Native with TypeScript. The app is designed to help follow the latest immigration news and users manage immigration-related tasks. It includes authentication (login, signup, forgot password), case management, news viewing, and a lawyer directory.

Key Features:
- Authentication:
Login, Sign Up, Forgot Password screens.
- Case Management:
CaseList and CaseDetail screens.
- News:
NewsList and NewsDetail screens.
- Lawyer Directory:
LawyerList and LawyerDetail screens.

Authentication & Profile Screens:
- Sign Up - user can sign up with email, phone number, or social media
- Login (including OAuth options for Google/Apple) - user can login with email, phone number, or social media
- Forget Password - user can reset their password
- Profile View/Edit - user can view and edit their profile
- Language Selection (English, Spanish, Russian) - user can select their preferred language
- Settings Screen - user can view and edit their settings
- Change Password Screen - user can change their password
- Email Verification Screen - user can verify their email

News Management Screens:
- News Feed (Main feed with categories) - user can scroll through news articles
- News Detail Screen - user can read the full article
- Saved News Feed - (user can save news articles to read later)
- News Search Screen - search by title, category, date, etc.
- News Category Filter Screen - filter by category
- News Preferences Screen - user can select news categories they want to receive

Case Management Screens:
- Cases Dashboard/Overview - user can view their cases
- Add New Case Screen - user can add a new case
- Case Detail/Tracking Screen - user can view the details of a case and track its progress
- Case Timeline View - user can view the timeline of a case
- Case Status History Screen - user can view the history of a case

Lawyer Consultation Screens:
- Lawyer Directory/List - user can view a list of lawyers
- Lawyer Profile Detail - user can view the details of a lawyer
- Lawyer Search/Filter Screen - user can search for a lawyer by name, specialization, language, location, etc.
- Appointment Booking Screen - user can book an appointment with a lawyer
- Appointment Calendar View - user can view their appointment calendar
- Appointment History Screen - user can view their appointment history
- Lawyer Reviews Screen - user can view reviews of a lawyer
- Consultation Payment Screen - user can pay for a consultation with a lawyer

Common Screens:
- FAQ Screen - user can view frequently asked questions
- Contact Support Screen - user can contact support
- Terms & Privacy Policy - user can view the terms and privacy policy
- App Tutorial/Onboarding Screens - user can view the app tutorial and onboarding screens

Each screen should follow iOS design guidelines and support both light and dark modes. The documentation also mentions that the app should have a clean, professional aesthetic with intuitive navigation and accessibility compliance.

Project Architecture & Structure
src/
├── screens/
│   ├── auth/
│   ├── case/
│   ├── news/
│   └── lawyer/
├── components/
│   ├── common/
│   └── specific/
├── navigation/
├── services/
├── store/
│   ├── slices/
│   └── index.ts
├── utils/
├── assets/
│   ├── images/
│   └── icons/
└── localization/
    ├── en.json
    ├── es.json
    └── ru.json

Key Considerations:

Modularity & Separation of Concerns:
Each folder and file is designed to encapsulate specific functionality (screens, reusable components, navigation, API services, state management, etc.). This ensures scalability and ease of maintenance.
TypeScript:
Enforce type safety across the codebase.
Navigation:
Use React Navigation (v6+) to separate authenticated and non-authenticated flows.
State Management:
Use Redux Toolkit for global state management and asynchronous actions.
UI Design System:
Create a consistent, reusable design system for common UI elements (buttons, inputs, cards).


Guidelines for the AI Agent
When generating code, the AI agent should follow these guidelines:

Technology & Tools:
React Native with TypeScript.
Redux Toolkit for state management.
React Navigation for routing and navigation.
Axios (or Fetch) for API integration.
i18next or react-native-localize for localization.
ESLint and Prettier for code formatting and linting.

Code Quality:
Produce clean, modular, and well-commented code.
Ensure that each component and module follows best practices.
Provide type definitions and ensure TypeScript correctness.
Include inline comments and documentation headers in each file.

Provide clear instructions on how each module integrates into the overall project.
If generating code for a specific file (e.g., Login.tsx), include necessary imports, styles, and sample usage.
