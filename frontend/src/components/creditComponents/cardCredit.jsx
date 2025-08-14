"use client";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import Container from "../containers/container";
import typeCreditList from "../../../public/typeCredit.json";
import * as Icons from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { deleteCredit, updateStatus } from "../../services/credit.service";
import { toast } from "sonner";
import { FormPayment } from "../../pages/credits/formPayment";
import { formatCurrency } from "../../utils/fonctionnel";
import { FormCredit } from "../../pages/credits/formCredit";
import { useAmountVisibility } from "../../context/AmountVisibilityContext";

export function CreditCardComponent({ credit, isActive, onClick, refetch }) {
  const queryClient = useQueryClient();
  const { isVisible } = useAmountVisibility();
  const mutationDelete = useMutation({
    mutationFn: async (itemId) => {
      return await deleteCredit(itemId);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries(["fetchCredits"]);
      refetch();
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  const mutationUpdateStatus = useMutation({
    mutationFn: async (itemId) => {
      return await updateStatus(itemId, !credit.isActive);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries(["fetchCredits"]);
      refetch();
    },
    onError: (error) => {
      toast.error(error?.data?.message);
    },
  });

  const typeInfo = typeCreditList.find((t) => t.key === credit.type) || {};
  const IconComponent = Icons[typeInfo.icon] || Icons.CreditCard;
  const amount = Number(credit.amount) || 0;
  const balance = Number(credit.balance) || 0;
  const monthly = Number(credit.monthlyPayment) || 0;
  const insurance = Number(credit.insurance) || 0;

  const progress = amount > 0 ? ((amount - balance) / amount) * 100 : 0;

  return (
    <Container
      custom={cn(
        "cursor-pointer transition-all group",
        !credit.isActive && "opacity-50",
        isActive ? "ring-1 ring-muted-foreground" : ""
      )}
      onClick={onClick}
    >
      <div className="p-2">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div
              className="p-2 rounded-full mr-3 flex items-center justify-center"
              style={{ backgroundColor: typeInfo.color || "#ccc" }}
            >
              <IconComponent className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-left">{credit.name || "—"}</h3>
                {!credit.isActive && (
                  <Icons.ShieldCheck className="h-4 w-4 text-green-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground text-left">
                {typeInfo.name || credit.type}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Icons.MoreHorizontal
                className={`cursor-pointer opacity-0 ${isActive && "opacity-100"} group-hover:opacity-100 transition-all`}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom">
              <Dialog modal>
                <DialogTrigger>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Icons.Plus className="mr-2 h-4 w-4" />
                    Ajouter un paiement
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <FormPayment credit={credit} refetch={refetch} />
                </DialogContent>
              </Dialog>
              <DropdownMenuItem
                onClick={() => {
                  mutationUpdateStatus.mutate(credit._id);
                }}
                onSelect={(e) => e.preventDefault()}
              >
                {credit.isActive ? (
                  <Icons.ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                ) : (
                  <Icons.ShieldCheck className="mr-2 h-4 w-4 text-red-500" />
                )}

                {credit.isActive ? "Remboursé" : "Non-remboursé"}
              </DropdownMenuItem>
              <Dialog modal>
                <DialogTrigger className="w-full">
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Icons.Pen className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <FormCredit credit={credit} refetch={refetch} editMode />
                </DialogContent>
              </Dialog>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                onClick={() => {
                  mutationDelete.mutate(credit._id);
                }}
                className="text-red-500"
              >
                <Icons.Trash className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Chiffres clés */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Restant dû</p>
            <p className="font-thin">
              {isVisible ? formatCurrency.format(balance) : "••••"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Mensualité</p>
            <p className="font-thin">
              {isVisible ? formatCurrency.format(monthly + insurance) : "••••"}
            </p>
          </div>
        </div>

        {/* Progression */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </div>
    </Container>
  );
}
