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
import { LoaderCircle } from "lucide-react";

// Define validation schema for form fields
const validationSchema = yup.object().shape({
  name: yup
    .string()
    .max(50, "Le titre est trop long")
    .required("Le titre est requis"),
  symbol: yup.string().max(250, "Les détails sont trop longs"),
  type: yup.string().required("Le type est requis"),
});

export function DialogEditInvest({ investment, refetch, data, btnOpen }) {
  const initialValues = {
    name: investment?.name || "",
    symbol: investment?.symbol || "",
    type: investment?.type || "",
  };
  // console.log(investment);
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
        id: investment?._id,
        name: values.name,
        symbol: values.symbol,
        type: values.type,
      };
      return await editInvestments(editData);
    },
    onSuccess: (response) => {
      refetch();
      formik.resetForm();
      toast.success(response?.message);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const dataBase = [investment?.name, investment?.symbol, investment?.type];

  const dataEdit = [
    formik.values?.name,
    formik.values?.symbol,
    formik.values?.type,
  ];

  const isSaveDisabled = dataBase.every(
    (value, index) => value === dataEdit[index]
  );

  return (
    <Dialog asChild>
      <DialogTrigger>{btnOpen}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modifier l'investissement</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'investissement.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={formik.values.name}
              type="text"
              maxLength={50}
              placeholder="Nom"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="name"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-xs text-left text-red-500 mt-1 ml-2">
                {formik.errors.name}
              </p>
            )}

            <Input
              value={formik.values.symbol}
              type="text"
              maxLength={50}
              placeholder="Symbole"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="symbol"
            />
            {formik.touched.symbol && formik.errors.symbol && (
              <p className="text-xs text-left text-red-500 mt-1 ml-2">
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
              <p className="text-xs text-left text-red-500 mt-1 ml-2">
                {formik.errors.type}
              </p>
            )}
          </div>

          <DialogFooter className="sm:justify-start">
            <Button
              disabled={mutationEdit.isPending || isSaveDisabled}
              type="submit"
            >
              {mutationEdit.isPending ? (
                <>
                  Chargement{" "}
                  <LoaderCircle
                    size={15}
                    strokeWidth={1}
                    className="ml-2 animate-spin"
                  />
                </>
              ) : (
                "Modifier"
              )}
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
