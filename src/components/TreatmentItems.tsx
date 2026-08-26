import React from 'react';
import { TreatmentItem } from '../types';

interface TreatmentItemsProps {
  items: TreatmentItem[];
  onChange: (updatedItems: TreatmentItem[]) => void;
}

const PRESETS = [
  // 補綴
  { category: "補綴", name: "ハイブリッドIn", price: 30000 },
  { category: "補綴", name: "セラミックIn／ジルコニアIn", price: 50000 },
  { category: "補綴", name: "フルジルコニアcr", price: 100000 },
  { category: "補綴", name: "オールセラミック", price: 120000 },
  { category: "補綴", name: "ジルコニアセラミック", price: 140000 },
  { category: "補綴", name: "MB", price: 80000 },
  { category: "補綴", name: "ラミネートベニア", price: 100000 },
  
  // ホワイトニング
  { category: "ホワイトニング", name: "ホームホワイトニング", price: 23000 },
  { category: "ホワイトニング", name: "ジェル追加", price: 3000 },
  { category: "ホワイトニング", name: "オフィスホワイトニング", price: 20000 },
  { category: "ホワイトニング", name: "デュアルホワイトニング", price: 53000 },
  { category: "ホワイトニング", name: "ウォーキングブリーチ", price: 10000 },
  { category: "ホワイトニング", name: "GAMピーリング", price: 6000 },
  
  // インプラント
  { category: "インプラント", name: "フィクスチャー", price: 300000 },
  { category: "インプラント", name: "上部構造", price: 100000 },
  { category: "インプラント", name: "GBR", price: 50000 },
  { category: "インプラント", name: "ソケットリフト", price: 100000 },
  { category: "インプラント", name: "サイナスリフト", price: 200000 },
  { category: "インプラント", name: "プロビ", price: 10000 },
  { category: "インプラント", name: "フレーム", price: 100000 },
  { category: "インプラント", name: "ガイド", price: 100000 },
  { category: "インプラント", name: "内冠", price: 100000 },
  { category: "インプラント", name: "ロケーター", price: 80000 },
  { category: "インプラント", name: "コバルト床（インプラント）", price: 200000 },
  { category: "インプラント", name: "チタン床（インプラント）", price: 300000 },

  // DEN
  { category: "DEN", name: "ノンクラスプ（1本）", price: 80000 },
  { category: "DEN", name: "ノンクラスプ（2本）", price: 100000 },
  { category: "DEN", name: "ノンクラスプ（両側full）", price: 200000 },
  { category: "DEN", name: "コバルト床（片面）", price: 200000 },
  { category: "DEN", name: "チタン床（片面）", price: 300000 },
  
  // 矯正
  { category: "矯正", name: "インビザ拡大床", price: 250000 },
  { category: "矯正", name: "ハイラックス", price: 200000 },
  { category: "矯正", name: "リンガルアーチ", price: 150000 },
  { category: "矯正", name: "フェイスマスク", price: 18000 },
  { category: "矯正", name: "プレオルソ", price: 50000 },
  { category: "矯正", name: "バンドループ", price: 50000 },
  { category: "矯正", name: "2by4 (片顎)", price: 100000 },
  { category: "矯正", name: "3by6 (片顎)", price: 150000 },
  { category: "矯正", name: "ブラケット1つ", price: 25000 },
  { category: "矯正", name: "ワイヤー矯正", price: 890000 },
  { category: "矯正", name: "インビザ", price: 890000 },
  { category: "矯正", name: "インビザ（ファースト）", price: 600000 },
  { category: "矯正", name: "アンカー1本", price: 30000 },
  { category: "矯正", name: "シュミレーション", price: 30000 },
  { category: "矯正", name: "片顎矯正", price: 450000 },
  { category: "矯正", name: "前歯矯正", price: 300000 },
  
  // その他
  { category: "その他", name: "ボツリヌス", price: 30000 },
  { category: "その他", name: "レングス", price: 50000 },
  { category: "その他", name: "IP full 自費BP", price: 9000 },
  { category: "その他", name: "半年以内BP再製", price: 15000 },
  { category: "その他", name: "自費メンテ", price: 3000 },
  { category: "その他", name: "その他", price: 0 }
];

const shouldShowToothSelector = (itemName: string) => {
  const preset = PRESETS.find(p => p.name === itemName);
  if (!preset) return true;
  return ['補綴', 'インプラント', 'その他', 'DEN'].includes(preset.category);
};

