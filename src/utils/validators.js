// src/utils/validators.js

export const validateEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
  if (!password) return false;
  return password.length >= 8;
};

export const validateUsername = (username) => {
  if (!username) return false;
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
};