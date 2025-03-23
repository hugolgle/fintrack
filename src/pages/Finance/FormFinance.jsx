import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { HttpStatusCode } from "axios";

import { alphaSort } from "../../utils/other";
import {
  categoryRecette,
  categoryDepense,
} from "../../../public/categories.json";
import {
  addTransaction,
  editTransactions,
  fetchTransactions,
} from "../../Service/Transaction.service";
import ButtonLoading from "../../components/Button/ButtonLoading";
import { Badge } from "@/components/ui/badge";
import {
  getTagsOfTransactions,
  getTitleOfTransactionsByType,
  getTransactionsByType,
} from "../../utils/operations";
import { TYPES } from "../../StaticData/StaticData";

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .max(50, "Le titre est trop long")
    .required("Le titre est requis"),
  titleBis: yup
    .string()
    .max(50, "Le titre est trop long")
    .when("title", (title, schema) =>
      title === "Autre" ? schema.required("Le titre bis est requis") : schema
    ),
  category: yup.string().required("La catégorie est requise"),
  date: yup.date().required("La date est requise"),
  detail: yup.string().max(250, "Les détails sont trop longs"),
  amount: yup
    .number()
    .positive("Le montant doit être positif")
    .required("Le montant est requis"),
  tag: yup.array().of(yup.string()).nullable(),
});

