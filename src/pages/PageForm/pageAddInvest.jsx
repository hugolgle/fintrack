"use client";

import { separateMillier } from "../../utils/fonctionnel";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Header from "../../composant/header";
import {
  addInvestment,
  fetchInvestments,
} from "../../service/investment.service";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "../../hooks/user.hooks";
import { Loader } from "lucide-react";

export default function PageAddInvest() {
  const { data: userInfo, isLoading: loadingUser } = useCurrentUser();

  const { data } = useQuery({
    queryKey: ["fetchInvestments"],
    queryFn: async () => {
      const response = await fetchInvestments(userInfo?._id);

      if (response?.response?.data?.message) {
        const message = response.response.data.message;
        toast.warn(message);
      }

      return response?.data;
    },
    refetchOnMount: true,
  });

  const suggestionsTitle = Array.from(
    new Set(data?.map((investment) => investment.title))
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedType, setSelectedType] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedDetail, setSelectedDetail] = useState("");
  const [selectedMontant, setSelectedMontant] = useState("");

  const addInvestmentMutation = useMutation({
    mutationFn: async (postData) => {
      const response = await addInvestment(postData, userInfo?._id);
      return response;
    },
    onSuccess: () => {
      resetForm();
      toast.success("Votre investissement a été ajouté !");
    },
    onError: () => {
      toast.error("Une erreur s'est produite lors de l'ajout de l'opération");
    },
  });

  useEffect(() => {
    if (selectedTitle) {
      const lastInvestment = data
        .filter((investment) => investment.title === selectedTitle)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

      if (lastInvestment) {
        setSelectedType(lastInvestment.type || "");
      }
    }
  }, [selectedTitle, data]);

  const resetForm = () => {
    setSelectedDetail("");
    setSelectedType("");
    setSelectedTitle("");
    setSelectedMontant("");
    setSelectedDate(new Date());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const postData = {
      user: userInfo?.id,
      type: selectedType,
      title: selectedTitle,
      detail: selectedDetail,
      date: new Date(selectedDate.setHours(0, 0, 0, 0)).toLocaleDateString(
        "fr-CA"
      ),
      amount: separateMillier(selectedMontant),
    };

    addInvestmentMutation.mutate(postData);
  };

  if (loadingUser) return <Loader />;

  return (
    <section className="h-full">
      <Header title="Ajouter un investissement" btnReturn />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-5 px-36 py-10 animate-fade"
      >
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
          value={selectedTitle}
          className="w-96 h-10 px-2 rounded-xl bg-colorSecondaryLight dark:bg-colorPrimaryDark"
          type="text"
          maxLength={50}
          placeholder="Titre"
          onChange={(e) => setSelectedTitle(e.target.value)}
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
