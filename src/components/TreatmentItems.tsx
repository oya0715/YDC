import React from 'react';
import { TreatmentItem } from '../types';

interface TreatmentItemsProps {
  items: TreatmentItem[];
  onChange: (updatedItems: TreatmentItem[]) => void;
}

const PRESETS = [
  { name: "セラミッククラウン", price: 100000 },
  { name: "ホワイトニング", price: 30000 },
  { name: "インプラント", price: 350000 },
  { name: "矯正治療", price: 800000 },
  { name: "メンテナンス", price: 5000 },
  { name: "その他", price: 0 }
];

export const TreatmentItems: React.FC<TreatmentItemsProps> = ({ items, onChange }) => {
  const handleAddItem = () => {
    const newItem: TreatmentItem = {
      id: Date.now().toString(),
      name: "その他",
      unitPrice: 0,
      quantity: 1,
      note: ""
    };
    onChange([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      alert("診療項目は最低1つ必要です。");
      return;
    }
    onChange(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, updatedFields: Partial<TreatmentItem>) => {
    onChange(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updatedFields };
        if (updatedFields.name && updatedFields.name !== item.name) {
          const preset = PRESETS.find(p => p.name === updatedFields.name);
          if (preset && preset.name !== "その他") {
            updated.unitPrice = preset.price;
          }
        }
        return updated;
      }
      return item;
    }));
  };

  const formatYen = (amount: number) => {
    return `¥${amount.toLocaleString('ja-JP')}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-clinic-50 text-clinic-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-3.75 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-slate-800">自費診療項目</h2>
        </div>
        <button
          onClick={handleAddItem}
          className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg text-clinic-600 bg-clinic-50 hover:bg-clinic-100 active:bg-clinic-200 transition-all gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          ＋項目を追加
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl space-y-3 relative group">
            
            {/* Close button top right */}
            <button
              onClick={() => handleRemoveItem(item.id)}
              className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
              title="この項目を削除"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pr-8">
              
              {/* Selector/Input Name */}
              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-slate-500 mb-1">診療項目名 <span className="text-rose-500">*</span></label>
                <div className="flex gap-2">
                  <select
                    value={PRESETS.some(p => p.name === item.name) ? item.name : "その他"}
                    onChange={e => handleUpdateItem(item.id, { name: e.target.value })}
                    className="w-1/2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500"
                  >
                    {PRESETS.map(preset => (
                      <option key={preset.name} value={preset.name}>{preset.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={item.name}
                    onChange={e => handleUpdateItem(item.id, { name: e.target.value })}
                    placeholder="治療内容を入力"
                    className="w-1/2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500"
                  />
                </div>
              </div>

              {/* Unit Price */}
              <div className="sm:col-span-4">
                <label className="block text-xs font-semibold text-slate-500 mb-1">単価 (円) <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span>
                  <input
                    type="number"
                    value={item.unitPrice || ''}
                    onChange={e => handleUpdateItem(item.id, { unitPrice: Number(e.target.value) })}
                    placeholder="0"
                    min="0"
                    className="w-full pl-7 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white text-right focus:outline-none focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 font-semibold text-slate-700"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">数量 <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  value={item.quantity || ''}
                  onChange={e => handleUpdateItem(item.id, { quantity: Number(e.target.value) })}
                  placeholder="1"
                  min="1"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white text-center focus:outline-none focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 font-semibold text-slate-700"
                />
              </div>

              {/* Note/Remarks */}
              <div className="sm:col-span-8">
                <label className="block text-xs font-semibold text-slate-500 mb-1">備考</label>
                <input
                  type="text"
                  value={item.note}
                  onChange={e => handleUpdateItem(item.id, { note: e.target.value })}
                  placeholder="例: 上顎前歯、右奥歯など (請求書に表示)"
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500"
                />
              </div>

              {/* Item Total Amount */}
              <div className="sm:col-span-4 flex flex-col justify-end text-right">
                <span className="text-xs text-slate-400 font-semibold mb-1">金額</span>
                <span className="text-base font-bold text-slate-700 py-1">{formatYen(item.unitPrice * item.quantity)}</span>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
