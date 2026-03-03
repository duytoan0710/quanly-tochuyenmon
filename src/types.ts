export type SchoolLevel = 'mam_non' | 'tieu_hoc' | 'thcs' | 'thpt';

export interface Teacher {
  id: string;
  code: string; // Mã định danh trên CSDL ngành
  name: string;
  email?: string;
  avatar?: string;
  mainSubjects?: string[]; // Môn dạy chính (cho giáo viên)
  level?: SchoolLevel[]; // Cấp học giảng dạy
  role?: string; // Chức vụ (cho cán bộ/nhân viên)
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  level: SchoolLevel[]; // Môn học thuộc cấp nào
}

export interface Department {
  id: string;
  name: string;
  level: SchoolLevel;
  type?: 'grade' | 'subject' | 'staff'; // Loại tổ: Tổ khối, Tổ bộ môn hoặc Tổ nhân viên/văn phòng
  description?: string;
  isSynced: boolean; // True nếu lấy từ CSDL ngành, False nếu tự tạo
  isFixed?: boolean; // True nếu là tổ cố định không được xóa (VD: Khối 1-5)
  memberIds: string[]; // Danh sách ID giáo viên
  subjectIds: string[]; // Danh sách ID môn học
}

export interface SchoolConfig {
  id: string;
  name: string;
  isMultiLevel: boolean;
  activeLevels: SchoolLevel[];
}
