import { RiCloseLine, RiUserFill } from '@remixicon/react';
import React from 'react';

function Sidebar({ sideOpen, setsideOpen,project }) {
  return (
    <aside 
      className={`absolute top-0 left-0 h-screen w-full bg-white border-r border-gray-200 shadow-xl flex flex-col z-50 transition-transform duration-300 ease-in-out ${
        sideOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Top Section */}
      <div className="p-4 flex justify-between items-center border-b border-gray-100">
        <span className="text-gray-800 font-bold text-lg">Menu</span>
        <button 
          onClick={() => setsideOpen(false)}
          className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-800 transition"
        >
          <RiCloseLine size={24} />
        </button>
      </div>

      {/* --- Middle/Top Section: User Profiles & Actions --- */}
      {/* flex-1 makes this take up remaining space, overflow-y-auto enables scrolling if the list gets too long */}
      <div className="flex-1 overflow-y-auto  bg-gray-50">
        {(project.users||[]).map((item,index) => (
          <div key={index} className="p-4 shadow-2xl  border-b bg-white/5 gap-3 border-gray-100 last:border-b-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* User Avatar */}
                <div className='h-13 w-13 rounded-full bg-gray-300 items-center flex justify-center'><RiUserFill /></div>
              
                {/* User Metadata */}
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.email}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
