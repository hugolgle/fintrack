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
});

export default function FormAddAccount() {
  const mutation = useMutation({
    mutationFn: addAccount,
    onSuccess: () => {
      toast.success("Succès");
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

  // Gestion du formulaire avec Formik
  const formik = useFormik({
    initialValues: {
      name: "",
      balance: "",
      interestRate: "",
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

        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Ajout en cours..." : "Ajouter le compte"}
        </Button>
      </form>
    </section>
  );
}
