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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import { Check } from "lucide-react";
import { LoaderCircle } from "lucide-react";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .max(50, "Le titre est trop long")
    .required("Le titre est requis"),
  type: yup.string().required("Le type est requis"),
  symbol: yup.string(),
});

export default function PageAddInvest() {
  const userId = getUserIdFromToken();

  const { data: userInfo, isLoading: loadingUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getCurrentUser(userId),
    enabled: !!userId,
  });
  // const { data } = useQuery({
  //   queryKey: ["fetchInvestments"],
  //   queryFn: async () => {
  //     const response = await fetchInvestments(userInfo?._id);
  //     if (response?.status !== HttpStatusCode.Ok) {
  //       const message = response?.response?.data?.message || "Erreur";
  //       toast.warn(message);
  //     }
  //     return response?.data;
  //   },
  //   refetchOnMount: true,
  // });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  // const suggestions = [ "Autre", ...getTitleOfTransactionsByType(data,
  //   props.type), ];

  // const suggestions = [...new Set(data?.map((investment) => investment.title))];
  const suggestions = ["Test"];

  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      symbol: "",
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values, { resetForm }) => {
      const postData = {
        user: userInfo?._id,
        name: values.name,
        type: values.type,
        symbol: values.symbol,
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

  // useEffect(() => {
  //   if (formik.values.name) {
  //     const lastInvestment = data
  //       .filter((investment) => investment.title === formik.values.name)
  //       .sort(
  //         (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  //       )[0];

  //     if (lastInvestment) {
  //       formik.setFieldValue("type", lastInvestment.type || "");
  //     }
  //   }
  // }, [formik.values.name, data]);

  if (loadingUser) return <Loader />;

  return (
    <section className="h-full">
      <Header title="Ajouter un investissement" btnReturn />
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col justify-center items-center mx-auto max-w-sm gap-5 py-10 animate-fade"
      >
        {/* <Popover>
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
          <p className="text-xs text-left flex items-start w-full text-red-500 -mt-3 ml-2">
            {formik.errors.date}
          </p>
        )} */}
        {/* <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="input" role="combobox" aria-expanded={open}>
              {formik.values.name || "Sélectionnez un titre..."}
              <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Command>
              <CommandInput placeholder="Rechercher un titre..." />
              <CommandList>
                {suggestions.length === 0 ? (
                  <CommandEmpty>Aucune suggestion trouvée.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {suggestions.map((suggestion, index) => (
                      <CommandItem
                        key={index}
                        onSelect={() => {
                          formik.setFieldValue("title", suggestion);
                          setValue(suggestion);
                          setOpen(false);
                        }}
                      >
                        {suggestion}
                        {value === suggestion && (
                          <Check className="ml-auto h-4 w-4 opacity-100" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover> */}
        <Input
          id="name"
          name="name"
          placeholder="Nom"
          {...formik.getFieldProps("name")}
        />
        <Input
          id="symbol"
          name="symbol"
          placeholder="Symbole"
          {...formik.getFieldProps("symbol")}
        />
        {formik.touched.symbol && formik.errors.symbol && (
          <p className="text-xs text-left flex items-start w-full text-red-500 -mt-3 ml-2">
            {formik.errors.symbol}
          </p>
        )}
        <Select
          name="type"
          value={formik.values.type}
          onValueChange={(value) => formik.setFieldValue("type", value)}
          required
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
          <p className="text-xs text-left flex items-start w-full text-red-500 -mt-3 ml-2">
            {formik.errors.type}
          </p>
        )}
        <Button disabled={addInvestmentMutation.isPending || !formik.isValid}>
          {addInvestmentMutation.isPending ? (
            <>
              En cours{" "}
              <LoaderCircle
                size={15}
                strokeWidth={1}
                className="ml-2 animate-spin"
              />
            </>
          ) : (
            "Soumettre l'investissement"
          )}
        </Button>
      </form>
    </section>
  );
}
