import React from 'react';

interface InvoiceFooterProps {
  subtotal: number;
  discount: number;
  tax: number;
  taxRate: number;
  isTaxInclusive: boolean;
  totalAmount: number;
  invoiceType: string;
}

export const InvoiceFooter: React.FC<InvoiceFooterProps> = ({
  subtotal,
  discount,
  tax,
  taxRate,
  isTaxInclusive,
  totalAmount,
  invoiceType,
}) => {
  const formatYen = (amount: number) => {
    return `¥${amount.toLocaleString('ja-JP')}`;
  };

  return (
    <div className="space-y-4">
      {/* Small Calculations Breakdown */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <div className="flex justify-between items-center text-xs text-slate-500 font-normal">
          <span>小計</span>
          <span className="font-medium text-slate-700">{formatYen(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-xs text-slate-500 font-normal">
            <span>値引き</span>
            <span className="font-medium text-slate-700">-{formatYen(discount)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-slate-500 font-normal">
          <span>消費税 ({taxRate}% {isTaxInclusive ? '内税' : '外税'})</span>
          <span className="font-medium text-slate-700">
            {isTaxInclusive ? `(${formatYen(tax)})` : formatYen(tax)}
          </span>
        </div>

        {/* Single Combined Billing Amount Box */}
        <div className="flex justify-between items-center bg-slate-100 border border-slate-300 px-4 py-3.5 rounded-xl mt-3">
          <span className="text-sm font-medium text-slate-800">ご請求金額（税込）</span>
          <span className="text-xl font-semibold text-slate-900 tracking-wide font-sans">{formatYen(totalAmount)}</span>
        </div>
      </div>

      {/* Payment and Bank Account Details (Common for all) */}
      <div className="mt-6 border-t border-slate-100 pt-4 text-[10px] space-y-3">
        <div className="space-y-1 text-slate-600 font-normal">
          <p>支払い方法：現金受付払い・振込（三井住友銀行／兵庫信用金庫）・デンタルローン</p>
          <p>支払い期日：（　　　　　　　　　　　　　　　　）</p>
        </div>
        
        <p className="text-[9px] text-slate-500 mt-1 font-medium">お振込みの際は下記口座へお願い致します。</p>
        <div className="overflow-hidden border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-center">
            <thead className="bg-slate-50">
              <tr className="divide-x divide-slate-200">
                <th className="px-2 py-1 font-medium text-slate-600">銀行名</th>
                <td className="px-2 py-1 font-medium text-slate-700">三井住友銀行</td>
                <td className="px-2 py-1 font-medium text-slate-700">兵庫信用金庫</td>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="divide-x divide-slate-200">
                <th className="px-2 py-1 font-medium text-slate-600 bg-slate-50/50">支店名</th>
                <td className="px-2 py-1 text-slate-600 font-normal">網干支店</td>
                <td className="px-2 py-1 text-slate-600 font-normal">御津支店</td>
              </tr>
              <tr className="divide-x divide-slate-200">
                <th className="px-2 py-1 font-medium text-slate-600 bg-slate-50/50">口座種類</th>
                <td className="px-2 py-1 text-slate-600 font-normal">普通</td>
                <td className="px-2 py-1 text-slate-600 font-normal">普通</td>
              </tr>
              <tr className="divide-x divide-slate-200">
                <th className="px-2 py-1 font-medium text-slate-600 bg-slate-50/50">口座番号</th>
                <td className="px-2 py-1 font-medium text-slate-800">3215296</td>
                <td className="px-2 py-1 font-medium text-slate-800">0179190</td>
              </tr>
              <tr className="divide-x divide-slate-200">
                <th className="px-2 py-1 font-medium text-slate-600 bg-slate-50/50">名義人</th>
                <td className="px-2 py-1 text-slate-600 tracking-wider font-normal">ヤマモト タカフミ</td>
                <td className="px-2 py-1 text-slate-600 tracking-wider font-normal">ヤマモト タカフミ</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Conditionally Render Guarantee Section */}
        {invoiceType === 'implant' && (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-[9px] text-slate-600 leading-relaxed space-y-1">
            <p className="font-medium text-slate-800">＜保証について＞</p>
            <p>ガイドデント認定医療機関において、インプラント手術を受けられた患者さまの再手術および上部構造の修復についてはインプラント10年保証に基づいて保証させていただきます。</p>
            <p className="font-medium text-slate-700">※但し、当医院の指定する定期検診にすべて応じて頂いてる方にかぎります。</p>
            <p>また、外傷・事故の場合は対象外とさせて頂きます。</p>
          </div>
        )}

        {invoiceType === 'prostho' && (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-[9px] text-slate-600 leading-relaxed space-y-1">
            <p className="font-medium text-slate-800">＜保証について＞</p>
            <p>3年以内は当医院がすべて負担いたします。3年以降は、下記の割合でご負担いただきます。</p>
            <div className="pl-4 space-y-0.5">
              <p>・3年以降4年未満：患者さん負担5割</p>
              <p>・4年以降5年未満：患者さん負担6割</p>
              <p>・5年以降6年未満：患者さん負担7割</p>
            </div>
            <p className="font-medium text-slate-700">※但し、当医院の指定する定期検診にすべて応じて頂いてる方にかぎります。</p>
            <p>また、外傷・事故の場合は対象外とさせて頂きます。</p>
          </div>
        )}

        {/* Signatures block (Matching reference screenshot) */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col items-end space-y-3 text-slate-700">
          <div className="w-full text-left font-normal text-[9px] text-slate-500">
            上記の内容について説明をうけ了承した。
          </div>
          <div className="flex flex-col gap-2 w-full max-w-[280px] self-end pt-1">
            <div className="flex justify-between items-baseline border-b border-slate-300 pb-0.5">
              <span className="font-medium text-xs text-slate-700 shrink-0">患者署名</span>
              <span className="w-full"></span>
            </div>
            <div className="flex justify-between items-baseline border-b border-slate-300 pb-0.5">
              <span className="font-medium text-xs text-slate-700 shrink-0">代理人署名</span>
              <span className="w-full"></span>
              <span className="font-normal text-[8px] shrink-0 text-slate-400">（続柄）______</span>
            </div>
          </div>
          <div className="text-right text-[9px] text-slate-500 font-medium pt-0.5">
            やまもと歯科
          </div>
        </div>
      </div>
    </div>
  );
};
