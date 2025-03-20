
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderByNumber, updateOrder } from '@/utils/ordersData';
import { toast } from 'sonner';
import OrderForm from '@/components/OrderForm';
import { ArrowLeft, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UpdateOrder = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState(orderNumber ? getOrderByNumber(orderNumber) : undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (orderNumber) {
      // Simulate loading delay
      const timer = setTimeout(() => {
        const foundOrder = getOrderByNumber(orderNumber);
        setOrder(foundOrder);
        setIsLoading(false);
        
        if (!foundOrder) {
          toast.error('Order not found');
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [orderNumber]);
  
  const handleUpdate = (formData: Parameters<typeof updateOrder>[1]) => {
    if (!orderNumber) return;
    
    try {
      const updated = updateOrder(orderNumber, formData);
      
      if (updated) {
        toast.success('Order updated successfully');
        navigate('/admin');
      } else {
        toast.error('Failed to update order');
      }
    } catch (error) {
      toast.error('An error occurred while updating the order');
      console.error(error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="h-8 w-32 bg-muted rounded-md mx-auto mb-4"></div>
          <div className="h-6 w-64 bg-muted rounded-md mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="min-h-screen pt-20">
        <div className="content-container">
          <div className="max-w-lg mx-auto glassmorphism rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
            <p className="mb-6 text-muted-foreground">
              We couldn't find an order with the number <strong>{orderNumber}</strong>.
            </p>
            <Button onClick={() => navigate('/admin')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Admin Panel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="content-container">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> 
            Back to Admin
          </Button>
          
          <h1 className="text-3xl font-bold tracking-tight animate-slide-in flex items-center gap-2">
            <PenLine className="h-6 w-6" /> 
            Update Order
          </h1>
          <p className="text-muted-foreground animate-fade-in">
            Update details for order {order.orderNumber}
          </p>
        </div>
        
        <div className="glassmorphism rounded-xl overflow-hidden p-6 max-w-4xl">
          <OrderForm 
            initialData={order} 
            onSubmit={handleUpdate}
            submitButtonText="Update Order"
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateOrder;
