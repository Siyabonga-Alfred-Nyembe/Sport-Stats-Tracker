# Role Verification System

This document describes the implementation of the role verification system for the Sport Stats Tracker application, which ensures users can only access features appropriate to their role (Fan or Coach).

## Overview

The role verification system provides:
- **Role-based access control** for different user types
- **Automatic role selection** for new users during signup
- **Protected routes** that check user roles before allowing access
- **Database integration** with the existing Supabase schema

## Database Schema

The system uses the following tables from your existing schema:

### `users` table
- `id` (uuid): Primary key, references auth.users
- `email` (text): User's email address
- `role` (text): User role - either 'Fan' or 'Coach'
- `google_id` (text, optional): Google OAuth ID

### `user_profiles` table
- `id` (uuid): Primary key, references users.id
- `display_name` (text): User's display name
- `avatar_url` (text, optional): User's avatar image URL
- `created_at` (timestamp): Profile creation timestamp

### `teams` table
- `id` (text): Team identifier
- `name` (text): Team name
- `coach_id` (text): References users.id (the coach managing this team)
- `logo_url` (text, optional): Team logo image URL

## Components

### 1. RoleSelection Component
**Location**: `src/components/RoleSelection.tsx`

A user interface component that allows new users to choose between Fan and Coach roles.

**Features**:
- Interactive role selection cards
- Detailed feature descriptions for each role
- Automatic navigation based on selected role
- Error handling for failed role updates

**Usage**:
```tsx
<RoleSelection
  userId="user-uuid"
  userEmail="user@example.com"
  onRoleSelected={(role) => console.log(`User selected: ${role}`)}
/>
```

### 2. ProtectedRoute Component
**Location**: `src/components/ProtectedRoute.tsx`

A wrapper component that protects routes based on user roles.

**Features**:
- Role-based access control
- Automatic redirects for unauthorized users
- Loading states during role verification
- Configurable redirect destinations

**Usage**:
```tsx
// Protect route for coaches only
<ProtectedRoute requiredRole="Coach" redirectTo="/login">
  <CoachDashboard />
</ProtectedRoute>

// Protect route for fans only
<ProtectedRoute requiredRole="Fan" redirectTo="/login">
  <UserDashboard />
</ProtectedRoute>

// Protect route for any authenticated user
<ProtectedRoute>
  <ProfileSettings />
</ProtectedRoute>
```

## Services

### RoleService
**Location**: `src/services/roleService.ts`

Provides functions for managing user roles and profiles.

**Functions**:
- `getUserRole(userId)`: Retrieve user's role from database
- `updateUserRole(userId, role)`: Update user's role
- `isCoach(userId)`: Check if user is a coach
- `isFan(userId)`: Check if user is a fan
- `createUserProfile(userId, email, role)`: Create new user profile

**Usage**:
```typescript
import { isCoach, updateUserRole } from '../services/roleService';

// Check if user is a coach
const isUserCoach = await isCoach(userId);

// Update user role
const success = await updateUserRole(userId, 'Coach');
```

## Authentication Flow

### New User Signup
1. User signs up through Google OAuth or email
2. `AuthCallback` component checks if user exists in database
3. If new user, shows `RoleSelection` component
4. User selects role (Fan or Coach)
5. Role is saved to database
6. User is redirected based on role:
   - **Fan**: `/user-dashboard`
   - **Coach**: `/team-setup`

### Existing User Login
1. User logs in through Google OAuth or email
2. `AuthCallback` component retrieves user role from database
3. User is redirected based on existing role:
   - **Fan**: `/user-dashboard`
   - **Coach**: `/coach-dashboard`

## Route Protection

### Protected Routes
The following routes are protected with role-based access:

**Coach-only routes**:
- `/coach-dashboard` - Coach dashboard
- `/team-setup` - Team creation and setup

**Fan-only routes**:
- `/user-dashboard` - User dashboard
- `/overview` - Overview page
- `/teams` - Teams list
- `/players` - Players list
- `/matches` - Matches list
- `/favorites` - Favorites page

**General protected routes**:
- `/profile-settings` - Profile settings (any authenticated user)

### Unprotected Routes
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/forgot` - Forgot password
- `/reset` - Reset password
- `/auth-callback` - OAuth callback

## Implementation Details

### Role Verification Process
1. **Session Check**: Verify user has valid authentication session
2. **Role Retrieval**: Query database for user's role
3. **Access Control**: Compare user's role with required role
4. **Navigation**: Allow access or redirect to appropriate page

### Error Handling
- **Authentication errors**: Redirect to login page
- **Database errors**: Log error and redirect to login
- **Role update failures**: Show error message to user
- **Network issues**: Graceful fallback with user feedback

### Performance Considerations
- Role information is cached during session
- Database queries are optimized with proper indexing
- Loading states provide user feedback during verification

## Testing

### Test Coverage
The system includes comprehensive tests for:
- Role selection component functionality
- Protected route access control
- Role service database operations
- Error handling and edge cases

### Running Tests
```bash
npm test
```

### Test Files
- `src/__test__/RoleSelection.test.tsx`
- `src/__test__/ProtectedRoute.test.tsx`
- `src/__test__/roleService.test.ts`
- `src/__test__/landingPage.test.tsx` (updated)
- `src/__test__/TeamSetup.test.tsx` (updated)

## Styling

### CSS Classes
The system uses modern CSS with:
- **Responsive design** for mobile and desktop
- **Gradient backgrounds** and modern aesthetics
- **Hover effects** and smooth transitions
- **Mobile-first approach** with breakpoints

### Key Style Files
- `src/components/RoleSelection.css` - Role selection styling
- `src/Styles/landingPage.css` - Landing page styling

## Security Considerations

### Role Validation
- Roles are validated against allowed values ('Fan', 'Coach')
- Database constraints prevent invalid role assignments
- Server-side validation ensures data integrity

### Access Control
- Routes are protected at the component level
- Role checks happen on every protected route access
- Unauthorized access attempts are logged and redirected

### Data Protection
- User roles are stored securely in Supabase
- Role information is only accessible to authenticated users
- No sensitive role data is exposed to the client

## Future Enhancements

### Potential Improvements
1. **Role Hierarchy**: Support for admin roles and permissions
2. **Dynamic Permissions**: Granular permission system
3. **Role Switching**: Allow users to change roles (with restrictions)
4. **Audit Logging**: Track role changes and access attempts
5. **Multi-team Support**: Coaches managing multiple teams

### Scalability
- Role system designed to handle multiple user types
- Database schema supports role expansion
- Component architecture allows easy role addition

## Troubleshooting

### Common Issues

**User stuck on role selection**:
- Check database connection
- Verify user record creation
- Check browser console for errors

**Role verification failing**:
- Ensure user has valid session
- Check database for user role record
- Verify role service functions

**Protected route access denied**:
- Confirm user has correct role
- Check route protection configuration
- Verify authentication state

### Debug Mode
Enable debug logging by checking browser console for:
- Role verification steps
- Database query results
- Navigation redirects
- Error messages

## Support

For issues or questions about the role verification system:
1. Check the test files for usage examples
2. Review the component implementations
3. Check browser console for error messages
4. Verify database schema and data integrity
