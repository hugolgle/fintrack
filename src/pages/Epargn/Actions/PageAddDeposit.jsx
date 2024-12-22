import React from "react";
import Header from "../../../composant/Header";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { depositAccount, fetchAccounts } from "../../../Service/Epargn.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "../../../composant/Loader/Loader";
import { HttpStatusCode } from "axios";
import ButtonLoading from "../../../composant/Button/ButtonLoading";

const validationSchema = yup.object({
  accountId: yup
    .string()
    .required("Sélectionnez un compte source")
    .min(24, "ID du compte invalide"),
  amount: yup
    .number()
    .required("Le montant est requis")
    .min(0, "Le montant ne peut pas être négatif")
    .max(999999, "Montant trop élevé"),
});

export default function PageAddDeposit() {
  const {
    isLoading,
    data: accounts,
    isFetching,
  } = useQuery({
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

  const mutation = useMutation({
    mutationFn: depositAccount,
    onSuccess: (response) => {
      toast.success(response?.message);
      formik.resetForm();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const formik = useFormik({
    initialValues: {
      accountId: "",
      amount: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  if (isLoading) return <Loader />;

  return (
    <section className="w-full">
      <Header title="Dépôt" isFetching={isFetching} btnReturn />
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col justify-center items-center mx-auto max-w-sm gap-5 py-10 animate-fade"
      >
        <Select
          value={formik.values.accountId}
          onValueChange={(value) => formik.setFieldValue("accountId", value)}
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
        <ButtonLoading
          variant="secondary"
          type="submit"
          text="Soumettre"
          isPending={mutation.isPending}
        />
      </form>
    </section>
  );
}
