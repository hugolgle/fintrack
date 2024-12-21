import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ButtonLoading({
  variant = "secondary",
  isPending,
  onClick = () => {},
  text,
  type,
  disabled,
}) {
  return (
    <Button
      type={type}
      variant={variant}
      disabled={disabled}
      onClick={() => onClick()}
      className="animate-fade w-full"
    >
      {isPending ? (
        <LoaderCircle size={15} strokeWidth={1} className="ml-2 animate-spin" />
      ) : (
        text
      )}
    </Button>
  );
}
