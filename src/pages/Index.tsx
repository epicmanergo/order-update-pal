
import React, { useState } from 'react';
import { findOrderByNumber } from '@/utils/ordersData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import OrderDetails from '@/components/OrderDetails';
import { toast } from 'sonner';
import { Package, SearchIcon } from 'lucide-react';

const Index = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<ReturnType<typeof findOrderByNumber>>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber.trim()) {
      toast.error('Veuillez saisir un numéro de commande');
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      const foundOrder = findOrderByNumber(orderNumber);
      setSearchedOrder(foundOrder);
      
      if (!foundOrder) {
        toast.error(`Commande "${orderNumber}" introuvable`);
      }
      
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="min-h-screen pt-20 md:pt-36">
      <div className="content-container text-center max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl animate-slide-in">
          Suivi de Commande
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl animate-fade-in delay-150">
          Entrez votre numéro de commande pour suivre votre livraison et connaître sa date d'arrivée estimée
        </p>
        
        <form 
          onSubmit={handleSearch} 
          className="mt-8 flex flex-col sm:flex-row items-center gap-3 animate-blur-in delay-300"
        >
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="pl-10 input-focus-ring w-full"
              placeholder="Numéro de commande (ex: ORD-2023-001)"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSearching}
            className="w-full sm:w-auto"
          >
            {isSearching ? 'Recherche...' : 'Suivre ma commande'}
          </Button>
        </form>
        
        <div className="mt-12">
          {searchedOrder ? (
            <OrderDetails order={searchedOrder} />
          ) : (
            <div className="text-center mt-8 text-muted-foreground py-12 animate-pulse-slow">
              <Package className="mx-auto h-16 w-16 mb-4 opacity-20" />
              <p>Les informations de votre commande apparaîtront ici</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
