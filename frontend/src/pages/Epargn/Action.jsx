import React from "react";
import Header from "../../components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { ROUTES } from "../../components/Routes";

export default function EpargnAction() {
  const navigate = useNavigate();

  return (
    <section className="w-full">
      <Header title="Action" btnReturn />
      <div className="flex flex-col w-80 gap-4 h-full items-center justify-center mx-auto animate-fade">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate(ROUTES.ADD_TRANSFERT)}
        >
          Virement
        </Button>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => navigate(ROUTES.ADD_DEPOSIT)}
        >
          Dépôt
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate(ROUTES.ADD_WITHDRAW)}
        >
          Retrait
        </Button>
      </div>
    </section>
  );
}
