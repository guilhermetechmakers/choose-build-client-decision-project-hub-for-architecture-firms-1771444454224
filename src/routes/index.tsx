import { createBrowserRouter, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

import { LandingPage } from "@/pages/landing";
import { LoginPage } from "@/pages/auth/login";
import { SignupPage } from "@/pages/auth/signup";
import { PasswordResetRequestPage } from "@/pages/auth/password-reset-request";
import { PasswordResetPage } from "@/pages/auth/password-reset";
import { EmailVerificationPage } from "@/pages/auth/email-verification";
import { UserProfilePage } from "@/pages/auth/user-profile";

import { DashboardPage } from "@/pages/dashboard/dashboard";
import { ProjectBoardPage } from "@/pages/dashboard/project-board";
import { DecisionLogPage } from "@/pages/dashboard/decision-log";
import { CreateDecisionPage } from "@/pages/dashboard/create-decision";
import { MessagesPage } from "@/pages/dashboard/messages";
import { FilesPage } from "@/pages/dashboard/files";
import { MeetingsPage } from "@/pages/dashboard/meetings";
import { TemplatesPage } from "@/pages/dashboard/templates";
import { ReportsPage } from "@/pages/dashboard/reports";
import { BillingPage } from "@/pages/dashboard/billing";
import { SettingsPage } from "@/pages/dashboard/settings";
import { AdminDashboardPage } from "@/pages/dashboard/admin-dashboard";
import { UserManagementPage } from "@/pages/dashboard/user-management";

import { CheckoutPage } from "@/pages/billing/checkout";
import { OrderHistoryPage } from "@/pages/billing/order-history";

import { UploadContentPage } from "@/pages/content/upload-content";
import { EditContentPage } from "@/pages/content/edit-content";

import { PrivacyPolicyPage } from "@/pages/legal/privacy-policy";
import { TermsPage } from "@/pages/legal/terms";
import { CookiePolicyPage } from "@/pages/legal/cookie-policy";

import { HelpPage } from "@/pages/help";
import { NotFoundPage } from "@/pages/not-found";
import { ErrorPage } from "@/pages/error";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/password-reset", element: <PasswordResetRequestPage /> },
  { path: "/password-reset/confirm", element: <PasswordResetPage /> },
  { path: "/verify-email", element: <EmailVerificationPage /> },
  { path: "/privacy", element: <PrivacyPolicyPage /> },
  { path: "/terms", element: <TermsPage /> },
  { path: "/cookies", element: <CookiePolicyPage /> },
  { path: "/help", element: <HelpPage /> },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "profile", element: <UserProfilePage /> },
      { path: "projects", element: <ProjectBoardPage /> },
      { path: "projects/:projectId", element: <ProjectBoardPage /> },
      { path: "decisions", element: <DecisionLogPage /> },
      { path: "decisions/new", element: <CreateDecisionPage /> },
      { path: "decisions/:decisionId", element: <DecisionLogPage /> },
      { path: "messages", element: <MessagesPage /> },
      { path: "files", element: <FilesPage /> },
      { path: "meetings", element: <MeetingsPage /> },
      { path: "templates", element: <TemplatesPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "billing", element: <BillingPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "orders", element: <OrderHistoryPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "admin", element: <AdminDashboardPage /> },
      { path: "admin/users", element: <UserManagementPage /> },
      { path: "content/upload", element: <UploadContentPage /> },
      { path: "content/:contentId/edit", element: <EditContentPage /> },
    ],
  },
  { path: "/404", element: <NotFoundPage /> },
  { path: "/500", element: <ErrorPage /> },
  { path: "*", element: <Navigate to="/404" replace /> },
]);
