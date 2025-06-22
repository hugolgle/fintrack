import React from "react";
import Container from "../../../components/containers/container";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import {
  BookOpen,
  FileText,
  GraduationCap,
  MessageCircle,
  Newspaper,
  Phone,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

function TabSupport() {
  return (
    <div className="flex flex-col gap-4">
      <Container>
        <CardHeader className="text-left p-0 pb-10">
          <CardTitle className="text-2xl font-bold">Centre d'aide</CardTitle>
          <CardDescription>
            Trouvez des réponses à vos questions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-left">Questions fréquentes</h3>
            <div className="space-y-2 rounded-md border p-4 text-left">
              <div className="cursor-pointer">
                <h4 className="font-medium">
                  Comment modifier mes informations personnelles ?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Accédez à l'onglet "Profil" et cliquez sur "Modifier les
                  informations".
                </p>
              </div>
              <div className="mt-2 cursor-pointer border-t pt-2">
                <h4 className="font-medium">
                  Comment activer l'authentification à deux facteurs ?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Rendez-vous dans l'onglet "Sécurité" et activez l'option
                  correspondante.
                </p>
              </div>
              <div className="mt-2 cursor-pointer border-t pt-2">
                <h4 className="font-medium">
                  Comment changer la langue de l'application ?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Allez dans l'onglet "Paramètres" et sélectionnez votre langue
                  préférée.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Documentation</h3>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <Button variant="outline" className="justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Guide d'utilisation
              </Button>
              <Button variant="outline" className="justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Tutoriels vidéo
              </Button>
              <Button variant="outline" className="justify-start">
                <GraduationCap className="mr-2 h-4 w-4" />
                Centre de formation
              </Button>
              <Button variant="outline" className="justify-start">
                <Newspaper className="mr-2 h-4 w-4" />
                Nouveautés
              </Button>
            </div>
          </div>
        </CardContent>
      </Container>
      <Container>
        <CardHeader className="text-left p-0 pb-10">
          <CardTitle className="text-2xl font-bold">Contactez-nous</CardTitle>
          <CardDescription>Notre équipe est là pour vous aider</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="language">Sujet</Label>
            <Select name="language">
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="fr" value="fr">
                  Question générale
                </SelectItem>
                <SelectItem key="en" value="en">
                  Problème technique
                </SelectItem>
                <SelectItem key="es" value="es">
                  Demande de fonctionnalité
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea name="message" placeholder="Message" />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="attach-logs"
              name="attach-logs"
              className="cursor-pointer"
            />
            <Label htmlFor="attach-logs">Joindre les journaux système</Label>
          </div>
          <div className="flex justify-end">
            <Button>Envoyer le message</Button>
          </div>
          <div className="mt-4 flex items-center justify-end gap-x-4">
            <Button variant="outline" size="sm">
              <Phone className="mr-2 h-4 w-4" />
              Assistance téléphonique
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat en direct
            </Button>
          </div>
        </CardContent>
      </Container>
    </div>
  );
}

export default TabSupport;
