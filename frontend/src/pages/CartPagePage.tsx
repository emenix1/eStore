import React from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../store";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteItemMutation, useGetItemsQuery } from "../store/api/cartApi";
import { useCreateOrderMutation } from "../store/api/orderApi";

const Cart: React.FC = () => {
  const { data: cartItems, isLoading, error, refetch } = useGetItemsQuery();
  const [removeFromCart] = useDeleteItemMutation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [createOrder] = useCreateOrderMutation();
  const navigate = useNavigate();


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Авторизуйтесь для просмотра корзины
        </h1>
        <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
          Авторизация
        </Link>
      </div>
    );
  }

  if (isLoading)
    return <div className="container mx-auto px-4 py-8">Загрузка...</div>;
  if (error)
    return (
      <div className="min-h-screen text-red-600 container mx-auto px-4 py-8">
        {`Ошибка ${error}`}
      </div>
    );

  const total =
    cartItems?.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ) || 0;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <h1 className="text-2xl text-black font-bold mb-4">Корзина пусто</h1>
          <Link to="/" className="text-indigo-600 hover:text-indigo-500">
            Совершать покупку
          </Link>
        </div>
      </div>
    );
  }

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId).unwrap();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleCreateOrder = async () => {
    try {
      await createOrder();
      refetch();
      alert("Заказ оформлен!");
      navigate("/");
    } catch (error) {
      console.log("Ошибка офорление товара", error);
    }
  };

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <h1 className="text-3xl text-black font-bold mb-6">Корзина</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="rounded-lg bg-white shadow-xl flex items-center border-b m-4"
            >
              <img
                src={`http://localhost:3000${item.product.image}`}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="ml-4 flex-1">
                <h2 className="text-black text-lg font-semibold">
                  {item.product.name}
                </h2>
              </div>
              <div className="m-4 flex-1">
                <p className="text-black text-lg">${item.product.price}</p>
              </div>
              <div className="m-4 flex-1">
                <span className="text-black px-4 py-1 border-b">
                  {item.quantity}
                </span>
              </div>
              <div className="flex items-center mr-4">
                <div className="flex">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gradient-to-b from-orange-600/90 to-orange-600/30 rounded-lg">
            <h2 className="text-2xl text-center font-bold my-4">
              Оформоление заказа
            </h2>

            <div className="mx-3 flex justify-between font-bold text-xl">
              <span>Сумма заказа</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCreateOrder}
              className="w-full mt-6 bg-gradient-to-b from-blue-600/90 to-blue-600/45 text-white py-3 rounded-lg hover:bg-indigo-700"
            >
              <span className="font-bold text-shadow-amber-950">Оформить</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
