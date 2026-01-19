const TOKEN_KEY = "token";
const NAME_KEY = "name";

export function setAuth({ token, name }) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (name) localStorage.setItem(NAME_KEY, name);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getName() {
  return localStorage.getItem(NAME_KEY) || "Alex";
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NAME_KEY);
}