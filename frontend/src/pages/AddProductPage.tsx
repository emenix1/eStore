// src/components/ProductForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAddProductMutation } from "../store/api/productApi";
import { useNavigate } from "react-router-dom";

type ProductForm = {
  name: string;
  description: string;
  price: number;
  image: FileList;
};

export function ProductForm({
  onSubmit,
}: {
  onSubmit: (data: FormData) => void;
}) {
  const { register, handleSubmit } = useForm<ProductForm>();
  const [preview, setPreview] = useState<string | null>(null);

  const submitHandler = (data: ProductForm) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());

    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    onSubmit(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Добавление товара
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(submitHandler)}>
          <div>
            <input
              type="text"
              {...register("name", {
                required: "Наименования обязательно для заполнения",
              })}
              className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Наименования"
            />
          </div>
          <div>
            <input
              type="text"
              {...register("description")}
              className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Описание"
            />
          </div>
          <div>
            <input
              type="number"
              {...register("price", {
                required: "Стоимость обязательно для заполнения",
              })}
              className="rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Стоимость"
            />
          </div>
          <div>
            <label className="w-full cursor-pointe border border-gray-300 rounded-md shadow-sm flex flex-col items-center p-4 hover:bg-gray-50 transition">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-40 object-contain mb-2 rounded"
                />
              )}
              <span className="text-gray-700 text-sm">
                {preview ? "Файл выбран" : "Выберите изображение или перетащите сюда"}
              </span>
              <input
                type="file"
                {...register("image")}
                className="hidden"
                onChange={(e) => {
                  register("image").onChange(e);
                  if (e.target.files && e.target.files[0]) {
                    setPreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >Добавить
            </button>
            </div>
        </form>
      </div>
    </div>
  );
}

export function AddProductPage() {
  const [createProduct, { isLoading }] = useAddProductMutation();
    const navigate = useNavigate()


  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await createProduct(formData).unwrap();
      console.log("Товар создан:", result);
      navigate('/')
    } catch (err) {
      console.error(err);
      alert("Ошибка при создании товара");
    }
  };

  return (
    <div>
      <ProductForm onSubmit={handleSubmit} />
      {isLoading && <p>Загрузка...</p>}
    </div>
  );
}
