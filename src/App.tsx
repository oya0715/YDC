import React, { useState, useEffect } from 'react';
import { PatientInfo, TreatmentItem } from './types';
import { PatientForm } from './components/PatientForm';
import { TreatmentItems } from './components/TreatmentItems';
import { PriceSummary } from './components/PriceSummary';
import { InvoicePreview } from './components/preview/InvoicePreview';

// Initial default data definitions
const getInitialDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const initialPatientInfo: PatientInfo = {
  name: "山田 太郎",
  patientId: "",
  invoiceDate: getInitialDate(),
  clinicName: "やまもと歯科",
  clinicAddress: "",
  clinicPhone: ""
};

const initialItems: TreatmentItem[] = [
  { id: "1", name: "フィクスチャー", unitPrice: 300000, quantity: 1, note: "" }
];

function App() {
  // 1. States loaded from localStorage (or defaults)
  const [patientInfo, setPatientInfo] = useState<PatientInfo>(() => {
    const saved = localStorage.getItem('ydc_patient');
    if (saved) {
      const parsed = JSON.parse(saved) as PatientInfo;
      if (!parsed.name) {
        parsed.name = "山田 太郎";
      }
      return parsed;
    }
    return initialPatientInfo;
  });

  const [items, setItems] = useState<TreatmentItem[]>(() => {
    const saved = localStorage.getItem('ydc_items');
    if (saved) {
      const parsed = JSON.parse(saved) as TreatmentItem[];
      return parsed.map(item => {
        if (item.note === "右下奥歯" || item.note === "ホームホワイトニング" || item.note === "定期健診・PMTC") {
          return { ...item, note: "" };
        }
        return item;
      });
    }
    return initialItems;
  });

  const [discount, setDiscount] = useState<number>(() => {
    const saved = localStorage.getItem('ydc_discount');
    return saved ? Number(saved) : 0;
  });



  const [taxRate, setTaxRate] = useState<number>(() => {
    const saved = localStorage.getItem('ydc_tax_rate');
    return saved ? Number(saved) : 10;
  });

  const [isTaxInclusive, setIsTaxInclusive] = useState<boolean>(() => {
    const saved = localStorage.getItem('ydc_tax_inc');
    return saved ? JSON.parse(saved) : false;
  });

  const [paidAmount, setPaidAmount] = useState<number>(() => {
    const saved = localStorage.getItem('ydc_paid');
    return saved ? Number(saved) : 0;
  });

  const [invoiceType, setInvoiceType] = useState<string>(() => {
    const saved = localStorage.getItem('ydc_invoice_type');
    return saved || 'implant';
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  // Syncing states to localStorage
  useEffect(() => {
    localStorage.setItem('ydc_patient', JSON.stringify(patientInfo));
  }, [patientInfo]);

  useEffect(() => {
    localStorage.setItem('ydc_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('ydc_discount', String(discount));
  }, [discount]);



  useEffect(() => {
    localStorage.setItem('ydc_tax_rate', String(taxRate));
  }, [taxRate]);

  useEffect(() => {
    localStorage.setItem('ydc_tax_inc', JSON.stringify(isTaxInclusive));
  }, [isTaxInclusive]);

  useEffect(() => {
    localStorage.setItem('ydc_paid', String(paidAmount));
  }, [paidAmount]);

  useEffect(() => {
    localStorage.setItem('ydc_invoice_type', invoiceType);
  }, [invoiceType]);

  // Validation
  useEffect(() => {
    const emptyItems = items.some(item => !item.name.trim());
    const invalidPriceOrQty = items.some(item => item.unitPrice < 0 || item.quantity <= 0);
    
    if (!patientInfo.name.trim()) {
      setValidationError("患者氏名を入力してください。");
    } else if (emptyItems) {
      setValidationError("空の診療項目名があります。");
    } else if (invalidPriceOrQty) {
      setValidationError("単価は0以上、数量は1以上で入力してください。");
    } else if (discount < 0) {
      setValidationError("値引き額は0以上で入力してください。");
    } else if (taxRate < 0 || taxRate > 100) {
      setValidationError("税率は0%〜100%の間で入力してください。");
    } else if (paidAmount < 0) {
      setValidationError("支払済み金額は0以上で入力してください。");
    } else {
      setValidationError(null);
    }
  }, [patientInfo, items, discount, taxRate, paidAmount]);

  // Dynamic A4 single-page scaling hook
  useEffect(() => {
    const handleBeforePrint = () => {
      const container = document.querySelector('.print-container') as HTMLElement;
      if (!container) return;
      container.style.setProperty('--print-scale', '1');
      const maxHeight = 960; // 96 DPI safe limit for A4 portrait
      let scale = 1.0;
      let height = container.scrollHeight;
      while (height > maxHeight && scale > 0.88) {
        scale -= 0.03;
        container.style.setProperty('--print-scale', String(scale));
        height = container.scrollHeight;
      }
    };

    const handleAfterPrint = () => {
      const container = document.querySelector('.print-container') as HTMLElement;
      if (container) {
        container.style.setProperty('--print-scale', '1');
      }
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  // 2. Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const taxBase = Math.max(0, subtotal - discount);

  let tax = 0;
  let totalAmount = 0;

  if (isTaxInclusive) {
    // 税込 (内税の場合: 消費税は合計金額の中に内包されているため、内訳額のみ表示)
    tax = Math.floor(taxBase * (taxRate / (100 + taxRate)));
    totalAmount = Math.max(0, taxBase);
  } else {
    // 税抜 (外税の場合: 小計 - 値引き額に、消費税率分を加算)
    tax = Math.floor(taxBase * (taxRate / 100));
    totalAmount = Math.max(0, taxBase + tax);
  }

  const unpaidAmount = Math.max(0, totalAmount - paidAmount);

  // 3. Handlers
  const handleInvoiceTypeChange = (newType: string) => {
    setInvoiceType(newType);
    let defaultName = "その他";
    let defaultPrice = 0;
    if (newType === 'implant') {
      defaultName = "フィクスチャー";
      defaultPrice = 300000;
    } else if (newType === 'prostho') {
      defaultName = "ハイブリッドIn";
      defaultPrice = 30000;
    } else if (newType === 'other') {
      defaultName = "ホームホワイトニング";
      defaultPrice = 23000;
    }
    setItems([{
      id: Date.now().toString(),
      name: defaultName,
      unitPrice: defaultPrice,
      quantity: 1,
      note: ""
    }]);
  };

  const handleReset = () => {
    if (confirm("入力データを初期値にリセットしますか？")) {
      setPatientInfo(initialPatientInfo);
      setItems(initialItems);
      setDiscount(0);
      setTaxRate(10);
      setIsTaxInclusive(false);
      setPaidAmount(0);
      setInvoiceType('implant');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 shadow-sm sticky top-0 z-30 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-clinic-500 flex items-center justify-center text-white shadow-md shadow-clinic-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-wide">自費診療請求書作成システム</h1>
              <p className="text-xs text-slate-400 font-medium">Dental Self-Pay Invoice Creator</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              className="inline-flex items-center px-3.5 py-2 border border-slate-200 text-sm font-semibold rounded-xl text-slate-600 bg-white hover:bg-slate-50 active:bg-slate-100 transition-all shadow-sm gap-1.5"
              title="データを初期状態にクリア"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              リセット
            </button>
            <button
              onClick={handlePrint}
              disabled={!!validationError}
              className="inline-flex items-center px-5 py-2 text-sm font-semibold rounded-xl text-white bg-clinic-500 hover:bg-clinic-600 active:bg-clinic-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-clinic-100 gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.617 0-1.11-.474-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-14.326 0C3.768 7.28 3 8.213 3 9.292v6.458c0 1.08.768 2.014 1.837 2.174h1.09m10.56-11.25V4.125c0-.621-.504-1.125-1.125-1.125H7.875c-.621 0-1.125.504-1.125 1.125v2.625m10.56 0V7.5H6.72V4.125" />
              </svg>
              印刷 / PDF保存
            </button>
          </div>
        </div>
      </header>

      {/* Validation Alert */}
      {validationError && (
        <div className="bg-rose-50 border-b border-rose-100 py-3 px-4 text-center text-sm font-semibold text-rose-700 flex items-center justify-center gap-1.5 no-print">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span>入力内容に不備があります: {validationError}</span>
        </div>
      )}

      {/* Main Content Layout */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Interactive Input Controls */}
        <div className="flex-1 space-y-6 no-print">
          
          <PatientForm
            patientInfo={patientInfo}
            onChange={setPatientInfo}
            invoiceType={invoiceType}
            onChangeInvoiceType={handleInvoiceTypeChange}
          />

          <TreatmentItems
            items={items}
            onChange={setItems}
            invoiceType={invoiceType}
          />

          <PriceSummary
            isTaxInclusive={isTaxInclusive}
            setIsTaxInclusive={setIsTaxInclusive}
            taxRate={taxRate}
            setTaxRate={setTaxRate}
            discount={discount}
            setDiscount={setDiscount}
            paidAmount={paidAmount}
            setPaidAmount={setPaidAmount}
          />

        </div>

        {/* Right Column: Preview of the physical Invoice */}
        <div className="w-full lg:w-[480px] xl:w-[520px] shrink-0 print-area">
          <InvoicePreview
            patientInfo={patientInfo}
            items={items}
            subtotal={subtotal}
            discount={discount}
            tax={tax}
            taxRate={taxRate}
            isTaxInclusive={isTaxInclusive}
            totalAmount={totalAmount}
            paidAmount={paidAmount}
            unpaidAmount={unpaidAmount}
            invoiceType={invoiceType}
          />
        </div>

      </main>
      
      {/* Web Footer */}
      <footer className="bg-white border-t border-slate-200/60 py-4 text-center text-xs text-slate-400 font-medium no-print mt-8">
        <p>&copy; 2026 やまもと歯科 - 自費診療請求書作成システム</p>
      </footer>

    </div>
  );
}

export default App;
