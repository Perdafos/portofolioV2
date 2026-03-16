import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import "./i18n";
import LoadingScreen from "./components/Layouts/LoadingScreen.tsx";
import { ThemeProvider } from "./components/theme-provider";
import App from "./pages/App.tsx";

const BlogPage = lazy(() => import("./pages/BlogPage.tsx"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage.tsx"));
const ProtectedAdminRoute = lazy(() => import("./components/admin/ProtectedAdminRoute.tsx"));

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = Boolean(clerkPublishableKey);

const adminPathSegment =
  import.meta.env.VITE_BLOG_ADMIN_PATH?.replace(/^\/+|\/+$/g, "") ?? "";
const adminRoutePath = adminPathSegment ? `/${adminPathSegment}` : null;

const appRoutes = (
  <ThemeProvider defaultTheme="dark" storageKey="portofolio-theme">
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          {adminRoutePath && isClerkConfigured ? (
            <Route path={adminRoutePath} element={<ProtectedAdminRoute />} />
          ) : null}
        </Routes>
      </Suspense>
    </BrowserRouter>
  </ThemeProvider>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {appRoutes}
  </StrictMode>
);
