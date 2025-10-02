// src/components/ProductForm.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../store/api/productApi";
import { useNavigate, useParams } from "react-router-dom";

type ProductFormData = {
  name: string;
  description: string;
  price: number;
  image: FileList;
};

type ProductFormProps = {
  product: {
    id: number;
    name?: string;
    description?: string;
    price?: number;
    image?: string;
  };
  onSubmit: (data: FormData, id: number) => void;
};

export function ProductForm({ product, onSubmit }: ProductFormProps) {
  const { register, handleSubmit, reset } = useForm<ProductFormData>();
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
      });
      setPreview('http://localhost:3000' + product.image);
    }
  }, [product, reset]);

  const submitHandler = (data: ProductFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    onSubmit(formData, product?.id);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      register("image").onChange(e);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            "Редактирование товара" 
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(submitHandler)}>
          <div>
            <input
              type="text"
              {...register("name", {
                required: "Наименование обязательно для заполнения",
              })}
              className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Наименование"
            />
          </div>
          <div>
            <textarea
              {...register("description")}
              rows={3}
              className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Описание"
            />
          </div>
          <div>
            <input
              type="number"
              {...register("price", {
                required: "Стоимость обязательно для заполнения",
                min: { value: 0, message: "Стоимость не может быть отрицательной" }
              })}
              className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Стоимость"
            />
          </div>
          <div>
            <label className="w-full cursor-pointer border border-gray-300 rounded-md shadow-sm flex flex-col items-center p-4">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-40 object-contain mb-2 rounded"
                />
              )}
              <span className="text-gray-700 text-sm">
                {preview ? "Файл выбран" : "Выберите изображение"}
              </span>
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              "Обновить"
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useGetProductByIdQuery(Number(id));
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const navigate = useNavigate();

  if (isLoading) return <p className="text-center mt-8">Загрузка...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">Ошибка загрузки товара</p>;
  if (!product || !id) return <p className="text-center mt-8">Товар не найден</p>;

  const handleSubmit = async (formData: FormData, productId?: number) => {
    if (!productId) return;
    
    try {
      await updateProduct({ id: productId, formData }).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Ошибка при обновлении товара:", err);
      alert("Ошибка при обновлении товара");
    }
  };

  return (
    <div>
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
      />
      {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <p className="text-white text-lg">Обновление товара...</p>
        </div>
      )}
    </div>
  );
}