import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation } from "../store/api/authApi";
import { setCredentials } from "../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../store";
import { useForm } from "react-hook-form";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>();
  const [registerMutation, { isLoading, error }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const response = await registerMutation({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();
      dispatch(
        setCredentials({ token: response.token, role: response.user.role })
      );
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              type="text"
              {...register("name", { required: "Имя обязательно" })}
              className=" rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Никнейм"
            />
          </div>
          <div>
            <input
              type="email"
              {...register("email", { required: "Email обязателен" })}
              className=" rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              {...register("password", {
                required: "Пароль обязателен для заполнения",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
              className=" rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Пароль"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Пожалуйста потвердите пароль",
                validate: (value) =>
                  value === watch("password") || "Пароли не совпадают",
              })}
              className=" rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Потверждения пароля"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {error && (
            <div className="text-red-500 text-sm">
              {"data" in error &&
              typeof (error as { data?: { message?: string } }).data ===
                "object"
                ? (error as { data?: { message?: string } }).data?.message ??
                  "Registration failed"
                : "Registration failed"}
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? "Создание аккаунта..." : "Зарегистрироваться"}
            </button>
          </div>
          <div className="text-center">
            <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
              У вас уже есть аккаунт? Войти
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
