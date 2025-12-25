"use client";

import useSchoolStore, { School } from "@/store/school";
import { useEffect } from "react";

export default function SchoolInitializer({ school }: { school: School | null }) {
  const { setSchool } = useSchoolStore();
  
  useEffect(() => {
    if (school) {
      setSchool(school);
    }
  }, [school, setSchool]);

  return null;
}
