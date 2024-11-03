"use client";

import { LogOut, Settings, User, Moon, Sun, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
  DropdownMenuSubContent,
  DropdownMenuRadioItem,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { ROUTES } from "./routes";
import { Highlighter } from "lucide-react";
import { Paintbrush } from "lucide-react";

export function DropdownProfil({ btnOpen, handleLogout }) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const handleProfileClick = () => {
    setOpen(false);
    navigate(ROUTES.PROFILE);
  };

  const handleMarkClick = () => {
    setOpen(false);
    navigate(ROUTES.MARK);
  };

  const handleThemeChange = (value) => {
    setTheme(value);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="none" className="p-0 h-fit truncate">
          {btnOpen}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="mb-4">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleProfileClick}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profil</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" onClick={handleMarkClick}>
          <Highlighter className="mr-2 h-4 w-4" />
          <span>Marque</span>
        </DropdownMenuItem>

        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SunMoon className="mr-2 h-4 w-4" />
              <span>Thème</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent side="left" align="end" sideOffset={5}>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={handleThemeChange}
              >
                <DropdownMenuRadioItem value="dark">
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Sombre</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="light">
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Clair</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="custom">
                  <Paintbrush className="mr-2 h-4 w-4" />
                  <span>Custom</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            setOpen(false);
            handleLogout();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
