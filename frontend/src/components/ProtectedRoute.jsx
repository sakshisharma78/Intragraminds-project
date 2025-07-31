// ProtectedRoute.jsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Assuming you're using Redux for authentication

/**
 * ProtectedRoute Component
 *
 * This component acts as a guard for routes that require authentication.
 * It checks the authentication status (e.g., from Redux store) and
 * either renders the child routes (via <Outlet />) if the user is authenticated,
 * or redirects the user to the login page if they are not.
 *
 * @returns {JSX.Element} The rendered child routes or a redirect to the login page.
 */
const ProtectedRoute = () => {
  // TODO: Replace this with your actual authentication logic.
  // For now, we'll simulate authentication.
  // In a real application, you'd likely get `isAuthenticated` from your Redux store,
  // a Context API, or a custom authentication hook.

  // Example using Redux:
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // const isLoadingAuth = useSelector((state) => state.auth.isLoading); // If you have a loading state

  // For demonstration, let's assume a simple boolean or check for a token.
  // You might check if a user token exists in localStorage or a Redux state.
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Assuming auth state in Redux

  // You might also want to handle a loading state if authentication check is asynchronous
  // if (isLoadingAuth) {
  //   return <div>Loading authentication...</div>; // Or a spinner
  // }

  // If the user is authenticated, render the child routes
  if (isAuthenticated) {
    return <Outlet />;
  } else {
    // If not authenticated, redirect them to the login page
    // The `replace` prop ensures that the login page replaces the current entry in the history stack,
    // so the user can't just hit the back button to bypass the login.
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;

