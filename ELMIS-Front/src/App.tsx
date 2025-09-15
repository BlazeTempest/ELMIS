import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuthStore } from "@/stores/authStore";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Reviews from "./pages/Reviews";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AnnouncementsPage from "./pages/admin/AnnouncementsPage";
import EmployeesPage from "./pages/admin/EmployeesPage";
import ReportsPage from "./pages/admin/ReportsPage";
import RentalsPage from "./pages/admin/RentalsPage";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/books" element={
        <ProtectedRoute>
          <MainLayout>
            <Books />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/reviews" element={
        <ProtectedRoute>
          <MainLayout>
            <Reviews />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/rentals" element={
        <ProtectedRoute>
          <MainLayout>
            <RentalsPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/employees" element={
        <ProtectedRoute roles={['admin']}>
          <MainLayout>
            <EmployeesPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/announcements" element={
        <ProtectedRoute roles={['admin']}>
          <MainLayout>
            <AnnouncementsPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute roles={['admin']}>
          <MainLayout>
            <ReportsPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/unauthorized" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">403</h1>
            <p className="text-xl text-muted-foreground mb-4">Access Denied</p>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;