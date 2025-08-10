import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  title: yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
  description: yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
  status: yup.string().oneOf(["active", "completed"]).required("Status is required"),
}).required();

type FormData = {
  title: string;
  description: string;
  status: "active" | "completed";
};

const EditProject: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then((res) => {
        const project = res.data.project;
        setValue("title", project.title);
        setValue("description", project.description);
        setValue("status", project.status);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load project");
        setLoading(false);
      });
  }, [id, setValue]);

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      await api.put(`/projects/${id}`, data);
      navigate("/");
    } catch {
      setError("Failed to save changes");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading project...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 via-teal-400 to-blue-500">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg p-8 rounded-xl w-96 transform transition-all hover:scale-105"
        noValidate
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-teal-600">
          ✏️ Edit Project
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <input
          type="text"
          placeholder="Title"
          {...register("title")}
          className={`border rounded-lg p-3 w-full mb-1 focus:ring-2 focus:ring-teal-400 outline-none ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mb-3">{errors.title.message}</p>
        )}

        <textarea
          placeholder="Description"
          rows={4}
          {...register("description")}
          className={`border rounded-lg p-3 w-full mb-1 focus:ring-2 focus:ring-teal-400 outline-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mb-3">{errors.description.message}</p>
        )}

        <select
          {...register("status")}
          className={`border rounded-lg p-3 w-full mb-6 focus:ring-2 focus:ring-teal-400 outline-none ${
            errors.status ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-sm mb-4">{errors.status.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-teal-500 text-white p-3 w-full rounded-lg hover:bg-teal-600 transition-all duration-300 disabled:opacity-50"
        >
          💾 {isSubmitting ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-3 border border-gray-300 text-gray-600 p-3 w-full rounded-lg hover:bg-gray-100 transition-all duration-300"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProject;
