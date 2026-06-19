import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";

function RegisterPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axiosInstance.post(
        "/auth/register",
        formData
      );

      navigate("/login");

    } catch (error) {

      alert(
        error.response?.data?.message
      );

    }

  };

  return (

    <form onSubmit={handleSubmit}>

      <input
        placeholder="Name"
        onChange={(e) =>
          setFormData({
            ...formData,
            name: e.target.value,
          })
        }
      />

      <input
        placeholder="Email"
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
        onChange={(e) =>
          setFormData({
            ...formData,
            password: e.target.value,
          })
        }
      />

      <button>
        Register
      </button>

    </form>

  );

}

export default RegisterPage;