import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ButtonLoading({
  variant,
  isPending,
  onClick = () => {},
  text,
  textBis,
  type,
  disabled,
}) {
  return (
    <Button
      type={type}
      variant={variant}
      disabled={disabled}
      onClick={() => onClick()}
      className="animate-fade"
    >
      {isPending ? (
        <>
          {textBis}
          <LoaderCircle
            size={15}
            strokeWidth={1}
            className="ml-2 animate-spin"
          />
        </>
      ) : (
        text
      )}
    </Button>
  );
}
