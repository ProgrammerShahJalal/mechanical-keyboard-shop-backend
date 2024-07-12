export interface IOrderItem {
  product: string;
  quantity: number;
}

export interface ICreateOrder {
  userDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  cartItems: IOrderItem[];
  paymentMethod: 'cashOnDelivery' | 'stripe';
  sessionId?: string; // only for stripe payment method
}
