# Make My Marriage — Product Requirements Document (PRD)

**Product name:** Make My Marriage  
**Document version:** 1.0  
**Product type:** Responsive wedding management web application  
**Initial goal:** Build a simple, polished MVP that helps a person or family organize one wedding.

---

## 1. Product Overview

Make My Marriage is a simple web application for managing wedding planning in one place. It brings together wedding expenses, digital invitations, wedding functions, family tasks, and basic settings.

The first version must stay focused and easy to use. It should have only five main navigation items:

1. Dashboard
2. Expenses
3. Invitations
4. Family Coordination
5. Settings & Admin

The architecture should allow multiple weddings and families in the future, but the MVP should not become overloaded with advanced features.

## 2. Goals

- Make it easy to see the wedding's overall status.
- Track the planned budget, expenses, payments, and outstanding amounts.
- Create and share a simple digital wedding invitation.
- Keep wedding functions, tasks, and family announcements organized.
- Give the wedding administrator control over wedding details and member access.
- Work well on desktop, tablet, and mobile.
- Keep the codebase understandable, reusable, and ready for future database integration.

## 3. Non-Goals for the MVP

Do not build these in the first version:

- Payment gateway or online vendor payments
- Subscription plans or billing
- Real-time chat or video calling
- Automated bulk WhatsApp messaging
- AI wedding assistant
- Vendor marketplace or vendor login portal
- Many invitation templates
- Complex analytics or advanced reporting
- Native Android or iOS applications

A WhatsApp share link is enough for the initial invitation feature. Do not claim a message was delivered or read unless a supported service confirms it.

## 4. Target Users and Roles

### Admin
The person managing the wedding. Can update wedding settings, manage members, and create, edit, or delete wedding records.

### Family Member
Can view wedding information and work on assigned tasks. Permissions should be defined clearly before enabling editing of shared records.

### Viewer
Can view permitted wedding information but cannot modify it.

For the first UI prototype, roles can be demonstrated with sample data. Real authentication and permissions must not be faked; they will be implemented with a backend in the database phase.

## 5. Main Navigation and Requirements

### 5.1 Dashboard

Display:
- Wedding name and couple names
- Total wedding budget
- Total expenses
- Remaining budget
- Total and pending tasks
- Upcoming wedding functions
- Recent expenses
- Quick action to add an expense

Requirements:
- Summary figures must be calculated from the underlying records, not hardcoded.
- Remaining budget = total budget − total expenses.
- Clearly distinguish paid amounts from outstanding payment amounts.
- Include useful empty states when there is no data.
- Provide a clear first action for a new wedding.

### 5.2 Expenses

Each expense record should support:
- Expense name
- Category (e.g. Venue, Catering, Clothing, Decoration, Photography, Transport, Other)
- Total amount
- Paid amount
- Remaining amount, calculated automatically
- Payment status (Unpaid, Partially Paid, Paid)
- Related wedding function (optional)
- Expense date
- Vendor or recipient (optional)
- Notes (optional)

Features:
- Add, edit, and delete an expense
- Search by expense or vendor
- Filter by category, function, or payment status
- Show total expenses, total paid, and total outstanding
- Validate required fields and non-negative amounts
- Prevent paid amount from exceeding the total amount unless a deliberate overpayment policy is implemented
- Confirm before destructive delete actions

Calculations:
- Remaining amount = total amount − paid amount
- Status is Unpaid when paid amount is zero; Partially Paid when paid amount is between zero and total; Paid when paid amount equals total.
- Dashboard totals must update after any expense change.

### 5.3 Invitations

Create a simple invitation builder with one attractive default template.

Invitation fields:
- Couple names
- Host/family names (optional)
- Function name
- Date and time
- Venue name
- Full address
- Optional short message

Features:
- Live invitation preview
- Guest list with guest name and phone number
- Copy invitation text
- Share invitation through a WhatsApp link
- Allow users to edit invitation details before sharing

Requirements:
- Encode WhatsApp message text safely in the share URL.
- Do not send messages automatically.
- Do not claim delivery, read receipts, or RSVP tracking unless those services are implemented.
- RSVP and multiple templates are future enhancements, not MVP requirements.

