export enum InquiryStatus {
  NEW = 'new',
  PROCESSING = 'processing',
  COMPLETED = 'completed'
}

export interface Inquiry {
  id: string;
  hotelName: string;
  location: string;
  roomsCount: string;
  clientName: string;
  clientPosition: string;
  contact: string;
  monthlyRevenue: string;
  worries: string[];
  status: InquiryStatus;
  adminMemo: string;
  createdAt: any; // Firestore Timestamp / Date object
}
