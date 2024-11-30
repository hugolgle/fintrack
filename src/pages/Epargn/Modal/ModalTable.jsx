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

export default function ModalTable({ btnOpen, data, columns, formatData }) {
  return (
    <Dialog>
      <DialogTrigger>{btnOpen}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transactions</DialogTitle>
          <DialogDescription>Liste des transactions.</DialogDescription>
        </DialogHeader>
        <div className="w-full text-sm mt-4 max-h-52 overflow-auto">
          <div className="flex w-full font-thin italic pb-2">
            {columns?.map(({ name }) => (
              <p className="w-1/5 text-center">{name}</p>
            ))}
          </div>
          <Separator className="w-full mx-auto" />
          {data?.map((transaction, index) => {
            const formattedRow = formatData(transaction);
            return (
              <div
                key={index}
                className="flex w-full items-center py-2 text-xs"
              >
                {formattedRow.map((cell, cellIndex) => (
                  <p key={cellIndex} className="w-1/5 text-center">
                    {cell}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
