import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addAccount } from "../../Service/Epargn.service";
import Header from "../../composant/Header";
import ButtonLoading from "../../composant/Button/ButtonLoading";

const validationSchema = yup.object({
  name: yup.string().required("Le nom est requis"),
  balance: yup
    .number()
    .typeError("Le solde doit être un nombre")
    .min(0, "Le solde ne peut pas être négatif")
    .required("Le solde est requis"),
  interestRate: yup
    .number()
    .typeError("Le taux d'intérêt doit être un nombre")
    .min(0, "Le taux d'intérêt ne peut pas être négatif")
    .required("Le taux d'intérêt est requis"),
  maxBalance: yup
    .number()
    .typeError("Le plafond doit être un nombre")
    .min(0, "Le plafond ne peut pas être négatif")
    .required("Le plafond est requis"),
});

export default function PageAddAccount() {
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
          {...formik.getFieldProps("name")}
          placeholder="Nom du compte"
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.name}
          </p>
        )}

        <Input
          type="number"
          id="balance"
          name="balance"
          {...formik.getFieldProps("balance")}
          placeholder="Montant initial"
          step="0.01"
        />
        {formik.touched.balance && formik.errors.balance && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.balance}
          </p>
        )}

        <Input
          type="number"
          id="interestRate"
          name="interestRate"
          {...formik.getFieldProps("interestRate")}
          placeholder="Taux en %"
          step="0.01"
        />
        {formik.touched.interestRate && formik.errors.interestRate && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.interestRate}
          </p>
        )}

        <Input
          type="number"
          id="maxBalance"
          name="maxBalance"
          {...formik.getFieldProps("maxBalance")}
          placeholder="Plafond"
          step="0.01"
        />
        {formik.touched.maxBalance && formik.errors.maxBalance && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.maxBalance}
          </p>
        )}
        <ButtonLoading
          variant="secondary"
          type="submit"
          text="Soumettre"
          disabled={mutation.isPending}
          isPending={mutation.isPending}
        />
      </form>
    </section>
  );
}
