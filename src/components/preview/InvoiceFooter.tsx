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
  invoiceType: string;
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
  invoiceType,
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
          <span className="text-sm font-bold text-slate-600">請求合計金額（税込）</span>
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

      {/* Payment and Bank Account Details (Common for all) */}
      <div className="mt-6 border-t border-slate-100 pt-4 text-[10px] space-y-3">
        <div className="flex flex-col sm:flex-row justify-between gap-2 text-slate-600 font-medium">
          <p>支払い方法：現金受付払い・振込（三井住友銀行／兵庫信用金庫）・デンタルローン</p>
          <p className="sm:text-right">支払い期日：（　　　　　　　　　　　　　　　　　）</p>
        </div>
        
        <p className="text-[9px] text-slate-500 mt-1 font-semibold">お振込みの際は下記口座へお願い致します。</p>
        <div className="overflow-hidden border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-center">
            <thead className="bg-slate-50">
              <tr className="divide-x divide-slate-200">
                <th className="px-2 py-1 font-bold text-slate-500">銀行名</th>
                <td className="px-2 py-1 font-semibold text-slate-700">三井住友銀行</td>
                <td className="px-2 py-1 font-semibold text-slate-700">兵庫信用金庫</td>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="divide-x divide-slate-200">
                <th className="px-2 py-1 font-bold text-slate-500 bg-slate-50/50">支店名</th>
                <td className="px-2 py-1 text-slate-600">網干支店</td>
                <td className="px-2 py-1 text-slate-600">御津支店</td>
              </tr>
              <tr className="divide-x divide-slate-200">
                <th className="px-2 py-1 font-bold text-slate-500 bg-slate-50/50">口座種類</th>
                <td className="px-2 py-1 text-slate-600">普通</td>
                <td className="px-2 py-1 text-slate-600">普通</td>
              </tr>
              <tr className="divide-x divide-slate-200">
                <th className="px-2 py-1 font-bold text-slate-500 bg-slate-50/50">口座番号</th>
                <td className="px-2 py-1 font-bold text-slate-800">3215296</td>
                <td className="px-2 py-1 font-bold text-slate-800">0179190</td>
              </tr>
              <tr className="divide-x divide-slate-200">
                <th className="px-2 py-1 font-bold text-slate-500 bg-slate-50/50">名義人</th>
                <td className="px-2 py-1 text-slate-600 tracking-wider">ヤマモト タカフミ</td>
                <td className="px-2 py-1 text-slate-600 tracking-wider">ヤマモト タカフミ</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Conditionally Render Guarantee Section */}
        {invoiceType === 'implant' && (
          <div className="mt-4 p-3 bg-teal-50/50 border border-teal-100 rounded-lg text-[9px] text-slate-600 leading-relaxed space-y-1">
            <p className="font-bold text-teal-800">＜保証について＞</p>
            <p>ガイドデント認定医療機関において、インプラント手術を受けられた患者さまの再手術および上部構造の修復についてはインプラント10年保証に基づいて保証させていただきます。</p>
            <p className="font-semibold text-slate-700">※但し、当医院の指定する定期検診にすべて応じて頂いてる方にかぎります。</p>
            <p>また、外傷・事故の場合は対象外とさせて頂きます。</p>
          </div>
        )}

        {invoiceType === 'prostho' && (
          <div className="mt-4 p-3 bg-teal-50/50 border border-teal-100 rounded-lg text-[9px] text-slate-600 leading-relaxed space-y-1">
            <p className="font-bold text-teal-800">＜保証について＞</p>
            <p>3年以内は当医院がすべて負担いたします。3年以降は、下記の割合でご負担いただきます。</p>
            <div className="pl-4 space-y-0.5">
              <p>・3年以降4年未満：患者さん負担5割</p>
              <p>・4年以降5年未満：患者さん負担6割</p>
              <p>・5年以降6年未満：患者さん負担7割</p>
            </div>
            <p className="font-semibold text-slate-700">※但し、当医院の指定する定期検診にすべて応じて頂いてる方にかぎります。</p>
            <p>また、外傷・事故の場合は対象外とさせて頂きます。</p>
          </div>
        )}

        {/* Signatures block */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col items-end space-y-3 text-slate-700">
          <div className="w-full text-left font-medium text-[9px] text-slate-400">
            上記の内容について説明をうけ了承した。
          </div>
          <div className="flex flex-col gap-2 w-full max-w-[280px] self-end pt-1">
            <div className="flex justify-between items-baseline border-b border-slate-300 pb-0.5">
              <span className="font-semibold shrink-0">患者署名</span>
              <span className="w-full"></span>
            </div>
            <div className="flex justify-between items-baseline border-b border-slate-300 pb-0.5">
              <span className="font-semibold shrink-0">代理人署名</span>
              <span className="w-full"></span>
              <span className="font-medium text-[8px] shrink-0 text-slate-400">（続柄）______</span>
            </div>
          </div>
          <div className="text-right text-[9px] text-slate-500 font-bold pt-0.5">
            やまもと歯科
          </div>
        </div>
      </div>
    </div>
  );
};
