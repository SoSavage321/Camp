# CampusFlow AI Coding Instructions

**Project**: CampusFlow - A React Native/Expo campus community app
**Stack**: React Native, Firebase, Zustand, React Navigation, TypeScript, Tailwind CSS, React Hook Form, React Query

## Architecture Overview

### Core Application Flow
1. **App Entry** (`App.tsx`): Initializes React Query, notifications, gesture handler
2. **RootNavigator** (`src/navigation/RootNavigator.tsx`): Conditional rendering based on auth state and onboarding status
   - Unauthenticated → `AuthNavigator`
   - Authenticated but not onboarded → `OnboardingNavigator`
   - Fully setup → `MainNavigator` (bottom tab navigation)

### State Management (Zustand)
- **`authStore`**: User authentication, profile updates, sign in/up/out
- **`appStore`**: App-level state (theme, onboarding flag, notifications)
- **Domain stores** (`eventStore`, `taskStore`): Manage domain-specific data

**Pattern**: Stores use `get()` to access current state in async operations; always await service calls before state updates.

### Firebase Integration (`src/services/firebase/`)
- **`config.ts`**: Initializes Auth, Firestore, Storage, Functions
- **`auth.service.ts`**: Authentication operations; User document stored in Firestore on signup
- **`firestore.service.ts`**: Generic CRUD wrapper with automatic `createdAt`/`updatedAt` timestamps
  - `getDocument<T>()`, `getDocuments<T>()`, `addDocument()`, `updateDocument()`, `deleteDocument()`
  - **Pagination**: Uses `getPaginatedDocuments()` with `lastDoc` cursor

### Data Types (`src/types/index.ts`)
Core entities:
- **User**: roles (student/organizer/admin), quietHours, interests, course, year
- **Task**: priority (low/med/high), dueAt, course, completed, reminderAt
- **Event**: category (social/study/sports/culture/other), visibility (public/group/private), status (pending/approved/rejected)
- **Chat**: type (dm/group/room), subjectId identifies relationship (userId/groupId/eventId)
- **Group**: type (society/study), members with roles (member/moderator)
- **Report/Announcement**: For moderation and communications

## Project-Specific Conventions

### Path Aliases (Configured in `tsconfig.json` & `babel.config.js`)
```
@/          → src/
@components → src/components/
@screens    → src/screens/
@services   → src/services/
@hooks      → src/hooks/
@utils      → src/utils/
@store      → src/store/
@types      → src/types/
```
**Always use aliases** for imports; never use relative paths.

### Component Structure
- **UI Components** (`src/components/ui/`): Reusable, theme-aware (Button, Input, Card, Badge, etc.)
  - All styled with `StyleSheet` and support `disabled`/`loading` states
- **Cards** (`src/components/cards/`): Domain-specific (ChatListItem, EventCard, StudyBuddyCard, etc.)
- **Forms/Lists/Modals**: Specialized composite components

### Screen Patterns
- Import stores and call hooks at top level
- Use `useTheme()` hook for colors (respects light/dark mode)
- Navigation params pass via `route.params`; defined in `src/navigation/types.ts`

### Form Validation
- Use `react-hook-form` + `zod` for schemas
- Validation utils in `src/utils/validation.utils.ts` (email, password, text sanitization)
- Forms submit via store actions, not direct service calls

### API Data Fetching
- **React Query** handles caching/refetching; configured in `App.tsx` with 5min staleTime, 2 retries
- **Never call Firebase services directly from components**; use store actions or custom hooks
- Custom hooks in `src/hooks/`: `useDebounce`, `useImageUpload`, `useInfiniteScroll`, `useNetworkStatus`, `useRefresh`, `useTheme`, `useKeyboard`

### Timestamps
- All dates stored as Firebase `Timestamp` in Firestore
- Utilities in `src/utils/date.utils.ts` convert to client Date/strings for display
- Never assume `Date` in types; always `Timestamp` for Firestore data

### Error Handling
- Auth errors propagate to store via `error` and `isLoading` state
- Services throw errors; stores catch and update error field
- UI shows errors via alert/toast (implement as needed)

