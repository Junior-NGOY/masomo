import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type School = {
  id: string;
  name: string;
  logo: string | null;
  slug: string;
};

interface SchoolState {
  school: School | null;
  setSchool: (school: School | null) => void;
  //addSchool: (schoolData: Omit<School, "id">) => void;
  //getSchoolBySlug: (slug: string) => School | undefined;
}

const useSchoolStore = create<SchoolState>()(
  persist(
    (set) => ({
      // Données par défaut pour le mode démo
      school: {
        id: "school_demo_123",
        name: "École Demo",
        logo: "/images/logo.png",
        slug: "ecole-demo"
      },
      setSchool: (school) => set({ school })
    }),
    {
      name: "school-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ school: state.school })
    }
  )
);

export default useSchoolStore;

// Example usage in a component:
/*
import useSchoolStore from './your-store-file';

const MyComponent = () => {
  const { addSchool, getSchoolBySlug } = useSchoolStore();

  const handleAddSchool = () => {
    addSchool({ name: 'New School', logo: null, slug: 'new-school' });
  };

  const schoolBySlug = getSchoolBySlug('new-school');

  return (
    <div>
      <button onClick={handleAddSchool}>Add School</button>
      {schoolBySlug && <p>School by slug: {schoolBySlug.name}</p>}
    </div>
  );
};
*/
