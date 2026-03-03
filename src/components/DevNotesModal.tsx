import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Code, Info, Zap, ShieldCheck, Layout, AlertTriangle } from 'lucide-react';

interface DevNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DevNotesModal: React.FC<DevNotesModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <Code className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Tài liệu dành cho Developer</h2>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Module Quản lý Tổ & Bộ Phận</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white hover:shadow-md rounded-full text-slate-400 hover:text-slate-600 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-12 custom-scrollbar">
              {/* Section 1: Quy tắc chung */}
              <section>
                <div className="flex items-center gap-3 mb-6 text-indigo-600">
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <Zap size={24} className="fill-indigo-500" />
                  </div>
                  <h3 className="font-bold text-2xl tracking-tight">Quy tắc nghiệp vụ chung</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200 shadow-inner">
                    <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                      <ShieldCheck size={18} className="text-indigo-500" /> Ràng buộc nhân sự
                    </h4>
                    <ul className="space-y-3 text-sm text-slate-600">
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span><strong>Duy nhất</strong>: Một giáo viên/nhân viên chỉ được thuộc về <strong>01 tổ duy nhất</strong> trong toàn trường.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span><strong>Trạng thái</strong>: Khi đã được xếp vào một tổ, nhân sự đó sẽ không xuất hiện trong danh sách chờ của các tổ khác.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-6 bg-blue-50/30 rounded-[2rem] border border-blue-100 shadow-inner">
                    <h4 className="font-bold text-blue-900 text-sm mb-4 flex items-center gap-2">
                      <Zap size={18} className="text-blue-500" /> Tối ưu thao tác
                    </h4>
                    <div className="p-4 bg-white rounded-2xl border border-blue-50 shadow-sm">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        <strong>Lọc tự động</strong>: Khi một tổ bộ môn đã được khai báo danh sách môn học, hệ thống sẽ <strong>tự động lọc</strong> danh sách giáo viên có chuyên môn tương ứng. 
                        <br /><br />
                        <span className="text-blue-700 font-medium italic">* Giúp người dùng không phải tìm kiếm thủ công trong danh sách hàng trăm giáo viên.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Đặc thù theo Cấp học */}
              <section>
                <div className="flex items-center gap-3 mb-6 text-emerald-600">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <Layout size={24} className="fill-emerald-500" />
                  </div>
                  <h3 className="font-bold text-2xl tracking-tight">Đặc thù theo cấp học</h3>
                </div>
                <div className="space-y-6">
                  {/* Mầm non */}
                  <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <span className="font-bold text-sm">MN</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">Cấp Mầm non</h4>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                      <li className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <strong>Cấu trúc tổ</strong>: Không chia theo môn học. Chỉ có "Tổ Chuyên Môn" (thay thế cho Tổ Khối).
                      </li>
                      <li className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <strong>Mặc định</strong>: Luôn có sẵn "Nhóm nhà trẻ" và "Lớp mẫu giáo" để bắt đầu làm việc.
                      </li>
                    </ul>
                  </div>

                  {/* Tiểu học */}
                  <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <span className="font-bold text-sm">TH</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">Cấp Tiểu học</h4>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                      <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-bold text-amber-900 mb-1">Ràng buộc hệ thống</p>
                        <p className="text-sm text-amber-800 leading-relaxed">
                          Các <strong>Khối 1, 2, 3, 4, 5</strong> là mặc định theo chương trình phổ thông. Người dùng <strong>không được phép xóa</strong> các tổ khối này để đảm bảo tính toàn vẹn dữ liệu.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* THCS & THPT */}
                  <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                        <span className="font-bold text-sm">PT</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg">Cấp THCS & THPT</h4>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600 font-medium italic">Logic kiểm tra tính tương thích khi xếp tổ:</p>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-center">
                          <p className="text-[10px] text-rose-400 uppercase font-bold mb-1">Toán</p>
                          <p className="text-xs font-bold text-rose-900">Tổ Tự nhiên</p>
                        </div>
                        <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-center">
                          <p className="text-[10px] text-rose-400 uppercase font-bold mb-1">Lý/Hóa/Sinh</p>
                          <p className="text-xs font-bold text-rose-900">Tổ KHTN</p>
                        </div>
                        <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-center">
                          <p className="text-[10px] text-rose-400 uppercase font-bold mb-1">Văn/Sử/Địa</p>
                          <p className="text-xs font-bold text-rose-900">Tổ KHXH</p>
                        </div>
                        <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-center">
                          <p className="text-[10px] text-rose-400 uppercase font-bold mb-1">Ngoại ngữ</p>
                          <p className="text-xs font-bold text-rose-900">Tổ Anh văn</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Hệ thống sẽ cảnh báo nếu người dùng cố tình xếp giáo viên vào tổ không phù hợp với chuyên môn (Ví dụ: Giáo viên Văn vào tổ Toán - Tin).
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3: Quy trình vận hành */}
              <section>
                <div className="flex items-center gap-3 mb-6 text-orange-600">
                  <div className="p-2 bg-orange-100 rounded-xl">
                    <Info size={24} className="fill-orange-500" />
                  </div>
                  <h3 className="font-bold text-2xl tracking-tight">Quy trình vận hành chuẩn</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-6 bg-orange-50/30 rounded-[2rem] border border-orange-100">
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md mb-4">
                      <span className="text-orange-500 text-lg font-bold">1</span>
                    </div>
                    <h5 className="font-bold text-slate-800 text-sm mb-2">Khai báo Môn học</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">Xác định các môn học/hoạt động mà tổ đó sẽ phụ trách giảng dạy.</p>
                  </div>
                  <div className="p-6 bg-orange-50/30 rounded-[2rem] border border-orange-100">
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md mb-4">
                      <span className="text-orange-500 text-lg font-bold">2</span>
                    </div>
                    <h5 className="font-bold text-slate-800 text-sm mb-2">Xếp giáo viên</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">Kéo thả giáo viên vào tổ. Danh sách đã được lọc sẵn theo môn học ở bước 1.</p>
                  </div>
                  <div className="p-6 bg-orange-50/30 rounded-[2rem] border border-orange-100">
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md mb-4">
                      <span className="text-orange-500 text-lg font-bold">3</span>
                    </div>
                    <h5 className="font-bold text-slate-800 text-sm mb-2">Kiểm tra & Lưu</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">Hệ thống tự động kiểm tra các ràng buộc và đồng bộ dữ liệu lên máy chủ.</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
              >
                Đã hiểu các quy tắc
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DevNotesModal;
