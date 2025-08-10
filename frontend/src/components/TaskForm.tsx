import React, { useState, useEffect } from "react";
import api from "../services/api";

interface TaskFormProps {
  projectId: string;
  taskData?: any; // For editing
  onSuccess: () => void;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  projectId,
  taskData,
  onSuccess,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (taskData) {
      setTitle(taskData.title);
      setDescription(taskData.description);
      setStatus(taskData.status);
      setDueDate(taskData.dueDate ? taskData.dueDate.split("T")[0] : "");
    }
  }, [taskData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { title, description, status, dueDate: dueDate || null };

      if (taskData) {
        await api.put(`/tasks/${taskData._id}`, payload);
      } else {
        await api.post(`/tasks/project/${projectId}`, payload);
      }
      onSuccess();
    } catch {
      setError("❌ Failed to save task. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4"
    >
      <h2 className="text-xl font-semibold text-indigo-600">
        {taskData ? "Edit Task" : "Add New Task"}
      </h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <input
        type="text"
        placeholder="Task Title"
        className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 outline-none"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 outline-none"
      >
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 outline-none"
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all"
        >
          {taskData ? "Update Task" : "Add Task"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
