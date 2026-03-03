import React, { useState } from 'react';
import { SchoolLevel, SchoolConfig } from './types';
import { LEVEL_LABELS } from './services/mockData';
import DepartmentManager from './components/DepartmentManager';
import DevNotesModal from './components/DevNotesModal';
import { GraduationCap, Settings, School, LayoutGrid, Code } from 'lucide-react';
import { cn } from './lib/utils';
import { motion } from 'motion/react';

function App() {
  // Mock School Configuration
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>({
    id: 'school_1',
    name: 'Trường Liên Cấp AISAVA',
    isMultiLevel: true,
    activeLevels: ['mam_non', 'tieu_hoc', 'thcs', 'thpt']
  });

  const [currentLevel, setCurrentLevel] = useState<SchoolLevel>(schoolConfig.activeLevels[0]);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-cyan-100 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-indigo-200">
              <School className="text-white" size={24} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">{schoolConfig.name}</h1>
              <p className="text-xs text-gray-500 font-medium">Hệ thống quản lý giáo dục</p>
            </div>
          </div>
          
          {/* Level Selector - Centered in Header */}
          {schoolConfig.isMultiLevel && (
            <div className="flex p-1.5 bg-indigo-50/50 rounded-full border border-indigo-100 shadow-sm overflow-x-auto max-w-[500px] no-scrollbar gap-1">
              {schoolConfig.activeLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setCurrentLevel(level)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-bold transition-all relative whitespace-nowrap z-0",
                    currentLevel === level
                      ? "text-white shadow-md"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  {currentLevel === level && (
                    <motion.div
                      layoutId="activeTabHeader"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <GraduationCap size={16} />
                    {LEVEL_LABELS[level]}
                  </span>
                </button>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-4 shrink-0">
            <button 
              onClick={() => setIsDevModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-all border border-slate-200"
            >
              <Code size={14} />
              Dành cho Dev
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
              <Settings size={20} />
            </button>
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
              AD
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <LayoutGrid className="text-gray-400" size={24} />
                Quản lý Tổ & Bộ Phận
              </h2>
              <p className="text-gray-500 mt-1 text-sm">
                Cấu hình danh sách tổ khối, tổ bộ môn và các bộ phận chức năng trong nhà trường.
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <DepartmentManager key={currentLevel} currentLevel={currentLevel} />
        </div>
      </main>

      <DevNotesModal 
        isOpen={isDevModalOpen} 
        onClose={() => setIsDevModalOpen(false)} 
      />
    </div>
  );
}

export default App;
