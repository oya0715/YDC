import React from 'react';

interface PriceSummaryProps {
  isTaxInclusive: boolean;
  setIsTaxInclusive: (val: boolean) => void;
  taxRate: number;
  setTaxRate: (val: number) => void;
  discount: number;
  setDiscount: (val: number) => void;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  isTaxInclusive,
  setIsTaxInclusive,
  taxRate,
  setTaxRate,
  discount,
  setDiscount,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <div className="w-6 h-6 rounded-lg bg-clinic-50 text-clinic-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6V8.25m8.25-3-5.12 5.397a.75.75 0 0 1-1.28-.53V5.25m-9 0v5.367a.75.75 0 0 1-1.28.53L3.75 5.25" />
          </svg>
        </div>
        <h2 className="text-base font-bold text-slate-800">金額・支払設定</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Tax Mode Toggles */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">消費税計算区分</label>
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setIsTaxInclusive(false)}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${!isTaxInclusive ? 'bg-white text-clinic-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              税抜（外税）
            </button>
            <button
              type="button"
              onClick={() => setIsTaxInclusive(true)}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${isTaxInclusive ? 'bg-white text-clinic-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              税込（内税）
            </button>
          </div>
        </div>

        {/* Tax Rate */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">消費税率 (%)</label>
          <div className="relative">
            <input
              type="number"
              value={taxRate}
              onChange={e => setTaxRate(Number(e.target.value))}
              placeholder="10"
              min="0"
              max="100"
              className="w-full pr-8 pl-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-clinic-500 bg-slate-50/50 font-semibold text-slate-700"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">%</span>
          </div>
        </div>

        {/* Discount */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 mb-1">値引き額</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">¥</span>
            <input
              type="number"
              value={discount || ''}
              onChange={e => setDiscount(Number(e.target.value))}
              placeholder="0"
              min="0"
              className="w-full pl-7 pr-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-clinic-500 bg-slate-50/50 text-right font-semibold text-slate-700"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
