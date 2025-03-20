
import React from 'react';
import { Order } from '@/utils/ordersData';
import { Calendar, Package, Mail, Phone, Clock, AlertTriangle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface OrderDetailsProps {
  order: Order;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'processing': return 'text-blue-500 bg-blue-50';
      case 'shipped': return 'text-amber-500 bg-amber-50';
      case 'delayed': return 'text-red-500 bg-red-50';
      case 'delivered': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'shipped': return <Package className="h-4 w-4" />;
      case 'delayed': return <AlertTriangle className="h-4 w-4" />;
      case 'delivered': return <Check className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      // Try to parse as ISO date
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original if not valid date
      }
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  };

  return (
    <div className="w-full animate-blur-in">
      <div className="glassmorphism rounded-xl overflow-hidden p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Order Number</div>
            <h2 className="text-2xl font-bold">{order.orderNumber}</h2>
          </div>
          
          <div className={cn(
            "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5",
            getStatusColor(order.status)
          )}>
            {getStatusIcon(order.status)}
            <span className="capitalize">{order.status}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Customer</div>
              <div className="text-lg font-semibold">{order.customerName}</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{order.customerEmail}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{order.customerPhone}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Expected Delivery</div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">{formatDate(order.deliveryDate)}</span>
              </div>
            </div>
            
            {order.delayReason && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-amber-700">Delay Information</div>
                    <p className="text-amber-600 text-sm">{order.delayReason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground pt-4 border-t border-border">
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <span>Created: {formatDate(order.createdAt)}</span>
            <span>Last Updated: {formatDate(order.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
