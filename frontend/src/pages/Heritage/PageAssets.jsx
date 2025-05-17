import Tableau from "../../composant/Table/Table.jsx";
import Header from "../../composant/Header.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "../../composant/loader/loader.jsx";
import { HttpStatusCode } from "axios";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Pencil } from "lucide-react";
import { Trash } from "lucide-react";

import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { ROUTES } from "../../composant/Routes.jsx";
import { formatCurrency } from "../../utils/fonctionnel.js";
import { toast } from "sonner";
import { deleteAsset, fetchAssets } from "../../service/Heritage.service.jsx";
import { FormEditAsset } from "./FormEditAsset.jsx";

export default function PageAssets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const queryClient = useQueryClient();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    performSearch(event.target.value);
  };

  const {
    isLoading,
    data: dataAssets,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["fetchAssets"],
    queryFn: async () => {
      const response = await fetchAssets();
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data || [];
    },
    refetchOnMount: true,
  });

  const mutationDeleteAsset = useMutation({
    mutationFn: async (id) => {
      return await deleteAsset(id);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries(["fetchAssets"]);
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  const columns = [
    { id: 1, name: "Catégorie", key: "category" },
    { id: 2, name: "Nom", key: "name" },
    { id: 3, name: "Date d'aquisition", key: "acquisitionDate" },
    { id: 4, name: "Prix estimé", key: "estimatePrice" },
    { id: 5, name: "Prix d'acquisition", key: "acquisitionPrice" },
  ];

  const displayData = dataAssets?.map(
    ({
      _id,
      name,
      category,
      acquisitionDate,
      acquisitionPrice,
      estimatePrice,
      createdAt,
    }) => {
      return {
        _id,
        category,
        name,
        date: acquisitionDate,
        amount: acquisitionPrice,
        estimatePrice,
        createdAt,
      };
    }
  );

  const performSearch = (term) => {
    const filteredData = displayData.filter((item) => {
      const nameMatches = item.name?.toLowerCase().includes(term.toLowerCase());
      const categoryMatches = item.category
        ?.toLowerCase()
        .includes(term.toLowerCase());
      const dateMatches = item.date?.toLowerCase().includes(term.toLowerCase());
      const priceMatches = item.amount
        .toString()
        .toLowerCase()
        .includes(term.toLowerCase());
      const estimatePriceMatches = item.estimatePrice
        .toString()
        .toLowerCase()
        .includes(term.toLowerCase());

      return (
        nameMatches ||
        categoryMatches ||
        dateMatches ||
        priceMatches ||
        estimatePriceMatches
      );
    });
    setSearchResults(filteredData);
  };

  const formatData = (row) => {
    const categoryTranslate =
      row.category === "furniture"
        ? "Mobilier"
        : row.category === "realEstate" && "Immobilier";

    return [
      categoryTranslate,
      row.name,
      format(row.date, "PP", { locale: fr }),
      `≈ ${formatCurrency.format(row.estimatePrice)}`,
      formatCurrency.format(row.amount),
    ];
  };

  const data = searchTerm ? searchResults : displayData;

  const action = (item) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreHorizontal className="cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left">
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <FormEditAsset asset={item} refetch={refetch} />
            </DialogContent>
          </Dialog>

          <DropdownMenuItem
            onClick={() => {
              mutationDeleteAsset.mutate(item._id);
            }}
            onSelect={(e) => e.preventDefault()}
            className="text-red-500"
          >
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <section className="w-full relative">
        <Header
          title="Liste des biens"
          btnSearch={{ handleSearchChange, searchTerm }}
          btnReturn
          btnAdd={ROUTES.ADD_ASSET}
          isFetching={isFetching}
        />

        <Tableau
          formatData={formatData}
          data={searchTerm ? searchResults : displayData}
          columns={columns}
          isFetching={isFetching}
          action={action}
          multiselect
        />
      </section>
    </>
  );
}
