import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { ScrollManager } from "@/components/site/ScrollManager";
import { CursorLabel } from "@/components/site/CursorLabel";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Works from "./pages/Works";
import Blogs from "./pages/Blogs";

// Case studies and articles pull in the markdown renderer, so load them on demand
const WorkDetail = lazy(() => import("./pages/WorkDetail"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MotionConfig reducedMotion="user">
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <ScrollManager />
          <CursorLabel />
          <Suspense fallback={<div className="min-h-[100svh] bg-ink" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/works" element={<Works />} />
              <Route path="/blog" element={<Blogs />} />
              <Route path="/works/:slug" element={<WorkDetail />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </MotionConfig>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
