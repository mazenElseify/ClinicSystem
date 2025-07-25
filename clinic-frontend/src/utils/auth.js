// src/utils/auth.js

export const isAuthenticated = () => {
  return !!localStorage.getItem('user');
};

export const logout = () => {
  localStorage.removeItem('user');
};
