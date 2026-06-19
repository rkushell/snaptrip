import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        "/auth/login",
        formData
      );

      login(response.data.token);

      navigate("/dashboard");
    } catch (error) {
        console.log(error);
        alert(
            error.response?.data?.message || "Login failed"
        );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4 rounded-3xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-3xl font-bold">
          Welcome Back
        </h1>

        <input
          placeholder="Email"
          className="rounded-2xl border p-3"
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="rounded-2xl border p-3"
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value,
            })
          }
        />

        <button
          className="
          rounded-3xl
          bg-[#F56476]
          p-4
          text-white"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;