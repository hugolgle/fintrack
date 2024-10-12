"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  categoryRecette,
  categoryDepense,
} from "../../../public/categories.json";
import { formatMontant } from "../../utils/fonctionnel";
import { useState, useEffect } from "react";
import { categorySort, nameType, normalizeText } from "../../utils/other";
import {
  getLatestTransactionByTitle,
  getTitleOfTransactionsByType,
} from "../../utils/operations";
import { fr } from "date-fns/locale";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom"; // Corriger l'import de useNavigate
import { Button } from "@/components/ui/button";
import Header from "../../composant/header";
import {
  addTransaction,
  fetchTransactions,
} from "../../service/transaction.service";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "../../hooks/user.hooks";
import Loader from "../../composant/loader";

// Schéma de validation pour la date
const FormSchema = z.object({
  date: z.date({
    required_error: "Une date est requise.",
  }),
});

export default function PageAddTransac(props) {
  const userId = localStorage.getItem("userId");
  const { data: userInfo, isLoading: loadingUser } = useCurrentUser(userId);

  const { data } = useQuery({
    queryKey: ["fetchTransactions"],
    queryFn: async () => {
      const response = await fetchTransactions(userId);

      if (response?.response?.data?.message) {
        const message = response.response.data.message;
        toast.warn(message);
      }

      return response?.data;
    },
  });

  const categoryD = categorySort(categoryDepense);
  const categoryR = categorySort(categoryRecette);

  const suggestions = getTitleOfTransactionsByType(data, props.type);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(), // Valeur par défaut pour la date
    },
  });

  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDetail, setSelectedDetail] = useState("");
  const [selectedMontant, setSelectedMontant] = useState("");

  const navigate = useNavigate();

  const lastTransacByTitle = getLatestTransactionByTitle(
    data,
    selectedTitle,
    props.type
  );

  useEffect(() => {
    if (selectedTitle && lastTransacByTitle) {
      setSelectedCategory(lastTransacByTitle.category || "");
      setSelectedDetail(lastTransacByTitle.detail || "");
      setSelectedMontant(
        Math.abs(parseFloat(lastTransacByTitle.amount)).toFixed(2) || ""
      );
    } else {
      setSelectedCategory("");
      setSelectedDetail("");
      setSelectedMontant("");
    }
  }, [selectedTitle, lastTransacByTitle]);

  const resetForm = () => {
    setSelectedTitle("");
    setSelectedCategory("");
    setSelectedDetail("");
    setSelectedMontant("");
    form.reset();
  };

  const handleDetail = (event) => {
    setSelectedDetail(event.target.value);
  };

  const handleTitle = (event) => {
    setSelectedTitle(event.target.value);
  };

  const handleMontant = (event) => {
    setSelectedMontant(event.target.value);
  };

  const addTransactionMutation = useMutation({
    mutationFn: async (postData) => {
      const response = await addTransaction(postData, userInfo?._id);

      return response;
    },
    onSuccess: (response) => {
      const newOperationId = response?.data?._id;
      resetForm();

      const transactionDate = new Date(response?.data?.date);
      const formattedDate = `${transactionDate.getFullYear()}${(transactionDate.getMonth() + 1).toString().padStart(2, "0")}`;

      toast.success(
        `Votre ${nameType(response?.data?.type).toLowerCase()} a été ajouté ! `,
        {
          action: {
            label: "Voir",
            onClick: () =>
              navigate(
                `/${normalizeText(response?.data?.type)}/${formattedDate}/${newOperationId}`
              ),
          },
        }
      );
    },
    onError: (error) => {
      console.error(
        "Error during transaction:",
        error.response ? error.response?.data : error.message
      );
      toast.error("Erreur lors de l'ajout de la transaction.");
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = await form.trigger();
    if (!isValid) {
      toast.success("Veuillez remplir tous les champs requis.");
      return;
    }

    const selectedDate = form.getValues("date");
    selectedDate.setHours(0, 0, 0, 0);

    const postData = {
      user: userInfo?.id,
      type: props.type,
      category: selectedCategory,
      title: selectedTitle,
      date: selectedDate.toLocaleDateString("fr-CA"),
      detail: selectedDetail,
      amount: formatMontant(selectedMontant, props.type),
    };

    addTransactionMutation.mutate(postData);
  };

  if (loadingUser) return <Loader />;

  return (
    <>
      <section className="w-full">
        <Header title={`Ajouter une ${props.title}`} btnReturn />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-5 px-36 py-10 animate-fade"
        >
          <Input
            className="w-96 h-10 px-2 rounded-xl bg-colorSecondaryLight dark:bg-colorPrimaryDark"
            list="title-suggestions"
            id="title"
            name="title"
            maxLength={50}
            placeholder="Titre"
            value={selectedTitle}
            onChange={(e) => {
              handleTitle(e);
            }}
            required
          />
          <datalist id="title-suggestions">
            {suggestions.map((suggestion, index) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>

          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
            }}
            required
          >
            <SelectTrigger className="w-96 h-10 px-2 rounded-xl bg-colorSecondaryLight dark:bg-colorPrimaryDark">
              <SelectValue placeholder="Entrez la catégorie" />
            </SelectTrigger>
            <SelectContent className="bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl">
              {props.type === "Expense" &&
                categoryD.map(({ name }) => (
                  <SelectItem key={name} value={name} className="rounded-xl">
                    {name}
                  </SelectItem>
                ))}
              {props.type === "Revenue" &&
                categoryR.map(({ name }) => (
                  <SelectItem key={name} value={name} className="rounded-xl">
                    {name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-96 h-10 px-2 rounded-xl bg-colorSecondaryLight dark:bg-colorPrimaryDark text-left font-normal"
              >
                {form.watch("date") ? (
                  format(form.watch("date"), "PPP", { locale: fr })
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
                selected={form.watch("date")}
                onSelect={(date) => form.setValue("date", date)}
                disabled={(date) => date < new Date("1900-01-01")}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>

          <Textarea
            value={selectedDetail}
            className="w-96 h-20 px-2 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-xl"
            placeholder="Détails"
            maxLength={250}
            onChange={(e) => {
              handleDetail(e);
            }}
          />

          <Input
            value={selectedMontant}
            className="w-96 h-10 px-2 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-xl"
            type="number"
            min="0"
            step="0.01"
            placeholder="Montant"
            onChange={(e) => {
              handleMontant(e);
            }}
            required
          />

          <Button variant="outline" className="rounded-xl" type="submit">
            Soumettre la {props.title}
          </Button>
        </form>
      </section>
    </>
  );
}
