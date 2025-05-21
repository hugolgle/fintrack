import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Container from "../../../components/Container/Container";
import { Button } from "@/components/ui/button";
import { SheetEditProfile } from "../SheetEditProfile.jsx";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getInitials } from "../../../utils/users";
import parsePhoneNumberFromString from "libphonenumber-js";

function TabProfil({ dataUser, refetch }) {
  const initialName = getInitials(dataUser?.prenom, dataUser?.nom);
  const phone = dataUser?.phone ?? "Aucun téléphone";
  const phoneNumber = phone ? parsePhoneNumberFromString(phone, "FR") : null;
  const formatted = phoneNumber ? phoneNumber.formatInternational() : phone;
  return (
    <div className="flex flex-col gap-4">
      <Container>
        <CardHeader className="text-left p-0 pb-10">
          <CardTitle className="text-2xl font-bold">
            Informations personnelles
          </CardTitle>
          <CardDescription>Gérez vos informations personnelles</CardDescription>
        </CardHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="text-left">
              <h3 className="text-sm font-medium text-muted-foreground">Nom</h3>
              <p>
                {dataUser?.prenom} {dataUser?.nom}
              </p>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium text-muted-foreground">
                Email
              </h3>
              <p>{dataUser?.username}</p>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium text-muted-foreground">
                Téléphone
              </h3>
              <p>{formatted === null ? "Auncun telephone" : formatted}</p>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium text-muted-foreground">
                Adresse
              </h3>
              <p>
                {dataUser?.address
                  ? `${dataUser?.address}, ${dataUser.city} ${dataUser.zipcode}`
                  : "Aucune adresse"}
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <SheetEditProfile dataProfil={dataUser} refetch={refetch} />
          </div>
        </div>
      </Container>
      <Container>
        <CardHeader className="text-left p-0 pb-10">
          <CardTitle className="text-2xl font-bold">Photo de profil</CardTitle>
          <CardDescription>Modifiez votre photo de profil</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Avatar className="size-24">
            {dataUser?.img ? (
              <img
                src={dataUser.img}
                alt="User Avatar"
                className="object-cover w-full h-full rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <AvatarFallback className="bg-secondary">
                {initialName}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex gap-2">
            <Button variant="outline">Changer la photo</Button>
            <Button variant="outline" className="text-destructive">
              Supprimer
            </Button>
          </div>
        </CardContent>
      </Container>
    </div>
  );
}

export default TabProfil;
