import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";
import CursorTrail from "@/components/CursorTrail";
import Footer from "@/components/Footer";
import NeuralBackground from "@/components/NeuralBackground";
import Home from "@/pages/Home";
import Privacy from "@/pages/Privacy";
import HMGS from "@/pages/HMGS";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col relative scroll-edge-top scroll-edge-bottom">
      <CursorTrail />
      <NeuralBackground />
      <Navbar />
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kvkk" element={<Privacy />} />
          <Route path="/hmgs" element={<HMGS />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
