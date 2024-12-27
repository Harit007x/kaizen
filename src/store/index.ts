import { create } from 'zustand';

interface IUserData {
  id: string;
  firstName: string;
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

interface TaskDialogStore {
  isTaskDialogOpen: boolean;
  setIsTaskDialogOpen: (state: boolean) => void;
}

export const taskDialogStore = create<TaskDialogStore>((set) => ({
  isTaskDialogOpen: false,
  setIsTaskDialogOpen: (state) => set({ isTaskDialogOpen: state }),
}));
