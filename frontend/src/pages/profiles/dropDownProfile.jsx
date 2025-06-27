"use client";

import { LogOut, User, Moon, Sun, SunMoon, Settings } from "lucide-react";
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
import { useTheme } from "../../context/themeContext.jsx";
import { ROUTES } from "../../components/route.jsx";

export function DropdownProfil({ btnOpen, handleLogout, dataUser }) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const handleProfileClick = () => {
    setOpen(false);
    navigate(ROUTES.PROFILE);
  };

  const handleSettingsClick = () => {
    setOpen(false);
    navigate(ROUTES.SETTINGS);
  };

  const handleThemeChange = (value) => {
    setTheme(value);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{btnOpen}</DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="mb-4">
        <DropdownMenuLabel>{dataUser?.username}</DropdownMenuLabel>
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
            <DropdownMenuSubContent
              className="mb-4"
              side="left"
              align="end"
              sideOffset={5}
            >
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