export function FormTransac({ transaction, refetch, editMode, type }) {
  const queryClient = useQueryClient();
  const [tags, setTags] = useState(transaction?.tag ?? []);
  const [tagInput, setTagInput] = useState("");
  const [open, setOpen] = useState(false);

  const { data: dataTransactions } = useQuery({
    queryKey: ["fetchTransactions"],
    queryFn: async () => {
      const response = await fetchTransactions();
      if (response?.status !== HttpStatusCode.Ok) {
        toast.warn(response?.response?.data?.message || "Erreur");
      }
      return response?.data;
    },
    refetchOnMount: false,
  });

  const initialValues = {
    type: transaction?.type ?? type ?? "",
    title: transaction?.title ?? "",
    titleBis: "",
    category: transaction?.category ?? "",
    date: transaction?.date ? new Date(transaction.date) : new Date(),
    detail: transaction?.detail ?? "",
    amount: transaction?.initialAmount
      ? Math.abs(transaction.initialAmount)
      : transaction?.amount
        ? Math.abs(transaction.amount)
        : "",
    tag: transaction?.tag ?? [],
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: editMode,
    onSubmit: (values) => {
      const localDate = new Date(values.date);
      const utcMidnightDate = new Date(
        Date.UTC(
          localDate.getFullYear(),
          localDate.getMonth(),
          localDate.getDate()
        )
      );

      const finalValues = {
        ...values,
        ...(editMode && { id: transaction?._id }),
        title: values.title === "Autre" ? values.titleBis : values.title,
        date: utcMidnightDate,
      };

      editMode
        ? mutationEdit.mutate(finalValues)
        : mutationAdd.mutate(finalValues);
    },
  });

  useEffect(() => {
    formik.setFieldValue("tag", tags);
  }, [tags]);

  const mutationEdit = useMutation({
    mutationFn: async (editData) => {
      return await editTransactions(editData);
    },
    onSuccess: (response) => {
      formik.resetForm();
      toast.success(response?.data?.message);
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const mutationAdd = useMutation({
    mutationFn: async (postData) => {
      return await addTransaction(postData);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries(["fetchTransactions"]);
      refetch();
      formik.resetForm();
      setTags([]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const categoryD = alphaSort(categoryDepense);
  const categoryR = alphaSort(categoryRecette);

  useEffect(() => {
    const dataByType = getTransactionsByType(
      dataTransactions,
      formik.values.type
    );
    if (dataByType && formik.values.title) {
      const existing = dataByType.find((t) => t.title === formik.values.title);
      if (existing && !editMode) {
        formik.setFieldValue("category", existing.category);
        formik.setFieldValue("detail", existing.detail);
        formik.setFieldValue("amount", Math.abs(existing.amount));
      }
    }
  }, [formik.values.title, dataTransactions]);

  const suggestions = [
    "Autre",
    ...getTitleOfTransactionsByType(
      dataTransactions,
      formik.values.type
    ).filter((title) => title.trim() !== ""),
  ];

  const tagsSuggestions = getTagsOfTransactions(dataTransactions);

  const handleAddTag = () => {
    if (tagInput.trim() === "") {
      toast.warning("Le tag ne peut pas être vide.");
      return;
    }

    if (tags.length >= 3) {
      toast.warning("Vous ne pouvez pas ajouter plus de 3 tags.");
      return;
    }

    if (!tags.includes(tagInput)) {
      setTags((prevTags) => [...prevTags, tagInput]);
      setTagInput("");
    } else {
      toast.warning("Ce tag a déjà été ajouté.");
    }
  };

  const handleSelectTag = (suggestion) => {
    if (!tags.includes(suggestion)) {
      setTags((prevTags) => [...prevTags, suggestion]);
    }
  };

  const handleRemoveTag = (index) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {editMode ? "Modifier la transaction" : "Ajouter une transaction"}
        </DialogTitle>
        <DialogDescription>
          {editMode
            ? "Modifiez les informations de la transaction."
            : "Remplissez les informations de la nouvelle transaction."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Select
          name="type"
          value={formik.values.type}
          onValueChange={(value) => formik.setFieldValue("type", value)}
          disabled={editMode}
        >
          <SelectTrigger>
            <SelectValue placeholder="Entrez le type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              className="hover:bg-accent"
              key={TYPES.INCOME}
              value={TYPES.INCOME}
            >
              Revenu
            </SelectItem>
            <SelectItem
              className="hover:bg-accent"
              key={TYPES.EXPENSE}
              value={TYPES.EXPENSE}
            >
              Dépense
            </SelectItem>
          </SelectContent>
        </Select>
        {formik.touched.type && formik.errors.type && (
          <p className="text-[10px] text-red-500 -mt-4 ml-2">
            {formik.errors.type}
          </p>
        )}

        <Select
          name="title"
          value={formik.values.title}
          onValueChange={(value) => formik.setFieldValue("title", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un titre" />
          </SelectTrigger>
          <SelectContent>
            {suggestions.map((suggestion) => (
              <SelectItem
                className="hover:bg-accent"
                key={suggestion}
                value={suggestion}
              >
                {suggestion}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formik.touched.title && formik.errors.title && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.title}
          </p>
        )}

        {formik.values.title === "Autre" && (
          <>
            <Input
              id="titleBis"
              name="titleBis"
              placeholder="Titre"
              {...formik.getFieldProps("titleBis")}
            />
            {formik.touched.titleBis && formik.errors.titleBis && (
              <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
                {formik.errors.titleBis}
              </p>
            )}
          </>
        )}
        <Select
          name="category"
          value={formik.values.category}
          onValueChange={(value) => formik.setFieldValue("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Entrez la catégorie" />
          </SelectTrigger>
          <SelectContent>
            {formik.values.type === TYPES.EXPENSE &&
              categoryD.map(({ name }) => (
                <SelectItem className="hover:bg-accent" key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            {formik.values.type === TYPES.INCOME &&
              categoryR.map(({ name }) => (
                <SelectItem className="hover:bg-accent" key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {formik.touched.category && formik.errors.category && (
          <p className="text-[10px] text-red-500 -mt-4 ml-2">
            {formik.errors.category}
          </p>
        )}
        <Popover modal open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {formik.values.date
                ? format(formik.values.date, "PP", { locale: fr })
                : "Choisir une date"}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formik.values.date}
              onSelect={(date) => {
                formik.setFieldValue("date", date);
                setOpen(false);
              }}
              initialFocus
              locale={fr}
            />
          </PopoverContent>
        </Popover>
        {formik.touched.date && formik.errors.date && (
          <p className="text-[10px] text-red-500 -mt-4 ml-2">
            {formik.errors.date}
          </p>
        )}
        <Textarea
          name="detail"
          placeholder="Détails"
          {...formik.getFieldProps("detail")}
        />
        {formik.touched.detail && formik.errors.detail && (
          <p className="text-[10px] text-red-500 -mt-4 ml-2">
            {formik.errors.detail}
          </p>
        )}
        <Input
          name="amount"
          type="number"
          step="0.01"
          placeholder="Montant"
          {...formik.getFieldProps("amount")}
        />
        {formik.touched.amount && formik.errors.amount && (
          <p className="text-[10px] text-red-500 -mt-4 ml-2">
            {formik.errors.amount}
          </p>
        )}

        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
            placeholder="Ajouter un tag"
          />
          <Button type="button" variant="secondary" onClick={handleAddTag}>
            <Plus strokeWidth={1} />
          </Button>
        </div>

        <ul className=" flex items-center gap-2">
          {tagInput && (
            <ul className=" flex items-center gap-2">
              {tagsSuggestions
                .filter(
                  (suggestion) =>
                    suggestion.toLowerCase().includes(tagInput.toLowerCase()) &&
                    !tags.includes(suggestion)
                )
                .map((suggestion, index) => (
                  <Badge
                    key={index}
                    className="relative flex items-center animate-pop-up gap-2"
                    variant="secondary"
                  >
                    {suggestion}
                    <Plus
                      className="absolute bg-green-500 rounded-full p-[3px] right-0 top-0 transform translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => handleSelectTag(suggestion)}
                      size={16}
                    />
                  </Badge>
                ))}
            </ul>
          )}
        </ul>

        <ul className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              className="group relative flex items-center animate-pop-up gap-2"
              variant="outline"
            >
              {tag}
              <X
                className="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-all cursor-pointer"
                onClick={() => handleRemoveTag(index)}
                size={12}
              />
            </Badge>
          ))}
        </ul>
      </div>
      <DialogFooter className="sm:justify-between">
        <ButtonLoading
          type="submit"
          text={editMode ? "Modifier" : "Ajouter"}
          isPending={editMode ? mutationEdit.isPending : mutationAdd.isPending}
          disabled={editMode ? mutationEdit.isPending : mutationAdd.isPending}
        />
        <DialogClose>
          <Button type="button" variant="outline">
            Annuler
          </Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}
