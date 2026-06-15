import React, { useState, useEffect } from "react";
import axios from "../config/axios.js";
import { api } from "../hooks/useAllapihooks.jsx";
import { RiUserLine } from '@remixicon/react';
import { useNavigate } from "react-router-dom";

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState(""); 
  const [projects, setProjects] = useState([]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const res = await axios.post("/api/project/create", { name: input.trim() });
      console.log(res);
      setIsOpen(false);
      setInput("");
      fetchProjects(); 
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/api/project/all');
      setProjects(res.data.projects || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const navigate=useNavigate()

  return (
    <div className="relative min-h-screen bg-gray-100 p-8">
     

      {/* Projects Grid Grid Layout */}
      <div className="flex flex-wrap gap-3 ">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700 transition"
        >
          New Project
        </button>
        {projects.map((project) => (
          <button
          onClick={()=>navigate('/project',{
            state:{project}
          })}
            key={project._id || project.id} // Added unique key tracking
            type="button"
            className="flex flex-col items-center justify-center rounded bg-white border border-gray-200 p-4 min-w-[120px] shadow-sm hover:bg-gray-50 transition text-center"
          >
            <span className="font-semibold text-gray-800 mb-1">{project.name}</span>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <RiUserLine size={16} />
              <span>({project.users?.length || 0})</span>
            </div>
          </button>
        ))}
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Create New Project
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  type="text"
                  placeholder="Enter project name..."
                  className="w-full rounded border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
