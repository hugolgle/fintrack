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
import { addRefund } from "../../Service/Transaction.service";
import ButtonLoading from "../../composant/Button/ButtonLoading";

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .max(50, "Le titre est trop long")
    .required("Le titre est requis"),
  date: yup.date().required("La date est requise"),
  amount: yup
    .number()
    .positive("Le montant doit être positif")
    .required("Le montant est requis"),
});

export function FormAddRefund({ transaction, refetch }) {
  const formik = useFormik({
    initialValues: {
      title: "",
      date: new Date(),
      amount: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutationPost.mutate(values);
    },
  });
  const mutationPost = useMutation({
    mutationFn: async (values) => {
      const postData = {
        title: values.title,
        date: values.date.toLocaleDateString("fr-CA"),
        amount: values.amount,
      };

      return await addRefund(transaction._id, postData);
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogHeader>
        <DialogTitle>Ajouter un remboursement</DialogTitle>
        <DialogDescription>
          Ajouter les informations du remboursement.
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

        <Input
          id="amount"
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

      <DialogFooter className="sm:justify-between">
        <ButtonLoading
          variant="default"
          type="submit"
          text="Soumettre"
          disabled={mutationPost.isPending || !formik.isValid}
          isPending={mutationPost.isPending}
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
