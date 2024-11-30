import React from "react";
import Header from "../../../composant/Header";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  fetchAccounts,
  withdrawAccount,
} from "../../../Service/Epargn.service";
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

const validationSchema = Yup.object({
  accountId: Yup.string()
    .required("Sélectionnez un compte source")
    .min(24, "ID du compte invalide"),
  amount: Yup.number()
    .required("Le montant est requis")
    .min(0, "Le montant ne peut pas être négatif")
    .max(999999, "Montant trop élevé"),
});

export default function FormAddWithdraw() {
  const { isLoading, data: accounts } = useQuery({
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
    mutationFn: withdrawAccount,
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
      <Header title="Retrait" btnReturn />
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
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="0.00"
          step="0.01"
        />
        {formik.touched.amount && formik.errors.amount && (
          <p className="text-red-500 text-sm">{formik.errors.amount}</p>
        )}
        <ButtonLoading
          type="submit"
          text="Effectuer le retrait"
          textBis="Retrait en cours"
          isPending={mutation.isPending}
        />
      </form>
    </section>
  );
}
