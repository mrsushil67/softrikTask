import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  title: yup.string().required("Project title is required").min(3, "Title must be at least 3 characters"),
  description: yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
  status: yup.string().oneOf(["active", "completed"]).required("Status is required"),
}).required();

type FormData = {
  title: string;
  description: string;
  status: "active" | "completed";
};

const ProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
    if (id) {
      api.get(`/projects/${id}`)
        .then((res) => {
          const project = res.data.project;
          setValue("title", project.title);
          setValue("description", project.description);
          setValue("status", project.status);
        })
        .catch(() => {
          setError("Failed to load project data");
        });
    }
  }, [id, setValue]);

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      if (id) {
        await api.put(`/projects/${id}`, data);
      } else {
        await api.post("/projects", data);
      }
      navigate("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md transform transition-all hover:scale-105"
        noValidate
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          {id ? "Edit Project" : "Add Project"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <input
          type="text"
          placeholder="Project Title"
          {...register("title")}
          className={`border rounded-lg p-3 w-full mb-1 focus:ring-2 focus:ring-indigo-400 outline-none ${
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
          className={`border rounded-lg p-3 w-full mb-1 focus:ring-2 focus:ring-indigo-400 outline-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mb-3">{errors.description.message}</p>
        )}

        <select
          {...register("status")}
          className={`border rounded-lg p-3 w-full mb-6 focus:ring-2 focus:ring-indigo-400 outline-none ${
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
          className="bg-indigo-500 text-white p-3 w-full rounded-lg hover:bg-indigo-600 transition-all duration-300 disabled:opacity-50"
        >
          {id ? "Update Project" : "Create Project"}
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;
