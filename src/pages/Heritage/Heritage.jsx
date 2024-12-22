import React from "react";
import Header from "../../composant/Header";
import BoxInfos from "../../composant/Box/BoxInfos";
import { ROUTES } from "../../composant/Routes";
import { Wallet } from "lucide-react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchAccounts } from "../../Service/Epargn.service";
import { HttpStatusCode } from "axios";
import { toast } from "sonner";
import Loader from "../../composant/Loader/Loader";
import { fetchInvestments } from "../../Service/Investment.service";
import { HandCoins } from "lucide-react";
import { Landmark } from "lucide-react";
import { AxeIcon } from "lucide-react";
import { fetchAssets } from "../../Service/Heritage.service";

export default function Heritage() {
  const navigate = useNavigate();

  const {
    isLoading: isLoadingAccounts,
    data: dataAccounts,
    isFetching: isFetchingAccounts,
  } = useQuery({
    queryKey: ["fetchAccounts"],
    queryFn: async () => {
      const response = await fetchAccounts();
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data || [];
    },
    refetchOnMount: true,
  });

  const {
    isLoading: isLoadingInvests,
    data: dataInvests,
    isFetching: isFetchingInvests,
  } = useQuery({
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

  const {
    isLoading: isLoadingAssets,
    data: dataAssets,
    isFetching: isFetchingAssets,
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

  const amountEpargn = (dataAccounts || []).reduce(
    (total, account) => total + account.balance,
    0
  );

  const amountInvestAll = Array.isArray(dataInvests)
    ? dataInvests.reduce((total, item) => {
        return total + (item?.amountBuy || 0);
      }, 0)
    : 0;

  const amountAssets = (dataAssets || []).reduce(
    (total, asset) => total + asset.estimatePrice,
    0
  );

  if (isLoadingAssets || isLoadingAccounts || isLoadingInvests) {
    return <Loader />;
  }

  return (
    <section className="w-full">
      <Header
        title="Patrimoine"
        isFetching={isFetchingAccounts || isFetchingInvests || isFetchingAssets}
        btnAdd={ROUTES.ADD_ASSET}
      />
      <div className="flex flex-col gap-4 animate-fade">
        <div className="flex gap-4">
          <BoxInfos
            onClick={() => navigate(ROUTES.EPARGN)}
            title="Épargne"
            value={amountEpargn}
            isAmount
            icon={<Landmark size={15} color="grey" />}
          />
          <BoxInfos
            onClick={() => navigate(ROUTES.INVESTMENT_ORDER)}
            title="Investissements"
            value={amountInvestAll}
            isAmount
            icon={<HandCoins size={15} color="grey" />}
          />
          <BoxInfos
            onClick={() => navigate(ROUTES.ASSETS_LIST)}
            title="Biens"
            value={amountAssets}
            isAmount
            icon={<AxeIcon size={15} color="grey" />}
          />
        </div>
      </div>
    </section>
  );
}
