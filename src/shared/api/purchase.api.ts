import axios from 'axios';

export interface PurchasePayload {
  ticketId: number;
  slotNumber: number;
  userExtraId: number;
  amount: number;
}

export interface PurchaseDTO {
  id: number;
  date: string;
  ticketNumber?: string;
  batch?: string;
  ticket?: {
    id: number;
    ticketKey?: string;
  };
}

export const purchaseTicket = (payload: PurchasePayload) => {
  return axios.post('/api/purchase', payload);
};

export const fetchPurchasesByUserId = (userId: number) => {
  return axios.get<PurchaseDTO[]>(`/api/purchases/by-user/${userId}`);
};
