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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ButtonLoading from "../../components/Button/ButtonLoading";
import { addCredit, addPayment } from "../../Service/Credit.service";

const validationSchema = yup.object().shape({
  amount: yup
    .number()
    .positive("Le montant doit être positif")
    .required("Le montant est requis"),
  date: yup.date(),
});

export function FormPayment({ credit, refetch, editMode }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const initialValues = {
    amount: null,
    date: new Date(),
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: editMode,
    onSubmit: (values) => {
      const finalValues = {
        ...values,
      };
      mutationAdd.mutate(finalValues);
    },
  });

  const mutationAdd = useMutation({
    mutationFn: async (postData) => {
      return await addPayment(credit._id, postData);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries(["fetchCredits"]);
      refetch();
      formik.resetForm();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {editMode ? "Modifier un paiement" : "Ajouter un paiement"}
        </DialogTitle>
        <DialogDescription>
          {editMode
            ? "Modifiez les informations du paiement."
            : "Remplissez les informations pour ajouter un nouveau paiement."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          placeholder="Montant du paiement"
          {...formik.getFieldProps("amount")}
        />
        {formik.touched.amount && formik.errors.amount && (
          <p className="text-[10px] text-red-500 -mt-4 ml-2">
            {formik.errors.amount}
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
      </div>
      <DialogFooter className="sm:justify-between">
        <ButtonLoading
          type="submit"
          text={editMode ? "Modifier" : "Ajouter"}
          isPending={mutationAdd.isPending}
          disabled={mutationAdd.isPending}
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
