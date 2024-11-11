// src/App.tsx
import { QueryProvider } from "./providers/QueryProvider";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import MainLayout from "./components/layout/MainLayout";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import Register from "./pages/Register";
import Categories from "./pages/Categories";
import TestPage from "./pages/Test";

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/test" element={<TestPage />} />

              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <Categories />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
