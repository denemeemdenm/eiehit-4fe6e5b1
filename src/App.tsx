import { useState } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NeuralBackground from "@/components/NeuralBackground";
import ThemeToggle from "@/components/ThemeToggle";
import CursorTrail from "@/components/CursorTrail";
import Home from "@/pages/Home";
import Privacy from "@/pages/Privacy";
import HMGS from "@/pages/HMGS";
import NotFound from "@/pages/NotFound";
import FlashcardApp from "@/flashcard/FlashcardApp";

const queryClient = new QueryClient();

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const [flashcardOpen, setFlashcardOpen] = useState(false);
  const [hitRect, setHitRect] = useState<DOMRect | null>(null);

  const handleHitClick = (rect?: DOMRect) => {
    if (rect) setHitRect(rect);
    setFlashcardOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <NeuralBackground />
      <CursorTrail />
      <Navbar theme={theme} onHitClick={handleHitClick} flashcardOpen={flashcardOpen} onFlashcardClose={() => setFlashcardOpen(false)} />
      <div
        className={`flex-1 transition-opacity duration-200 ${
          flashcardOpen ? "opacity-0 pointer-events-none select-none" : "opacity-100"
        }`}
        aria-hidden={flashcardOpen}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kvkk" element={<Privacy />} />
          <Route path="/hmgs" element={<HMGS />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      <div
        className={`transition-opacity duration-200 ${
          flashcardOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-hidden={flashcardOpen}
      >
        <Footer />
      </div>
      {!flashcardOpen && <ThemeToggle theme={theme} toggleTheme={toggleTheme} />}
      <AnimatePresence>
        {flashcardOpen && <FlashcardApp onClose={() => setFlashcardOpen(false)} originRect={hitRect} />}
      </AnimatePresence>
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
