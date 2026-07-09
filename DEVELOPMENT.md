# LintCollab Web — Developer Documentation

Welcome to the development documentation for **LintCollab Web**, a collaborative workspace platform designed for social media content planning, scheduling, multi-channel approval workflows, and publishing.

---

## 1. Project Overview & Architecture

LintCollab Web is a modern React application built on top of the **Vite** build tool. It communicates with a backend REST API to manage workspaces, channels (like Facebook), posts, media, comments, and members.

### Technical Stack
*   **Core**: React 19, Vite (ES modules, Fast Refresh)
*   **Routing**: React Router DOM (v7) with route guards for public and private pages
*   **Styling**: Vanilla CSS alongside Material-UI (MUI v7) and Emotion for rich, interactive, and responsive user interfaces
*   **Animations**: Framer Motion for smooth transitions and Micro-animations
*   **3D Graphics**: Three.js & `@react-three/fiber` / `@react-three/drei` for immersive landing/login page backgrounds
*   **HTTP Client**: Axios with interceptors for token refresh, request signatures, and error mapping
*   **Notifications**: Centralized Context API with `react-hot-toast`

---

## 2. Directory Structure

Here is an overview of the key directories in the `src/` codebase:

```
src/
├── assets/          # Static assets (images, icons)
├── components/      # Reusable UI components
│   ├── layout/      # Sidebar, Header, Page wrappers
│   ├── post/        # Post creation, editing, cards, and previews
│   ├── tabs/        # Tab components for Settings & Workspace pages
│   ├── ui/          # Core atoms/UI primitives (buttons, modals, tooltips)
│   └── views/       # Alternate layout view engines (Calendar, Grid, List)
├── contexts/        # React context providers (Notification, Auth etc.)
├── data/            # Static configuration, mock data definitions
├── layouts/         # High-level layouts (WorkspaceLayout, AuthLayout)
├── pages/           # Route-level page components (Dashboard, Content, Media, Analytics, Settings)
├── services/        # API request functions (Auth, Workspaces, Channels, Users)
├── styles/          # Base styling systems, themes, and global variables
├── utils/           # Helper scripts (Date formatters, Device IDs, Validators)
├── App.jsx          # Root component containing React Router configuration
├── index.css        # Global CSS stylesheet & custom utility classes
└── main.jsx         # Application mounting and entry point
```

---

## 3. Core Features & Functional Specification

### 3.1. Authentication & Security
*   **JWT Storage**: Supports both persistent authentication (`localStorage` for "Remember Me") and transient session-bound authentication (`sessionStorage`).
*   **Route Guards**:
    *   `ProtectedRoute`: Verifies presence of an access token; otherwise redirects to `/login`.
    *   `PublicRoute`: Redirects already-authenticated users from `/login` or `/signup` back to `/workspace`.
*   **Automatic Token Refresh**: The custom Axios interceptor intercepts `401 Unauthorized` responses, queues pending requests, initiates a token refresh POST request to `/v1/token/refresh/`, and retries all queued requests seamlessly.
*   **Immersive Login Background**: Features `Background3D.jsx` using React Three Fiber to render dynamic interactive 3D particle systems.

### 3.2. Workspace Management
*   **Multi-Workspace Switcher**: Users can belong to multiple workspaces and switch between them dynamically.
*   **Workspace Creation**: Create new workspaces with custom names and timezone preferences.
*   **Member Invitations**: Invite team members via email and assign roles (e.g., Owner, Admin, Creator, Reviewer).
*   **Workspace Settings**: Manage workspace names, update regional timezones, invite new members, remove active members, or delete a workspace (owners only).

### 3.3. Social Media Integrations (Channels)
*   **OAuth Flow**: Supports Facebook Login integration to fetch user pages and connect pages to workspaces.
*   **Facebook Pages Manager**: Connect, view status, and disconnect specific Facebook Pages within the workspace.
*   **Multi-Channel Publishing**: Prepare and format post payloads targeting multiple connected social destinations.

### 3.4. Content & Publishing Hub
*   **Visual Board Views**: View content via a **Grid**, a **Calendar**, or a list layout.
*   **Post Creation Modal (`CreatePostModal`)**: 
    *   Drafting text with emoji picker support.
    *   Media attachments from the local machine or Workspace Media Library.
    *   Platform-specific previews (e.g., mobile/desktop Facebook feed rendering).
    *   Scheduling options (immediate publish vs. scheduled future release).
*   **Approvals Flow**: Separate approval tab where Reviewers and Admins can approve or reject scheduled posts, providing comments on rejection.
*   **Interactive Commenting**: Sidebar panels for contextual feedback, threaded comments, and team discussion on draft/pending posts.

### 3.5. Media Library
*   **Asset Management**: Centralized hub to store and search images/videos.
*   **Media Uploader**: Handles multipart uploads and previews files prior to insertion into drafts.

### 3.6. Analytics & Performance
*   **Data Dashboards**: Visualizes key metrics such as post engagement, reach, impressions, and follower growth using rich interactive charts and graphs.

---

## 4. API & Network Integration Layer

All API calls are centralized in `src/services/` and run through the customized Axios instance in [api.js](file:///d:/lintcollab-web/src/services/api.js).

### Request Interceptor
*   Attaches the `Authorization: Bearer <token>` header dynamically.
*   Optionally inserts custom device identification fingerprints (`X-Device-Id`).

### Response Interceptor
*   Decodes API responses.
*   Catches error status codes and delegates to [errorMapper.js](file:///d:/lintcollab-web/src/services/errorMapper.js) to translate backend errors into user-friendly validation notices.
*   Handles token expiration and request retrying through a promise-based queue lock.

---

## 5. Getting Started & Development Commands

Ensure you have Node.js installed on your machine.

### Installation
```bash
npm install
```

### Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Running Locally (Development Mode)
```bash
npm run dev
```
Starts the Vite dev server locally.

### Linting
```bash
npm run lint
```
Runs ESLint rules configured in `eslint.config.js`.

### Production Build
```bash
npm run build
```
Compiles and optimizes assets into the `dist/` directory for static hosting.

### Preview Production Build
```bash
npm run preview
```
Runs a local web server to preview the built application.
