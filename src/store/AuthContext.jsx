import { create } from 'zustand';

// Use Zustand to manage auth without Context Provider
const getStoredUser = () => {
  const storedUser = localStorage.getItem('inventoryUser');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const useAuth = create((set) => ({
  user: getStoredUser(),

  login: (email, password) => {
    const fakeUser = {
      id: 1,
      email: email,
      name: 'Admin User',
    };
    set({ user: fakeUser });
    localStorage.setItem('inventoryUser', JSON.stringify(fakeUser));
    return true;
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem('inventoryUser');
  }
}));
