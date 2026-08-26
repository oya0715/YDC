import React from 'react';

interface InvoiceFooterProps {
  subtotal: number;
  discount: number;
  tax: number;
  taxRate: number;
  isTaxInclusive: boolean;
  adjustment: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
}

export const InvoiceFooter: React.FC<InvoiceFooterProps> = ({
  subtotal,
  discount,
  tax,
  taxRate,
  isTaxInclusive,
  adjustment,
  totalAmount,
  paidAmount,
  unpaidAmount,
}) => {
  const formatYen = (amount: number) => {
    return `¥${amount.toLocaleString('ja-JP')}`;
  };

  return (
    <div className="space-y-4">
      {/* Small Calculations Breakdown */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
          <span>小計</span>
          <span className="font-semibold text-slate-700">{formatYen(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>値引き</span>
            <span className="font-semibold text-emerald-600">-{formatYen(discount)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
          <span>消費税 ({taxRate}% {isTaxInclusive ? '内税' : '外税'})</span>
          <span className="font-semibold text-slate-700">
            {isTaxInclusive ? `(${formatYen(tax)})` : formatYen(tax)}
          </span>
        </div>

        {adjustment !== 0 && (
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
            <span>端数調整額</span>
            <span className={`font-semibold ${adjustment > 0 ? 'text-slate-700' : 'text-emerald-600'}`}>
              {adjustment > 0 ? '+' : ''}{formatYen(adjustment)}
            </span>
          </div>
        )}

        {/* Total Amount (Highlight 1) */}
        <div className="flex justify-between items-center bg-slate-50 px-3.5 py-3 rounded-xl border border-slate-100 mt-2">
          <span class="text-sm font-bold text-slate-600">請求合計金額（税込）</span>
          <span className="text-lg font-black text-slate-800 tracking-wide">{formatYen(totalAmount)}</span>
        </div>

        {paidAmount > 0 && (
          <div className="flex justify-between items-center text-xs text-slate-500 font-medium px-1 mt-2">
            <span>支払済み金額</span>
            <span className="font-semibold text-slate-700">{formatYen(paidAmount)}</span>
          </div>
        )}

        {/* Remaining Unpaid Amount (Highlight 2) */}
        <div className="flex justify-between items-center bg-clinic-50 border border-clinic-100 px-3.5 py-3.5 rounded-xl mt-3">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-clinic-700">今回ご請求金額</span>
            <span className="text-[9px] text-clinic-500 font-medium mt-0.5">(合計金額 - 既収金)</span>
          </div>
          <span className="text-xl font-extrabold text-clinic-700 tracking-wide">{formatYen(unpaidAmount)}</span>
        </div>
      </div>

      {/* Footer notes */}
      <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 space-y-1">
        <p className="font-medium text-slate-500">【備考】</p>
        <p className="leading-relaxed">
          ・本請求書は自費診療（保険外診療）に関する請求書です。保険診療の領収書とは別扱いとなります。
        </p>
        <p className="leading-relaxed">
          ・ご不明な点がございましたら、当院受付窓口までお気軽にお問い合わせください。
        </p>
      </div>
    </div>
  );
};
