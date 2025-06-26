import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "../../../utils/fonctionnel";

export default function ModalTable({
  btnOpen,
  data,
  columns,
  formatData,
  title,
  description,
  initialAmount,
}) {
  return (
    <Dialog>
      <DialogTrigger>{btnOpen}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="w-full text-sm mt-4 max-h-52 overflow-auto">
          <div className="flex w-full font-thin italic pb-2">
            {columns?.map(({ id, name }) => (
              <p key={id} className="w-full text-center">
                {name}
              </p>
            ))}
          </div>
          <Separator className="w-full mx-auto bg-secondary" />
          {data?.map((transaction, index) => {
            const formattedRow = formatData(transaction);
            return (
              <div
                key={index}
                className="flex w-full items-center py-2 text-xs"
              >
                {formattedRow.map((cell, cellIndex) => (
                  <p key={cellIndex} className="w-full text-center">
                    {cell}
                  </p>
                ))}
              </div>
            );
          })}
          {initialAmount && (
            <>
              <Separator className="w-full mx-auto bg-secondary" />
              <div className="text-xs flex justify-end gap-4 items-center py-2">
                <p className="text-gray-400">Montant initial:</p>
                <p>{formatCurrency.format(initialAmount)}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
