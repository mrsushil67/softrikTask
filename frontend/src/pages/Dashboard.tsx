import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Trash2, Edit3, CheckCircle, Clock } from "lucide-react";

const ITEMS_PER_PAGE = 6; // Customize how many projects per page

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    api.get("/projects/").then((res) => {
      setProjects(res.data);
      setFilteredProjects(res.data);
      setCurrentPage(1); // reset page on load
    });
  }, []);

  const handleSearch = (term: string) => {
    const filtered = projects.filter((p) =>
      p.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProjects(filtered);
    setCurrentPage(1);
  };

  const deleteProject = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await api.delete(`/projects/${id}`);
      const updated = projects.filter((p) => p._id !== id);
      setProjects(updated);
      const filteredUpdated = filteredProjects.filter((p) => p._id !== id);
      setFilteredProjects(filteredUpdated);
      setCurrentPage(1);
    }
  };

  // Pagination logic:
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top on page change
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar onSearch={handleSearch} />
      </div>

      <div className="h-[64px]" />

      <div className="flex-1 overflow-auto p-6 bg-gradient-to-r from-indigo-100 via-white to-indigo-50">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-indigo-700">My Projects</h1>

          <div className="flex items-center gap-4">
            {/* Filter By */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Filter By:</span>
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setFilteredProjects(projects);
                  } else {
                    const filtered = projects.filter(
                      (p) => p.status.toLowerCase() === value.toLowerCase()
                    );
                    setFilteredProjects(filtered);
                  }
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <Link
              to="/projects/new"
              className="bg-indigo-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300"
            >
              + Add Project
            </Link>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center mt-20">
            <img
              src="https://illustrations.popsy.co/gray/teamwork.svg"
              alt="No projects"
              className="w-64 mx-auto mb-6"
            />
            <p className="text-gray-500 text-lg">
              No projects match your search. Try a different keyword!
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedProjects.map((p) => (
                <div
                  key={p._id}
                  className="bg-white border border-gray-200 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-indigo-600 mb-1">
                      {p.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{p.description}</p>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${p.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : p.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {p.status === "completed" ? (
                        <CheckCircle size={14} />
                      ) : (
                        <Clock size={14} />
                      )}
                      {p.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4">
                    <Link
                      to={`/projects/${p._id}`}
                      className="flex-1 bg-indigo-500 text-white text-center py-2 rounded-lg hover:bg-indigo-600 transition-all"
                    >
                      View
                    </Link>
                    <Link
                      to={`/projects/edit/${p._id}`}
                      className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-all"
                      title="Edit"
                    >
                      <Edit3 size={18} />
                    </Link>
                    <button
                      onClick={() => deleteProject(p._id)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>


          </>

        )}
        <div className="flex justify-end items-end float-end gap-3 mt-8 pr-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
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
                onClick={() => goToPage(pageNum)}
                className={`px-3 py-1 rounded transition ${pageNum === currentPage
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-100 hover:bg-indigo-300"
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-indigo-200 disabled:opacity-50 hover:bg-indigo-300 transition"
          >
            Next
          </button>
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
