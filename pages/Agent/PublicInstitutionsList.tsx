
import React, { useState } from 'react';
import { Institution, SystemProduct } from '../../types';
import { ICONS } from '../../constants';

interface PublicInstitutionsListProps {
  institutions: Institution[];
  systems: SystemProduct[];
  onAddVisit: (data: Omit<Institution, 'id' | 'status' | 'lastVisitDate'>) => Promise<void>;
  onDelete: (id: string) => void;
  currentUserName: string;
}

const PublicInstitutionsList: React.FC<PublicInstitutionsListProps> = ({ institutions, systems, onAddVisit, currentUserName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    offeredSystem: ''
  });

  const filtered = institutions.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddVisit({
        ...formData,
        lastVisitedBy: currentUserName
      });
      setIsModalOpen(false);
      setFormData({ name: '', city: '', address: '', offeredSystem: '' });
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">مستودع البيانات الميدانية</h3>
          <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.4em]">Field Intelligence Registry</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 flex-1 lg:max-w-3xl">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="ابحث عن مدرسة أو مدينة..."
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-black border border-white/5 text-white outline-none focus:border-white transition-all font-bold text-sm"
            />
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-600">
              {ICONS.Search}
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all active:scale-95 whitespace-nowrap"
          >
            تسجيل زيارة جديدة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((inst) => (
          <div key={inst.id} className="bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 flex flex-col gap-6 group hover:border-white/10 transition-all shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl -mr-12 -mt-12 group-hover:bg-white/10 transition-all"></div>
            
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 bg-black border border-white/5 rounded-2xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                {ICONS.Institutions}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                  inst.status === 'CUSTOMER' ? 'bg-white text-black border-white' : 'bg-black text-gray-500 border-white/5'
                }`}>
                  {inst.status === 'CUSTOMER' ? 'عميل نشط' : 'تمت الزيارة'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-black text-xl text-white tracking-tighter uppercase">{inst.name}</h4>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                {ICONS.Location} {inst.city} - {inst.address}
              </p>
              {inst.offeredSystem && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[7px] font-black text-gray-700 uppercase tracking-widest">النظام المعروض:</span>
                  <span className="text-[10px] font-black text-white uppercase italic">{inst.offeredSystem}</span>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-gray-700 font-black uppercase tracking-widest">تاريخ أخر رصد</span>
                <span className="text-[10px] text-gray-400 font-black">{inst.lastVisitDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-gray-700 font-black uppercase tracking-widest">المسؤول عن الزيارة</span>
                <span className="text-[10px] text-white font-black uppercase tracking-tighter italic">{inst.lastVisitedBy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-32 bg-[#050505] rounded-[3rem] border border-dashed border-white/5">
          <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 text-gray-800">
            {ICONS.Search}
          </div>
          <p className="text-gray-600 font-black uppercase tracking-[0.4em] text-[10px]">No intelligence found in this sector</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[100] p-6 overflow-y-auto">
          <div className="bg-[#0A0A0A] w-full max-w-xl rounded-[4rem] border border-white/10 shadow-2xl animate-in zoom-in duration-300">
            <form onSubmit={handleSubmit} className="p-12 space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-3xl font-black text-white tracking-tighter uppercase italic">رصد مدرسة جديدة</h4>
                  <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.4em] mt-1">Deployment Target Setup</p>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  {ICONS.X}
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mr-4">اسم المدرسة</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-8 py-5 rounded-[2rem] bg-black border border-white/5 text-white focus:border-white outline-none transition-all font-black text-sm" placeholder="اسم المدرسة أو المؤسسة" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mr-4">المدينة</label>
                    <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-8 py-5 rounded-[2rem] bg-black border border-white/5 text-white focus:border-white outline-none transition-all font-black text-sm" placeholder="المدينة" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mr-4">النظام المعروض</label>
                    <select required value={formData.offeredSystem} onChange={e => setFormData({...formData, offeredSystem: e.target.value})} className="w-full px-8 py-5 rounded-[2rem] bg-black border border-white/5 text-white focus:border-white outline-none transition-all font-black text-sm appearance-none cursor-pointer">
                      <option value="">اختر النظام</option>
                      {systems.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      <option value="أخرى">أخرى / غير محدد</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mr-4">العنوان</label>
                  <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-8 py-5 rounded-[2rem] bg-black border border-white/5 text-white focus:border-white outline-none transition-all font-black text-sm" placeholder="الحي - الشارع" />
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-white text-black font-black py-6 rounded-[2.5rem] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all text-[11px] uppercase tracking-[0.4em] disabled:opacity-50"
                >
                  {isSubmitting ? 'جار الحفظ...' : 'تأكيد الرصد'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition-colors">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicInstitutionsList;
