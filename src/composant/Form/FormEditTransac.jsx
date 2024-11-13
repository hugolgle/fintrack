import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { formatAmount } from "../../utils/fonctionnel";
import { editTransactions } from "../../service/transaction.service";
import { LoaderCircle } from "lucide-react";

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
});

export function FormEditTransac({ transaction, refetch }) {
  const initialValues = {
    title: transaction.title || "",
    category: transaction.category || "",
    date: transaction.date ? new Date(transaction.date) : new Date(),
    detail: transaction.detail || "",
    amount: Math.abs(transaction.amount) || "",
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
        amount: formatAmount(Math.abs(values.amount), transaction.type),
      };
      return await editTransactions(editData);
    },
    onSuccess: (response) => {
      formik.resetForm();
      toast.success(response?.data?.message);
      refetch();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const categoryD = categorySort(categoryDepense);
  const categoryR = categorySort(categoryRecette);

  const dataBase = [
    transaction?.data?.title,
    transaction?.data?.detail,
    transaction?.data?.amount,
    transaction?.data?.category,
    transaction?.data?.date,
  ];

  const dataEdit = [
    formik.values?.title,
    formik.values?.detail,
    `${formatAmount(formik.values?.amount, transaction?.data?.type)}`,
    formik.values?.category,
    formik.values?.date.toLocaleDateString("fr-CA"),
  ];

  const isSaveDisabled = dataBase.every(
    (value, index) => value === dataEdit[index]
  );

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
          <p className="text-xs text-left text-red-500 -mt-3 ml-2">
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
            {(transaction?.data?.type === "Expense"
              ? categoryD
              : categoryR
            ).map(({ name }) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formik.touched.category && formik.errors.category && (
          <p className="text-xs text-left text-red-500 -mt-3 ml-2">
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
          <p className="text-xs text-left text-red-500 -mt-3 ml-2">
            {formik.errors.date}
          </p>
        )}

        <Textarea
          name="detail"
          placeholder="Détails"
          {...formik.getFieldProps("detail")}
        />
        {formik.touched.detail && formik.errors.detail && (
          <p className="text-xs text-left text-red-500 -mt-3 ml-2">
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
          <p className="text-xs text-left text-red-500 -mt-3 ml-2">
            {formik.errors.amount}
          </p>
        )}
      </div>

      <DialogFooter className="sm:justify-start">
        <Button
          disabled={mutationEdit.isPending || isSaveDisabled}
          type="submit"
        >
          {mutationEdit.isPending ? (
            <>
              Chargement{" "}
              <LoaderCircle
                size={15}
                strokeWidth={1}
                className="ml-2 animate-spin"
              />
            </>
          ) : (
            "Modifier"
          )}
        </Button>
        <DialogClose>
          <Button type="button" variant="outline">
            Annuler
          </Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}
