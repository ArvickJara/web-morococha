import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Pucara from "./pages/Pucara";
import Convocatorias from "./pages/Convocatorias";
import ConvocatoriaDetalle from "@/pages/ConvocatoriaDetalle";
import Proyectos from "./pages/Proyectos";
import ProyectoDetalle from "@/pages/ProyectoDetalle";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pucara" element={<Pucara />} />
          <Route path="/convocatorias" element={<Convocatorias />} />
          <Route path="/convocatorias/:documentId" element={<ConvocatoriaDetalle />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/proyectos/:documentId" element={<ProyectoDetalle />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
