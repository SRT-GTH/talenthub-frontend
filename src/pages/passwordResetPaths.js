/*
 * Where an account signs in after a password reset: staff (Platform Admin) at /admin/sign-in, everyone else at /login.
 * The admin sign-in's "Forgot password?" and staff reset emails add ?for=staff; the backend's reset answer names the path too.
 */
export const STAFF_SIGN_IN = '/admin/sign-in';
export const signInPathFromSearch = (params) =>
  params.get('for') === 'staff' ? STAFF_SIGN_IN : '/login';
