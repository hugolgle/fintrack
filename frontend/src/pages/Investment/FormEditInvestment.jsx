import React from "react";
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
import { Input } from "@/components/ui/input";
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
import { editInvestmentsTransaction } from "../../service/investment.service";
import ButtonLoading from "../../composant/Button/ButtonLoading";
import { useState } from "react";

const validationSchema = yup.object().shape({
  date: yup.date().required("La date est requise"),
  amount: yup
    .number()
    .positive("Le montant doit être positif")
    .required("Le montant est requis"),
});

export function FormEditInvestment({ transaction, refetch }) {
  const [open, setOpen] = useState(false);

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
        amount: Math.abs(values.amount),
      };
      return await editInvestmentsTransaction(editData, transaction?.idInvest);
    },
    onSuccess: (response) => {
      refetch();
      formik.resetForm();
      toast.success(response?.data?.message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const dataBase = [transaction?.amount, transaction?.date];

  const dataEdit = [
    formik.values?.action,
    formik.values?.amount,
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
        <Popover modal={true} open={open} onOpenChange={setOpen}>
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
                setOpen(false);
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

      <DialogFooter className="sm:justify-between">
        <ButtonLoading
          type="submit"
          text="Modifier"
          isPending={mutationEdit.isPending || isSaveDisabled}
        />
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Annuler
          </Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}
