import React, { useState, useMemo, useEffect } from 'react';
import { SchoolLevel, Department, Teacher, Subject } from '../types';
import { MOCK_TEACHERS, MOCK_SUBJECTS, LEVEL_LABELS } from '../services/mockData';
import { Users, BookOpen, Trash2, Plus, Check, X, Search, Layers, Palette, GraduationCap, GripVertical, User, Book, Info, ChevronDown, ChevronRight, AlertTriangle, Briefcase, Pencil } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { DndContext, useDraggable, useDroppable, DragOverlay, DragStartEvent, DragEndEvent, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DepartmentManagerProps {
  currentLevel: SchoolLevel;
}

// Draggable Item Component
const DraggableItem: React.FC<{ 
  id: string, 
  data: any, 
  type: 'teacher' | 'subject', 
  isSelected: boolean,
  isLocked?: boolean,
  assignedTo?: string[]
}> = ({ id, data, type, isSelected, isLocked, assignedTo }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: { type, item: data },
    disabled: isSelected || isLocked,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  if (isSelected) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 opacity-80 cursor-default group">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <Check size={16} strokeWidth={3} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-700 truncate">{data.name}</div>
          <div className="text-[10px] text-emerald-600 font-medium">Đã thêm vào tổ này</div>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 opacity-60 cursor-not-allowed group relative">
        <div className="w-8 h-8 rounded-lg bg-gray-200 text-gray-500 flex items-center justify-center">
          <User size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-500 truncate">{data.name}</div>
          <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
            <span>Đã thuộc:</span>
            <span className="font-bold text-indigo-600 truncate max-w-[120px]">
              {assignedTo?.join(', ')}
            </span>
          </div>
        </div>
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[1px] rounded-xl">
          <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full border border-red-100 shadow-sm">
            Đã xếp tổ
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-indigo-400 hover:shadow-md transition-all touch-none select-none",
        isDragging ? "opacity-30 ring-2 ring-indigo-500 ring-offset-2" : "opacity-100"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
        type === 'teacher' ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
      )}>
        <GripVertical size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-gray-800 truncate">{data.name}</div>
        <div className="text-xs text-gray-500 truncate font-medium">
          {type === 'teacher' ? data.code : data.code}
        </div>
      </div>
    </div>
  );
};

// Droppable Area Component
function DroppableArea({ 
  id, 
  children, 
  title, 
  icon: Icon, 
  count, 
  colorClass,
  variant = 'vertical'
}: { 
  id: string, 
  children: React.ReactNode, 
  title: string, 
  icon: any, 
  count: number, 
  colorClass: string,
  variant?: 'vertical' | 'horizontal'
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  const isEmpty = count === 0;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 flex flex-col rounded-2xl border transition-all overflow-hidden relative",
        variant === 'vertical' ? "h-full" : "min-h-[100px]",
        isOver 
          ? "border-indigo-500 bg-indigo-50/50 ring-4 ring-indigo-500/10 z-10" 
          : isEmpty 
            ? "border-dashed border-gray-300 bg-gray-50" 
            : "border-gray-200 bg-gray-50/50 shadow-inner"
      )}
    >
      <div className={cn(
        "p-4 border-b flex items-center justify-between sticky top-0 z-10 backdrop-blur-md",
        isOver ? "bg-indigo-100/50 border-indigo-200" : "bg-gray-50/90 border-gray-200"
      )}>
        <h4 className="font-bold text-gray-800 flex items-center gap-2.5 text-sm uppercase tracking-wide">
          <div className={cn("p-1.5 rounded-lg shadow-sm text-white", colorClass)}>
            <Icon size={14} strokeWidth={3} />
          </div>
          {title}
        </h4>
        <span className={cn(
          "px-2.5 py-0.5 rounded-full text-xs font-extrabold",
          count > 0 ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-500"
        )}>
          {count}
        </span>
      </div>
      
      <div className={cn(
        "flex-1 p-3 overflow-y-auto custom-scrollbar",
        variant === 'vertical' ? "space-y-2" : "flex flex-wrap gap-2"
      )}>
        {children}
        {isEmpty && (
          <div className={cn(
            "flex flex-col items-center justify-center text-gray-400 text-sm text-center px-6",
            variant === 'vertical' ? "h-full pb-10" : "py-4"
          )}>
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-sm transition-transform duration-500",
              isOver ? "scale-110 bg-indigo-200 text-indigo-700" : "bg-white border border-gray-200"
            )}>
              <Plus size={24} className={isOver ? "text-indigo-700" : "text-gray-300"} />
            </div>
            <p className="font-medium">
              {isOver ? "Thả vào đây!" : `Kéo thả ${title.toLowerCase()} vào đây`}
            </p>
          </div>
        )}
      </div>
      
      {/* Overlay when dragging over */}
      {isOver && !isEmpty && (
        <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg text-indigo-600 font-bold text-sm animate-bounce">
            Thả để thêm
          </div>
        </div>
      )}
    </div>
  );
}

