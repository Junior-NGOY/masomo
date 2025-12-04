import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SchoolLevel = 'MATERNELLE' | 'PRIMAIRE' | 'SECONDAIRE' | 'PROFESSIONNEL' | 'ALL';

interface LevelState {
  currentLevel: SchoolLevel;
  availableLevels: SchoolLevel[];
  setLevel: (level: SchoolLevel) => void;
  setAvailableLevels: (levels: SchoolLevel[]) => void;
}

export const useLevelStore = create<LevelState>()(
  persist(
    (set) => ({
      currentLevel: 'ALL',
      availableLevels: ['MATERNELLE', 'PRIMAIRE', 'SECONDAIRE', 'PROFESSIONNEL'],
      setLevel: (level) => set({ currentLevel: level }),
      setAvailableLevels: (levels) => set({ availableLevels: levels }),
    }),
    {
      name: 'school-level-storage',
    }
  )
);
