import Header from "../../composant/Header";
import { useNavigate } from "react-router";
import BoxInfos from "../../composant/Box/BoxInfos";
import { useQuery } from "@tanstack/react-query";
import { fetchAccounts } from "../../Service/Epargn.service";
import { HttpStatusCode } from "axios";
import Loader from "../../composant/Loader/Loader";

export default function Epargn() {
  const navigate = useNavigate();

  const {
    isLoading,
    data: accounts,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["fetchAccounts"],
    queryFn: async () => {
      const response = await fetchAccounts();
      if (response?.status !== HttpStatusCode.Ok) {
        const message = response?.response?.data?.message || "Erreur";
        toast.warn(message);
      }
      return response?.data;
    },
    refetchOnMount: true,
  });

  if (isLoading) return <Loader />;

  return (
    <section className="w-full">
      <Header title="Épargne" btnAdd btnAddTransfert />
      <div className="flex flex-col w-full gap-4 animate-fade">
        <div className="flex gap-4 w-full">
          {accounts.map((account) => (
            <BoxInfos
              key={account.id}
              onClick={() => navigate(`/epargn/${account._id}`)}
              title={account.name}
              value={account.balance}
              isAmount
            />
          ))}
        </div>
      </div>
    </section>
  );
}
