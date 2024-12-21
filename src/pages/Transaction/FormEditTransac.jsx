import React, { useState } from "react";
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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { categorySort } from "../../utils/other";
import {
  categoryRecette,
  categoryDepense,
} from "../../../public/categories.json";
import { editTransactions } from "../../Service/Transaction.service";
import ButtonLoading from "../../composant/Button/ButtonLoading";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .max(50, "Le titre est trop long")
    .required("Le titre est requis"),
  category: yup.string().required("La catégorie est requise"),
  date: yup.date().required("La date est requise"),
  detail: yup.string().max(250, "Les détails sont trop longs"),
  amount: yup
    .number()
    .positive("Le montant doit être positif")
    .required("Le montant est requis"),
  tag: yup.array().of(yup.string()).nullable(),
});

export function FormEditTransac({ transaction, refetch }) {
  const [tags, setTags] = useState(transaction.tag || []);
  const [tagInput, setTagInput] = useState("");

  const initialValues = {
    title: transaction.title || "",
    category: transaction.category || "",
    date: transaction.date ? new Date(transaction.date) : new Date(),
    detail: transaction.detail || "",
    amount: transaction?.initialAmount
      ? Math.abs(transaction.initialAmount)
      : Math.abs(transaction.amount) || "",
    tag: transaction.tag,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      mutationEdit.mutate(values);
    },
  });

  const mutationEdit = useMutation({
    mutationFn: async (values) => {
      const editData = {
        id: transaction._id,
        type: transaction.type,
        title: values.title,
        category: values.category,
        date: values.date.toLocaleDateString("fr-CA"),
        detail: values.detail,
        amount: values.amount,
        tag: tags,
      };
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

  const categoryD = categorySort(categoryDepense);
  const categoryR = categorySort(categoryRecette);

  const dataBase = [
    transaction?.title,
    transaction?.detail,
    transaction?.initialAmount ?? transaction?.amount,
    transaction?.category,
    transaction?.date,
    transaction?.tag,
  ];

  const dataEdit = [
    formik.values?.title,
    formik.values?.detail,
    formik.values?.amount,
    formik.values?.category,
    formik.values?.date.toLocaleDateString("fr-CA"),
    formik.values?.tag,
  ];

  const isSaveDisabled = dataBase.every(
    (value, index) => value === dataEdit[index]
  );

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

  const handleRemoveTag = (index) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogHeader>
        <DialogTitle>Modifier la transaction</DialogTitle>
        <DialogDescription>
          Modifiez les informations de la transaction.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Input
          name="title"
          placeholder="Titre"
          {...formik.getFieldProps("title")}
        />
        {formik.touched.title && formik.errors.title && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.title}
          </p>
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
            {(transaction?.type === "Expense" ? categoryD : categoryR).map(
              ({ name }) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        {formik.touched.category && formik.errors.category && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.category}
          </p>
        )}

        <Popover modal={true}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {formik.values.date ? (
                format(formik.values.date, "PP", { locale: fr })
              ) : (
                <span>Choisir une date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto  p-0" align="start">
            <Calendar
              mode="single"
              selected={formik.values.date}
              onSelect={(date) => {
                formik.setFieldValue("date", date);
              }}
              initialFocus
              locale={fr}
            />
          </PopoverContent>
        </Popover>

        {formik.touched.date && formik.errors.date && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.date}
          </p>
        )}

        <Textarea
          name="detail"
          placeholder="Détails"
          {...formik.getFieldProps("detail")}
        />
        {formik.touched.detail && formik.errors.detail && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
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
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.amount}
          </p>
        )}
      </div>
      <div className="w-full flex justify-center gap-2 items-center">
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
          placeholder="Ajouter un tag"
        />
        <Button type="button" variant="secondary" onClick={handleAddTag}>
          <Plus />
        </Button>
      </div>

      <div className="w-full flex gap-2 py-4 items-center">
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
      </div>

      <DialogFooter className="sm:justify-between">
        <ButtonLoading
          variant="default"
          type="submit"
          text="Modifier"
          isPending={mutationEdit.isPending}
          disabled={mutationEdit.isPending || isSaveDisabled}
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
