import type React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FaOpencart } from "react-icons/fa6";
import {
  FaHistory,
  FaSignInAlt,
  FaSignOutAlt,
  FaCartPlus,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

type ItemProps = {
  icon: ReactNode;
  show: boolean;
  text: string;
  to: string;
};

export const Item: React.FC<ItemProps> = ({ show, icon, text, to }) => {
  if (!show) return null;

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-fit h-11/12 flex flex-col items-center transition-colors ${
          isActive ? "text-amber-400 font-bold" : "text-amber-100"
        }`
      }
    >
      {icon}
      <span>{text}</span>
    </NavLink>
  );
};

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.auth
  );
  console.log(role, isAuthenticated)
  return (
    <>
      <header className="w-full bg-gradient-to-tl from-cyan-950 to-orange-950 p-2 shadow-2xl sticky top-0 z-50">
        <div className="container flex flex-row gap-4 justify-around mx-auto">
          <img
            src="src/components/header/logo.png"
            width={100}
            alt="Logo"
            onClick={() => navigate("/")}
          />
          <div className=" flex flex-row-reverse gap-4">
            <Item
              show={!isAuthenticated}
              icon={<FaSignInAlt />}
              text="Вход"
              to="/login"
            />
            <Item
              show={isAuthenticated}
              icon={<FaSignOutAlt />}
              text="Выход"
              to="/logout"
            />
            <Item
              show={isAuthenticated}
              icon={<FaOpencart />}
              text="Корзина"
              to="/cart"
            />
            <Item
              show={isAuthenticated}
              icon={<FaHistory />}
              text="Заказы"
              to="/order"
            />
            <Item
              show={isAuthenticated && role === "ADMIN"}
              icon={<FaCartPlus />}
              text="Добавить товар"
              to="/add"
            />
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};
