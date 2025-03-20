
export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryDate: string;
  status: 'processing' | 'shipped' | 'delayed' | 'delivered';
  delayReason?: string;
  createdAt: string;
  updatedAt: string;
}

// For a real application, this would be stored in a database
let orders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2023-001',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    customerPhone: '555-123-4567',
    deliveryDate: '2023-12-18',
    status: 'shipped',
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2023-12-03T14:30:00Z'
  },
  {
    id: '2',
    orderNumber: 'ORD-2023-002',
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    customerPhone: '555-987-6543',
    deliveryDate: '2023-12-20',
    status: 'delayed',
    delayReason: 'Weather conditions affecting delivery routes',
    createdAt: '2023-12-02T09:15:00Z',
    updatedAt: '2023-12-10T11:20:00Z'
  }
];

// Get all orders
export const getAllOrders = (): Order[] => {
  return [...orders];
};

// Get order by order number
export const getOrderByNumber = (orderNumber: string): Order | undefined => {
  return orders.find(order => order.orderNumber.toLowerCase() === orderNumber.toLowerCase());
};

// Add new order
export const addOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
  const newOrder: Order = {
    ...order,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  orders = [...orders, newOrder];
  return newOrder;
};

// Update order
export const updateOrder = (orderId: string, updates: Partial<Order>): Order | undefined => {
  // Find the order by id, not by order number
  const index = orders.findIndex(order => order.id === orderId);
  
  if (index === -1) return undefined;
  
  const updatedOrder = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  orders = [
    ...orders.slice(0, index),
    updatedOrder,
    ...orders.slice(index + 1)
  ];
  
  return updatedOrder;
};

// Delete order
export const deleteOrder = (orderNumber: string): boolean => {
  const initialLength = orders.length;
  orders = orders.filter(order => order.orderNumber.toLowerCase() !== orderNumber.toLowerCase());
  return initialLength !== orders.length;
};
