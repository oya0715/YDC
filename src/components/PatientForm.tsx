import React from 'react';
import { PatientInfo } from '../types';

interface PatientFormProps {
  patientInfo: PatientInfo;
  onChange: (updatedInfo: PatientInfo) => void;
  invoiceType: string;
  onChangeInvoiceType: (type: string) => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  patientInfo,
  onChange,
  invoiceType,
  onChangeInvoiceType,
}) => {
  const handleChange = (field: keyof PatientInfo, value: string) => {
    onChange({
      ...patientInfo,
      [field]: value
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <div className="w-6 h-6 rounded-lg bg-clinic-50 text-clinic-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
        <h2 className="text-base font-bold text-slate-800">患者情報 & 医院情報</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 mb-1">請求書タイプ <span className="text-rose-500">*</span></label>
          <select
            value={invoiceType}
            onChange={e => onChangeInvoiceType(e.target.value)}
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-clinic-500 bg-white font-semibold text-slate-700"
          >
            <option value="implant">インプラント用請求書 (10年保証)</option>
            <option value="prostho">自費補綴用請求書 (5年保証・義歯除く)</option>
            <option value="other">その他自費（矯正など）用請求書 (保証なし)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">患者氏名 <span className="text-rose-500">*</span></label>
          <input
            type="text"
            value={patientInfo.name}
            onChange={e => handleChange('name', e.target.value)}
            placeholder="山田 太郎"
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 bg-slate-50/50"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">請求日 <span className="text-rose-500">*</span></label>
          <input
            type="date"
            value={patientInfo.invoiceDate}
            onChange={e => handleChange('invoiceDate', e.target.value)}
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 bg-slate-50/50"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">医院名</label>
          <input
            type="text"
            value={patientInfo.clinicName}
            onChange={e => handleChange('clinicName', e.target.value)}
            placeholder="みなと歯科クリニック"
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 bg-slate-50/50"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 mb-1">医院住所</label>
          <input
            type="text"
            value={patientInfo.clinicAddress}
            onChange={e => handleChange('clinicAddress', e.target.value)}
            placeholder="住所を入力してください"
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 bg-slate-50/50"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 mb-1">電話番号</label>
          <input
            type="text"
            value={patientInfo.clinicPhone}
            onChange={e => handleChange('clinicPhone', e.target.value)}
            placeholder="03-1234-5678"
            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-clinic-500 focus:border-clinic-500 bg-slate-50/50"
          />
        </div>
      </div>
    </div>
  );
};
