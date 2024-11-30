import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { Trash } from "lucide-react";
import { deleteInvestment } from "../Service/Investment.service";
import { toast } from "sonner";
import { useParams } from "react-router";
import ButtonLoading from "./Button/ButtonLoading";

export function DialogDelete() {
  const { id } = useParams();

  const navigate = useNavigate();
  const mutationDelete = useMutation({
    mutationFn: async () => {
      return await deleteInvestment(id);
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      navigate(-1);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Trash
            size={20}
            className="cursor-pointer hover:scale-110 transition-all"
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Êtes-vous sûr de vouloir supprimer cette ordre ?
            </DialogTitle>
          </DialogHeader>

          <DialogFooter className="sm:justify-start">
            <ButtonLoading
              text="Oui"
              textBis="Suppression"
              isPending={mutationDelete.isPending}
              onClick={mutationDelete.mutate}
              variant="destructive"
            />
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Non
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
