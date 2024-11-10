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
import { LoaderCircle } from "lucide-react";

export function DialogDelete({ handleDelete, isPending }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Supprimer</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette opération ?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start">
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? (
              <>
                Suppression{" "}
                <LoaderCircle
                  size={15}
                  strokeWidth={1}
                  className="ml-2 animate-spin"
                />
              </>
            ) : (
              "Oui"
            )}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Non
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
