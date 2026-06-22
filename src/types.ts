export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  items: ServiceItem[];
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceCategory: string;
  serviceName: string;
  servicePrice: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM AM/PM
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  type: 'booking' | 'contact';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  meta: {
    customerName: string;
    customerPhone?: string;
    customerEmail?: string;
    details: string; // serviceName, date, time or contact text
  };
}
