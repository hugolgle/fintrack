import { useFormik } from "formik";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { editInvestments } from "../service/investment.service";
import { formatAmount } from "../utils/fonctionnel";

// Define validation schema for form fields
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

export function DialogEditInvest({ investment, refetch, data }) {
  const initialValues = {
    title: investment?.data?.title || "",
    type: investment?.data?.type || "",
    date: investment?.data?.date
      ? new Date(investment?.data?.date)
      : new Date(),
    detail: investment?.data?.detail || "",
    amount: investment?.data?.amount || "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      mutationEdit.mutate(values);
    },
  });

  const mutationEdit = useMutation({
    mutationFn: async (values) => {
      const editData = {
        id: investment?.data?._id,
        type: values.type,
        title: values.title,
        date: values.date.toLocaleDateString("fr-CA"),
        detail: values.detail,
        amount: formatAmount(values.amount),
      };
      return await editInvestments(editData);
    },
    onSuccess: (response) => {
      refetch();
      formik.resetForm();
      toast.success(response?.data?.message);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const suggestionsTitle = Array.from(
    new Set(data?.map((investment) => investment.title))
  );

  const dataBase = [
    investment?.data?.title,
    investment?.data?.detail,
    investment?.data?.amount,
    investment?.data?.type,
    investment?.data?.date,
  ];

  const dataEdit = [
    formik.values?.title,
    formik.values?.detail,
    formik.values?.amount,
    formik.values?.type,
    formik.values?.date.toLocaleDateString("fr-CA"),
  ];

  const isSaveDisabled = dataBase.every(
    (value, index) => value === dataEdit[index]
  );

  return (
    <Dialog asChild>
      <DialogTrigger>
        <Button>Modifier</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modifier l'investissement</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'investissement.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button variant="outline">
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
                  }}
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
            {formik.touched.date && formik.errors.date && (
              <p className="text-xs text-left text-red-500 mt-1 ml-2">
                {formik.errors.date}
              </p>
            )}
            <Input
              list="title-suggestions"
              value={formik.values.title}
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

            <datalist id="title-suggestions">
              {suggestionsTitle.map((suggestion, index) => (
                <option key={index} value={suggestion} />
              ))}
            </datalist>

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
              <p className="text-xs text-left text-red-500 mt-1 ml-2">
                {formik.errors.type}
              </p>
            )}

            <Textarea
              placeholder="Détails"
              {...formik.getFieldProps("detail")}
              name="detail"
            />
            {formik.touched.detail && formik.errors.detail && (
              <p className="text-xs text-left text-red-500 mt-1 ml-2">
                {formik.errors.detail}
              </p>
            )}

            <Input
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

          <DialogFooter className="sm:justify-start">
            <Button
              disabled={mutationEdit.isPending || isSaveDisabled}
              type="submit"
            >
              {mutationEdit.isPending ? "Chargement ..." : "Modifier"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
