
import React, { useState } from 'react';
import { SystemProduct, SubscriptionTier } from '../../types';
import { ICONS } from '../../constants';

interface SystemsManagerProps {
  systems: SystemProduct[];
  onCreate: (system: Omit<SystemProduct, 'id'>) => void;
  onUpdate: (id: string, system: Partial<SystemProduct>) => void;
  onDelete: (id: string) => void;
}

const SystemsManager: React.FC<SystemsManagerProps> = ({ systems, onCreate, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<SystemProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Omit<SystemProduct, 'id'>>({
    name: '',
    description: '',
    tiers: [
      { name: 'اشتراك قياسي', price: 0, commission: 0 }
    ]
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      tiers: [{ name: 'اشتراك قياسي', price: 0, commission: 0 }]
    });
    setEditingSystem(null);
  };

  const addTier = () => {
    setFormData({
      ...formData,
      tiers: [...formData.tiers, { name: '', price: 0, commission: 0 }]
    });
  };

  const removeTier = (index: number) => {
    if (formData.tiers.length === 1) return;
    const newTiers = formData.tiers.filter((_, i) => i !== index);
    setFormData({ ...formData, tiers: newTiers });
  };

  const updateTier = (index: number, field: keyof SubscriptionTier, value: string | number) => {
    const newTiers = [...formData.tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setFormData({ ...formData, tiers: newTiers });
  };

  const handleOpenEdit = (system: SystemProduct) => {
    setEditingSystem(system);
    setFormData({
      name: system.name,
      description: system.description,
      tiers: Array.isArray(system.tiers) ? [...system.tiers] : [{ name: 'اشتراك قياسي', price: 0, commission: 0 }]
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (editingSystem) {
        await onUpdate(editingSystem.id, formData);
      } else {
        await onCreate(formData);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Submit Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between bg-[#0A0A0A] p-10 rounded-[3rem] border border-[#1A1A1A] gap-6">
        <div>
          <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">هندسة الأنظمة والاشتراكات</h3>
          <p className="text-[10px] text-gray-600 mt-2 font-black uppercase tracking-[0.4em]">Dynamic Pricing & Tier Matrix</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-white text-black px-12 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.4em] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all active:scale-95 w-full md:w-auto text-center"
        >
          إضافة نظام جديد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {(systems || []).map(sys => (
          <div key={sys.id} className="bg-[#0A0A0A] rounded-[3.5rem] border border-[#1A1A1A] overflow-hidden flex flex-col group hover:border-white/20 transition-all duration-500 relative">
            <div className="p-10 border-b border-[#111]">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-black border border-[#222] rounded-[1.5rem] flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                    {ICONS.Package}
                  </div>
                  <div>
                    <h4 className="font-black text-2xl text-white tracking-tighter uppercase">{sys.name}</h4>
                    <p className="text-[9px] text-gray-700 font-black uppercase tracking-widest mt-1">Tiers: {sys.tiers?.length || 0}</p>
                  </div>
                </div>
                <div className="flex gap-3 relative z-10">
                   <button 
                    onClick={() => handleOpenEdit(sys)} 
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white hover:text-black rounded-xl transition-all text-[10px] font-black uppercase tracking-tighter"
                   >
                    {ICONS.Settings}
                    <span className="hidden sm:inline">تعديل</span>
                   </button>
                   <button 
                    onClick={() => onDelete(sys.id)} 
                    className="flex items-center gap-2 px-4 py-2 bg-red-900/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-tighter"
                   >
                    {ICONS.X}
                    <span className="hidden sm:inline">حذف</span>
                   </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 font-bold leading-relaxed">{sys.description}</p>
            </div>
            
            <div className="p-10 space-y-6 flex-1 bg-[#050505]">
              <h5 className="font-black text-[9px] text-gray-700 uppercase tracking-[0.5em] border-r-2 border-white pr-3">مستويات الاشتراك المتاحة</h5>
              <div className="space-y-4">
                {sys.tiers?.map((tier, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-black border border-[#111] rounded-[1.8rem] hover:border-white/10 transition-colors gap-6">
                    <div className="space-y-1">
                      <span className="font-black text-[10px] text-white uppercase tracking-widest">{tier.name}</span>
                      <p className="text-[7px] text-gray-600 font-black uppercase tracking-widest italic">Tier Option {idx + 1}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 sm:gap-12 flex-1 sm:flex-initial">
                      <div className="text-right sm:text-left">
                        <p className="text-[9px] text-gray-700 font-black uppercase tracking-widest mb-1">السعر</p>
                        <div className="flex items-center gap-1">
                          <span className="font-black text-lg text-white tracking-tighter">{tier.price.toLocaleString()}</span>
                          <span className="text-[7px] font-black text-gray-600 uppercase">IQD</span>
                        </div>
                      </div>
                      <div className="text-right sm:text-left border-r border-white/5 pr-8 sm:pr-0 sm:border-r-0">
                        <p className="text-[9px] text-gray-700 font-black uppercase tracking-widest mb-1">العمولة</p>
                        <div className="flex items-center gap-1">
                          <span className="font-black text-lg text-white tracking-tighter">{tier.commission.toLocaleString()}</span>
                          <span className="text-[7px] font-black text-gray-600 uppercase">IQD</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-2xl flex justify-center items-start z-[100] p-4 sm:p-8 overflow-y-auto">
          <div className="bg-[#0A0A0A] w-full max-w-4xl rounded-[3rem] sm:rounded-[4rem] border border-white/10 shadow-2xl animate-in zoom-in duration-300 my-8">
            <form onSubmit={handleSubmit}>
              <div className="p-8 sm:p-12 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase italic">
                    {editingSystem ? 'تحديث هيكلية النظام' : 'تأسيس نظام برمجي جديد'}
                  </h4>
                  <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.4em] mt-2 italic">Architecture & Tier Management Protocol</p>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl sm:rounded-3xl bg-white/5 hover:bg-white hover:text-black transition-all shadow-xl">
                  {ICONS.X}
                </button>
              </div>

              <div className="p-8 sm:p-16 space-y-12">
                <div className="grid grid-cols-1 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mr-6">اسم النظام الأساسي</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-8 py-6 rounded-[2rem] bg-black border border-white/10 text-white focus:border-white outline-none transition-all font-black text-lg shadow-inner"
                      placeholder="PRODUCT NAME"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mr-6">المواصفات الفنية والوصف</label>
                    <textarea 
                      required
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full px-8 py-6 rounded-[2rem] bg-black border border-white/10 text-white focus:border-white outline-none transition-all font-bold text-base resize-none"
                      placeholder="TECHNICAL DESCRIPTION"
                    />
                  </div>
                </div>

                <div className="space-y-10">
                   <div className="flex items-center justify-between border-b border-white/5 pb-6">
                      <h5 className="text-[10px] font-black text-white uppercase tracking-[0.6em]">مصفوفة فئات الاشتراكات والعمولات</h5>
                      <button 
                        type="button" 
                        onClick={addTier}
                        className="bg-white text-black px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2"
                      >
                        {ICONS.SendRequest} إضافة فئة جديدة
                      </button>
                   </div>
                   
                   <div className="space-y-6">
                     {formData.tiers.map((tier, idx) => (
                       <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 bg-black/40 rounded-[2.5rem] border border-white/5 relative group">
                          {formData.tiers.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => removeTier(idx)}
                              className="absolute -top-3 -left-3 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg z-10"
                            >
                              {ICONS.X}
                            </button>
                          )}
                          <div className="space-y-3">
                             <label className="text-[8px] font-black text-gray-700 uppercase tracking-widest">اسم الفئة</label>
                             <input 
                                required
                                type="text"
                                value={tier.name}
                                onChange={e => updateTier(idx, 'name', e.target.value)}
                                className="w-full px-5 py-4 rounded-xl bg-black border border-white/5 text-white outline-none font-black text-xs"
                                placeholder="مثلاً: باقة العمالقة"
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[8px] font-black text-gray-700 uppercase tracking-widest">السعر النهائي (IQD)</label>
                             <input 
                                required
                                type="number"
                                value={tier.price}
                                onChange={e => updateTier(idx, 'price', Number(e.target.value))}
                                className="w-full px-5 py-4 rounded-xl bg-black border border-white/5 text-white outline-none font-black text-xs"
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[8px] font-black text-gray-700 uppercase tracking-widest">عمولة المندوب (IQD)</label>
                             <input 
                                required
                                type="number"
                                value={tier.commission}
                                onChange={e => updateTier(idx, 'commission', Number(e.target.value))}
                                className="w-full px-5 py-4 rounded-xl bg-black border border-white/5 text-white outline-none font-black text-xs"
                             />
                          </div>
                          <div className="flex items-end pb-1 hidden md:flex">
                             <div className="text-[8px] text-gray-800 font-black uppercase tracking-widest">ID: OPT_{idx+1}</div>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              <div className="p-10 sm:p-16 border-t border-white/5 flex flex-col sm:flex-row gap-6">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-white text-black font-black py-7 rounded-[2rem] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] active:scale-95 transition-all text-[12px] uppercase tracking-[0.6em] italic disabled:opacity-50"
                >
                  {isSubmitting ? 'جار الحفظ وتأمين البيانات...' : 'حفظ وتأمين البيانات'}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-12 py-7 text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-widest italic"
                >
                  تجاهل التغييرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemsManager;
