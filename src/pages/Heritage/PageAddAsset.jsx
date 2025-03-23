import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { useMutation } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Header from "../../components/Header.jsx";
import { useFormik } from "formik";
import * as yup from "yup";

import ButtonLoading from "../../components/Button/ButtonLoading.jsx";
import { addAsset } from "../../Service/Heritage.service.jsx";
import { useState } from "react";

const validationSchema = yup.object().shape({
  category: yup.string().required("La catégorie est requise"),
  name: yup.string().required("Le nom est requis"),
  detail: yup.string(),
  acquisitionDate: yup.date().required("La date d'acquisition est requise"),
  acquisitionPrice: yup
    .number()
    .positive()
    .required("Le prix d'acquisition est requis"),
  estimatePrice: yup
    .number()
    .positive()
    .required("Le prix d'estimation est requis"),
});

export default function PageAddAsset() {
  const [open, setOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      category: "",
      name: "",
      acquisitionDate: "",
      detail: "",
      acquisitionPrice: "",
      estimatePrice: "",
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      const postData = {
        category: values.category,
        name: values.name,
        acquisitionDate: values.acquisitionDate.toLocaleDateString("fr-CA"),
        detail: values.detail,
        acquisitionPrice: values.acquisitionPrice,
        estimatePrice: values.estimatePrice,
      };

      addAssetMutation.mutate(postData);
      formik.resetForm();
    },
  });

  const addAssetMutation = useMutation({
    mutationFn: async (postData) => {
      const response = await addAsset(postData);
      return response;
    },
    onSuccess: (response) => {
      toast.success(response?.data.message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  return (
    <section className="h-full">
      <Header title="Ajouter un bien" btnReturn />
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col justify-center items-center mx-auto max-w-sm gap-5 py-10 animate-fade"
      >
        <Select
          name="category"
          value={formik.values.category}
          onValueChange={(value) => formik.setFieldValue("category", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="realEstate">Immobilier</SelectItem>
            <SelectItem value="furniture">Mobilier</SelectItem>
          </SelectContent>
        </Select>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="input">
              {formik.values.acquisitionDate ? (
                format(formik.values.acquisitionDate, "PP", { locale: fr })
              ) : (
                <span>Choisir une date d'acquisition</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formik.values.acquisitionDate}
              onSelect={(acquisitionDate) => {
                formik.setFieldValue("acquisitionDate", acquisitionDate);
                setOpen(false);
              }}
              initialFocus
              locale={fr}
            />
          </PopoverContent>
        </Popover>
        {formik.touched.acquisitionDate && formik.errors.acquisitionDate && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.acquisitionDate}
          </p>
        )}

        <Input
          id="name"
          type="text"
          name="name"
          placeholder="Nom"
          {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.name}
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
          id="acquisitionPrice"
          type="number"
          step="0.01"
          name="acquisitionPrice"
          placeholder="Prix d'acquisition"
          {...formik.getFieldProps("acquisitionPrice")}
        />
        {formik.touched.acquisitionPrice && formik.errors.acquisitionPrice && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.acquisitionPrice}
          </p>
        )}

        <Input
          id="estimatePrice"
          type="number"
          step="0.01"
          name="estimatePrice"
          placeholder="Prix d'estimation"
          {...formik.getFieldProps("estimatePrice")}
        />
        {formik.touched.estimatePrice && formik.errors.estimatePrice && (
          <p className="text-[10px] text-left flex items-start w-full text-red-500 -mt-4 ml-2">
            {formik.errors.estimatePrice}
          </p>
        )}

        <ButtonLoading
          variant="secondary"
          text="Soumettre"
          disabled={addAssetMutation.isPending}
          isPending={addAssetMutation.isPending}
        />
      </form>
    </section>
  );
}