### 5.4 Family Coordination

This page contains three simple sections.

#### Wedding Functions
Fields:
- Function name
- Date and time
- Venue
- Notes
- Optional status

Allow users with appropriate permission to add, edit, and delete functions.

#### Family Tasks
Fields:
- Task title
- Description (optional)
- Assigned family member (optional in prototype)
- Due date (optional)
- Related function (optional)
- Status: Pending, In Progress, Completed

Features:
- Add, edit, and delete tasks
- Filter tasks by status or assigned member
- Mark a task completed
- Highlight overdue tasks when a due date exists

#### Family Updates
Fields:
- Announcement title or message
- Author
- Creation date

For the MVP, announcements can be a simple shared list. Real-time chat is explicitly out of scope.

### 5.5 Settings & Admin

Wedding settings:
- Wedding name
- Couple names
- Wedding budget
- Preferred currency (default INR / ₹)
- Optional main wedding date

Family access:
- List of members
- Role labels: Admin, Family Member, Viewer
- Add/remove member UI in the prototype
- Clear explanation that real invites and permissions require backend authentication

Account settings:
- Profile details
- Logout entry in the UI where applicable

Security requirement:
- In the production version, enforce authorization on the backend/database. Hiding a button in the frontend is not security.

## 6. User Journeys

### Journey A: Set up a wedding
1. Admin opens the app.
2. Enters wedding name, couple names, budget, and date.
3. Adds wedding functions.
4. Sees the dashboard populated with the new details.

### Journey B: Record an expense
1. User opens Expenses.
2. Selects Add Expense.
3. Enters the amount and amount paid.
4. Saves the record.
5. Expense list and dashboard totals update immediately.

### Journey C: Share an invitation
1. User opens Invitations.
2. Enters invitation details.
3. Reviews the live preview.
4. Copies the text or opens the WhatsApp share link.
5. User confirms and sends the invitation from WhatsApp.

### Journey D: Coordinate family tasks
1. User opens Family Coordination.
2. Creates a task and optionally assigns a family member.
3. Updates its status as work progresses.
4. Dashboard pending-task totals update.

## 7. Design and UX Requirements

Visual direction:
- Premium, calm wedding-planning aesthetic
- Warm ivory/off-white backgrounds
- Sage-green accents
- Subtle gold details used sparingly
- Dark, readable text
- Clean typography and consistent spacing
- Rounded cards, subtle borders, and restrained shadows
- Small, purposeful animations only
- Avoid clutter, excessive gradients, and unnecessary decorative elements

Layout:
- Desktop: left sidebar and main content area
- Mobile: responsive drawer or compact navigation
- Consistent page titles, action buttons, form layouts, and table styles
- Use cards for summaries and tables/lists for records
- Make all important actions reachable on mobile

Accessibility and usability:
- Labels for all form inputs
- Visible focus states and keyboard-friendly controls
- Adequate text contrast
- Helpful validation and error messages
- Confirmation for destructive actions
- Loading, empty, error, and success states
- Use Indian Rupee formatting by default

## 8. Technical Requirements

Preferred stack:
- React
- Vite
- Tailwind CSS
- Lucide React icons
- Supabase for future/production authentication and shared database

Project rules:
- Inspect the existing repository before changing files.
- Preserve working configuration and existing dependencies where possible.
- Use reusable components and a clean folder structure.
- Keep data models and calculations separate from presentation where practical.
- Avoid unnecessary libraries.
- Do not leave dead buttons or pretend functionality works when it does not.
- If a feature is not implemented, label it clearly as a prototype or disabled future feature.
- Ensure the app runs and builds successfully.

Suggested structure (adapt to the existing repository rather than blindly overwriting it):

