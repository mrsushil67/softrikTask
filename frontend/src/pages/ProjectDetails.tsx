import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import TaskForm from "../components/TaskForm";
import Navbar from "../components/Navbar";
import { Trash2, PlusCircle, CheckCircle, Clock, Pencil } from "lucide-react";
const TASKS_PER_PAGE = 6; // Adjust how many tasks per page

const ProjectDetails: React.FC = () => {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const fetchProject = async () => {
    const res = await api.get(`/projects/${id}`);
    setProject(res.data.project);
    setAllTasks(res.data.tasks);
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  useEffect(() => {
    let filtered = allTasks;
    if (filterStatus) {
      filtered = allTasks.filter(
        (task: any) => task.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }
    const start = (currentPage - 1) * TASKS_PER_PAGE;
    const paginatedTasks = filtered.slice(start, start + TASKS_PER_PAGE);
    setTasks(paginatedTasks);
  }, [allTasks, filterStatus, currentPage]);

  const deleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await api.delete(`/tasks/${taskId}`);
      fetchProject();
      // reset page to 1 in case last page is emptied after deletion
      setCurrentPage(1);
    }
  };

  if (!project) {
    return (
      <div className="p-6 text-center text-gray-500 text-lg">
        Loading project details...
      </div>
    );
  }

  // Calculate total pages based on filtered tasks
  const totalPages = Math.ceil(
    (filterStatus
      ? allTasks.filter(
          (task: any) => task.status.toLowerCase() === filterStatus.toLowerCase()
        ).length
      : allTasks.length) / TASKS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div>
      <Navbar />

      <div className="p-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 min-h-screen">
        {/* Project Info */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">{project.title}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>

        {/* Tasks Section */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h2 className="text-2xl font-semibold text-indigo-600">Tasks</h2>

          <div className="flex items-center gap-4">
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1); // reset to first page on filter change
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">All</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            {!showTaskForm && (
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowTaskForm(true);
                }}
                className="flex items-center gap-2 bg-indigo-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300"
              >
                <PlusCircle size={20} /> Add Task
              </button>
            )}
          </div>
        </div>

        {(showTaskForm || editingTask) && (
          <div className="mb-6">
            <TaskForm
              projectId={project._id}
              taskData={editingTask}
              onSuccess={() => {
                fetchProject();
                setShowTaskForm(false);
                setEditingTask(null);
              }}
              onCancel={() => {
                setShowTaskForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        )}

        {tasks.length === 0 ? (
          <p className="text-gray-500 italic">No tasks yet for this project.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((t) => (
              <div
                key={t._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-indigo-600">{t.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingTask(t);
                        setShowTaskForm(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="Edit Task"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => deleteTask(t._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{t.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span
                    className={`px-2 py-1 rounded font-medium flex items-center gap-1 ${t.status === "done"
                      ? "bg-green-100 text-green-700"
                      : t.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {t.status === "done" ? <CheckCircle size={14} /> : <Clock size={14} />}
                    {t.status}
                  </span>
                  {t.dueDate && (
                    <span className="text-gray-500">
                      Due: {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-indigo-200 disabled:opacity-50 hover:bg-indigo-300 transition"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded transition ${
                    pageNum === currentPage
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-100 hover:bg-indigo-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-indigo-200 disabled:opacity-50 hover:bg-indigo-300 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
