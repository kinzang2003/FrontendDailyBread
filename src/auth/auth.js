export function getUser() {
  const stored = localStorage.getItem("user");
  if (!stored) return null;

  const user = JSON.parse(stored);

  // Ensure there's a 'role' property for easier checks
  if (!user.role && Array.isArray(user.authorities)) {
    user.role = user.authorities[0]?.authority;
  }

  return user;
}

export const isAuthenticated = () => {
  return !!localStorage.getItem("user");
};

export const login = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = () => {
  localStorage.removeItem("user");
};
