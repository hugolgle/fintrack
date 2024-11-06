"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  categoryRecette,
  categoryDepense,
} from "../../../public/categories.json";
import { formatAmount } from "../../utils/fonctionnel";
import { useEffect } from "react";
import { categorySort, nameType, normalizeText } from "../../utils/other";
import {
  getTitleOfTransactionsByType,
  getTransactionsByType,
} from "../../utils/operations";
import { fr } from "date-fns/locale";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "../../composant/header";
import {
  addTransaction,
  fetchTransactions,
} from "../../service/transaction.service";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../composant/loader/loader";
import { useFormik } from "formik";
import * as yup from "yup";
import { HttpStatusCode } from "axios";
import { getUserIdFromToken } from "../../utils/users";
import { getCurrentUser } from "../../service/user.service";

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .max(50, "Le titre est trop longs")
    .required("Le titre est requis"),
  category: yup.string().required("La catégorie est requise"),
  date: yup.date().required("La date est requise"),
  detail: yup.string().max(250, "Les détails sont trop long"),
  amount: yup
    .number()
    .typeError("Le montant est requis")
    .positive("Le montant doit être positif")
    .required("Le montant est requis"),
});

export default function PageAddTransac(props) {
  const userId = getUserIdFromToken();

  const { data: userInfo, isLoading: loadingUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getCurrentUser(userId),
    enabled: !!userId,
  });
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["fetchTransactions"],
    queryFn: async () => {
      const response = await fetchTransactions(userInfo?._id);
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data;
    },
    refetchOnMount: true,
  });

  const categoryD = categorySort(categoryDepense);
  const categoryR = categorySort(categoryRecette);

  const suggestions = getTitleOfTransactionsByType(data, props.type);

  const addTransactionMutation = useMutation({
    mutationFn: async (postData) => {
      return await addTransaction(postData, userInfo?._id);
    },
    onSuccess: (response) => {
      const newOperationId = response?.data?._id;
      const transactionDate = new Date(response?.data?.date);
      const formattedDate = `${transactionDate.getFullYear()}${(transactionDate.getMonth() + 1).toString().padStart(2, "0")}`;

      toast.success(
        `Votre ${nameType(response?.data?.type).toLowerCase()} a été ajouté ! `,
        {
          action: {
            label: "Voir",
            onClick: () =>
              navigate(
                `/${normalizeText(response?.data?.type)}/${formattedDate}/${newOperationId}`
              ),
          },
        }
      );
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      category: "",
      date: new Date(),
      detail: "",
      amount: "",
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values, { resetForm }) => {
      const postData = {
        user: userInfo?._id,
        type: props.type,
        category: values.category,
        title: values.title,
        date: values.date.toLocaleDateString("fr-CA"),
        detail: values.detail,
        amount: formatAmount(values.amount, props.type),
      };
      addTransactionMutation.mutate(postData, {
        onSuccess: () => {
          resetForm();
        },
      });
    },
  });

  useEffect(() => {
    const dataByType = getTransactionsByType(data, props.type);
    if (dataByType && formik.values.title) {
      const existingTransaction = dataByType.find(
        (transaction) => transaction.title === formik.values.title
      );

      if (existingTransaction) {
        formik.setFieldValue("category", existingTransaction.category);
        formik.setFieldValue("detail", existingTransaction.detail);
        formik.setFieldValue("amount", Math.abs(existingTransaction.amount));
      }
    }
  }, [formik.values.title, data]);

  if (loadingUser) return <Loader />;

  return (
    <section className="w-full">
      <Header title={`Ajouter une ${props.title}`} btnReturn />
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col justify-center items-center gap-5 px-36 py-10 animate-fade"
      >
        <div>
          <Input
            className="w-96 h-10 px-2 "
            list="title-suggestions"
            id="title"
            name="title"
            placeholder="Titre"
            {...formik.getFieldProps("title")}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="text-xs text-left text-red-500 mt-1 ml-2">
              {formik.errors.title}
            </p>
          )}
          <datalist id="title-suggestions">
            {suggestions.map((suggestion, index) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>
        </div>
        <div>
          <Select
            name="category"
            value={formik.values.category}
            onValueChange={(value) => formik.setFieldValue("category", value)}
          >
            <SelectTrigger className="w-96 h-10 px-2 ">
              <SelectValue placeholder="Entrez la catégorie" />
            </SelectTrigger>
            <SelectContent>
              {props.type === "Expense" &&
                categoryD.map(({ name }) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              {props.type === "Revenue" &&
                categoryR.map(({ name }) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {formik.touched.category && formik.errors.category && (
            <p className="text-xs text-left text-red-500 mt-1 ml-2">
              {formik.errors.category}
            </p>
          )}
        </div>

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
          <Textarea
            name="detail"
            className="w-96 h-20 px-2"
            placeholder="Détails"
            {...formik.getFieldProps("detail")}
          />
          {formik.touched.detail && formik.errors.detail && (
            <p className="text-xs text-left text-red-500 mt-1 ml-2">
              {formik.errors.detail}
            </p>
          )}
        </div>
        <div>
          <Input
            name="amount"
            className="w-96 h-10 px-2"
            type="number"
            step="0.01"
            placeholder="Montant"
            {...formik.getFieldProps("amount")}
          />
          {formik.touched.amount && formik.errors.amount && (
            <p className="text-xs text-left text-red-500 mt-1 ml-2">
              {formik.errors.amount}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={addTransactionMutation.isPending || !formik.isValid}
        >
          {addTransactionMutation.isPending
            ? "En cours ..."
            : `Soumettre la ${props.title}`}
        </Button>
      </form>
    </section>
  );
}
