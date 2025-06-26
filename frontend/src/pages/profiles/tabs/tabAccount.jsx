import React, { useState } from "react";
import Container from "../../../components/containers/container.jsx";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash } from "lucide-react";

function TabAccount({ dataUser, refetch }) {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <Container>
        <CardHeader className="text-left p-0 pb-10">
          <CardTitle className="text-2xl font-bold">
            Informations du compte
          </CardTitle>
          <CardDescription>Détails de votre compte FinTrack</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-left">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                ID du compte
              </h3>
              <p className="font-mono text-sm">{dataUser._id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Date de création
              </h3>
              <p>
                {new Date(dataUser?.createdAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Type de compte
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Premium</Badge>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Statut
              </h3>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">Actif</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Container>
      <Container>
        <CardHeader className="text-left p-0 pb-10">
          <CardTitle className="text-2xl font-bold">
            Abonnement et facturation
          </CardTitle>
          <CardDescription>
            Gérez votre abonnement et vos informations de facturation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-left">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Plan actuel
              </h3>
              <p className="font-medium">Premium - 29,99€/mois</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Prochaine facturation
              </h3>
              <p>15 juin 2025</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Méthode de paiement
              </h3>
              <p>•••• •••• •••• 1234 (Visa)</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Renouvellement automatique
              </h3>
              <Badge variant="outline">Activé</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Changer de plan</Button>
            <Button variant="outline">Modifier le paiement</Button>
            <Button variant="outline">Voir les factures</Button>
          </div>
        </CardContent>
      </Container>
      <Container>
        <CardHeader className="text-left p-0 pb-10">
          <CardTitle className="text-2xl font-bold text-red-500">
            Zone de danger
          </CardTitle>
          <CardDescription>
            Actions irréversibles concernant votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-destructive bg-destructive/20 p-4 text-left">
            <h3 className="font-medium text-red-800">Supprimer mon compte</h3>
            <p className="mt-1 text-sm text-red-600">
              Cette action est irréversible. Toutes vos données seront
              définitivement supprimées.
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-red-800">
                Avant de supprimer votre compte :
              </p>
              <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                <li>Exportez vos données importantes</li>
                <li>Annulez votre abonnement actif</li>
                <li>Sauvegardez vos rapports financiers</li>
              </ul>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <Checkbox
                id="confirm-delete"
                checked={checked}
                onCheckedChange={() => {
                  setChecked(!checked);
                }}
              />
              <Label htmlFor="confirm-delete" className="text-sm text-red-600">
                Je comprends que cette action est irréversible
              </Label>
            </div>
            <Button variant="destructive" className="mt-4" disabled={!checked}>
              <Trash className="mr-2 h-4 w-4" />
              Supprimer définitivement mon compte
            </Button>
          </div>
        </CardContent>
      </Container>
    </div>
  );
}

export default TabAccount;
