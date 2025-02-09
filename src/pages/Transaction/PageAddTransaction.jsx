"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
import { useEffect } from "react";
import { alphaSort, nameType } from "../../utils/other";
import {
  getTagsOfTransactions,
  getTitleOfTransactionsByType,
  getTransactionsByType,
} from "../../utils/operations";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { fr } from "date-fns/locale";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Header from "../../composant/Header.jsx";
import {
  addTransaction,
  fetchTransactions,
} from "../../Service/Transaction.service";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../composant/Loader/Loader";
import { useFormik } from "formik";
import * as yup from "yup";
import { HttpStatusCode } from "axios";
import { getUserIdFromToken } from "../../utils/users";
import { getCurrentUser } from "../../Service/User.service";
import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Check } from "lucide-react";
import ButtonLoading from "../../composant/Button/ButtonLoading.jsx";
import { X } from "lucide-react";
import { Plus } from "lucide-react";

const validationSchema = yup.object().shape({
  title: yup
    .string()
    .max(50, "Le titre est trop long")
    .required("Le titre est requis"),
  titleBis: yup
    .string()
    .max(50, "Le titre est trop long")
    .when("title", (title, schema) =>
      title === "Autre" ? schema.required("Le titre bis est requis") : schema
    ),
  category: yup.string().required("La catégorie est requise"),
  date: yup.date().required("La date est requise"),
  detail: yup.string().max(250, "Les détails sont trop longs"),
  amount: yup
    .number()
    .positive("Le montant doit être positif")
    .required("Le montant est requis"),
  tag: yup.array().of(yup.string()).nullable(),
});

export default function PageAddTransac(props) {
  const userId = getUserIdFromToken();

  const {
    isLoading: isLoadingUser,
    data: dataUser,
    isFetching: isFetchingUser,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getCurrentUser(userId),
    enabled: !!userId,
  });

  const queryClient = useQueryClient();

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const {
    isLoading: isLoadingTransactions,
    data: dataTransactions,
    isFetching: isFetchingTransactions,
    refetch,
  } = useQuery({
    queryKey: ["fetchTransactions"],
    queryFn: async () => {
      const response = await fetchTransactions();
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data;
    },
    refetchOnMount: true,
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [openCalendar, setOpenCalendar] = useState(false);

  const categoryD = alphaSort(categoryDepense);
  const categoryR = alphaSort(categoryRecette);

  const suggestions = [
    "Autre",
    ...getTitleOfTransactionsByType(dataTransactions, props.type),
  ];

  const tagsSuggestions = getTagsOfTransactions(dataTransactions);

  const addTransactionMutation = useMutation({
    mutationFn: async (postData) => {
      return await addTransaction(postData, dataUser?._id);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries(["fetchTransactions"]);
      refetch();
      formik.resetForm();
      setTags([]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      titleBis: "",
      category: "",
      date: new Date(),
      detail: "",
      amount: "",
      tag: tags,
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      const postData = {
        user: dataUser?._id,
        type: props.type,
        category: values.category,
        title: values.title === "Autre" ? values.titleBis : values.title,
        date: values.date.toLocaleDateString("fr-CA"),
        detail: values.detail,
        amount: values.amount,
        tag: tags,
      };
      addTransactionMutation.mutate(postData);
    },
  });

  const handleAddTag = () => {
    if (tagInput.trim() === "") {
      toast.warning("Le tag ne peut pas être vide.");
      return;
    }

    if (tags.length >= 3) {
      toast.warning("Vous ne pouvez pas ajouter plus de 3 tags.");
      return;
    }

    if (!tags.includes(tagInput)) {
      setTags((prevTags) => [...prevTags, tagInput]);
      setTagInput("");
    } else {
      toast.warning("Ce tag a déjà été ajouté.");
    }
  };

  const handleSelectTag = (suggestion) => {
    if (!tags.includes(suggestion)) {
      setTags((prevTags) => [...prevTags, suggestion]);
    }
  };

  const handleRemoveTag = (index) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const dataByType = getTransactionsByType(dataTransactions, props.type);
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
  }, [formik.values.title, dataTransactions]);

  if (isLoadingUser || isLoadingTransactions) return <Loader />;

  return (
    <section className="w-full">
      <Header
        title={`Ajouter ${props.title === "dépense" ? "une" : "un"} ${props.title}`}
        isFetching={isFetchingTransactions || isFetchingUser}
        btnReturn
      />
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col justify-center items-center mx-auto max-w-sm gap-5 py-10 animate-fade"
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="input" role="combobox" aria-expanded={open}>
              {formik.values.title || "Sélectionnez un titre..."}
              <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          {formik.touched.title && formik.errors.title && (
            <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
              {formik.errors.title}
            </p>
          )}
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
                          formik.setTouched({ ...formik.touched, title: true });
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
        </Popover>

        {formik.values.title === "Autre" && (
          <>
            <Input
              id="titleBis"
              name="titleBis"
              placeholder="Titre"
              {...formik.getFieldProps("titleBis")}
            />
            {formik.touched.titleBis && formik.errors.titleBis && (
              <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
                {formik.errors.titleBis}
              </p>
            )}
          </>
        )}

        <Select
          name="category"
          value={formik.values.category}
          onValueChange={(value) => formik.setFieldValue("category", value)}
        >
          <SelectTrigger>
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
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.category}
          </p>
        )}

        <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
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
              onSelect={(date) => {
                formik.setFieldValue("date", date);
                setOpenCalendar(false);
              }}
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

        <Textarea
          name="detail"
          placeholder="Détails"
          {...formik.getFieldProps("detail")}
        />
        {formik.touched.detail && formik.errors.detail && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.detail}
          </p>
        )}

        <Input
          name="amount"
          type="number"
          step="0.01"
          placeholder="Montant"
          {...formik.getFieldProps("amount")}
        />
        {formik.touched.amount && formik.errors.amount && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.amount}
          </p>
        )}

        <div className="w-full flex justify-center gap-2 items-center">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
            placeholder="Ajouter un tag"
          />
          <Button type="button" variant="secondary" onClick={handleAddTag}>
            <Plus strokeWidth={1} />
          </Button>
        </div>

        <div className="flex gap-2">
          <ul className="space-y-2">
            {tagInput && (
              <ul className="space-y-2">
                {tagsSuggestions
                  .filter(
                    (suggestion) =>
                      suggestion
                        .toLowerCase()
                        .includes(tagInput.toLowerCase()) &&
                      !tags.includes(suggestion)
                  )
                  .map((suggestion, index) => (
                    <Badge
                      key={index}
                      className="relative flex items-center animate-pop-up gap-2"
                      variant="secondary"
                    >
                      {suggestion}
                      <Plus
                        className="absolute bg-green-500 rounded-full p-[3px] right-0 top-0 transform translate-x-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={() => handleSelectTag(suggestion)}
                        size={16}
                      />
                    </Badge>
                  ))}
              </ul>
            )}
          </ul>

          <ul className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                className="group relative flex items-center animate-pop-up gap-2"
                variant="outline"
              >
                {tag}
                <X
                  className="absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-all cursor-pointer"
                  onClick={() => handleRemoveTag(index)}
                  size={12}
                />
              </Badge>
            ))}
          </ul>
        </div>

        <ButtonLoading
          variant="secondary"
          type="submit"
          text="Soumettre"
          isPending={addTransactionMutation.isPending}
          disabled={addTransactionMutation.isPending}
        />
      </form>
    </section>
  );
}
