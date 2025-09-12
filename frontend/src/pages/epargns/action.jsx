import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  addTransfer,
  depositAccount,
  fetchAccounts,
  interestAccount,
  withdrawAccount,
} from "../../services/epargn.service";
import { HttpStatusCode } from "axios";
import { toast } from "sonner";
import ButtonLoading from "../../components/buttons/buttonLoading";

const validationSchema = yup.object({
  action: yup.string().required("L'action est requise"),
  accountId: yup
    .string()
    .required("Sélectionnez un compte source")
    .min(24, "ID du compte invalide"),
  toAccountId: yup.string().when("action", {
    is: "Virement",
    then: (schema) =>
      schema
        .required("Sélectionnez un compte de destination")
        .min(24, "ID du compte invalide"),
    otherwise: (schema) => schema.notRequired(),
  }),
  amount: yup
    .number()
    .required("Le montant est requis")
    .min(0, "Le montant ne peut pas être négatif")
    .max(999999, "Montant trop élevé"),
  date: yup.date().required("La date est requise"),
});

export default function FormAction({ refetch, accountId }) {
  const { data: accounts } = useQuery({
    queryKey: ["fetchAccounts"],
    queryFn: async () => {
      const response = await fetchAccounts();
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data;
    },
    refetchOnMount: true,
  });

  const [accountOptions, setAccountOptions] = useState([]);
  const [open, setOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      action: "",
      accountId: accountId ?? "",
      toAccountId: "",
      amount: "",
      date: null,
    },
    validationSchema,
    onSubmit: (values) => {
      const { action, ...dataToSend } = values;

      if (action === "Dépôt") {
        mutationDeposit.mutate(dataToSend);
      } else if (action === "Retrait") {
        mutationWithdraw.mutate(dataToSend);
      } else if (action === "Virement") {
        mutationTransfer.mutate(dataToSend);
      } else if (action === "Intérêts") {
        mutationInterest.mutate(dataToSend);
      }
    },
  });

  const mutationInterest = useMutation({
    mutationFn: interestAccount,
    onSuccess: (response) => {
      toast.success(response?.message);
      formik.resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const mutationDeposit = useMutation({
    mutationFn: depositAccount,
    onSuccess: (response) => {
      toast.success(response?.message);
      formik.resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const mutationTransfer = useMutation({
    mutationFn: addTransfer,
    onSuccess: (response) => {
      toast.success(response?.message);
      formik.resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const mutationWithdraw = useMutation({
    mutationFn: withdrawAccount,
    onSuccess: (response) => {
      toast.success(response?.message);
      formik.resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  useEffect(() => {
    setAccountOptions(
      accounts?.map((account) => ({
        value: account._id,
        label: account.name,
      }))
    );
  }, [accounts]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogHeader>
        <DialogTitle>Ajouter un versement</DialogTitle>
        <DialogDescription>
          Remplissez les informations du nouveau versement.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        {/* Sélection de l'action */}
        <Select
          value={formik.values.action}
          onValueChange={(value) => formik.setFieldValue("action", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Dépôt">Dépôt</SelectItem>
            <SelectItem value="Retrait">Retrait</SelectItem>
            <SelectItem value="Virement">Virement</SelectItem>
            <SelectItem value="Intérêts">Intérêts</SelectItem>
          </SelectContent>
        </Select>
        {formik.touched.action && formik.errors.action && (
          <p className="text-red-500 text-sm">{formik.errors.action}</p>
        )}

        {/* Sélection du compte source */}
        <Select
          value={formik.values.accountId}
          onValueChange={(value) => formik.setFieldValue("accountId", value)}
          disabled={accountId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un compte source" />
          </SelectTrigger>
          <SelectContent>
            {accounts?.map((account) => (
              <SelectItem key={account._id} value={account._id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formik.touched.accountId && formik.errors.accountId && (
          <p className="text-red-500 text-sm">{formik.errors.accountId}</p>
        )}

        {formik.values.action === "Virement" && (
          <Select
            value={formik.values.toAccountId}
            onValueChange={(value) =>
              formik.setFieldValue("toAccountId", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un compte de destination" />
            </SelectTrigger>
            <SelectContent>
              {accountOptions
                ?.filter((account) => account.value !== formik.values.accountId)
                .map((account) => (
                  <SelectItem key={account.value} value={account.value}>
                    {account.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
        {formik.values.action === "Virement" &&
          formik.touched.toAccountId &&
          formik.errors.toAccountId && (
            <p className="text-red-500 text-sm">{formik.errors.toAccountId}</p>
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

        {/* Montant */}
        <Input
          type="number"
          id="amount"
          name="amount"
          {...formik.getFieldProps("amount")}
          placeholder="0.00"
          step="0.01"
        />
        {formik.touched.amount && formik.errors.amount && (
          <p className="text-red-500 text-sm">{formik.errors.amount}</p>
        )}
      </div>

      {/* Bouton de soumission avec état de chargement */}
      <ButtonLoading
        type="submit"
        text="Soumettre"
        isPending={
          mutationDeposit.isLoading ||
          mutationTransfer.isLoading ||
          mutationWithdraw.isLoading
        }
      />
    </form>
  );
}
