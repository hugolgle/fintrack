import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/loaders/loader.jsx";
import { ROUTES } from "../../components/route.jsx";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "../../context/authContext.jsx";

const ButtonGradient = ({ className, ...props }) => (
  <Button
    className={cn(
      "bg-gradient-to-r from-blue-500 to-indigo-500 text-primary-foreground hover:shadow-lg shadow-indigo-400 dark:shadow-indigo-700 dark:text-foreground hover:to-blue-500 transition",
      className
    )}
    {...props}
  />
);

export default function Home() {
  const navigate = useNavigate();
  const { user: dataUser, isLoading } = useAuth();
  if (isLoading) return <Loader />;

  return (
    <section className="w-full h-screen">
      <div className="flex flex-col justify-center  items-center h-full gap-10 animate-fade">
        <img
          src="/logoFinTrack.png"
          className="size-16 mx-auto animate__animated animate__zoomIn animate__faster"
          alt="logo"
        />
        <div>
          <h1 className="font-light text-5xl animate-fade">
            Bienvenue <span className="font-bold">{dataUser?.prenom}</span> sur
          </h1>
          <p className="text-5xl mt-3 font-logo font-thin animate-fade">
            FinTrack
          </p>
        </div>
        <ButtonGradient
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="scale-125 animate-fade"
        >
          Let's go !
        </ButtonGradient>
      </div>
    </section>
  );
}
