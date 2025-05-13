import React, { ReactNode } from "react";
import { ArrowLeft, Swords } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { reset } from "../utils/storage.ts";
import { useGameContext } from "../context/GameContext.tsx";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = "Card Game Scoreboard",
  showBackButton = false,
}) => {
  const navigate = useNavigate();

  const { resetContext } = useGameContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className={"flex items-center"}>
            <button
              onClick={() => navigate("/")}
              className="mr-3 p-2 rounded-full hover:bg-slate-700 transition-colors"
              aria-label="Go back"
            >
              <Swords size={20} />
            </button>
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="mr-3 p-2 rounded-full hover:bg-slate-700 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          </div>
          <button
            onClick={() => {
              reset();
              resetContext();
              navigate("/");
            }}
            className="mr-3 p-2 rounded-full hover:bg-slate-700 transition-colors"
            aria-label="Reset"
          >
            Reset
          </button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 pb-24">{children}</main>
      <footer className="bg-slate-900 border-t border-slate-800 fixed bottom-0 w-full py-2">
        <div className="container mx-auto px-4 text-center text-sm text-slate-400">
          Kachuful Scoreboard &copy; Dhruvin Patel - {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
