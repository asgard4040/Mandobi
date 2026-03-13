
import React, { useState } from 'react';
import { SalesRequest, RequestStatus } from '../../types';
import { ICONS } from '../../constants';

interface MyRequestsProps {
  requests: SalesRequest[];
}

const MyRequests: React.FC<MyRequestsProps> = ({ requests }) => {
  const [filter, setFilter] = useState<RequestStatus | 'ALL'>('ALL');

  const filteredRequests = requests.filter(req => filter === 'ALL' || req.status === filter);

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.ACCEPTED:
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">مقبول</span>;
      case RequestStatus.REJECTED:
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">مرفوض</span>;
      case RequestStatus.NEED_INFO:
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">بحاجة معلومات</span>;
      default:
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">معلق</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">سجل طلباتي</h3>
        <div className="flex gap-2">
          {['ALL', RequestStatus.PENDING, RequestStatus.ACCEPTED, RequestStatus.REJECTED].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                filter === f ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {f === 'ALL' ? 'الكل' : f === RequestStatus.PENDING ? 'المعلقة' : f === RequestStatus.ACCEPTED ? 'المقبولة' : 'المرفوضة'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredRequests.map((req) => (
          <div key={req.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-blue-600">
                  {ICONS.Institutions}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-800">{req.institutionName}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                    <span className="flex items-center gap-1">{ICONS.Package} {req.systemName}</span>
                    <span className="flex items-center gap-1">{ICONS.Location} {req.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(req.status)}
                <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString('ar-EG')}</p>
              </div>
            </div>

            {req.status === RequestStatus.REJECTED && req.rejectionReason && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-xs text-red-400 uppercase font-bold mb-1">سبب الرفض:</p>
                <p className="text-sm text-red-700">{req.rejectionReason}</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-50 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-400">نوع الاشتراك</p>
                <p className="font-semibold text-gray-700">{req.subscriptionType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">اسم المسؤول</p>
                <p className="font-semibold text-gray-700">{req.contactName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">رقم الهاتف</p>
                <p className="font-semibold text-gray-700">{req.contactPhone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">تاريخ الإرسال</p>
                <p className="font-semibold text-gray-700">{new Date(req.createdAt).toLocaleTimeString('ar-EG', {hour: '2-digit', minute: '2-digit'})}</p>
              </div>
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="bg-white p-20 rounded-3xl border border-dashed border-gray-200 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              {ICONS.MyRequests}
            </div>
            <h4 className="text-gray-500 font-medium">لا توجد طلبات في هذا القسم حالياً</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
