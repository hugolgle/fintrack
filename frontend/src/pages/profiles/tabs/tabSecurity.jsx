import React from "react";
import Container from "../../../components/containers/container";
import { KeyIcon, ShieldIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

function TabSecurity() {
  return (
    <div className="flex flex-col gap-4">
      <Container>
        <CardHeader className="text-left p-0 pb-10">
          <CardTitle className="text-2xl font-bold">
            Sécurité du compte
          </CardTitle>
          <CardDescription>Gérez la sécurité de votre compte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-left">
            <div>
              <h3 className="font-medium">Authentification à deux facteurs</h3>
              <p className="text-sm text-muted-foreground">
                Sécurisez votre compte avec 2FA
              </p>
            </div>
            <Switch id="2fa" />
          </div>
          <div className="flex gap-4 justify-end">
            <Button variant="outline">
              <KeyIcon className="mr-2 h-4 w-4" />
              Changer le mot de passe
            </Button>
            <Button variant="outline">
              <ShieldIcon className="mr-2 h-4 w-4" />
              Vérifier les appareils connectés
            </Button>
          </div>
        </CardContent>
      </Container>
      <Container>
        <CardHeader className="text-left p-0 pb-10">
          <CardTitle className="text-2xl font-bold">Confidentialité</CardTitle>
          <CardDescription>
            Gérez vos paramètres de confidentialité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-left">
            <div>
              <h3 className="font-medium">Partage des données d'utilisation</h3>
              <p className="text-sm text-muted-foreground">
                Nous aider à améliorer nos services
              </p>
            </div>
            <Switch id="data-sharing" defaultChecked />
          </div>
          <div className="flex items-center justify-between text-left">
            <div>
              <h3 className="font-medium">Cookies marketing</h3>
              <p className="text-sm text-muted-foreground">
                Permettre les cookies de marketing
              </p>
            </div>
            <Switch id="marketing-cookies" />
          </div>
          <div className="flex justify-end">
            <Button variant="outline">Télécharger mes données</Button>
          </div>
        </CardContent>
      </Container>
    </div>
  );
}

export default TabSecurity;
