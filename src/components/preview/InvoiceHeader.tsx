import React from 'react';
import { PatientInfo } from '../../types';

interface InvoiceHeaderProps {
  patientInfo: PatientInfo;
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ patientInfo }) => {
  const getInitialDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const formattedDate = patientInfo.invoiceDate 
    ? patientInfo.invoiceDate.replace(/-/g, '/') 
    : getInitialDate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-5 border-b-2 border-slate-100">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-wider">請求書</h2>
        <div className="mt-2.5 space-y-1.5">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-slate-800 border-b border-slate-800 pb-0.5">{patientInfo.name || "山田 太郎"}</span>
            <span className="text-xs text-slate-500 font-semibold">様</span>
          </div>
        </div>
      </div>
      
      <div className="text-right space-y-1.5 self-stretch md:self-auto flex flex-col justify-between items-end">
        <p className="text-xs text-slate-500 font-semibold">請求日: {formattedDate}</p>
        
        <div className="text-right mt-1">
          <p className="text-sm font-bold text-slate-800">{patientInfo.clinicName || "みなと歯科クリニック"}</p>
          <p className="text-[10px] text-slate-400 font-medium max-w-[200px] leading-relaxed whitespace-pre-wrap">{patientInfo.clinicAddress}</p>
          {patientInfo.clinicPhone && (
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">TEL: {patientInfo.clinicPhone}</p>
          )}
        </div>
      </div>
    </div>
  );
};
