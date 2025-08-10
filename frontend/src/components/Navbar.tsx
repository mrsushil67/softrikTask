import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar: React.FC<{ onSearch?: (term: string) => void }> = ({ onSearch }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value); // send search term to parent component
    }
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Left: Brand + Dashboard Link */}
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard"
            className="text-2xl font-bold text-white hover:text-yellow-300 transition-colors duration-300"
          >
            ProjectManager
          </Link>
          {/* <Link
            to="/dashboard"
            className="text-white hover:text-yellow-200 transition-colors duration-300"
          >
            Dashboard
          </Link> */}
        </div>

        {/* Middle: Search Bar */}
        <div className="flex-grow max-w-md mx-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search projects..."
            className="w-full px-4 py-2 rounded-lg shadow-inner border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Right: Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
