"use client";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Header from "../../composant/Header.jsx";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  addInvestment,
  addTransaction,
  fetchInvestments,
} from "../../Service/Investment.service.jsx";
import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as yup from "yup";
import { getUserIdFromToken } from "../../utils/users.js";
import { getCurrentUser } from "../../Service/User.service.jsx";
import { LoaderCircle } from "lucide-react";
import ButtonLoading from "../../composant/Button/ButtonLoading.jsx";
import { HttpStatusCode } from "axios";
import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Check } from "lucide-react";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loader from "../../composant/Loader/Loader.jsx";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .max(50, "Le titre est trop long")
    .required("Le titre est requis"),
  type: yup.string().when("name", {
    is: "Autre",
    then: (schema) => schema.required("Le type est requis"),
    otherwise: (schema) => schema.notRequired(),
  }),
  symbol: yup.string().when(["name", "type"], {
    is: (name, type) =>
      name === "Autre" || type === "Action" || type === "Crypto",
    then: (schema) =>
      schema
        .required("Le symbole est requis")
        .uppercase("Le symbole doit être en majuscules"),
    otherwise: (schema) => schema.notRequired(),
  }),

  action: yup.boolean().required("L'action est requise"),
  amount: yup
    .number()
    .required("Le montant est requis")
    .min(0, "Le montant ne peut pas être négatif")
    .max(999999, "Montant trop élevé"),
  date: yup.date().required("La date est requise"),
});

export default function PageAddInvestmentMain() {
  const userId = getUserIdFromToken();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("transaction");
  const [selectedSuggestion, setSelectedSuggestion] = useState("");
  const [idInvest, setIdInvest] = useState("");

  const { data: userInfo, isLoading: loadingUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getCurrentUser(userId),
    enabled: !!userId,
  });

  const { isLoading: loadingInvestments, data: dataInvest } = useQuery({
    queryKey: ["fetchInvestments"],
    queryFn: async () => {
      const response = await fetchInvestments();
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data;
    },
    refetchOnMount: true,
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      symbol: "",
      action: "",
      amount: "",
      date: new Date(),
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      const postData =
        activeTab === "autre"
          ? {
              user: userInfo?._id,
              name: values.name,
              type: values.type,
              symbol: values.symbol,
              transaction: {
                action: values.action === "true",
                amount: parseFloat(values.amount),
                date: values.date.toISOString(),
              },
            }
          : {
              action: values.action === "true",
              amount: values.amount,
              date: values.date.toLocaleDateString("fr-CA"),
            };
      activeTab === "autre"
        ? addInvestmentMutation.mutate(postData)
        : addTransactionInvestmentMutation.mutate(postData);

      formik.resetForm();
    },
  });

  const addInvestmentMutation = useMutation({
    mutationFn: (postData) => addInvestment(postData, userInfo?._id),
    onSuccess: () => toast.success("Votre investissement a été ajouté !"),
    onError: (error) =>
      toast.error(error?.response?.data?.message || "Une erreur est survenue."),
  });

  const addTransactionInvestmentMutation = useMutation({
    mutationFn: async (postData) => {
      const response = await addTransaction(idInvest, postData);
      return response;
    },
    onSuccess: () => {
      toast.success("Votre investissement a été ajouté !");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  if (loadingUser || loadingInvestments) return <Loader />;

  return (
    <section className="h-full">
      <Header title="Ajouter un investissement" btnReturn />
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col justify-center items-center mx-auto max-w-sm gap-5 py-10 animate-fade"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transaction">Transaction</TabsTrigger>
            <TabsTrigger value="autre">Nouvel actif</TabsTrigger>
          </TabsList>

          <TabsContent value="transaction">
            <div className="flex flex-col space-y-4">
              <Popover open={open} onOpenChange={setOpen} className="py-2">
                <PopoverTrigger asChild>
                  <Button variant="input" role="combobox" aria-expanded={open}>
                    {selectedSuggestion || "Sélectionnez un actif..."}
                    <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Rechercher un actif..." />
                    <CommandList>
                      {dataInvest?.length === 0 ? (
                        <CommandEmpty>Aucune suggestion trouvée.</CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {dataInvest?.map((suggestion, index) => (
                            <CommandItem
                              key={index}
                              onSelect={() => {
                                formik.setFieldValue("name", suggestion.name);
                                setSelectedSuggestion(suggestion.name);
                                setIdInvest(suggestion._id);
                                setOpen(false);
                              }}
                            >
                              {suggestion.name}
                              {selectedSuggestion === suggestion.name && (
                                <Check className="ml-auto h-4 w-4 opacity-100" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Select
                name="action"
                value={formik.values.action}
                onValueChange={(value) => formik.setFieldValue("action", value)}
                required
                className="py-2"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Vendre</SelectItem>
                  <SelectItem value="false">Acheter</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
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
                    onSelect={(date) => formik.setFieldValue("date", date)}
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
                type="float"
                name="amount"
                placeholder="Montant"
                {...formik.getFieldProps("amount")}
              />
              {formik.touched.amount && formik.errors.amount && (
                <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
                  {formik.errors.amount}
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="autre">
            <div className="flex flex-col space-y-4">
              <Select
                name="type"
                value={formik.values.type}
                onValueChange={(value) => formik.setFieldValue("type", value)}
              >
                <SelectTrigger>
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
                <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
                  {formik.errors.type}
                </p>
              )}
              <Input
                id="name"
                name="name"
                placeholder="Nom de l'actif"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
                  {formik.errors.name}
                </p>
              )}
              {(formik.values.type === "Action" ||
                formik.values.type === "Crypto") && (
                <>
                  <Input
                    id="symbol"
                    name="symbol"
                    placeholder="Symbole"
                    {...formik.getFieldProps("symbol")}
                  />
                  {formik.touched.symbol && formik.errors.symbol && (
                    <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
                      {formik.errors.symbol}
                    </p>
                  )}
                </>
              )}

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
                  <SelectItem value="true">Vendre</SelectItem>
                  <SelectItem value="false">Acheter</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
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
                    onSelect={(date) => formik.setFieldValue("date", date)}
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
                type="float"
                name="amount"
                placeholder="Montant"
                {...formik.getFieldProps("amount")}
              />
              {formik.touched.amount && formik.errors.amount && (
                <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
                  {formik.errors.amount}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <ButtonLoading
          text="Soumettre l'investissement"
          textBis="En cours"
          isPending={addInvestmentMutation.isPending}
          disabled={addInvestmentMutation.isPending || !formik.isValid}
        />
      </form>
    </section>
  );
}
