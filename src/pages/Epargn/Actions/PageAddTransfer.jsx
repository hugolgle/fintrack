import React from "react";
import Header from "../../../composant/Header";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addTransfer, fetchAccounts } from "../../../Service/Epargn.service";
import { useState } from "react";
import { useEffect } from "react";
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
  fromAccountId: yup
    .string()
    .required("Sélectionnez un compte source")
    .min(24, "ID du compte invalide"),
  toAccountId: yup
    .string()
    .required("Sélectionnez un compte de destination")
    .min(24, "ID du compte invalide"),
  amount: yup
    .number()
    .required("Le montant est requis")
    .min(0, "Le montant ne peut pas être négatif")
    .max(999999, "Montant trop élevé"),
});

export default function PageAddTransfert() {
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

  const [accountOptions, setAccountOptions] = useState([]);

  useEffect(() => {
    setAccountOptions(
      accounts?.map((account) => ({
        value: account._id,
        label: account.name,
      }))
    );
  }, [accounts]);

  const mutation = useMutation({
    mutationFn: addTransfer,
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
      fromAccountId: "",
      toAccountId: "",
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
      <Header title="Virement" isFetching={isFetching} btnReturn />
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col justify-center items-center mx-auto max-w-sm gap-5 py-10 animate-fade"
      >
        <Select
          value={formik.values.fromAccountId}
          onValueChange={(value) =>
            formik.setFieldValue("fromAccountId", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un compte source" />
          </SelectTrigger>
          <SelectContent>
            {accountOptions?.map((account) => (
              <SelectItem key={account.value} value={account.value}>
                {account.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formik.touched.fromAccountId && formik.errors.fromAccountId && (
          <p className="text-red-500 text-sm">{formik.errors.fromAccountId}</p>
        )}
        <Select
          value={formik.values.toAccountId}
          onValueChange={(value) => formik.setFieldValue("toAccountId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un compte de destination" />
          </SelectTrigger>
          <SelectContent>
            {accountOptions?.map(
              (account) =>
                account.value !== formik.values.fromAccountId && (
                  <SelectItem key={account.value} value={account.value}>
                    {account.label}
                  </SelectItem>
                )
            )}
          </SelectContent>
        </Select>
        {formik.touched.toAccountId && formik.errors.toAccountId && (
          <p className="text-red-500 text-sm">{formik.errors.toAccountId}</p>
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
          type="submit"
          text="Soumettre"
          isPending={mutation.isPending}
        />
      </form>
    </section>
  );
}
