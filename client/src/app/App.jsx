import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "./AppShell.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { LoginPage } from "../pages/auth/LoginPage.jsx";
import { RegisterPage } from "../pages/auth/RegisterPage.jsx";
import { NotFoundPage } from "../pages/shared/NotFoundPage.jsx";

const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard.jsx").then((module) => ({ default: module.AdminDashboard })));
const AdminQueuePage = lazy(() => import("../pages/portal/AdminQueuePage.jsx").then((module) => ({ default: module.AdminQueuePage })));
const AnalyticsPage = lazy(() => import("../pages/portal/AnalyticsPage.jsx").then((module) => ({ default: module.AnalyticsPage })));
const CampusPage = lazy(() => import("../pages/portal/CampusPage.jsx").then((module) => ({ default: module.CampusPage })));
const CollaborationPage = lazy(() => import("../pages/portal/CollaborationPage.jsx").then((module) => ({ default: module.CollaborationPage })));
const CoursesPage = lazy(() => import("../pages/portal/CoursesPage.jsx").then((module) => ({ default: module.CoursesPage })));
const DocumentsPage = lazy(() => import("../pages/portal/DocumentsPage.jsx").then((module) => ({ default: module.DocumentsPage })));
const ExamsPage = lazy(() => import("../pages/portal/ExamsPage.jsx").then((module) => ({ default: module.ExamsPage })));
const FeesPage = lazy(() => import("../pages/portal/FeesPage.jsx").then((module) => ({ default: module.FeesPage })));
const FocusPage = lazy(() => import("../pages/portal/FocusPage.jsx").then((module) => ({ default: module.FocusPage })));
const GradesPage = lazy(() => import("../pages/portal/GradesPage.jsx").then((module) => ({ default: module.GradesPage })));
const HostelPage = lazy(() => import("../pages/portal/HostelPage.jsx").then((module) => ({ default: module.HostelPage })));
const KnowledgePage = lazy(() => import("../pages/portal/KnowledgePage.jsx").then((module) => ({ default: module.KnowledgePage })));
const IdCardPage = lazy(() => import("../pages/portal/IdCardPage.jsx").then((module) => ({ default: module.IdCardPage })));
const InternshipsPage = lazy(() => import("../pages/portal/InternshipsPage.jsx").then((module) => ({ default: module.InternshipsPage })));
const LibraryPage = lazy(() => import("../pages/portal/LibraryPage.jsx").then((module) => ({ default: module.LibraryPage })));
const LeavePage = lazy(() => import("../pages/portal/LeavePage.jsx").then((module) => ({ default: module.LeavePage })));
const PlacementsPage = lazy(() => import("../pages/portal/PlacementsPage.jsx").then((module) => ({ default: module.PlacementsPage })));
const ProfilePage = lazy(() => import("../pages/portal/ProfilePage.jsx").then((module) => ({ default: module.ProfilePage })));
const ResultsPage = lazy(() => import("../pages/portal/ResultsPage.jsx").then((module) => ({ default: module.ResultsPage })));
const TransportPage = lazy(() => import("../pages/portal/TransportPage.jsx").then((module) => ({ default: module.TransportPage })));
const StudentDashboard = lazy(() => import("../pages/student/StudentDashboard.jsx").then((module) => ({ default: module.StudentDashboard })));

const RouteLoader = () => (
  <div className="glass-card rounded-3xl p-8 text-center text-[var(--text-primary)]">
    Loading page...
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        Loading Bibliotek X...
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        Loading Bibliotek X...
      </div>
    );
  }
  return user ? <Navigate to={user.role === "admin" ? "/admin" : "/"} replace /> : children;
};

export const App = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<RouteLoader />}>
              <StudentDashboard />
            </Suspense>
          }
        />
        <Route
          path="courses"
          element={
            <Suspense fallback={<RouteLoader />}>
              <CoursesPage />
            </Suspense>
          }
        />
        <Route
          path="knowledge-graph"
          element={
            <Suspense fallback={<RouteLoader />}>
              <KnowledgePage />
            </Suspense>
          }
        />
        <Route
          path="analytics"
          element={
            <Suspense fallback={<RouteLoader />}>
              <AnalyticsPage />
            </Suspense>
          }
        />
        <Route
          path="focus-mode"
          element={
            <Suspense fallback={<RouteLoader />}>
              <FocusPage />
            </Suspense>
          }
        />
        <Route
          path="exams"
          element={
            <Suspense fallback={<RouteLoader />}>
              <ExamsPage />
            </Suspense>
          }
        />
        <Route
          path="fees"
          element={
            <Suspense fallback={<RouteLoader />}>
              <FeesPage />
            </Suspense>
          }
        />
        <Route
          path="documents"
          element={
            <Suspense fallback={<RouteLoader />}>
              <DocumentsPage />
            </Suspense>
          }
        />
        <Route
          path="id-card"
          element={
            <Suspense fallback={<RouteLoader />}>
              <IdCardPage />
            </Suspense>
          }
        />
        <Route
          path="hostel"
          element={
            <Suspense fallback={<RouteLoader />}>
              <HostelPage />
            </Suspense>
          }
        />
        <Route
          path="transport"
          element={
            <Suspense fallback={<RouteLoader />}>
              <TransportPage />
            </Suspense>
          }
        />
        <Route
          path="placements"
          element={
            <Suspense fallback={<RouteLoader />}>
              <PlacementsPage />
            </Suspense>
          }
        />
        <Route
          path="internships"
          element={
            <Suspense fallback={<RouteLoader />}>
              <InternshipsPage />
            </Suspense>
          }
        />
        <Route
          path="library"
          element={
            <Suspense fallback={<RouteLoader />}>
              <LibraryPage />
            </Suspense>
          }
        />
        <Route
          path="admin-queue"
          element={
            <Suspense fallback={<RouteLoader />}>
              <AdminQueuePage />
            </Suspense>
          }
        />
        <Route
          path="leave"
          element={
            <Suspense fallback={<RouteLoader />}>
              <LeavePage />
            </Suspense>
          }
        />
        <Route
          path="grades"
          element={
            <Suspense fallback={<RouteLoader />}>
              <GradesPage />
            </Suspense>
          }
        />
        <Route
          path="results"
          element={
            <Suspense fallback={<RouteLoader />}>
              <ResultsPage />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<RouteLoader />}>
              <ProfilePage />
            </Suspense>
          }
        />
        <Route
          path="collaboration"
          element={
            <Suspense fallback={<RouteLoader />}>
              <CollaborationPage />
            </Suspense>
          }
        />
        <Route
          path="campus"
          element={
            <Suspense fallback={<RouteLoader />}>
              <CampusPage />
            </Suspense>
          }
        />
        <Route
          path="admin"
          element={
            user?.role === "admin" ? (
              <Suspense fallback={<RouteLoader />}>
                <AdminDashboard />
              </Suspense>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};