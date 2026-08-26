import React from 'react';
import { PatientInfo, TreatmentItem } from '../../types';
import { InvoiceHeader } from './InvoiceHeader';
import { InvoiceTable } from './InvoiceTable';
import { InvoiceFooter } from './InvoiceFooter';

interface InvoicePreviewProps {
  patientInfo: PatientInfo;
  items: TreatmentItem[];
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

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
  patientInfo,
  items,
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
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-md flex flex-col justify-between print-container">
      {/* Print Title (Invisible on screen, visible only when printing to specify document type) */}
      <div className="hidden print:block text-right text-xs text-slate-400 font-medium mb-2">請求書控え / 患者様用</div>

      {/* Main Invoice Section */}
      <div className="space-y-6">
        
        {/* Header */}
        <InvoiceHeader patientInfo={patientInfo} />

        {/* Message/Intro */}
        <p className="text-xs text-slate-600 leading-relaxed">
          毎度ありがとうございます。下記の通りご請求申し上げます。
        </p>

        {/* Details Table */}
        <InvoiceTable items={items} />

        {/* Totals Summary */}
        <InvoiceFooter
          subtotal={subtotal}
          discount={discount}
          tax={tax}
          taxRate={taxRate}
          isTaxInclusive={isTaxInclusive}
          adjustment={adjustment}
          totalAmount={totalAmount}
          paidAmount={paidAmount}
          unpaidAmount={unpaidAmount}
        />

      </div>
    </div>
  );
};
