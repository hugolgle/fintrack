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
import { useCurrentUser } from "../hooks/user.hooks";
import { Loader } from "lucide-react";

export function DropdownProfil({ btnOpen, handleLogout }) {
  const userId = localStorage.getItem("userId");
  const { data: userInfo, isLoading } = useCurrentUser(userId);
  if (isLoading) {
    return <Loader />;
  }
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const handleProfileClick = () => {
    setOpen(false);
    navigate(ROUTES.PROFILE);
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
      <DropdownMenuContent className="ml-3">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={handleProfileClick}
        >
          <User className="mr-2 h-4 w-4" />
          <span>Profil</span>
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
