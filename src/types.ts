export interface TreatmentItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  note: string;
}

export interface PatientInfo {
  name: string;
  patientId: string;
  invoiceDate: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
}
