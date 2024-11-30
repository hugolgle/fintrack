import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addAccount } from "../../Service/Epargn.service";
import Header from "../../composant/Header";
import ButtonLoading from "../../composant/Button/ButtonLoading";

const validationSchema = Yup.object({
  name: Yup.string().required("Le nom est requis"),
  balance: Yup.number()
    .typeError("Le solde doit être un nombre")
    .min(0, "Le solde ne peut pas être négatif")
    .required("Le solde est requis"),
  interestRate: Yup.number()
    .typeError("Le taux d'intérêt doit être un nombre")
    .min(0, "Le taux d'intérêt ne peut pas être négatif")
    .required("Le taux d'intérêt est requis"),
  maxBalance: Yup.number()
    .typeError("Le plafond doit être un nombre")
    .min(0, "Le plafond ne peut pas être négatif")
    .required("Le plafond est requis"),
});

export default function FormAddAccount() {
  const mutation = useMutation({
    mutationFn: addAccount,
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      formik.resetForm();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description:
          error.response?.data?.message || "Une erreur est survenue.",
        variant: "destructive",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      balance: "",
      interestRate: "",
      maxBalance: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return (
    <section className="w-full">
      <Header title="Ajouter un compte" btnReturn />
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col justify-center items-center mx-auto max-w-sm gap-5 py-10 animate-fade"
      >
        <Input
          type="text"
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Nom du compte"
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-500 text-sm">{formik.errors.name}</p>
        )}

        <Input
          type="number"
          id="balance"
          name="balance"
          value={formik.values.balance}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Montant initial"
          step="0.01"
        />
        {formik.touched.balance && formik.errors.balance && (
          <p className="text-red-500 text-sm">{formik.errors.balance}</p>
        )}

        <Input
          type="number"
          id="interestRate"
          name="interestRate"
          value={formik.values.interestRate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Taux en %"
          step="0.01"
        />
        {formik.touched.interestRate && formik.errors.interestRate && (
          <p className="text-red-500 text-sm">{formik.errors.interestRate}</p>
        )}

        <Input
          type="number"
          id="maxBalance"
          name="maxBalance"
          value={formik.values.maxBalance}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Plafond"
          step="0.01"
        />
        {formik.touched.maxBalance && formik.errors.maxBalance && (
          <p className="text-red-500 text-sm">{formik.errors.maxBalance}</p>
        )}
        <ButtonLoading
          type="submit"
          text="Ajouter le compte"
          textBis="Ajout en cours"
          isPending={mutation.isPending}
        />
      </form>
    </section>
  );
}
