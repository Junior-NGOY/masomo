"use client";

import useSchoolStore, { School } from "@/store/school";
import { useUserSession } from "@/store/auth";
import { User } from "@/types/types";
import { useEffect } from "react";

interface SchoolInitializerProps {
  school: School | null;
  user: User | null;
}

export default function SchoolInitializer({ school, user }: SchoolInitializerProps) {
  const { setSchool } = useSchoolStore();
  const { setUser } = useUserSession();
  
  useEffect(() => {
    // Always sync the store with the server state
    setSchool(school);
    
    // Sync user session
    if (user) {
      setUser(user);
    }
  }, [school, user, setSchool, setUser]);

  return null;
}
