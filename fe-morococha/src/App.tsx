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
import NewsDetail from "@/pages/NewsDetail";

import Proyectos from "./pages/Proyectos";
import ProyectoDetalle from "@/pages/ProyectoDetalle";
import ProyectoSanFrancisco from "./pages/ProyectosSanFrancisco";
import ProyectoSanFranciscoDetalle from "./pages/ProyectoSanFranciscoDetalle";

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
          <Route path="/noticias/:id" element={<NewsDetail />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/proyectos/:documentId" element={<ProyectoDetalle />} />
          <Route path="/proyectos/san-francisco" element={<ProyectoSanFrancisco />} />
          <Route path="/proyectos/san-francisco/:documentId" element={<ProyectoSanFranciscoDetalle />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
