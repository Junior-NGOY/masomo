import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, UserRole } from "@/types/types";
import { logout } from "@/actions/auth";

//session data type
export interface SessionData {
  user: User;
  accessToken: string;
  refreshToken: string;
}
//store interface
interface UserSessionStore {
  user: User | null;
  setUser: (userData: User) => Promise<void>;
  clearSession: () => Promise<void>;
}
interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
}
//create zustand store persistence
export const useUserSession = create<UserSessionStore>()(
  persist(
    (set) => ({
      // Données par défaut vides
      user: null,
      //Method to set user session via server action
      setUser: async (userData) => {
        try {
          set({ user: userData });
        } catch (error) {
          console.log("session creation error:", error);
          //optionaly handle error(e.g show notification)
        }
      },
      //Method to clear session via sever action
      clearSession: async () => {
        try {
          // Mode démo - pas d'appel API pour logout
          console.log("Déconnexion en mode démo");
          // reset user avec les données démo par défaut
          set({ 
            user: {
              id: "user_demo_123",
              name: "Administrateur Demo",
              email: "demo@masomo.com",
              role: UserRole.ADMIN,
              schoolId: "school_demo_123",
              schoolName: "École Demo",
              image: "/avatars/shadcn.jpg",
              phone: "+243 999 999 999",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            } as User 
          });
        } catch (error) {
          console.log("Logout error:", error);
          //optionally handle error (e.g,  show notification)
        }
      }
    }),
    { name: "user-session", partialize: (state) => ({ user: state.user }) }
  )
);
