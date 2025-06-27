import React, { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import typeCredit from "../../../public/typeCredit.json";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ButtonLoading from "../../components/buttons/buttonLoading";
import { addCredit, editCredit } from "../../services/credit.service";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .max(50, "Le nom est trop long")
    .required("Le nom est requis"),
  type: yup.string().required("Le type est requise"),
  startDate: yup.date(),
  monthlyPayment: yup
    .number()
    .positive("Le montant doit être positif")
    .nullable(),
  duration: yup
    .number()
    .positive("La durée doit être un nombre positif")
    .nullable(),
  amount: yup
    .number()
    .positive("Le montant doit être positif")
    .required("Le montant est requis"),
  insurance: yup.number().positive("Le montant doit être positif").nullable(),
  interestRate: yup.number().required("Le taux d'intérêt est requis"),
});

export function FormCredit({ refetch, editMode, credit }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const initialValues = {
    name: credit?.name ?? "",
    type: credit?.type ?? "",
    monthlyPayment: credit?.monthlyPayment ?? null,
    amount: credit?.amount ?? null,
    insurance: credit?.insurance ?? null,
    interestRate: credit?.interestRate ?? null,
    startDate: credit?.startDate ?? new Date(),
    duration: credit?.duration ?? null,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: editMode,
    onSubmit: (values) => {
      const localDate = new Date(values.startDate);
      const utcMidnightDate = new Date(
        Date.UTC(
          localDate.getFullYear(),
          localDate.getMonth(),
          localDate.getDate()
        )
      );

      const finalValues = {
        ...values,
        insurance: values.insurance ?? 0,
        monthlyPayment: values.monthlyPayment ?? 0,
        duration: values.duration ?? 0,
        ...(editMode && { id: credit?._id }),
        startDate: utcMidnightDate,
      };

      editMode
        ? mutationEdit.mutate(finalValues)
        : mutationAdd.mutate(finalValues);
    },
  });

  const mutationAdd = useMutation({
    mutationFn: async (postData) => {
      return await addCredit(postData);
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

  const mutationEdit = useMutation({
    mutationFn: async (editData) => {
      return await editCredit(editData);
    },
    onSuccess: (response) => {
      formik.resetForm();
      toast.success(response?.message);
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  useEffect(() => {
    const { amount, duration, interestRate } = formik.values;

    if (
      amount &&
      duration &&
      interestRate !== null &&
      interestRate !== undefined
    ) {
      const principal = parseFloat(amount);
      const months = parseInt(duration);
      const monthlyRate = parseFloat(interestRate) / 100 / 12;

      let mensualité = 0;

      if (monthlyRate > 0) {
        mensualité =
          (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
      } else {
        mensualité = principal / months;
      }

      if (!isNaN(mensualité) && isFinite(mensualité)) {
        formik.setFieldValue(
          "monthlyPayment",
          parseFloat(mensualité.toFixed(2))
        );
      }
    }
  }, [
    formik.values.amount,
    formik.values.duration,
    formik.values.interestRate,
  ]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {editMode ? "Modifier un crédit" : "Ajouter un crédit"}
        </DialogTitle>
        <DialogDescription>
          {editMode
            ? "Modifiez les informations du crédit."
            : "Remplissez les informations pour ajouter un nouveau crédit."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Input
          id="name"
          name="name"
          placeholder="Nom du crédit"
          {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-[10px] text-red-500 -mt-4 ml-2">
            {formik.errors.name}
          </p>
        )}

        <Select
          name="type"
          value={formik.values.type}
          onValueChange={(value) => formik.setFieldValue("type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un type" />
          </SelectTrigger>
          <SelectContent>
            {typeCredit.map((item) => (
              <SelectItem key={item.key} value={item.key}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formik.touched.type && formik.errors.type && (
          <p className="text-[10px] text-red-500 -mt-4 ml-2">
            {formik.errors.type}
          </p>
        )}

        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          placeholder="Montant du crédit"
          {...formik.getFieldProps("amount")}
        />
        {formik.touched.amount && formik.errors.amount && (
          <p className="text-[10px] text-red-500 -mt-4 ml-2">
            {formik.errors.amount}
          </p>
        )}

        {/* Taux d'intérêt */}

        <Input
          id="interestRate"
          name="interestRate"
          type="number"
          step="0.01"
          placeholder="Taux d'intérêt (%)"
          {...formik.getFieldProps("interestRate")}
        />
        {formik.touched.interestRate && formik.errors.interestRate && (
          <p className="text-[10px] text-red-500 -mt-4 ml-2">
            {formik.errors.interestRate}
          </p>
        )}

        <Input
          id="duration"
          name="duration"
          type="number"
          placeholder="Durée en mois"
          {...formik.getFieldProps("duration")}
        />
        {formik.touched.duration && formik.errors.duration && (
          <p className="text-[10px] text-red-500 -mt-4 ml-2">
            {formik.errors.duration}
          </p>
        )}

        <Input
          id="monthlyPayment"
          name="monthlyPayment"
          type="number"
          step="0.01"
          placeholder="Paiement mensuel"
          {...formik.getFieldProps("monthlyPayment")}
        />
        {formik.touched.monthlyPayment && formik.errors.monthlyPayment && (
          <p className="text-[10px] text-red-500 -mt-4 ml-2">
            {formik.errors.monthlyPayment}
          </p>
        )}

        <Input
          id="insurance"
          name="insurance"
          type="number"
          step="0.01"
          placeholder="Montant de l'assurance par mois"
          {...formik.getFieldProps("insurance")}
        />
        {formik.touched.insurance && formik.errors.insurance && (
          <p className="text-[10px] text-red-500 -mt-4 ml-2">
            {formik.errors.insurance}
          </p>
        )}
        {/* Date de début */}

        <Popover modal open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {formik.values.startDate
                ? format(formik.values.startDate, "PP", { locale: fr })
                : "Choisir une date de début"}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formik.values.startDate}
              onSelect={(date) => {
                formik.setFieldValue("startDate", date);
                setOpen(false);
              }}
              initialFocus
              locale={fr}
            />
          </PopoverContent>
        </Popover>
        {formik.touched.startDate && formik.errors.startDate && (
          <p className="text-[10px] text-red-500 -mt-4 ml-2">
            {formik.errors.startDate}
          </p>
        )}
      </div>
      <DialogFooter className="sm:justify-between">
        <ButtonLoading
          type="submit"
          text={editMode ? "Modifier" : "Ajouter"}
          isPending={mutationAdd.isPending || mutationEdit.isPending}
          disabled={mutationAdd.isPending || mutationEdit.isPending}
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
