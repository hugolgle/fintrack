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

export function DialogDelete({ btnDelete, handleDelete }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="none" className="w-full p-0 h-fit">
          {btnDelete}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette transaction ?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete} // Appel direct à handleLogout
          >
            Oui
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
