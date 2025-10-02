import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../store/api/productApi";
import { useAddItemMutation } from "../store/api/cartApi";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { CiEdit, CiSquareRemove } from "react-icons/ci";
import { useEffect, useState } from "react";
import { useGetMeQuery } from "../store/api/authApi";
import { setRole } from "../store/slices/authSlice";
import { SortButton } from "../components/sortItem";

type SortType = "date" | "name" | "price";

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [addToCart] = useAddItemMutation();
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const { data } = useGetMeQuery();
  const [sortedProducts, setSortedProducts] = useState(products);

  useEffect(() => {
    if (data?.role) {
      dispatch(setRole(data.role));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (products) {
      setSortedProducts([...products]);
    }
  }, [products]);
  const handleAddToCart = async (productId: number) => {
    if (!isAuthenticated) {
      navigate("/login");
    }

    try {
      await addToCart({ productId, quantity: 1 }).unwrap();
      alert("Product added to cart!");
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const handleDeleteProduction = async (id: number) => {
    deleteProduct(id);
  };
  const handleEditProduct = async (id: number) => {
    navigate(`/edit/${id}`)
  }

  const sortBy = (arg: SortType) => {
    if (products) {
      switch (arg) {
        case "date":
          setSortedProducts(
            [...products].sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
          );
          break;
        case "name":
          setSortedProducts(
            [...products].sort((a, b) => a.name.localeCompare(b.name))
          );
          break;
        case "price":
        default:
          setSortedProducts([...products].sort((a, b) => a.price - b.price));
      }
    }
  };

  if (isLoading) return <div className="text-center">Загрузка...</div>;
  if (error)
    return (
      <div className="text-center text-red-500">Ошибка загрузки товаров</div>
    );
  return (
    <div className="min-h-screen container  mx-auto px-4 py-8 shadow-lg">
      <div className="mb-6 flex flex-row items-center justify-between">
        <h1 className="text-3xl inline text-amber-950 font-bold mb-4">
          Товары
        </h1>
        <div className="flex flex-row gap-4">
          <SortButton onClick={() => sortBy("date")}>По дате</SortButton>
          <SortButton onClick={() => sortBy("name")}>По имени</SortButton>
          <SortButton onClick={() => sortBy("price")}>По цене</SortButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedProducts?.map((product) => (
          <div
            key={product.id}
            className="bg-gradient-to-bl from-green-500/40 to-blue-500/40 border rounded-lg p-4 shadow-sm"
          >
            <img
              src={`http://localhost:3000${product.image}`}
              alt={product.name}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h3 className="text-black text-xl font-semibold mb-2">
              {product.name}
            </h3>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <div className="flex flex-row justify-between">
              <div>
                <h3 className="flex text-2xl font-bold text-black mb-4">
                  <span className="text-yellow-800">$</span> {product.price}
                </h3>
              </div>
              {role === "ADMIN" && (
                <div className="flex px-2 item justify-between hover: text-yellow-300">
                  <button onClick={() => handleEditProduct(product.id)} className="p-3 text-2xl text-black hover:text-green-700">
                    <CiEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteProduction(product.id)}
                    className="p-3 text-2xl text-black hover:text-red-700"
                  >
                    <CiSquareRemove />
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => handleAddToCart(product.id)}
              className="w-full bg-gradient-to-r from-orange-700 to-purple-800/75 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              Добавить в корзину
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
