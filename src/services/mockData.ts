import { SchoolLevel, Subject, Teacher } from '../types';

// --- Helper Data ---
const FIRST_NAMES = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const MIDDLE_NAMES_MALE = ['Văn', 'Hữu', 'Đức', 'Thành', 'Công', 'Minh', 'Quang', 'Tuấn', 'Hoàng'];
const MIDDLE_NAMES_FEMALE = ['Thị', 'Thu', 'Thanh', 'Ngọc', 'Hồng', 'Kim', 'Mai', 'Phương', 'Bích'];
const LAST_NAMES_MALE = ['An', 'Bình', 'Cường', 'Dũng', 'Em', 'Hùng', 'Khánh', 'Long', 'Minh', 'Nam', 'Phong', 'Quân', 'Sơn', 'Thắng', 'Tùng', 'Việt'];
const LAST_NAMES_FEMALE = ['Anh', 'Bích', 'Chi', 'Dung', 'Giang', 'Hà', 'Hương', 'Lan', 'Linh', 'Mai', 'Ngọc', 'Oanh', 'Phương', 'Quyên', 'Thảo', 'Trang', 'Uyên', 'Vân', 'Yến'];

function generateName(gender: 'male' | 'female'): string {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const middle = gender === 'male' 
    ? MIDDLE_NAMES_MALE[Math.floor(Math.random() * MIDDLE_NAMES_MALE.length)]
    : MIDDLE_NAMES_FEMALE[Math.floor(Math.random() * MIDDLE_NAMES_FEMALE.length)];
  const last = gender === 'male'
    ? LAST_NAMES_MALE[Math.floor(Math.random() * LAST_NAMES_MALE.length)]
    : LAST_NAMES_FEMALE[Math.floor(Math.random() * LAST_NAMES_FEMALE.length)];
  return `${first} ${middle} ${last}`;
}

function generateCCCD(): string {
  let cccd = '';
  for (let i = 0; i < 12; i++) {
    cccd += Math.floor(Math.random() * 10).toString();
  }
  return cccd;
}

// --- MOCK DATA GENERATION ---

// 1. MẦM NON (Preschool)
const TEACHERS_MN: Teacher[] = Array.from({ length: 15 }, (_, i) => ({
  id: `t_mn_${i + 1}`,
  code: generateCCCD(),
  name: generateName('female'), // Mostly female teachers in preschool
  mainSubjects: ['Giáo viên Mầm non'],
  level: ['mam_non'],
  role: i === 0 ? 'Tổ trưởng' : 'Giáo viên',
}));

const SUBJECTS_MN: Subject[] = [
  { id: 's_mn_1', code: 'MN01', name: 'Hoạt động vui chơi', level: ['mam_non'] },
  { id: 's_mn_2', code: 'MN02', name: 'Hoạt động học', level: ['mam_non'] },
  { id: 's_mn_3', code: 'MN03', name: 'Hoạt động ăn ngủ', level: ['mam_non'] },
  { id: 's_mn_4', code: 'MN04', name: 'Vệ sinh cá nhân', level: ['mam_non'] },
  { id: 's_mn_5', code: 'MN05', name: 'Đón trả trẻ', level: ['mam_non'] },
];

// 2. TIỂU HỌC (Primary School)
// GVCN (Homeroom teachers) - Teach many subjects
const TEACHERS_TH_GVCN: Teacher[] = Array.from({ length: 20 }, (_, i) => ({
  id: `t_th_cn_${i + 1}`,
  code: generateCCCD(),
  name: generateName(Math.random() > 0.8 ? 'male' : 'female'),
  mainSubjects: ['Toán', 'Tiếng Việt', 'Đạo đức', 'TNXH', 'HĐTN'],
  level: ['tieu_hoc'],
  role: i % 5 === 0 ? 'Tổ trưởng' : 'Giáo viên',
}));

// GV Bộ môn (Specialist teachers)
const TEACHERS_TH_BM: Teacher[] = [
  { id: 't_th_bm_1', code: generateCCCD(), name: generateName('female'), mainSubjects: ['Tiếng Anh'], level: ['tieu_hoc'], role: 'Giáo viên' },
  { id: 't_th_bm_2', code: generateCCCD(), name: generateName('male'), mainSubjects: ['Tin học', 'Công nghệ'], level: ['tieu_hoc'], role: 'Giáo viên' },
  { id: 't_th_bm_3', code: generateCCCD(), name: generateName('male'), mainSubjects: ['Giáo dục thể chất'], level: ['tieu_hoc'], role: 'Giáo viên' },
  { id: 't_th_bm_4', code: generateCCCD(), name: generateName('female'), mainSubjects: ['Âm nhạc'], level: ['tieu_hoc'], role: 'Giáo viên' },
  { id: 't_th_bm_5', code: generateCCCD(), name: generateName('female'), mainSubjects: ['Mĩ thuật'], level: ['tieu_hoc'], role: 'Giáo viên' },
];

