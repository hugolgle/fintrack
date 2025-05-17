import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { logoutUser } from "../service/user.service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ROUTES } from "./Routes";

const TokenExpirationPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  const { mutate } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      sessionStorage.removeItem("token");
      toast.success("Vous avez été déconnecté !");
    },
    onError: (error) => {
      toast.error("Erreur de déconnexion: " + error.message);
    },
  });

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = sessionStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            setShowPopup(true);
            sessionStorage.removeItem("token");
            mutate();
          }
        } catch (error) {
          console.error("Token invalide :", error);
        }
      }
    };

    const interval = setInterval(checkTokenExpiration, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLoginRedirect = () => {
    window.location.href = ROUTES.LOGIN;
  };

  if (!showPopup) return null;

  return (
    <Dialog open={showPopup}>
      <DialogContent className="sm:max-w-[425px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Votre session a expiré !</DialogTitle>
          <DialogDescription>
            Veuillez vous identifiez a nouveau
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleLoginRedirect}>Se reconnecter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TokenExpirationPopup;
