# User Store Documentation

This directory contains the Zustand store for managing user state throughout the application.

## User Store (`userStore.js`)

The user store provides centralized state management for user authentication, profile data, and selected athlete state.

### Features

- **Persistent Storage**: User data persists across browser sessions using localStorage
- **Performance Optimized**: Uses Zustand selectors to prevent unnecessary re-renders
- **Type Safe**: Includes helper functions for common user operations
- **Error Handling**: Centralized error state management

### Usage

#### Basic Usage

```javascript
import useUserStore from "../stores/userStore";

const MyComponent = () => {
  const { user, login, logout, fetchUser } = useUserStore();

  // Use the state and actions
};
```

#### Using Selectors (Recommended for Performance)

```javascript
import useUserStore, {
  useUser,
  useIsCoach,
  useError,
} from "../stores/userStore";

const MyComponent = () => {
  const user = useUser(); // Only re-renders when user changes
  const isCoach = useIsCoach(); // Only re-renders when role changes
  const error = useError(); // Only re-renders when error changes

  const { login, logout } = useUserStore(); // Actions don't cause re-renders
};
```

### Available Selectors

- `useUser()` - Get current user object
- `useSelectedAthlete()` - Get selected athlete ID
- `useIsLoading()` - Get loading state
- `useError()` - Get error state
- `useIsAuthenticated()` - Check if user is logged in
- `useIsCoach()` - Check if user is a coach
- `useIsAthlete()` - Check if user is an athlete

### Available Actions

- `login(credentials)` - Authenticate user
- `logout()` - Sign out user
- `fetchUser()` - Fetch current user data from API
- `setUser(user)` - Set user data manually
- `setSelectedAthlete(athleteId)` - Set selected athlete
- `clearError()` - Clear error state
- `reset()` - Reset store to initial state

### Helper Functions

- `getUserId()` - Get user ID (backward compatibility)
- `getUserFullName()` - Get user's full name
- `getUserOrg()` - Get user's organization
- `isAuthenticated()` - Check authentication status
- `isCoach()` - Check if user is coach
- `isAthlete()` - Check if user is athlete

### State Structure

```javascript
{
  user: null | UserObject,
  selectedAthlete: null | string,
  isLoading: boolean,
  error: null | string
}
```

### Persistence

The store automatically persists `user` and `selectedAthlete` to localStorage. Other state (loading, errors) is not persisted.

### DevTools

Zustand provides excellent DevTools support. In development, you can inspect the store state using the Redux DevTools browser extension.

### Best Practices

1. **Use selectors** for reading state to prevent unnecessary re-renders
2. **Use actions** for modifying state
3. **Handle loading states** in your components
4. **Clear errors** when starting new operations
5. **Use helper functions** instead of manually checking user properties
