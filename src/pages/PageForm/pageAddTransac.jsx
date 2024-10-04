"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  categorieRecette,
  categorieDepense,
} from "../../../public/categories.json";
import { formatMontant } from "../../utils/fonctionnel";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addTransactions,
  getTransactions,
} from "../../redux/actions/transaction.action";
import { infoUser } from "../../utils/users";
import { categorieSort, normalizeText } from "../../utils/other";
import {
  getLatestTransactionByTitle,
  getTitleOfTransactionsByType,
} from "../../utils/operations";
import { fr } from "date-fns/locale";
import LayoutOperation from "../../layout/layoutOperation";
import { useNavigate } from "react-router-dom"; // Corriger l'import de useNavigate

// Schéma de validation pour la date
const FormSchema = z.object({
  date: z.date({
    required_error: "Une date est requise.",
  }),
});

export default function PageAddTransac(props) {
  const userInfo = infoUser();

  const categorieD = categorieSort(categorieDepense);
  const categorieR = categorieSort(categorieRecette);

  const suggestions = getTitleOfTransactionsByType(props.type);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(), // Valeur par défaut pour la date
    },
  });

  const [selectedTitre, setSelectedTitre] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("");
  const [selectedDetail, setSelectedDetail] = useState("");
  const [selectedMontant, setSelectedMontant] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Utiliser useNavigate correctement
  const [addedOperationDate, setAddedOperationDate] = useState("");
  const [addedOperationId, setAddedOperationId] = useState("");

  const lastTransacByTitle = getLatestTransactionByTitle(
    selectedTitre,
    props.type
  );

  useEffect(() => {
    if (selectedTitre && lastTransacByTitle) {
      setSelectedCategorie(lastTransacByTitle.categorie || "");
      setSelectedDetail(lastTransacByTitle.detail || "");
      setSelectedMontant(
        Math.abs(parseFloat(lastTransacByTitle.montant)).toFixed(2) || ""
      );
    } else {
      setSelectedCategorie("");
      setSelectedDetail("");
      setSelectedMontant("");
    }
  }, [selectedTitre, lastTransacByTitle]);

  const resetForm = () => {
    setSelectedTitre("");
    setSelectedCategorie("");
    setSelectedDetail("");
    setSelectedMontant("");
    form.reset();
  };

  const handleDetail = (event) => {
    setSelectedDetail(event.target.value);
  };

  const handleTitre = (event) => {
    setSelectedTitre(event.target.value);
  };

  const handleMontant = (event) => {
    setSelectedMontant(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = await form.trigger();
    if (!isValid) {
      toast("Veuillez remplir tous les champs requis.");
      return;
    }

    const postData = {
      user: userInfo.id,
      type: props.type,
      categorie: selectedCategorie,
      titre: selectedTitre,
      date: form.getValues("date").toISOString().split("T")[0],
      detail: selectedDetail,
      montant: formatMontant(selectedMontant, props.type),
    };

    try {
      const response = await dispatch(addTransactions(postData));
      const newOperationId = response.data._id;
      dispatch(getTransactions());
      resetForm();

      const transactionDate = new Date(
        form.getValues("date").toISOString().split("T")[0]
      );
      const formattedDate = `${transactionDate.getFullYear()}${(transactionDate.getMonth() + 1).toString().padStart(2, "0")}`;

      toast(`Votre ${props.type.toLowerCase()} a été ajouté ! `, {
        action: {
          label: "Voir",
          onClick: () =>
            navigate(
              `/${normalizeText(props.type)}/${formattedDate}/${newOperationId}`
            ),
        },
      });
    } catch (error) {
      toast("Une erreur s'est produite lors de l'ajout de l'opération");
    }
  };

  return (
    <>
      <section className="h-full">
        <LayoutOperation
          title={`Ajouter une ${props.type.toLowerCase()}`}
          pageById
          pageAdd
        />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-5 px-36 py-10 animate-fade"
        >
          <input
            className="w-96 h-10 px-2 rounded-xl bg-colorSecondaryLight dark:bg-colorPrimaryDark"
            list="title-suggestions"
            id="title"
            name="title"
            maxLength={50}
            placeholder="Titre"
            value={selectedTitre}
            onChange={(e) => {
              handleTitre(e);
            }}
            required
          />
          <datalist id="title-suggestions">
            {suggestions.map((suggestion, index) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>

          <Select
            value={selectedCategorie}
            onValueChange={(value) => {
              setSelectedCategorie(value);
            }}
            required
          >
            <SelectTrigger className="w-96 h-10 px-2 rounded-xl bg-colorSecondaryLight dark:bg-colorPrimaryDark">
              <SelectValue placeholder="Entrez la catégorie" />
            </SelectTrigger>
            <SelectContent className="bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-2xl">
              {props.type === "Dépense" &&
                categorieD.map(({ name }) => (
                  <SelectItem key={name} value={name} className="rounded-xl">
                    {name}
                  </SelectItem>
                ))}
              {props.type === "Recette" &&
                categorieR.map(({ name }) => (
                  <SelectItem key={name} value={name} className="rounded-2xl">
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

          <textarea
            value={selectedDetail}
            className="w-96 h-20 px-2 bg-colorSecondaryLight dark:bg-colorPrimaryDark rounded-xl"
            placeholder="Détails"
            maxLength={250}
            onChange={(e) => {
              handleDetail(e);
            }}
          />

          <input
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

          <Button
            variant="outline"
            className="rounded-xl w-1/4 bg-colorSecondaryLight dark:bg-colorPrimaryDark hover:border-blue-500"
            type="submit"
          >
            Soumettre la {props.type.toLowerCase()}
          </Button>
        </form>
      </section>
    </>
  );
}