const DepartmentManager: React.FC<DepartmentManagerProps> = ({ currentLevel }) => {
  // Mock initial state
  const [departments, setDepartments] = useState<Department[]>([
    // Mầm non
    {
      id: 'd_mn_1',
      name: 'Nhóm nhà trẻ',
      level: 'mam_non',
      type: 'grade',
      isSynced: true,
      memberIds: ['t_mn_1', 't_mn_2', 't_mn_3'],
      subjectIds: ['s_mn_1', 's_mn_2', 's_mn_3']
    },
    {
      id: 'd_mn_2',
      name: 'Lớp mẫu giáo',
      level: 'mam_non',
      type: 'grade',
      isSynced: true,
      memberIds: ['t_mn_4', 't_mn_5'],
      subjectIds: ['s_mn_1', 's_mn_2']
    },
    // Tiểu học - Tổ Khối (Fixed)
    {
      id: 'd_th_1',
      name: 'Tổ Khối 1',
      level: 'tieu_hoc',
      type: 'grade',
      isFixed: true,
      isSynced: true,
      memberIds: ['t6', 't7'],
      subjectIds: ['s_th_1', 's_th_2', 's_th_6']
    },
    {
      id: 'd_th_2',
      name: 'Tổ Khối 2',
      level: 'tieu_hoc',
      type: 'grade',
      isFixed: true,
      isSynced: true,
      memberIds: ['t8'],
      subjectIds: ['s_th_1', 's_th_2', 's_th_3', 's_th_6']
    },
    {
      id: 'd_th_3',
      name: 'Tổ Khối 3',
      level: 'tieu_hoc',
      type: 'grade',
      isFixed: true,
      isSynced: true,
      memberIds: ['t9'],
      subjectIds: ['s_th_1', 's_th_2', 's_th_3', 's_th_6']
    },
    {
      id: 'd_th_4',
      name: 'Tổ Khối 4',
      level: 'tieu_hoc',
      type: 'grade',
      isFixed: true,
      isSynced: false,
      memberIds: ['t10', 't11'],
      subjectIds: ['s_th_1', 's_th_2', 's_th_4', 's_th_5']
    },
    {
      id: 'd_th_5',
      name: 'Tổ Khối 5',
      level: 'tieu_hoc',
      type: 'grade',
      isFixed: true,
      isSynced: false,
      memberIds: ['t12'],
      subjectIds: ['s_th_1', 's_th_2', 's_th_4', 's_th_5']
    },
    // Tiểu học - Tổ Bộ Môn (Dynamic)
    {
      id: 'd_th_ta',
      name: 'Tổ Tiếng Anh',
      level: 'tieu_hoc',
      type: 'subject',
      isSynced: false,
      memberIds: [],
      subjectIds: ['s_c23_10']
    },
    {
      id: 'd_th_nk',
      name: 'Tổ Năng khiếu - Tin học',
      level: 'tieu_hoc',
      type: 'subject',
      isSynced: false,
      memberIds: [],
      subjectIds: ['s_c23_8']
    },
    // THCS
    {
      id: 'd1',
      name: 'Tổ Toán - Tin',
      level: 'thcs',
      type: 'subject',
      isSynced: true,
      memberIds: ['t1', 't2'],
      subjectIds: ['s_th_1', 's_c23_8']
    },
    {
      id: 'd2',
      name: 'Tổ Khoa học tự nhiên',
      level: 'thcs',
      type: 'subject',
      isSynced: false,
      memberIds: ['t3', 't4'],
      subjectIds: ['s_c23_2', 's_c23_3', 's_c23_4']
    },
    // Staff Departments
    {
      id: 'd_staff_vp',
      name: 'Tổ Văn phòng',
      level: currentLevel,
      type: 'staff',
      isSynced: false,
      memberIds: ['staff_1', 'staff_2', 'staff_4'],
      subjectIds: []
    },
    {
      id: 'd_staff_bv',
      name: 'Tổ Bảo vệ - Phục vụ',
      level: currentLevel,
      type: 'staff',
      isSynced: false,
      memberIds: ['staff_6', 'staff_7'],
      subjectIds: []
    }
  ]);

  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingNameValue, setEditingNameValue] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptType, setNewDeptType] = useState<'grade' | 'subject' | 'staff'>(currentLevel === 'mam_non' ? 'grade' : 'subject');

  useEffect(() => {
    setNewDeptType(currentLevel === 'mam_non' ? 'grade' : 'subject');
  }, [currentLevel]);
  const [activeTab, setActiveTab] = useState<'teachers' | 'subjects'>('teachers');

  // Set default tab based on department type
  useEffect(() => {
    if (selectedDept) {
      setIsEditingName(false);
      if (selectedDept.type === 'subject') {
        // For Subject Departments, start with Subjects to enforce workflow
        setActiveTab('subjects');
      } else {
        // For Grade and Staff Departments, start with Teachers
        setActiveTab('teachers');
      }
    }
  }, [selectedDept?.id]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeDragItem, setActiveDragItem] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor)
  );

  // Filter departments by current level
  const levelDepartments = departments.filter(d => d.level === currentLevel);
  const gradeDepartments = levelDepartments.filter(d => d.type === 'grade' || !d.type);
  const subjectDepartments = levelDepartments.filter(d => d.type === 'subject');
  const staffDepartments = levelDepartments.filter(d => d.type === 'staff');

  const SUGGESTED_DEPARTMENTS = useMemo(() => {
    if (newDeptType === 'staff') {
      return [
        'Tổ Văn phòng', 'Tổ Bảo vệ', 'Tổ Phục vụ', 'Tổ Y tế', 'Tổ Thư viện', 
        'Tổ Kế toán', 'Tổ Hành chính'
      ];
    }
    
    if (currentLevel === 'mam_non') {
      return ['Nhóm nhà trẻ', 'Lớp mẫu giáo', 'Tổ Chuyên môn 1', 'Tổ Chuyên môn 2'];
    }
    
    return [
      'Tổ Toán - Tin', 'Tổ Ngữ văn', 'Tổ Ngoại ngữ', 'Tổ Tự nhiên', 'Tổ Xã hội', 
      'Tổ Năng khiếu', 'Tổ Sử - Địa', 'Tổ Lí - Hóa - Sinh'
    ];
  }, [newDeptType, currentLevel]);

  // Compute teacher assignments
  const teacherAssignments = useMemo(() => {
    const map: Record<string, string[]> = {};
    levelDepartments.forEach(dept => {
      dept.memberIds.forEach(memberId => {
        if (!map[memberId]) map[memberId] = [];
        map[memberId].push(dept.name);
      });
    });
    return map;
  }, [levelDepartments]);

  // Compute subject assignments
  const subjectAssignments = useMemo(() => {
    const map: Record<string, string[]> = {};
    levelDepartments.forEach(dept => {
      dept.subjectIds.forEach(subId => {
        if (!map[subId]) map[subId] = [];
        map[subId].push(dept.name);
      });
    });
    return map;
  }, [levelDepartments]);

  // Filtered Source Data - Split into Unassigned and Assigned
  const filteredSourceData = useMemo(() => {
    if (activeTab === 'teachers') {
      let filtered = MOCK_TEACHERS.filter(t => 
        t.level?.includes(currentLevel) &&
        (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
         t.code.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      // --- NEW: Smart Filter for Subject Departments ---
      let showPrompt = false;
      if (selectedDept && selectedDept.type === 'subject') {
          const assignedSubjectIds = selectedDept.subjectIds || [];
          if (assignedSubjectIds.length === 0) {
              // No subjects assigned -> Show nothing and prompt
              showPrompt = true;
              filtered = []; // Clear list
          } else {
              // Filter teachers by assigned subjects
              const assignedSubjectNames = MOCK_SUBJECTS
                  .filter(s => assignedSubjectIds.includes(s.id))
                  .map(s => s.name);
              
              filtered = filtered.filter(t => {
                  const subject = t.mainSubjects?.[0];
                  return subject && assignedSubjectNames.includes(subject);
              });
          }
      } else if (selectedDept && selectedDept.type === 'staff') {
          // Filter for staff members (no main subjects)
          filtered = filtered.filter(t => !t.mainSubjects || t.mainSubjects.length === 0);
      } else if (selectedDept && (selectedDept.type === 'grade' || !selectedDept.type)) {
          // Filter for teachers (have main subjects)
          filtered = filtered.filter(t => t.mainSubjects && t.mainSubjects.length > 0);
      }

      const unassigned: Teacher[] = [];
      const assigned: Teacher[] = [];

      filtered.forEach(t => {
        const isAssigned = teacherAssignments[t.id]?.length > 0;
        if (isAssigned) {
          assigned.push(t);
        } else {
          unassigned.push(t);
        }
      });

      // Group unassigned teachers
      const unassignedGroups: Record<string, Teacher[]> = {};
      if (currentLevel === 'mam_non' || currentLevel === 'tieu_hoc') {
        // Group by alphabet or just put in one group? 
        // Original logic: unassignedGroups['ALL']
        // But wait, original logic had a check. Let's keep it simple.
        // Actually, for primary/preschool, we might want to group by Role or just list them.
        // The original code used 'ALL' for these levels.
        const key = 'Danh sách giáo viên';
        unassignedGroups[key] = unassigned.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        unassigned.forEach(t => {
          const subject = t.mainSubjects?.[0] || 'Khác';
          if (!unassignedGroups[subject]) unassignedGroups[subject] = [];
          unassignedGroups[subject].push(t);
        });
      }

      return { 
        type: 'teachers',
        unassignedGroups, 
        assigned,
        showPrompt
      };

    } else {
      // Subjects
      const filtered = MOCK_SUBJECTS.filter(s => 
        s.level.includes(currentLevel) &&
        (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
         s.code.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      const unassigned: Subject[] = [];
      const assigned: Subject[] = [];

      filtered.forEach(s => {
        const isAssigned = subjectAssignments[s.id]?.length > 0;
        if (isAssigned) {
          assigned.push(s);
        } else {
          unassigned.push(s);
        }
      });

      return { 
        type: 'subjects',
        unassigned, 
        assigned,
        unassignedGroups: {},
        showPrompt: false
      };
    }
  }, [activeTab, searchQuery, currentLevel, teacherAssignments, subjectAssignments, selectedDept]);

  const [isAssignedExpanded, setIsAssignedExpanded] = useState(false);
  const [pendingAssignment, setPendingAssignment] = useState<{
    item: any;
    deptId: string;
    type: 'teacher' | 'subject';
  } | null>(null);

  // Helper function to check if a subject matches a department name
  const isSubjectCompatible = (subjectName: string, deptName: string): boolean => {
    const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const s = normalize(subjectName);
    const d = normalize(deptName);

    // Direct match
    if (d.includes(s)) return true;

    // Keyword mapping
    const keywords: Record<string, string[]> = {
      'toan': ['toan', 'tu nhien'],
      'ly': ['ly', 'vat li', 'tu nhien', 'khtn'],
      'vat li': ['ly', 'vat li', 'tu nhien', 'khtn'],
      'hoa': ['hoa', 'tu nhien', 'khtn'],
      'sinh': ['sinh', 'tu nhien', 'khtn'],
      'van': ['van', 'xa hoi', 'khxh'],
      'ngu van': ['van', 'xa hoi', 'khxh'],
      'su': ['su', 'lich su', 'xa hoi', 'khxh'],
      'dia': ['dia', 'dia li', 'xa hoi', 'khxh'],
      'gdcd': ['gdcd', 'cong dan', 'xa hoi', 'khxh'],
      'tin': ['tin', 'cong nghe', 'ky thuat'],
      'cong nghe': ['cong nghe', 'ky thuat', 'tin'],
      'anh': ['anh', 'ngoai ngu'],
      'tieng anh': ['anh', 'ngoai ngu'],
      'the duc': ['the duc', 'the chat', 'gdqp'],
      'giao duc the chat': ['the duc', 'the chat'],
      'nhac': ['nhac', 'nghe thuat', 'am nhac'],
      'am nhac': ['nhac', 'nghe thuat', 'am nhac'],
      'my thuat': ['my thuat', 'nghe thuat'],
      'khoa hoc tu nhien': ['khtn', 'tu nhien', 'ly', 'hoa', 'sinh'],
      'lich su va dia li': ['su', 'dia', 'xa hoi', 'khxh'],
      'nghe thuat': ['nhac', 'my thuat', 'am nhac']
    };

    // Check keywords
    for (const key in keywords) {
      if (s.includes(key)) {
        for (const deptKey of keywords[key]) {
          if (d.includes(deptKey)) return true;
        }
      }
    }

    return false;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragItem(event.active.data.current);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (!over || !selectedDept) return;

    const itemType = active.data.current?.type;
    const item = active.data.current?.item;

    if (itemType === 'teacher' && over.id === 'drop-teachers') {
      // Check if teacher is already assigned to ANY department (including current one, though UI handles that)
      const isAssigned = teacherAssignments[item.id]?.length > 0;
      
      // Add teacher to department ONLY if not assigned anywhere else
      if (!selectedDept.memberIds.includes(item.id) && !isAssigned) {
        // Validation Logic for Secondary & High School
        if (currentLevel === 'thcs' || currentLevel === 'thpt') {
          const subject = item.mainSubjects?.[0] || '';
          // Only validate if it's a Subject Department (not Grade Department)
          if (selectedDept.type !== 'grade' && subject && !isSubjectCompatible(subject, selectedDept.name)) {
            setPendingAssignment({ item, deptId: selectedDept.id, type: 'teacher' });
            return;
          }
        }

        const updatedDept = {
          ...selectedDept,
          memberIds: [...selectedDept.memberIds, item.id]
        };
        updateDepartment(updatedDept);
      }
    } else if (itemType === 'subject' && over.id === 'drop-subjects') {
      // Add subject to department
      if (!selectedDept.subjectIds.includes(item.id)) {
        // Validation Logic for Secondary & High School
        if (currentLevel === 'thcs' || currentLevel === 'thpt') {
           // Only validate if it's a Subject Department (not Grade Department)
           if (selectedDept.type !== 'grade' && !isSubjectCompatible(item.name, selectedDept.name)) {
            setPendingAssignment({ item, deptId: selectedDept.id, type: 'subject' });
            return;
          }
        }

        const updatedDept = {
          ...selectedDept,
          subjectIds: [...selectedDept.subjectIds, item.id]
        };
        updateDepartment(updatedDept);
      }
    }
  };

  const confirmPendingAssignment = () => {
    if (!pendingAssignment || !selectedDept) return;

    if (pendingAssignment.type === 'teacher') {
      const updatedDept = {
        ...selectedDept,
        memberIds: [...selectedDept.memberIds, pendingAssignment.item.id]
      };
      updateDepartment(updatedDept);
    } else {
      const updatedDept = {
        ...selectedDept,
        subjectIds: [...selectedDept.subjectIds, pendingAssignment.item.id]
      };
      updateDepartment(updatedDept);
    }
    setPendingAssignment(null);
  };

  const cancelPendingAssignment = () => {
    setPendingAssignment(null);
  };

  const updateDepartment = (updatedDept: Department) => {
    setDepartments(departments.map(d => d.id === updatedDept.id ? updatedDept : d));
    setSelectedDept(updatedDept);
  };

  const handleRemoveMember = (teacherId: string) => {
    if (!selectedDept) return;
    const updatedDept = {
      ...selectedDept,
      memberIds: selectedDept.memberIds.filter(id => id !== teacherId)
    };
    updateDepartment(updatedDept);
  };

  const handleRemoveSubject = (subjectId: string) => {
    if (!selectedDept) return;
    const updatedDept = {
      ...selectedDept,
      subjectIds: selectedDept.subjectIds.filter(id => id !== subjectId)
    };
    updateDepartment(updatedDept);
  };

  const handleStartEditingName = () => {
    if (!selectedDept) return;
    setEditingNameValue(selectedDept.name);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (!selectedDept || !editingNameValue.trim()) {
      setIsEditingName(false);
      return;
    }
    const updatedDept = {
      ...selectedDept,
      name: editingNameValue.trim()
    };
    updateDepartment(updatedDept);
    setIsEditingName(false);
  };

  const handleCancelEditingName = () => {
    setIsEditingName(false);
  };

  const handleAddDepartment = (name?: string) => {
    const deptName = name || newDeptName;
    if (!deptName.trim()) return;
    
    const newDept: Department = {
      id: `d_${Date.now()}`,
      name: deptName,
      level: currentLevel,
      type: newDeptType,
      isSynced: false,
      memberIds: [],
      subjectIds: []
    };
    setDepartments([...departments, newDept]);
    setNewDeptName('');
    setIsAddModalOpen(false);
    setSelectedDept(newDept);
  };

  const handleDeleteDepartment = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa tổ chuyên môn này không?')) {
      setDepartments(departments.filter(d => d.id !== id));
      if (selectedDept?.id === id) setSelectedDept(null);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] relative flex gap-4">
      {/* COLUMN 1: Sidebar - Department List (Fixed Width) */}
      <div className="w-72 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden shrink-0">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-black text-base text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 uppercase tracking-tight text-center">
            Danh sách Tổ & Bộ Phận
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar bg-gray-50/30">
          {/* Grade Departments */}
          {gradeDepartments.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-2 mb-3 text-indigo-600 font-extrabold text-xs uppercase tracking-wider">
                <Layers size={12} />
                {currentLevel === 'mam_non' ? 'Tổ Chuyên Môn' : 'Tổ Khối'}
              </div>
              <div className="space-y-2">
                {gradeDepartments.map(dept => (
                  <div
                    key={dept.id}
                    onClick={() => setSelectedDept(departments.find(d => d.id === dept.id) || null)}
                    className={cn(
                      "group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border relative overflow-hidden",
                      selectedDept?.id === dept.id
                        ? "bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500/20"
                        : "bg-white border-gray-100 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-sm text-white transition-transform group-hover:scale-110",
                      selectedDept?.id === dept.id 
                        ? "bg-gradient-to-br from-indigo-500 to-violet-600" 
                        : "bg-gradient-to-br from-gray-400 to-gray-500 group-hover:from-indigo-400 group-hover:to-violet-500"
                    )}>
                      <GraduationCap size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "font-bold text-sm truncate transition-colors",
                        selectedDept?.id === dept.id ? "text-indigo-900" : "text-gray-700 group-hover:text-gray-900"
                      )}>
                        {dept.name}
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium mt-0.5 flex items-center gap-2">
                        <span>{dept.memberIds.length} GV</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>{dept.subjectIds.length} Môn</span>
                      </div>
                    </div>
                    {selectedDept?.id === dept.id && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-l-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subject Departments */}
          {currentLevel !== 'mam_non' && (
            <div>
              <div className="flex items-center gap-2 px-2 mb-3 text-emerald-600 font-extrabold text-xs uppercase tracking-wider">
                <Palette size={12} />
                Tổ Bộ Môn
              </div>
            <div className="space-y-2">
              {subjectDepartments.map(dept => (
                <div
                  key={dept.id}
                  onClick={() => setSelectedDept(departments.find(d => d.id === dept.id) || null)}
                  className={cn(
                    "group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border relative overflow-hidden",
                    selectedDept?.id === dept.id
                      ? "bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500/20"
                      : "bg-white border-gray-100 hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-sm text-white transition-transform group-hover:scale-110",
                    selectedDept?.id === dept.id 
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600" 
                      : "bg-gradient-to-br from-gray-400 to-gray-500 group-hover:from-emerald-400 group-hover:to-teal-500"
                  )}>
                    <BookOpen size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "font-bold text-sm truncate transition-colors",
                      selectedDept?.id === dept.id ? "text-emerald-900" : "text-gray-700 group-hover:text-gray-900"
                    )}>
                      {dept.name}
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium mt-0.5 flex items-center gap-2">
                      <span>{dept.memberIds.length} GV</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span>{dept.subjectIds.length} Môn</span>
                    </div>
                  </div>
                  {selectedDept?.id === dept.id && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-l-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staff Departments */}
          {staffDepartments.length > 0 && (
            <div>
              <div className="flex items-center gap-2 px-2 mb-3 text-orange-600 font-extrabold text-xs uppercase tracking-wider">
                <Briefcase size={12} />
                Bộ phận khác (Nhân viên)
              </div>
              <div className="space-y-2">
                {staffDepartments.map(dept => (
                  <div
                    key={dept.id}
                    onClick={() => setSelectedDept(departments.find(d => d.id === dept.id) || null)}
                    className={cn(
                      "group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border relative overflow-hidden",
                      selectedDept?.id === dept.id
                        ? "bg-white border-orange-500 shadow-md ring-1 ring-orange-500/20"
                        : "bg-white border-gray-100 hover:border-orange-300 hover:shadow-md hover:-translate-y-0.5"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-sm text-white transition-transform group-hover:scale-110",
                      selectedDept?.id === dept.id 
                        ? "bg-gradient-to-br from-orange-500 to-amber-600" 
                        : "bg-gradient-to-br from-gray-400 to-gray-500 group-hover:from-orange-400 group-hover:to-amber-500"
                    )}>
                      <Briefcase size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "font-bold text-sm truncate transition-colors",
                        selectedDept?.id === dept.id ? "text-orange-900" : "text-gray-700 group-hover:text-gray-900"
                      )}>
                        {dept.name}
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium mt-0.5 flex items-center gap-2">
                        <span>{dept.memberIds.length} NV</span>
                      </div>
                    </div>
                    {selectedDept?.id === dept.id && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-l-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-white">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-violet-700 transition-all transform hover:scale-[1.02]"
          >
            <Plus size={18} />
            Thêm tổ mới
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {selectedDept ? (
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {/* COLUMN 2: Source - Available Resources */}
            <div className="w-80 flex flex-col border-r border-gray-200 bg-gray-50/50">
              <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                {/* Tabs - Enhanced Visibility */}
                <div className="flex p-1.5 bg-gray-100/80 rounded-xl mb-5 shadow-inner border border-gray-200/50">
                  {selectedDept.type === 'subject' ? (
                    <>
                      <button
                        onClick={() => setActiveTab('subjects')}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg transition-all duration-200",
                          activeTab === 'subjects' 
                            ? "bg-white text-emerald-600 shadow-md ring-1 ring-black/5 scale-[1.02]" 
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                        )}
                      >
                        <BookOpen size={18} className={activeTab === 'subjects' ? "fill-emerald-100" : ""} />
                        MÔN HỌC
                      </button>
                      <button
                        onClick={() => {
                          // Only allow switching if subjects are assigned
                          if (selectedDept.subjectIds.length > 0) {
                            setActiveTab('teachers');
                          }
                        }}
                        disabled={selectedDept.subjectIds.length === 0}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg transition-all duration-200",
                          activeTab === 'teachers' 
                            ? "bg-white text-indigo-600 shadow-md ring-1 ring-black/5 scale-[1.02]" 
                            : selectedDept.subjectIds.length === 0
                              ? "text-gray-300 cursor-not-allowed bg-gray-50"
                              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                        )}
                      >
                        <User size={18} className={activeTab === 'teachers' ? "fill-indigo-100" : ""} />
                        GIÁO VIÊN
                      </button>
                    </>
                  ) : selectedDept.type === 'staff' ? (
                    <button
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg bg-white text-orange-600 shadow-md ring-1 ring-black/5"
                    >
                      <Briefcase size={18} className="fill-orange-100" />
                      NHÂN VIÊN
                    </button>
                  ) : currentLevel === 'mam_non' ? (
                    <button
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg bg-white text-indigo-600 shadow-md ring-1 ring-black/5"
                    >
                      <User size={18} className="fill-indigo-100" />
                      GIÁO VIÊN
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setActiveTab('teachers')}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg transition-all duration-200",
                          activeTab === 'teachers' 
                            ? "bg-white text-indigo-600 shadow-md ring-1 ring-black/5 scale-[1.02]" 
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                        )}
                      >
                        <User size={18} className={activeTab === 'teachers' ? "fill-indigo-100" : ""} />
                        GIÁO VIÊN
                      </button>
                      <button
                        onClick={() => setActiveTab('subjects')}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-lg transition-all duration-200",
                          activeTab === 'subjects' 
                            ? "bg-white text-emerald-600 shadow-md ring-1 ring-black/5 scale-[1.02]" 
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                        )}
                      >
                        <BookOpen size={18} className={activeTab === 'subjects' ? "fill-emerald-100" : ""} />
                        MÔN HỌC
                      </button>
                    </>
                  )}
                </div>

                {/* Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="text"
                    placeholder={
                      selectedDept.type === 'staff' 
                        ? "Tìm nhân viên..." 
                        : activeTab === 'teachers' 
                          ? "Tìm giáo viên..." 
                          : (currentLevel === 'mam_non' ? "Tìm hoạt động..." : "Tìm môn học...")
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* Filter Info Banner for Teachers Tab (THCS/THPT) */}
                {activeTab === 'teachers' && (currentLevel === 'thcs' || currentLevel === 'thpt') && selectedDept.type !== 'grade' && selectedDept.subjectIds.length > 0 && (
                  <div className="mb-3 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 text-indigo-600">
                        <Layers size={14} />
                      </div>
                      <div>
                        <p className="text-xs text-indigo-900 font-semibold mb-1">
                          Đang lọc giáo viên theo môn:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {MOCK_SUBJECTS.filter(s => selectedDept.subjectIds.includes(s.id)).map(s => (
                            <span key={s.id} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-white text-indigo-700 border border-indigo-200">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Drag Instruction Hint */}
                <div className="flex items-start gap-2 p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg mb-1">
                  <div className="p-1 bg-white rounded shadow-sm text-indigo-600 mt-0.5">
                    <GripVertical size={12} />
                  </div>
                  <p className="text-xs text-indigo-800 leading-relaxed font-medium">
                    <span className="font-bold">Mẹo:</span> Kéo thả {activeTab === 'teachers' ? 'giáo viên' : (currentLevel === 'mam_non' ? 'hoạt động' : 'môn học')} từ danh sách này sang khung bên phải để thêm vào tổ.
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                <div className="space-y-4">
                  {/* ASSIGNED ITEMS (Collapsible - Moved to Top) */}
                  {(filteredSourceData.type === 'teachers' ? filteredSourceData.assigned.length > 0 : filteredSourceData.assigned.length > 0) && (
                    <div className="mb-4">
                      <button 
                        onClick={() => setIsAssignedExpanded(!isAssignedExpanded)}
                        className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg group border border-slate-600"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors shadow-sm",
                            isAssignedExpanded ? "bg-white text-slate-800" : "bg-slate-600 text-white group-hover:bg-white group-hover:text-slate-800"
                          )}>
                            {filteredSourceData.type === 'teachers' ? filteredSourceData.assigned.length : filteredSourceData.assigned.length}
                          </div>
                          <span className="text-sm font-bold uppercase tracking-wide">Đã xếp tổ</span>
                        </div>
                        {isAssignedExpanded ? <ChevronDown size={18} className="text-slate-200" /> : <ChevronRight size={18} className="text-slate-200" />}
                      </button>
                      
                      <AnimatePresence>
                        {isAssignedExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-2 pt-3 pb-2 pl-1">
                              {filteredSourceData.type === 'teachers' ? (
                                (filteredSourceData.assigned as Teacher[]).map(teacher => (
                                  <DraggableItem
                                    key={teacher.id}
                                    id={teacher.id}
                                    data={teacher}
                                    type="teacher"
                                    isSelected={selectedDept.memberIds.includes(teacher.id)}
                                    assignedTo={teacherAssignments[teacher.id]}
                                    isLocked={true} // Always locked in this section
                                  />
                                ))
                              ) : (
                                (filteredSourceData.assigned as Subject[]).map(subject => (
                                  <DraggableItem
                                    key={subject.id}
                                    id={subject.id}
                                    data={subject}
                                    type="subject"
                                    isSelected={selectedDept.subjectIds.includes(subject.id)}
                                    assignedTo={subjectAssignments[subject.id]}
                                    isLocked={true} // Always locked in this section
                                  />
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* PROMPT FOR THCS/THPT */}
                  {filteredSourceData.showPrompt && (
                    <div className="flex flex-col items-center justify-center p-6 text-center bg-white border-2 border-dashed border-gray-200 rounded-xl mt-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-3">
                        <BookOpen size={24} />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1">Chưa có môn học</h3>
                      <p className="text-xs text-gray-500 mb-4 max-w-[200px] mx-auto">
                        Vui lòng thêm môn học vào tổ trước để hiển thị danh sách giáo viên phù hợp.
                      </p>
                      <button
                        onClick={() => setActiveTab('subjects')}
                        className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                      >
                        Chuyển sang tab Môn học
                      </button>
                    </div>
                  )}

                  {/* UNASSIGNED ITEMS */}
                  {filteredSourceData.type === 'teachers' ? (
                    Object.entries(filteredSourceData.unassignedGroups as Record<string, Teacher[]>).map(([subject, teachers]) => {
                      if (teachers.length === 0) return null;
                      return (
                        <div key={subject}>
                          {/* Only show header if NOT mam_non or tieu_hoc */}
                          {!['mam_non', 'tieu_hoc'].includes(currentLevel) && (
                            <div className="flex items-center gap-3 mb-3 mt-2 px-1">
                              <span className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 shadow-sm">
                                {subject}
                              </span>
                              <div className="h-px flex-1 bg-indigo-100/50"></div>
                            </div>
                          )}
                          <div className="space-y-2">
                            {teachers.map(teacher => (
                              <DraggableItem
                                key={teacher.id}
                                id={teacher.id}
                                data={teacher}
                                type="teacher"
                                isSelected={selectedDept.memberIds.includes(teacher.id)}
                                assignedTo={teacherAssignments[teacher.id]}
                                isLocked={false} // Unassigned teachers are never locked
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="space-y-2">
                      {(filteredSourceData.unassigned as Subject[]).map(subject => (
                        <DraggableItem
                          key={subject.id}
                          id={subject.id}
                          data={subject}
                          type="subject"
                          isSelected={selectedDept.subjectIds.includes(subject.id)}
                          isLocked={false}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* COLUMN 3: Target - Department Details */}
            <div className="flex-1 flex flex-col bg-white min-w-0">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      {isEditingName ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingNameValue}
                            onChange={(e) => setEditingNameValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveName();
                              if (e.key === 'Escape') handleCancelEditingName();
                            }}
                            autoFocus
                            className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 focus:outline-none bg-transparent"
                          />
                          <button
                            onClick={handleSaveName}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Lưu"
                          >
                            <Check size={20} />
                          </button>
                          <button
                            onClick={handleCancelEditingName}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hủy"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold text-gray-900">{selectedDept.name}</h2>
                          {selectedDept.type !== 'grade' && (
                            <button
                              onClick={handleStartEditingName}
                              className="p-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all"
                              title="Đổi tên tổ"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                        </div>
                      )}
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide",
                        selectedDept.type === 'grade' || !selectedDept.type 
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-100" 
                          : selectedDept.type === 'subject'
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-orange-50 text-orange-700 border border-orange-100"
                      )}>
                        {selectedDept.type === 'grade' || !selectedDept.type 
                          ? (currentLevel === 'mam_non' ? 'Tổ Chuyên Môn' : 'Tổ Khối')
                          : selectedDept.type === 'subject' 
                            ? 'Tổ Bộ Môn' 
                            : 'Bộ phận khác'}
                      </span>
                    </div>
                    {selectedDept.type !== 'staff' && (
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-500 text-sm">
                          {currentLevel === 'mam_non' ? 'Quản lý thành viên và các hoạt động thuộc tổ' : 'Quản lý thành viên và các môn học thuộc tổ'}
                        </p>
                        <button
                          onClick={() => setIsInfoModalOpen(true)}
                          className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                        >
                          <Info size={14} />
                          Tại sao cần thiết lập?
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {!selectedDept.isFixed && (
                    <button 
                      onClick={() => handleDeleteDepartment(selectedDept.id)}
                      className="flex items-center gap-2 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Trash2 size={14} />
                      Xóa tổ
                    </button>
                  )}
                </div>
              </div>

              {/* Info Modal */}
              <AnimatePresence>
                {isInfoModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg overflow-hidden"
                    >
                      <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Info size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">Ý nghĩa thiết lập Tổ chuyên môn</h3>
                            <p className="text-xs text-gray-500">Tại sao việc này lại quan trọng?</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsInfoModalOpen(false)}
                          className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      
                      <div className="p-6 space-y-5">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Việc định nghĩa rõ cấu trúc tổ là <strong className="text-gray-900">bước nền tảng</strong> để vận hành quy trình giáo dục tự động hóa:
                        </p>
                        
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                              <Layers size={18} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 mb-1">Lập kế hoạch giáo dục</h4>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                Xây dựng kế hoạch dạy học chi tiết dựa trên nhân sự thực tế và đặc thù chuyên môn của từng tổ.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                              <BookOpen size={18} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 mb-1">Phân công giảng dạy</h4>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                Hệ thống tự động gợi ý phân công và kiểm tra định mức tiết dạy, đảm bảo công bằng và đúng quy chế.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                              <GraduationCap size={18} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 mb-1">Quản lý & Đánh giá</h4>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                Phân quyền cho Tổ trưởng duyệt giáo án, đánh giá thi đua và tổ chức sinh hoạt chuyên môn hiệu quả.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => setIsInfoModalOpen(false)}
                          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          Đã hiểu
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Droppable Areas Container */}
              <div className="flex-1 flex flex-col h-full bg-gray-50/30 overflow-hidden">
                
                {/* Subject Configuration Section - Universal (except staff and mam_non) */}
                {selectedDept.type !== 'staff' && currentLevel !== 'mam_non' && (
                  <div className="px-6 pt-6 pb-2 shrink-0">
                    <DroppableArea
                      id="drop-subjects"
                      title={currentLevel === 'mam_non' ? "Khai báo hoạt động thuộc tổ" : "Khai báo môn học thuộc tổ"}
                      icon={Book}
                      count={selectedDept.subjectIds.length}
                      colorClass="bg-emerald-500"
                      variant="horizontal"
                    >
                      {selectedDept.subjectIds.map(id => {
                        const subject = MOCK_SUBJECTS.find(s => s.id === id);
                        if (!subject) return null;
                        return (
                          <div key={id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-emerald-200 shadow-sm group hover:border-emerald-300 transition-all">
                            <div className="w-5 h-5 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                              {subject.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{subject.name}</span>
                            <button
                              onClick={() => handleRemoveSubject(id)}
                              className="ml-1 p-0.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                              title="Xóa khỏi tổ"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </DroppableArea>
                  </div>
                )}

                <div className="flex-1 p-6 overflow-hidden">
                  <div className="flex gap-6 h-full">
                    {/* Teachers Column - Always visible, full width */}
                    <div className="flex flex-col h-full flex-1">
                      <DroppableArea
                        id="drop-teachers"
                        title={selectedDept.type === 'staff' ? "Danh sách nhân viên" : "Danh sách giáo viên"}
                        icon={selectedDept.type === 'staff' ? Briefcase : User}
                        count={selectedDept.memberIds.length}
                        colorClass={selectedDept.type === 'staff' ? "bg-orange-500" : "bg-indigo-500"}
                      >
                        {selectedDept.memberIds.length > 0 ? (
                          <div className="grid grid-cols-1 gap-2">
                            {selectedDept.memberIds.map(id => {
                              const teacher = MOCK_TEACHERS.find(t => t.id === id);
                              if (!teacher) return null;
                              return (
                                <div key={id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm group hover:border-indigo-300 transition-all">
                                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">
                                    {teacher.name.charAt(0)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-gray-900">{teacher.name}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-2">
                                      <span>{teacher.code}</span>
                                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                      <span>{teacher.mainSubjects?.[0]}</span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveMember(id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Xóa khỏi tổ"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                      </DroppableArea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DragOverlay>
              {activeDragItem ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border-2 border-indigo-500 shadow-2xl cursor-grabbing w-72 transform scale-105">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md">
                    <GripVertical size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-900 truncate">{activeDragItem.item.name}</div>
                    <div className="text-xs text-gray-500">{activeDragItem.item.code}</div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
              <Layers size={40} className="text-indigo-200" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Chưa chọn Tổ chuyên môn</h3>
            <p className="text-sm text-gray-500 max-w-xs text-center">
              Vui lòng chọn một tổ từ danh sách bên trái hoặc tạo mới để bắt đầu quản lý.
            </p>
          </div>
        )}
      </div>

      {/* Add Department Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Thêm Tổ/Bộ Phận Mới</h3>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Loại tổ/bộ phận
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setNewDeptType(currentLevel === 'mam_non' ? 'grade' : 'subject')}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-xl border transition-all text-sm font-bold",
                          (newDeptType === 'subject' || newDeptType === 'grade')
                            ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm"
                            : "bg-white border-gray-200 text-gray-600 hover:border-emerald-200"
                        )}
                      >
                        {currentLevel === 'mam_non' ? <Layers size={16} /> : <Palette size={16} />}
                        {currentLevel === 'mam_non' ? 'Tổ Chuyên Môn' : 'Tổ Bộ Môn'}
                      </button>
                      <button
                        onClick={() => setNewDeptType('staff')}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-xl border transition-all text-sm font-bold",
                          newDeptType === 'staff'
                            ? "bg-orange-50 border-orange-500 text-orange-700 shadow-sm"
                            : "bg-white border-gray-200 text-gray-600 hover:border-orange-200"
                        )}
                      >
                        <Briefcase size={16} />
                        Bộ Phận Khác
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên {newDeptType === 'staff' ? 'bộ phận' : (currentLevel === 'mam_non' ? 'tổ chuyên môn' : 'tổ bộ môn')}
                    </label>
                    <input
                      autoFocus
                      type="text"
                      value={newDeptName}
                      onChange={(e) => setNewDeptName(e.target.value)}
                      placeholder={newDeptType === 'staff' ? "Ví dụ: Tổ Văn phòng" : (currentLevel === 'mam_non' ? "Ví dụ: Nhóm trẻ 24-36 tháng" : "Ví dụ: Tổ Ngoại ngữ")}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-gray-50"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddDepartment()}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Gợi ý tên tổ
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_DEPARTMENTS.map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => setNewDeptName(suggestion)}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors border border-indigo-100"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={() => handleAddDepartment()}
                      disabled={!newDeptName.trim()}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Tạo mới
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Warning Modal */}
      <AnimatePresence>
        {pendingAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Cảnh báo phân công</h3>
                    <p className="text-sm text-gray-500">Phát hiện logic không phù hợp</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Bạn đang xếp {pendingAssignment.type === 'teacher' ? 'giáo viên' : 'môn'} <span className="font-bold text-gray-900">{pendingAssignment.type === 'teacher' ? pendingAssignment.item.name : pendingAssignment.item.name}</span> 
                  {pendingAssignment.type === 'teacher' && <span className="text-gray-500"> (Môn: {pendingAssignment.item.mainSubjects?.[0]})</span>}
                  {' '}vào <span className="font-bold text-indigo-600">{selectedDept?.name}</span>.
                  <br/><br/>
                  Hệ thống nhận thấy chuyên môn không phù hợp với tên tổ. Bạn có chắc chắn muốn tiếp tục?
                </p>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={cancelPendingAssignment}
                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={confirmPendingAssignment}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
                  >
                    <Check size={16} />
                    Vẫn xếp vào
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentManager;
