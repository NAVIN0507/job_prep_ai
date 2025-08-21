"use client";

import { Moon, Sun  , Monitor} from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const themes = [
  {
    name: "Light",
    value: "light",
    icon: <Sun className="h-4 w-4" />
  },
  {
    name: "Dark",
    value: "dark",
    icon: <Moon className="h-4 w-4" />
  },
  {
    name: "System",
    value: "system",
    icon: <Monitor className="h-4 w-4" />
  }
] as const;
export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem key={theme.value} onClick={() => setTheme(theme.value)}>
            {theme.icon}
            <span className="ml-2">{theme.name}</span>
          </DropdownMenuItem>
        ))}
        </DropdownMenuContent>
      
    </DropdownMenu>
  );
}