interface ToothSelectorProps {
  note: string;
  onChange: (newNote: string) => void;
}

const ToothSelector: React.FC<ToothSelectorProps> = ({ note, onChange }) => {
  const selectedTeeth = note ? note.split(', ') : [];
  
  const toothOrder = [
    '右上8','右上7','右上6','右上5','右上4','右上3','右上2','右上1',
    '左上1','左上2','左上3','左上4','左上5','左上6','左上7','左上8',
    '右下8','右下7','右下6','右下5','右下4','右下3','右下2','右下1',
    '左下1','左下2','左下3','左下4','左下5','左下6','左下7','左下8'
  ];

  const handleToggleTooth = (toothId: string) => {
    let next = [...selectedTeeth];
    const idx = next.indexOf(toothId);
    if (idx > -1) {
      next.splice(idx, 1);
    } else {
      next.push(toothId);
    }
    next.sort((a, b) => toothOrder.indexOf(a) - toothOrder.indexOf(b));
    onChange(next.join(', '));
  };

  const handleClear = () => {
    onChange('');
  };

  const renderToothButton = (toothId: string, label: number) => {
    const isSelected = selectedTeeth.includes(toothId);
    return (
      <button
        type="button"
        key={toothId}
        onClick={() => handleToggleTooth(toothId)}
        className={`w-6 h-6 text-[10px] rounded border flex items-center justify-center transition-all cursor-pointer ${
          isSelected
            ? 'bg-clinic-500 text-white border-clinic-600 shadow-sm font-bold scale-105'
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="sm:col-span-12 mt-2 bg-slate-50 border border-slate-200/60 p-3 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-600">歯の部位を選択 (複数選択可)</span>
        <button
          onClick={handleClear}
          type="button"
          className="text-[10px] font-semibold text-slate-500 hover:text-rose-500 transition-colors"
        >
          選択をクリア
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        <div className="flex flex-col items-center gap-1.5 font-mono text-xs select-none min-w-[360px] py-1">
          {/* Upper Row */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] font-bold text-slate-400 mr-1.5 self-center">右上</span>
              {[8, 7, 6, 5, 4, 3, 2, 1].map(num => renderToothButton(`右上${num}`, num))}
            </div>
            <div className="w-px h-6 bg-slate-300 mx-2"></div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => renderToothButton(`左上${num}`, num))}
              <span className="text-[9px] font-bold text-slate-400 ml-1.5 self-center">左上</span>
            </div>
          </div>

          <div className="w-full border-t border-dashed border-slate-200 my-0.5"></div>

          {/* Lower Row */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] font-bold text-slate-400 mr-1.5 self-center">右下</span>
              {[8, 7, 6, 5, 4, 3, 2, 1].map(num => renderToothButton(`右下${num}`, num))}
            </div>
            <div className="w-px h-6 bg-slate-300 mx-2"></div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => renderToothButton(`左下${num}`, num))}
              <span className="text-[9px] font-bold text-slate-400 ml-1.5 self-center">左下</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 text-[10px] text-slate-500 font-semibold flex items-center gap-1.5">
        <span className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">選択中</span>
        <span className="text-slate-700">{note || 'なし'}</span>
      </div>
    </div>
  );
};

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

  const categories = Array.from(new Set(PRESETS.map(p => p.category)));

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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" className="w-3.5 h-3.5">
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pr-8">
              
              {/* Selector Name */}
              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-500 mb-1">診療項目名 <span className="text-rose-500">*</span></label>
                <select
                  value={PRESETS.some(p => p.name === item.name) ? item.name : "その他"}
                  onChange={e => handleUpdateItem(item.id, { name: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-clinic-500 font-semibold text-slate-700"
                >
                  {categories.map(cat => (
                    <optgroup key={cat} label={cat}>
                      {PRESETS.filter(p => p.category === cat).map(preset => (
                        <option key={preset.name} value={preset.name}>{preset.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Unit Price */}
              <div className="sm:col-span-3">
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

              {/* Item Total Amount */}
              <div className="sm:col-span-2 flex flex-col justify-end text-right">
                <span className="text-xs text-slate-400 font-semibold mb-1">金額</span>
                <span className="text-base font-bold text-slate-700 py-1">{formatYen(item.unitPrice * item.quantity)}</span>
              </div>

              {/* Tooth Selector */}
              {shouldShowToothSelector(item.name) && (
                <ToothSelector
                  note={item.note}
                  onChange={(newNote) => handleUpdateItem(item.id, { note: newNote })}
                />
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