```text
src/
  components/
    layout/
      AppLayout.jsx
      Sidebar.jsx
      MobileNavigation.jsx
      PageHeader.jsx
    ui/
      Button.jsx
      Card.jsx
      Modal.jsx
      FormField.jsx
      EmptyState.jsx
      ConfirmDialog.jsx
  pages/
    Dashboard.jsx
    Expenses.jsx
    Invitations.jsx
    FamilyCoordination.jsx
    SettingsAdmin.jsx
  features/
    expenses/
      expenseUtils.js
      ExpenseForm.jsx
      ExpenseTable.jsx
    invitations/
      InvitationForm.jsx
      InvitationPreview.jsx
    functions/
      FunctionForm.jsx
    tasks/
      TaskForm.jsx
  data/
    sampleData.js
  lib/
    formatCurrency.js
    validation.js
  App.jsx
  main.jsx
```

## 9. Data Model (Initial)

Prepare these entities for later database integration:

### Wedding
- id
- name
- couple_names
- budget
- currency
- main_date
- created_at

### WeddingMember
- id
- wedding_id
- user_id
- role
- created_at

### Expense
- id
- wedding_id
- name
- category
- total_amount
- paid_amount
- function_id (optional)
- vendor (optional)
- expense_date
- notes (optional)
- created_at
- updated_at

### WeddingFunction
- id
- wedding_id
- name
- starts_at
- venue
- notes
- status (optional)

### Guest
- id
- wedding_id
- name
- phone (optional)
- created_at

### Invitation
- id
- wedding_id
- couple_names
- host_names (optional)
- function_name
- starts_at
- venue
- address
- message (optional)
- created_at
- updated_at

### Task
- id
- wedding_id
- title
- description (optional)
- assigned_member_id (optional)
- due_date (optional)
- function_id (optional)
- status
- created_at
- updated_at

### Announcement
- id
- wedding_id
- message
- author_id (or author label in prototype)
- created_at

All wedding-related records must be scoped to a wedding. Users must not be able to access another wedding's data without explicit authorization.

## 10. Data Persistence Plan

### UI prototype
Use realistic sample data to demonstrate the experience. If browser-local persistence is used temporarily, explain that it is local to that browser/device and is not shared with family members.

### Production phase
Integrate Supabase:
- Authentication
- Database tables and relationships
- Row Level Security (RLS) policies for each wedding and its members
- Role-based authorization enforced in the database
- Safe environment variable handling
- No service-role key in client-side code

Do not represent prototype data as securely stored or shared.

## 11. MVP Acceptance Criteria

The MVP is acceptable when:
- All five navigation pages exist and navigation works.
- Layout is responsive on mobile and desktop.
- Dashboard totals are derived from records.
- Expense create/edit/delete flows work and validate inputs.
- Remaining amounts and payment statuses calculate correctly.
- Invitation preview updates when fields change.
- WhatsApp share link opens with the encoded invitation message.
- Functions and tasks can be managed in the prototype.
- Task status can be updated.
- Settings can be edited in the prototype.
- Empty, validation, and error states are present.
- No visible primary action is a dead button.
- No frontend-only role check is presented as production security.
- The project runs without build errors.

## 12. Delivery Plan

### Phase 1 — UI foundation
- Inspect the current project.
- Build layout, navigation, all five pages, and responsive styling.
- Use realistic sample data.
- Verify the application starts and builds.

### Phase 2 — Frontend functionality
- Implement expense CRUD and calculations.
- Implement function and task management.
- Implement invitation preview and WhatsApp share link.
- Implement settings form validation.

### Phase 3 — Backend
- Configure Supabase.
- Add authentication and wedding membership.
- Create database schema and RLS policies.
- Connect all data operations.
- Test access control with different roles and separate weddings.

### Phase 4 — QA and deployment
- Test on mobile and desktop.
- Test empty and invalid forms.
- Test data isolation and permissions.
- Fix errors and document environment setup.
- Deploy to a hosting provider.

## 13. Instructions for the AI Coding Agent

Work in small, verifiable steps. Begin by inspecting the existing project and summarizing its current setup. Then implement **Phase 1 only**.

Do not attempt to build every phase at once. After Phase 1:
1. Run the app and build.
2. Fix errors.
3. Summarize which files were created or changed.
4. List any features that are visual prototypes rather than fully functional.
5. Wait for the next instruction before moving to Phase 2.

The result should feel like a real, polished wedding-planning product while remaining simple enough for a beginner to understand and maintain.
