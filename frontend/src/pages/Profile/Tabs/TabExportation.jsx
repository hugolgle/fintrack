import React from "react";
import Container from "../../../components/Container/Container";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function TabExportation() {
  return (
    <div className="flex flex-col gap-4">
      <Container>
        <CardHeader className="text-left p-0 pb-10">
          <CardTitle className="text-2xl font-bold">
            Exportation des données
          </CardTitle>
          <CardDescription>
            Exportez vos données financières dans différents formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-left">Exportation rapide</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4 text-left">
                <h4 className="mb-2 font-medium">Mois en cours</h4>
                <p className="mb-4 text-sm text-muted-foreground">
                  Exporter les données du mois actuel
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    Excel
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border p-4 text-left">
                <h4 className="mb-2 font-medium">Trimestre en cours</h4>
                <p className="mb-4 text-sm text-muted-foreground">
                  Exporter les données du trimestre actuel
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    Excel
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border p-4 text-left">
                <h4 className="mb-2 font-medium">Année en cours</h4>
                <p className="mb-4 text-sm text-muted-foreground">
                  Exporter les données de l'année actuelle
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    Excel
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-left">
              Exportation personnalisée
            </h3>
            <div className="rounded-lg border p-4 text-left">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="date-from">Date de début</Label>
                  <Input
                    type="date"
                    id="date-from"
                    className="mt-1 w-full rounded-md border p-2"
                  />
                </div>
                <div>
                  <Label htmlFor="date-to">Date de fin</Label>
                  <Input
                    type="date"
                    id="date-to"
                    className="mt-1 w-full rounded-md border p-2"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label>Types de données</Label>
                <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="transactions"
                    
                      defaultChecked
                    />
                    <Label htmlFor="transactions">Transactions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="revenus"
                    
                      defaultChecked
                    />
                    <Label htmlFor="revenus">Revenus</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="depenses"
                    
                      defaultChecked
                    />
                    <Label htmlFor="depenses">Dépenses</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="budgets" />
                    <Label htmlFor="budgets">Budgets</Label>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Label>Format d'exportation</Label>
                <div className="mt-2 flex gap-2">
                  <Button variant="outline">CSV</Button>
                  <Button variant="outline">PDF</Button>
                  <Button variant="outline">Excel</Button>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" className="mt-4">
                  Exporter les données
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Container>
      <Container>
        <CardHeader className="text-left p-0 pb-10">
          <CardTitle className="text-2xl font-bold">
            Historique des exportations
          </CardTitle>
          <CardDescription>
            Consultez et téléchargez vos exportations précédentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: 1,
                date: "22 Mai 2025",
                type: "Mois en cours",
                format: "PDF",
                taille: "1.2 MB",
              },
              {
                id: 2,
                date: "15 Mai 2025",
                type: "Personnalisé",
                format: "Excel",
                taille: "3.5 MB",
              },
              {
                id: 3,
                date: "1 Mai 2025",
                type: "Trimestre en cours",
                format: "CSV",
                taille: "0.8 MB",
              },
            ].map((export_item) => (
              <div
                key={export_item.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="text-left">
                  <p className="font-medium">{export_item.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {export_item.date} • {export_item.taille}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{export_item.format}</Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Container>
      <Container>
        <CardHeader className="text-left p-0 pb-10">
          <CardTitle className="text-2xl font-bold">
            Exportation automatique
          </CardTitle>
          <CardDescription>
            Planifiez des exportations régulières de vos données
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="font-medium">Exportation mensuelle</h3>
              <p className="text-sm text-muted-foreground">
                Recevoir un export CSV de vos données chaque mois
              </p>
            </div>
            <Switch id="monthly-export" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="font-medium">Exportation trimestrielle</h3>
              <p className="text-sm text-muted-foreground">
                Recevoir un export PDF de vos données chaque trimestre
              </p>
            </div>
            <Switch id="quarterly-export" />
          </div>
          <div className="flex justify-end">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Configurer les exportations automatiques
            </Button>
          </div>
        </CardContent>
      </Container>
    </div>
  );
}

export default TabExportation;
