"use client";

import * as React from "react";
import { Check, ChevronsUpDown, School } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLevelStore, SchoolLevel } from "@/store/level-store";
import { UserRole } from "@/types/types";

interface LevelSwitcherProps {
  userRole?: UserRole;
}

const levels: { value: SchoolLevel; label: string }[] = [
  { value: "ALL", label: "Vue Globale" },
  { value: "MATERNELLE", label: "Maternelle" },
  { value: "PRIMAIRE", label: "Primaire" },
  { value: "SECONDAIRE", label: "Secondaire" },
  { value: "PROFESSIONNEL", label: "Professionnel" },
];

export function LevelSwitcher({ userRole }: LevelSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const { currentLevel, setLevel } = useLevelStore();

  // Only ADMIN or SUPER_ADMIN can switch levels
  const canSwitch = userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN;

  if (!canSwitch) {
    // For non-admins, we might want to just show the current level badge or nothing
    // Assuming the level is set correctly on login for them
    return null; 
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <School className="mr-2 h-4 w-4" />
          {currentLevel === "ALL"
            ? "Vue Globale"
            : levels.find((level) => level.value === currentLevel)?.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Choisir un niveau..." />
          <CommandList>
            <CommandEmpty>Aucun niveau trouvé.</CommandEmpty>
            <CommandGroup>
              {levels.map((level) => (
                <CommandItem
                  key={level.value}
                  value={level.value}
                  onSelect={(currentValue) => {
                    setLevel(level.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentLevel === level.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {level.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
