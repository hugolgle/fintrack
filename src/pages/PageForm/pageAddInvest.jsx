"use client";

import { separateMillier } from "../../utils/fonctionnel";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { infoUser } from "../../utils/users";
import {
  addInvestments,
  getInvestments,
} from "../../redux/actions/investment.action";
import BtnReturn from "../../composant/Button/btnReturn";
import { getAllInvestments } from "../../utils/operations";
import Title from "../../composant/Text/title";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react"; // Import de l'icône de calendrier
import { format } from "date-fns"; // Pour formater la date
import { fr } from "date-fns/locale"; // Locale française pour la date
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import MainLayout from "../../layout/mainLayout";
import Header from "../../composant/header";

export default function PageAddInvest() {
  const userInfo = infoUser();
  const getInvest = getAllInvestments(null);
  const suggestionsTitle = Array.from(
    new Set(getInvest.map((investment) => investment.titre))
  );

  const [selectedDate, setSelectedDate] = useState(new Date()); // Utilisation de la date actuelle par défaut
  const [selectedType, setSelectedType] = useState("");
  const [selectedTitre, setSelectedTitre] = useState("");
  const [selectedDetail, setSelectedDetail] = useState("");
  const [selectedMontant, setSelectedMontant] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedTitre) {
      const lastInvestment = getInvest
        .filter((investment) => investment.titre === selectedTitre)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

      if (lastInvestment) {
        setSelectedType(lastInvestment.type || "");
      }
    }
  }, [selectedTitre, getInvest]);

  const resetForm = () => {
    setSelectedDetail("");
    setSelectedType("");
    setSelectedTitre("");
    setSelectedMontant("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const postData = {
      user: userInfo.id,
      type: selectedType,
      titre: selectedTitre,
      detail: selectedDetail,
      date: selectedDate.toISOString().split("T")[0], // Envoi de la date au format ISO
      montant: separateMillier(selectedMontant),
    };

    try {
      await dispatch(addInvestments(postData));
      dispatch(getInvestments());
      resetForm();
      toast.success("Votre investissement a été ajouté !");
    } catch {
      toast.error("Une erreur s'est produite lors de l'ajout de l'opération");
    }
  };

  return (
    <section className="h-full">
      <Header title="Ajouter un investissement" btnReturn />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-5 px-36 py-10 animate-fade"
      >
        {/* Input pour la date avec calendrier */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-96 h-10 px-2 rounded-xl bg-colorSecondaryLight dark:bg-colorPrimaryDark text-left font-normal"
            >
              {selectedDate ? (
                format(selectedDate, "PPP", { locale: fr })
              ) : (
                <span>Choisir une date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto rounded-xl bg-colorSecondaryLight dark:bg-[#1a1a1a] p-0"
            align="start"
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date("1900-01-01")}
              locale={fr}
            />
          </PopoverContent>
        </Popover>

        <Input
          list="title-suggestions"
          value={selectedTitre}
          className="w-96 h-10 px-2 rounded-xl bg-colorSecondaryLight dark:bg-colorPrimaryDark"
          type="text"
          maxLength={50}
          placeholder="Titre"
          onChange={(e) => setSelectedTitre(e.target.value)}
          required
        />

        <datalist id="title-suggestions">
          {suggestionsTitle.map((suggestion, index) => (
            <option key={index} value={suggestion} />
          ))}
        </datalist>

        <Select
          value={selectedType}
          onValueChange={(value) => setSelectedType(value)}
          required
        >
          <SelectTrigger className="w-96 h-10 px-2 rounded-xl bg-colorSecondaryLight dark:bg-colorPrimaryDark">
            <SelectValue placeholder="Entrez la catégorie" />
          </SelectTrigger>
          <SelectContent className="bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl">
            <SelectItem className="rounded-xl" value="Action">
              Action
            </SelectItem>
            <SelectItem className="rounded-xl" value="ETF">
              ETF
            </SelectItem>
            <SelectItem className="rounded-xl" value="Crypto">
              Crypto
            </SelectItem>
            <SelectItem className="rounded-xl" value="Obligation">
              Obligation
            </SelectItem>
            <SelectItem className="rounded-xl" value="Dérivé">
              Dérivé
            </SelectItem>
          </SelectContent>
        </Select>

        <Textarea
          value={selectedDetail}
          className="w-96 h-10 px-2 rounded-xl bg-colorSecondaryLight dark:bg-colorPrimaryDark"
          placeholder="Détails"
          maxLength={250}
          onChange={(e) => setSelectedDetail(e.target.value)}
        />

        <Input
          value={selectedMontant}
          className="w-96 h-10 px-2 rounded-xl bg-colorSecondaryLight dark:bg-colorPrimaryDark"
          type="number"
          min="0"
          step="0.01"
          placeholder="Montant"
          onChange={(e) => setSelectedMontant(e.target.value)}
          required
        />

        <Button variant="outline" className="rounded-xl ">
          Soumettre l'investissement
        </Button>
      </form>
    </section>
  );
}