## Build & Development

**Commands** (see `package.json`):
- `npm start` → Expo dev server (interactive mode)
- `npm run android` → Android simulator
- `npm run ios` → iOS simulator
- `npm run web` → Web preview

**Environment**:
- Firebase config via `.env` (Expo reads `EXPO_PUBLIC_*` prefix)
- File: `Envrinoment.env` (note: typo in existing codebase)

**Notable Dependencies**:
- `expo-router` configured but not heavily used; using `@react-navigation` instead
- `nativewind` provides Tailwind utilities for React Native
- `lucide-react-native` for icons

## Integration Points & Data Flow

### Authentication Flow
1. User signs up/in via `AuthService.signUp/signIn()`
2. Firebase creates Auth user + Firestore `/users/{uid}` document
3. `RootNavigator` listens to `onAuthStateChanged()` → loads user data
4. `authStore.setUser()` updates state
5. Unauthorized requests rejected by Firebase security rules

### Event Management
- Create via `EventService` → stored in `/events` collection
- Status workflow: pending (admin review) → approved/rejected
- `EventRSVP` documents track user attendance; aggregated counts (attendeeCount) in Event doc

### Chat System
- `/chats` collection with `subjectId` (userId for DM, groupId for group)
- `participants` array for membership
- `/messages` subcollection with `chatId` reference
- Unread counts per user tracked in Chat doc

### Study Rooms
- Session-based with `expiresAt` TTL
- Pomodoro tracking in separate `PomodoroSession` documents
- Active rooms queried by course

### Moderation
- `/reports` collection: target (message/user/event), reason, status (open/reviewed/closed)
- Admin review → approve/reject actions

## Code Style & Standards

- **TypeScript**: Strict mode enabled; no `any` types without justification
- **Naming**: camelCase for functions/variables, PascalCase for components/classes, UPPER_CASE for constants
- **File Organization**: One component per file; related utils grouped in `utils/` subfolders
- **Comments**: Use for "why" decisions (e.g., Firestore index requirements), not "what"
- **Responsive**: Use theme colors via `useTheme()`; layout with flexbox

## Common Tasks

### Add a New Screen
1. Create file in `src/screens/{feature}/NewScreen.tsx`
2. Import store hooks + `useTheme()`
3. Add route to navigator (`src/navigation/{Feature}Navigator.tsx`)
4. Update `src/navigation/types.ts` with param list

### Add a Feature Store
1. Create `src/store/{feature}Store.ts` using Zustand pattern
2. Define state interface + actions
3. Export `use{Feature}Store` hook
4. Use in components via `const { state } = use{Feature}Store()`

### Fetch Data
1. Create service method in `src/services/` or use `FirestoreService`
2. Call from store action with loading/error handling
3. Use in component via store hook or custom hook wrapping store

### Style a Component
1. Use `useTheme()` to access color palette
2. Define `StyleSheet` outside component
3. Build theme-aware styles from `colors` object
4. Store colors in theme, not hardcoded

## Known Patterns & Anti-Patterns

✅ **DO**:
- Import via path aliases
- Handle errors in stores, not components
- Use Firestore timestamp auto-generation in service layer
- Export types from `types/index.ts`
- Keep screens simple; complex logic in stores

❌ **DON'T**:
- Import components with relative paths (`../../../`)
- Call Firebase directly from components
- Hardcode colors (use `useTheme()`)
- Mix form libraries; stick with react-hook-form
- Create new stores without clear justification

## File Reference

Key files exemplifying patterns:
- **Navigation setup**: `RootNavigator.tsx`, `MainNavigator.tsx`
- **Store pattern**: `authStore.ts`, `appStore.ts`
- **Service layer**: `auth.service.ts`, `firestore.service.ts`
- **Component patterns**: `Button.tsx`, `EventCard.tsx`
- **Type safety**: `types/index.ts` (95+ domain types)
- **Configuration**: `app.json` (Expo config), `tsconfig.json` (path aliases)
