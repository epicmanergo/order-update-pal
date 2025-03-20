
import React, { useState } from 'react';
import { getOrderByNumber } from '@/utils/ordersData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import OrderDetails from '@/components/OrderDetails';
import { Search, PackageSearch } from 'lucide-react';

const Index = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<ReturnType<typeof getOrderByNumber>>(undefined);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber.trim()) {
      toast.error('Please enter an order number');
      return;
    }
    
    setIsSearching(true);
    
    // Simulate network delay
    setTimeout(() => {
      const order = getOrderByNumber(orderNumber);
      setSearchedOrder(order);
      
      if (!order) {
        toast.error('Order not found. Please check the order number and try again.');
      }
      
      setIsSearching(false);
    }, 600);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="content-container">
        {/* Hero Section */}
        <div className="page-section mb-16">
          <div className="w-full max-w-3xl mx-auto text-center space-y-4">
            <div className="text-sm font-medium text-blue-600 uppercase tracking-wide animate-fade-in">
              Order Tracking
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight animate-slide-in">
              Track Your Order Status
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
              Enter your order number below to check the current status and estimated delivery date.
            </p>
          </div>
          
          <div className="w-full max-w-md mx-auto mt-8 animate-blur-in">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter your order number..."
                  className="pl-10 pr-24 py-6 text-base rounded-full border-muted input-focus-ring shadow-sm"
                />
                <Button 
                  type="submit" 
                  disabled={isSearching || !orderNumber.trim()}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full h-10"
                >
                  {isSearching ? 'Searching...' : 'Track'}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Order Details */}
        <div className="w-full max-w-3xl mx-auto">
          {searchedOrder ? (
            <OrderDetails order={searchedOrder} />
          ) : !isSearching && orderNumber.trim() && (
            <div className="glassmorphism rounded-xl overflow-hidden p-8 text-center animate-fade-in">
              <PackageSearch className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No Order Found</h3>
              <p className="text-muted-foreground mt-2">
                We couldn't find an order with the number <strong>{orderNumber}</strong>.<br />
                Please check the order number and try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
