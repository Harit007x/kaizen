import { create } from 'zustand';

interface IUserData {
  name: string;
  email: string;
  profilePicture: string;
}

interface UserStore {
  user: IUserData | null;
  setUserData: (userData: IUserData) => void;
}

export const userStore = create<UserStore>((set) => ({
  user: null,
  setUserData: (userData: IUserData) =>
    set({
      user: userData,
    }),
}));
