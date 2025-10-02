import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import PrivateRoute from "./components/PrivateRoute";
import { Navbar } from "./components/header/header";
import "./App.css";
import Order from "./pages/OrderPage";
import { Logout } from "./pages/LogoutPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPager";
import Products from "./pages/ProductsPage";
import { AddProductPage } from "./pages/AddProductPage";
import Cart from "./pages/CartPagePage";
import { EditProductPage } from "./pages/EditProductPage";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Products />} />
          <Route
            path="/add"
            element={
              <PrivateRoute adminOnly>
                <AddProductPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/order"
            element={
              <PrivateRoute>
                <Order />
              </PrivateRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <PrivateRoute>
                <Logout />
              </PrivateRoute>
            }
          />
          <Route
          path="/edit/:id"
          element={
          <PrivateRoute>
            <EditProductPage/>
          </PrivateRoute>
           }/>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
