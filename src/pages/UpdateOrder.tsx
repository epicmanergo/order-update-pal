
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderByNumber, updateOrder } from '@/utils/ordersData';
import OrderForm from '@/components/OrderForm';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

const UpdateOrder = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState(orderNumber ? getOrderByNumber(orderNumber) : null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (orderNumber) {
      const foundOrder = getOrderByNumber(orderNumber);
      setOrder(foundOrder);
      
      if (!foundOrder) {
        toast.error(`Commande "${orderNumber}" introuvable`);
        navigate('/admin');
      }
    }
  }, [orderNumber, navigate]);

  const handleUpdateOrder = (formData: Parameters<typeof updateOrder>[1]) => {
    if (!order) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        updateOrder(order.id, formData);
        toast.success('Commande mise à jour avec succès');
        navigate('/admin');
      } catch (error) {
        toast.error('Échec de la mise à jour de la commande');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  if (!order) {
    return (
      <div className="min-h-screen pt-20 flex justify-center">
        <div className="bg-muted/30 rounded-lg p-8 text-center max-w-lg mx-auto">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-medium">Commande Introuvable</h3>
          <p className="text-muted-foreground mt-2">
            La commande que vous recherchez n'existe pas ou a été supprimée.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="content-container max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight animate-slide-in">
            Mettre à Jour la Commande
          </h1>
          <p className="text-muted-foreground mt-1 animate-fade-in">
            Modifier les détails de la commande {order.orderNumber}
          </p>
        </div>
        
        <div className="glassmorphism rounded-xl overflow-hidden p-6">
          <OrderForm 
            initialData={order} 
            onSubmit={handleUpdateOrder}
            submitButtonText={isLoading ? 'Mise à jour...' : 'Mettre à Jour la Commande'}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateOrder;
