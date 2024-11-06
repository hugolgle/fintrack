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

import { categorySort } from "../utils/other";
import { categoryRecette, categoryDepense } from "../../public/categories.json";
import { formatAmount } from "../utils/fonctionnel";
import { editTransactions } from "../service/transaction.service";
import { getTitleOfTransactionsByType } from "../utils/operations";

// Define validation schema for form fields
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

export function DialogEdit({ transaction, refetch, data }) {
  const initialValues = {
    title: transaction?.data?.title || "",
    category: transaction?.data?.category || "",
    date: transaction?.data?.date
      ? new Date(transaction?.data?.date)
      : new Date(),
    detail: transaction?.data?.detail || "",
    amount: Math.abs(transaction?.data?.amount) || "",
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
        id: transaction?.data?._id,
        type: transaction?.data?.type,
        title: values.title,
        category: values.category,
        date: values.date.toLocaleDateString("fr-CA"),
        detail: values.detail,
        amount: formatAmount(Math.abs(values.amount), transaction?.data?.type),
      };
      return await editTransactions(editData);
    },
    onSuccess: (response) => {
      refetch(); // Actually calling refetch to update data
      formik.resetForm();
      toast.success(response?.data?.message);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const categoryD = categorySort(categoryDepense);
  const categoryR = categorySort(categoryRecette);
  const suggestions = getTitleOfTransactionsByType(
    data,
    transaction?.data?.type
  );

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
    <Dialog asChild>
      <DialogTrigger>
        <Button>Modifier</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modifier la transaction</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              list="title-suggestions"
              name="title"
              placeholder="Titre"
              className="w-96 h-10 px-2 "
              {...formik.getFieldProps("title")}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-xs text-left text-red-500 mt-1 ml-2">
                {formik.errors.title}
              </p>
            )}
            <datalist id="title-suggestions">
              {suggestions.map((suggestion, index) => (
                <option key={index} value={suggestion} />
              ))}
            </datalist>
            <Select
              name="category"
              value={formik.values.category}
              onValueChange={(value) => formik.setFieldValue("category", value)}
            >
              <SelectTrigger className="w-96 h-10 px-2 ">
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
              <p className="text-xs text-left text-red-500 mt-1 ml-2">
                {formik.errors.category}
              </p>
            )}

            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-96 h-10 px-2  text-left font-normal"
                >
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
              <p className="text-xs text-left text-red-500 mt-1 ml-2">
                {formik.errors.date}
              </p>
            )}

            <Textarea
              name="detail"
              placeholder="Détails"
              className="w-96 h-20 px-2 "
              {...formik.getFieldProps("detail")}
            />
            {formik.touched.detail && formik.errors.detail && (
              <p className="text-xs text-left text-red-500 mt-1 ml-2">
                {formik.errors.detail}
              </p>
            )}

            <Input
              name="amount"
              type="number"
              step="0.01"
              placeholder="Montant"
              className="w-96 h-10 px-2 "
              {...formik.getFieldProps("amount")}
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="text-xs text-left text-red-500 mt-1 ml-2">
                {formik.errors.amount}
              </p>
            )}
          </div>

          <DialogFooter className="sm:justify-start">
            <Button
              disabled={mutationEdit.isPending || isSaveDisabled}
              type="submit"
            >
              {mutationEdit.isPending ? "Chargement ..." : "Modifier"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
