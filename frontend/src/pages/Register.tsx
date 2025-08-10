import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Define schema using Yup
const schema = yup.object({
  name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
}).required();

type FormData = {
  name: string;
  email: string;
  password: string;
};

const Register: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post("/auth/register", data);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-400 via-teal-400 to-blue-500">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg p-8 rounded-xl w-96 transform transition-all hover:scale-105"
        noValidate
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-teal-600">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Name"
          {...register("name")}
          className={`border rounded-lg p-3 w-full mb-1 focus:ring-2 focus:ring-teal-400 outline-none ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mb-3">{errors.name.message}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className={`border rounded-lg p-3 w-full mb-1 focus:ring-2 focus:ring-teal-400 outline-none ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className={`border rounded-lg p-3 w-full mb-4 focus:ring-2 focus:ring-teal-400 outline-none ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-4">{errors.password.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-teal-500 text-white p-3 w-full rounded-lg hover:bg-teal-600 transition-all duration-300 disabled:opacity-50"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-gray-600 mt-4 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-teal-600 hover:underline font-semibold"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
