import React from "react";
import Container from "../../../components/Container/Container";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import { CircleCheck, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "../../../Context/ThemeContext";

function TabSettings() {
  const { theme, setTheme } = useTheme();
  const { backgroundColor, setBackgroundColor } = useTheme();
  const backgroundColors = [
    { name: "red", code: "#ef444439" },
    { name: "blue", code: "#3b82f639" },
    { name: "green", code: "#22c55e39" },
    { name: "yellow", code: "#fbbf2439" },
    { name: "purple", code: "#9333ea39" },
    { name: "white", code: "#ffffff27" },
    { name: "black", code: "#00000039" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Container>
        <CardHeader className="text-left p-0 pb-10">
          <CardTitle className="text-2xl font-bold">
            Préférences générales
          </CardTitle>
          <CardDescription>Gérez vos préférences d'utilisation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="font-medium">Notifications par email</h3>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications par email
              </p>
            </div>
            <Switch id="email-notifications" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="font-medium">Notifications push</h3>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications sur votre appareil
              </p>
            </div>
            <Switch id="push-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="font-medium">Mode sombre</h3>
              <p className="text-sm text-muted-foreground">
                Utiliser le thème sombre
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === "dark"}
              onCheckedChange={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="font-medium">Couleur</h3>
              <p className="text-sm text-muted-foreground">
                Choisissez votre couleur préférée
              </p>
            </div>
            <div className="flex gap-2">
              {backgroundColors.map((color) => (
                <CheckboxPrimitive.Root
                  checked={backgroundColor === color.code}
                  className={`h-8 w-8 rounded-full ${
                    color.name === "white" || color.name === "black"
                      ? ""
                      : `bg-${color.name}-500 text-${color.name}-500`
                  }`}
                  onClick={() => {
                    setBackgroundColor(color.code);
                  }}
                >
                  <CheckboxPrimitive.Indicator className="h-full w-full flex items-center justify-center">
                    <CircleCheck className="h-5 w-5 fill-white stroke-current" />
                  </CheckboxPrimitive.Indicator>
                </CheckboxPrimitive.Root>
              ))}
            </div>
          </div>
        </CardContent>
      </Container>
      <Container>
        <CardHeader className="text-left p-0 pb-10">
          <CardTitle className="text-2xl font-bold">Langue et région</CardTitle>
          <CardDescription>
            Définissez vos préférences régionales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="language">Langue</Label>
              <Select name="language">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="fr" value="fr">
                    Français
                  </SelectItem>
                  <SelectItem key="en" value="en">
                    English
                  </SelectItem>
                  <SelectItem key="es" value="es">
                    Español
                  </SelectItem>
                  <SelectItem key="de" value="de">
                    Deutsch
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Select name="timezone">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="europe-paris" value="europe-paris">
                    Europe/Paris (UTC+1)
                  </SelectItem>
                  <SelectItem key="europe-london" value="europe-london">
                    Europe/London (UTC+0)
                  </SelectItem>
                  <SelectItem key="america-new_york" value="america-new_york">
                    America/New_York (UTC-5)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Container>
    </div>
  );
}

export default TabSettings;
