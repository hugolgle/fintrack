import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { useMutation } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import {
  addDividend,
  addTransaction,
} from "../../services/investment.service.jsx";
import { useFormik } from "formik";
import * as yup from "yup";

import { useParams } from "react-router";
import ButtonLoading from "../../components/buttons/buttonLoading.jsx";
import { useState } from "react";

const validationSchema = yup.object().shape({
  action: yup
    .string()
    .oneOf(["buy", "sell", "dividend"])
    .required("L'action est requise"),
  date: yup.date().required("La date est requise"),
  amount: yup.number().positive().required("Le montant est requis"),
  closed: yup.boolean(),
});

export default function FormAddInvestment({ refetch }) {
  const { id } = useParams();

  const [open, setOpen] = useState(false);

  const addTransactionInvestmentMutation = useMutation({
    mutationFn: async (postData) => {
      const response = await addTransaction(id, postData);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      refetch();
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  const addDividendInvestmentMutation = useMutation({
    mutationFn: async (postData) => {
      const response = await addDividend(id, postData);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      refetch();
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
      closed: false,
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      const postData = {
        action: values.action,
        amount: values.amount,
        date: values.date.toLocaleDateString("fr-CA"),
        closed: values.closed,
      };

      if (values.action === "dividend") {
        addDividendInvestmentMutation.mutate(postData);
      } else {
        addTransactionInvestmentMutation.mutate(postData);
      }

      formik.resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogHeader>
        <DialogTitle>Ajouter un investissement</DialogTitle>
        <DialogDescription>
          Ajouter les informations du nouveau investissement.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
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
            <SelectItem value="buy">Acheter</SelectItem>
            <SelectItem value="sell">Vendre</SelectItem>
            <SelectItem value="dividend">Dividende</SelectItem>
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

        {formik.values.action === "sell" && (
          <div className="flex items-center space-x-2">
            <Checkbox
              name="closed"
              checked={formik.values.closed}
              onCheckedChange={(checked) =>
                formik.setFieldValue("closed", checked)
              }
            />
            <label
              htmlFor="closed"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Clôturer le cycle
            </label>
          </div>
        )}
      </div>

      <ButtonLoading
        type="submit"
        text="Soumettre"
        disabled={addTransactionInvestmentMutation.isPending}
        isPending={addTransactionInvestmentMutation.isPending}
      />
    </form>
  );
}
