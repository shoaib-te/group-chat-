import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  RiGroupLine,
  RiSendPlaneFill,
  RiUserAddLine,
  RiCloseLine,
  RiSearchLine,
} from "@remixicon/react";
import Sidebar from "../components/Sidebar";
import { api } from "../hooks/useAllapihooks";
import {
  initializeSocket,
  sendMessage,
  reseveMessage,
} from "../config/socketio";
import { useAuth } from "../context/authContext";

function Project() {
  const location = useLocation();

  // auth context in get user
  const { user } = useAuth();

  // Layout & UI States
  const [sideOpen, setsideOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Data & Selection States
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState({});
  const [project, setproject] = useState(location.state.project._id);

  // message stream array and text input
  const [message, setMessage] = useState([]); 
  const [input, setinput] = useState('');

  // sendmessage function
  const sendMessagehandle = (e) => {
    if (e) e.preventDefault(); // Stop page refresh if sent via Form submission

    if (!user?._id) {
      console.log("user id is undefined");
      return;
    }

    // Ensure the user typed actual content, not just spaces
    if (input.trim()) {
      const messagePayload = {
        message: input,
        sender: user._id, // Set the current user as sender so 'isMe' checks work instantly
      };

      // 1. Send via socket to other users
      sendMessage("porject-message", messagePayload);

      // 2. IMMEDIATELY show your text in your desktop/frontend stream
      setMessage((prev) => [...prev, messagePayload]);

      // 3. Clear the input text field
      setinput(""); 
    }
  };

  useEffect(() => {
    initializeSocket(location.state.project._id);

    reseveMessage("receive_message", (data) => {
      console.log("New message payload incoming:", data);
      
      // FIX: Only append if the incoming message is NOT from yourself.
      // This prevents the message from appearing twice on your screen.
      if (data.sender !== user?._id) {
        setMessage((prev) => [...prev, data]);
      }
    });

    // get all project user
    api
      .get(`/api/project/get-project/${location.state.project._id}`)
      .then((response) => {
        setproject(response.data.project);
      })
      .catch((err) => {
        console.log(err);
      });

    // all user in user router
    api
      .get("/api/auth/allUser")
      .then((res) => {
        setUsers(res.data?.users || []);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, [user?._id]); // Added dependency to keep socket listener accurate with current user context

  // Filter users safely based on search text
  const filteredUsers = users.filter((u) => {
    const name = u.name?.toLowerCase() || "";
    const email = u.email?.toLowerCase() || "";
    const query = search.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  // Check if all filtered users are currently checked
  const isAllSelected =
    filteredUsers.length > 0 && filteredUsers.every((u) => selectedIds[u._id]);

  // Toggle single user checkbox
  const toggleUser = (id) => {
    setSelectedIds((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      const finalSelected = users.filter((u) => updated[u._id]);
      console.log("Users currently selected for group:", finalSelected);
      return updated;
    });
  };

  // Toggle "Select All" checkbox for filtered users
  const toggleSelectAll = () => {
    const nextState = !isAllSelected;
    setSelectedIds((prev) => {
      const updated = { ...prev };
      filteredUsers.forEach((u) => {
        updated[u._id] = nextState;
      });
      return updated;
    });
  };

  // Confirm selection and close modal
  const handleAddSelected = async () => {
    const finalSelectedUserIds = Object.keys(selectedIds).filter(
      (id) => selectedIds[id],
    );
    const projectId = location.state.project._id;

    if (!projectId) {
      console.error("Project ID is missing from location state.");
      return;
    }

    try {
      const res = await api.put("/api/project/user-update", {
        projectId: projectId,
        users: finalSelectedUserIds,
      });
      console.log("Users updated successfully:", res.data);
      setModalOpen(false);
    } catch (err) {
      console.error("Error updating project users:", err);
    }
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <main className="grid grid-cols-3 h-screen w-full overflow-hidden text-gray-900">
      {/* LEFT CHAT PANEL CONTAINER */}
      <section className="min-w-80 relative grid grid-rows-10 border-r border-gray-200">
        <Sidebar
          setsideOpen={setsideOpen}
          project={project}
          sideOpen={sideOpen}
        />

        {/* Chat Header */}
        <header className="grid grid-cols-2 items-center bg-white p-4 border-b border-gray-100">
          <button
            onClick={() => setModalOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
          >
            <RiUserAddLine className="h-5 w-5" />
          </button>
          <div className="flex justify-end">
            <button
              onClick={() => setsideOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 text-white hover:bg-gray-600 transition"
            >
              <RiGroupLine className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Chat Message Stream */}
        <div className="bg-gray-50 row-span-8 overflow-auto p-4 space-y-4">
          {Array.isArray(message) && message.map((msg, index) => {
            const isMe = msg.sender === user?._id;

            return (
              <div
                key={index}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 max-w-xs rounded-2xl text-sm ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none" 
                      : "bg-gray-200 text-gray-800 rounded-bl-none" 
                  }`}
                >
                  {!isMe && (
                    <span className="block text-xs font-semibold text-gray-500 mb-1">
                      {msg.sender?.substring(0, 5)}...
                    </span>
                  )}

                  <p className="whitespace-pre-wrap break-words">
                    {msg.message}
                  </p>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Footer */}
        <footer className="bg-white p-4 border-t border-gray-200">
          <form
            onSubmit={sendMessagehandle}
            className="flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setinput(e.target.value)}
              placeholder="Type here..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              type="submit"
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RiSendPlaneFill className="h-5 w-5" />
            </button>
          </form>
        </footer>
      </section>

      {/* RIGHT MAIN VIEWPORT */}
      <section className="bg-gray-100 col-span-2"></section>

      {/* SELECTION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <RiUserAddLine className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Select & Add Users</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <RiCloseLine className="h-6 w-6" />
              </button>
            </div>

            <div className="relative mt-4">
              <RiSearchLine className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
              <span className="font-medium text-gray-700">
                Select All Filtered Users
              </span>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="mt-2 max-h-48 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <label
                    key={u._id}
                    className="flex cursor-pointer items-center justify-between p-3 transition hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600 text-xs">
                        {(u.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!selectedIds[u._id]}
                      onChange={() => toggleUser(u._id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </label>
                ))
              ) : (
                <p className="p-4 text-center text-sm text-gray-500">
                  No users found.
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSelected}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Add Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Project;