const SUBJECTS_TH: Subject[] = [
  { id: 's_th_1', code: 'TH01', name: 'Toán', level: ['tieu_hoc'] },
  { id: 's_th_2', code: 'TH02', name: 'Tiếng Việt', level: ['tieu_hoc'] },
  { id: 's_th_3', code: 'TH03', name: 'Tiếng Anh', level: ['tieu_hoc'] },
  { id: 's_th_4', code: 'TH04', name: 'Đạo đức', level: ['tieu_hoc'] },
  { id: 's_th_5', code: 'TH05', name: 'Tự nhiên và Xã hội', level: ['tieu_hoc'] },
  { id: 's_th_6', code: 'TH06', name: 'Lịch sử và Địa lí', level: ['tieu_hoc'] },
  { id: 's_th_7', code: 'TH07', name: 'Khoa học', level: ['tieu_hoc'] },
  { id: 's_th_8', code: 'TH08', name: 'Tin học và Công nghệ', level: ['tieu_hoc'] },
  { id: 's_th_9', code: 'TH09', name: 'Giáo dục thể chất', level: ['tieu_hoc'] },
  { id: 's_th_10', code: 'TH10', name: 'Âm nhạc', level: ['tieu_hoc'] },
  { id: 's_th_11', code: 'TH11', name: 'Mĩ thuật', level: ['tieu_hoc'] },
  { id: 's_th_12', code: 'TH12', name: 'Hoạt động trải nghiệm', level: ['tieu_hoc'] },
];

// 3. THCS (Secondary School)
const SUBJECTS_THCS_LIST = [
  'Ngữ văn', 'Toán', 'Tiếng Anh', 'KHTN', 'Lịch sử và Địa lí', 'GDCD', 'Tin học', 'Công nghệ', 'Giáo dục thể chất', 'Nghệ thuật', 'HĐTN-HN'
];

const TEACHERS_THCS: Teacher[] = SUBJECTS_THCS_LIST.flatMap((subject, index) => {
  // Create 2-3 teachers per subject
  const count = ['Toán', 'Ngữ văn', 'Tiếng Anh'].includes(subject) ? 4 : 2;
  return Array.from({ length: count }, (_, i) => ({
    id: `t_thcs_${index}_${i}`,
    code: generateCCCD(),
    name: generateName(Math.random() > 0.5 ? 'male' : 'female'),
    mainSubjects: [subject],
    level: ['thcs'],
    role: i === 0 ? 'Tổ trưởng' : 'Giáo viên',
  }));
});

const SUBJECTS_THCS: Subject[] = SUBJECTS_THCS_LIST.map((name, i) => ({
  id: `s_thcs_${i}`,
  code: `THCS${(i + 1).toString().padStart(2, '0')}`,
  name,
  level: ['thcs'],
}));

// 4. THPT (High School)
const SUBJECTS_THPT_LIST = [
  'Ngữ văn', 'Toán', 'Tiếng Anh', 'Giáo dục thể chất', 'GDQP&AN', 'HĐTN-HN', // Compulsory
  'Vật lí', 'Hóa học', 'Sinh học', // Natural Sciences
  'Lịch sử', 'Địa lí', 'GDKT&PL', // Social Sciences
  'Tin học', 'Công nghệ', 'Âm nhạc', 'Mĩ thuật' // Technology & Arts
];

const TEACHERS_THPT: Teacher[] = SUBJECTS_THPT_LIST.flatMap((subject, index) => {
  // Create 2-3 teachers per subject
  const count = ['Toán', 'Ngữ văn', 'Tiếng Anh'].includes(subject) ? 5 : 2;
  return Array.from({ length: count }, (_, i) => ({
    id: `t_thpt_${index}_${i}`,
    code: generateCCCD(),
    name: generateName(Math.random() > 0.5 ? 'male' : 'female'),
    mainSubjects: [subject],
    level: ['thpt'],
    role: i === 0 ? 'Tổ trưởng' : 'Giáo viên',
  }));
});

const SUBJECTS_THPT: Subject[] = SUBJECTS_THPT_LIST.map((name, i) => ({
  id: `s_thpt_${i}`,
  code: `THPT${(i + 1).toString().padStart(2, '0')}`,
  name,
  level: ['thpt'],
}));

// 5. STAFF (Non-teaching staff)
const STAFF_ROLES = ['Kế toán', 'Văn thư', 'Y tế', 'Thủ quỹ', 'Thư viện', 'Bảo vệ', 'Phục vụ', 'Tài xế'];
const STAFF: Teacher[] = STAFF_ROLES.map((role, i) => ({
  id: `staff_${i + 1}`,
  code: generateCCCD(),
  name: generateName(Math.random() > 0.5 ? 'male' : 'female'),
  mainSubjects: [], // No subjects for staff
  level: ['mam_non', 'tieu_hoc', 'thcs', 'thpt'], // Staff can be in any level
  role: role,
}));


// --- EXPORT ---

export const MOCK_TEACHERS: Teacher[] = [
  ...TEACHERS_MN,
  ...TEACHERS_TH_GVCN,
  ...TEACHERS_TH_BM,
  ...TEACHERS_THCS,
  ...TEACHERS_THPT,
  ...STAFF,
];

export const MOCK_SUBJECTS: Subject[] = [
  ...SUBJECTS_MN,
  ...SUBJECTS_TH,
  ...SUBJECTS_THCS,
  ...SUBJECTS_THPT,
];

export const LEVEL_LABELS: Record<SchoolLevel, string> = {
  mam_non: 'Mầm non',
  tieu_hoc: 'Tiểu học',
  thcs: 'THCS',
  thpt: 'THPT',
};
