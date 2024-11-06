"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
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
import Header from "../../composant/header";
import {
  addInvestment,
  fetchInvestments,
} from "../../service/investment.service";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { formatAmount } from "../../utils/fonctionnel";
import { useFormik } from "formik";
import * as yup from "yup";
import { HttpStatusCode } from "axios";
import { getUserIdFromToken } from "../../utils/users";
import { getCurrentUser } from "../../service/user.service";

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .max(50, "Le titre est trop long")
    .required("Le titre est requis"),
  type: yup.string().required("Le type est requis"),
  detail: yup.string().max(250, "Les détails sont trop longs"),
  amount: yup
    .number()
    .typeError("Le montant est requis")
    .positive("Le montant doit être positif")
    .required("Le montant est requis"),
});

export default function PageAddInvest() {
  const userId = getUserIdFromToken();

  const { data: userInfo, isLoading: loadingUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getCurrentUser(userId),
    enabled: !!userId,
  });
  const { data } = useQuery({
    queryKey: ["fetchInvestments"],
    queryFn: async () => {
      const response = await fetchInvestments(userInfo?._id);
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data;
    },
    refetchOnMount: true,
  });

  const suggestionsTitle = Array.from(
    new Set(data?.map((investment) => investment.title))
  );

  const formik = useFormik({
    initialValues: {
      title: "",
      type: "",
      detail: "",
      amount: "",
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values, { resetForm }) => {
      const postData = {
        user: userInfo?._id,
        type: values.type,
        title: values.title,
        detail: values.detail,
        date: values.date.toLocaleDateString("fr-CA"),
        amount: formatAmount(values.amount),
      };

      addInvestmentMutation.mutate(postData);
      resetForm();
    },
  });

  const addInvestmentMutation = useMutation({
    mutationFn: async (postData) => {
      const response = await addInvestment(postData, userInfo?._id);
      return response;
    },
    onSuccess: () => {
      toast.success("Votre investissement a été ajouté !");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  useEffect(() => {
    if (formik.values.title) {
      const lastInvestment = data
        .filter((investment) => investment.title === formik.values.title)
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

      if (lastInvestment) {
        formik.setFieldValue("type", lastInvestment.type || "");
      }
    }
  }, [formik.values.title, data]);

  if (loadingUser) return <Loader />;

  return (
    <section className="h-full">
      <Header title="Ajouter un investissement" btnReturn />
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col justify-center items-center gap-5 px-36 py-10 animate-fade"
      >
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-96 h-10 px-2 text-left font-normal"
              >
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
                onSelect={(date) => formik.setFieldValue("date", date)}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
          {formik.touched.date && formik.errors.date && (
            <p className="text-xs text-left text-red-500 mt-1 ml-2">
              {formik.errors.date}
            </p>
          )}
        </div>

        <div>
          <Input
            list="title-suggestions"
            value={formik.values.title}
            className="w-96 h-10 px-2 "
            type="text"
            maxLength={50}
            placeholder="Titre"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="title"
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-xs text-left text-red-500 mt-1 ml-2">
              {formik.errors.title}
            </p>
          )}
        </div>

        <datalist id="title-suggestions">
          {suggestionsTitle.map((suggestion, index) => (
            <option key={index} value={suggestion} />
          ))}
        </datalist>
        <div>
          <Select
            name="type"
            // {...formik.getFieldProps("type")} peut ton ajouter ceci ici  ??
            value={formik.values.type}
            onValueChange={(value) => formik.setFieldValue("type", value)}
            required
          >
            <SelectTrigger className="w-96 h-10 px-2 ">
              <SelectValue placeholder="Sélectionnez le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Action">Action</SelectItem>
              <SelectItem value="ETF">ETF</SelectItem>
              <SelectItem value="Crypto">Crypto</SelectItem>
              <SelectItem value="Obligation">Obligation</SelectItem>
              <SelectItem value="Dérivé">Dérivé</SelectItem>
            </SelectContent>
          </Select>
          {formik.touched.type && formik.errors.type && (
            <p className="text-xs text-left text-red-500 mt-1 ml-2">
              {formik.errors.type}
            </p>
          )}
        </div>
        <div>
          <Textarea
            className="w-96 h-10 px-2 "
            placeholder="Détails"
            {...formik.getFieldProps("detail")}
            name="detail"
          />
          {formik.touched.detail && formik.errors.detail && (
            <p className="text-xs text-left text-red-500 mt-1 ml-2">
              {formik.errors.detail}
            </p>
          )}
        </div>

        <div>
          <Input
            className="w-96 h-10 px-2 "
            type="number"
            step="0.01"
            placeholder="Montant"
            {...formik.getFieldProps("amount")}
            name="amount"
          />
          {formik.touched.amount && formik.errors.amount && (
            <p className="text-xs text-left text-red-500 mt-1 ml-2">
              {formik.errors.amount}
            </p>
          )}
        </div>

        <Button disabled={addInvestmentMutation.isPending || !formik.isValid}>
          {addInvestmentMutation.isPending
            ? "En cours ..."
            : "Soumettre l'investissement"}
        </Button>
      </form>
    </section>
  );
}
