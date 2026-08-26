import React from 'react';
import { TreatmentItem } from '../../types';

interface InvoiceTableProps {
  items: TreatmentItem[];
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({ items }) => {
  const formatYen = (amount: number) => {
    return `¥${amount.toLocaleString('ja-JP')}`;
  };

  return (
    <div className="overflow-hidden border border-slate-200 rounded-xl">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-bold text-slate-500 tracking-wider">診療内容</th>
            <th className="px-2 py-2 text-center text-xs font-bold text-slate-500 tracking-wider">数量</th>
            <th className="px-3 py-2 text-right text-xs font-bold text-slate-500 tracking-wider">単価</th>
            <th className="px-3 py-2 text-right text-xs font-bold text-slate-500 tracking-wider">金額</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-3 py-2.5">
                <p className="text-xs font-bold text-slate-800">{item.name}</p>
                {item.note && <p className="text-[10px] text-slate-400 mt-0.5">{item.note}</p>}
              </td>
              <td className="px-2 py-2.5 text-center text-xs text-slate-600 font-semibold">{item.quantity}</td>
              <td className="px-3 py-2.5 text-right text-xs text-slate-600 font-semibold">{formatYen(item.unitPrice)}</td>
              <td className="px-3 py-2.5 text-right text-xs text-slate-800 font-bold">{formatYen(item.unitPrice * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
