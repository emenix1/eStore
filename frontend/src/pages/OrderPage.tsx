import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../store/api/orderApi";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

const Order: React.FC = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Авторизуйтесь для просмотра корзины
          </h1>
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Авторизация
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Загрузка..
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {`Ошибка ${error}`}
      </div>
    );

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <h1 className="text-2xl text-black font-bold mb-4">
            Нет записей о покупках
          </h1>
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Продолжить покупку
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      <h1 className="text-3xl text-black font-bold mb-6 text-center">
        Корзина
      </h1>

      <div className="w-full max-w-6xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg p-4 shadow-lg bg-gradient-to-r from-yellow-50"
              >
                <h2 className="text-xl text-black font-bold mb-2">
                  Заказ #{order.id}
                </h2>
                <span className="text-black font-bold">{`Общая сумма $${order.total}`}</span>
                {order.items.map((product) => (
                  <div
                    key={product.id}
                    className="my-2 flex items-center shadow p-2 bg-white rounded"
                  >
                    <img
                      src={`http://localhost:3000${product.product.image}`}
                      alt={product.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="ml-4 flex-1">
                      <h2 className="text-black text-lg font-semibold">
                        {product.product.name}
                      </h2>
                    </div>
                    <div className="m-4 flex-1">
                      <p className="text-black text-lg">
                        ${product.product.price}
                      </p>
                    </div>
                    <div className="m-4 flex-1">
                      <span className="text-black px-4 py-1 border-b">
                        {product.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
