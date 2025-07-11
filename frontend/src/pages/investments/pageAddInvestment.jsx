import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { useMutation } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Header from "../../components/headers.jsx";
import { addTransaction } from "../../services/investment.service.jsx";
import { useFormik } from "formik";
import * as yup from "yup";

import { useParams } from "react-router";
import ButtonLoading from "../../components/buttons/buttonLoading.jsx";
import { useState } from "react";

const validationSchema = yup.object().shape({
  action: yup.string().required("L'action est requise"),
  date: yup.date().required("Le nom est requis"),
  amount: yup.number().positive().required("Le montant est requis"),
});

export default function PageAddInvestment() {
  const { id } = useParams();

  const [open, setOpen] = useState(false);

  const addTransactionInvestmentMutation = useMutation({
    mutationFn: async (postData) => {
      const response = await addTransaction(id, postData);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  const formik = useFormik({
    initialValues: {
      action: "",
      amount: "",
      date: new Date(),
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      const postData = {
        action: values.action === "true",
        amount: values.amount,
        date: values.date.toLocaleDateString("fr-CA"),
      };

      addTransactionInvestmentMutation.mutate(postData);
      formik.resetForm();
    },
  });

  return (
    <section className="h-full">
      <Header title="Ajouter une opération" btnReturn />
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col justify-center items-center mx-auto max-w-sm gap-5 py-10 animate-fade"
      >
        <Select
          name="action"
          value={formik.values.action}
          onValueChange={(value) => formik.setFieldValue("action", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Vendre</SelectItem>
            <SelectItem value="false">Acheter</SelectItem>
          </SelectContent>
        </Select>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="input">
              {formik.values.date ? (
                format(formik.values.date, "PP", { locale: fr })
              ) : (
                <span>Choisir une date</span>
              )}
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
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.date}
          </p>
        )}
        <Input
          id="amount"
          type="number"
          name="amount"
          step="0.01"
          placeholder="Montant"
          {...formik.getFieldProps("amount")}
        />
        {formik.touched.amount && formik.errors.amount && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.amount}
          </p>
        )}

        <ButtonLoading
          variant="secondary"
          text="Soumettre"
          disabled={addTransactionInvestmentMutation.isPending}
          isPending={addTransactionInvestmentMutation.isPending}
        />
      </form>
    </section>
  );
}
