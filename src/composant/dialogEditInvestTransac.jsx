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
import { LoaderCircle } from "lucide-react";
import { Pencil } from "lucide-react";
import { Pencil2Icon } from "@radix-ui/react-icons";
import {
  deleteTransaction,
  editInvestmentsTransaction,
} from "../service/investment.service";

// Define validation schema for form fields
const validationSchema = yup.object().shape({
  date: yup.date().required("La date est requise"),
  amount: yup
    .number()
    .positive("Le montant doit être positif")
    .required("Le montant est requis"),
});

export function DialogEditTransacInvest({
  transaction,
  refetch,
  idInvestment,
}) {
  const initialValues = {
    date: transaction?.date ? new Date(transaction?.date) : new Date(),
    amount: Math.abs(transaction?.amount) || "",
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
        id: transaction?._id,
        date: values.date.toLocaleDateString("fr-CA"),
        amount: formatAmount(Math.abs(values.amount)),
      };
      return await editInvestmentsTransaction(editData, idInvestment);
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

  const mutationDelete = useMutation({
    mutationFn: async () => {
      return await deleteTransaction(idInvestment, transaction?._id);
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

  const dataBase = [transaction?.amount, transaction?.date];

  const dataEdit = [
    formik.values?.action,
    `${formatAmount(formik.values?.amount)}`,
    formik.values?.date.toLocaleDateString("fr-CA"),
  ];

  const isSaveDisabled = dataBase.every(
    (value, index) => value === dataEdit[index]
  );

  return (
    <Dialog asChild>
      <DialogTrigger>
        <Pencil2Icon size={15} className="absolute right-2 top-3" />
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
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={() => mutationDelete.mutate()}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
