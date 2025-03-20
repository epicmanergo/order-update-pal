
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllOrders, addOrder } from '@/utils/ordersData';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import OrderForm from '@/components/OrderForm';
import { 
  Plus, 
  Package, 
  PenLine, 
  Calendar, 
  User,
  Search,
  Clock,
  Truck,
  AlertTriangle,
  Check,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

const Admin = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(getAllOrders());
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    // Refresh orders when component mounts
    setOrders(getAllOrders());
  }, []);
  
  const handleCreateOrder = (orderData: Parameters<typeof addOrder>[0]) => {
    try {
      const newOrder = addOrder(orderData);
      toast.success('Commande créée avec succès');
      setOrders(getAllOrders());
      setShowForm(false);
    } catch (error) {
      toast.error('Échec de la création de la commande');
      console.error(error);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    toast.success('Vous êtes déconnecté');
    navigate('/');
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'shipped': return <Truck className="h-4 w-4 text-amber-500" />;
      case 'delayed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'delivered': return <Check className="h-4 w-4 text-green-500" />;
      default: return <Package className="h-4 w-4" />;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'delayed': return 'bg-red-50 text-red-700 border-red-200';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing': return 'En traitement';
      case 'shipped': return 'Expédié';
      case 'delayed': return 'Retardé';
      case 'delivered': return 'Livré';
      default: return status;
    }
  };
  
  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="content-container">
        <div className="w-full mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight animate-slide-in">
                Gestion des Commandes
              </h1>
              <p className="text-muted-foreground mt-1 animate-fade-in">
                Afficher, créer et mettre à jour les informations de commande
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="animate-blur-in text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <LogOut className="mr-1 h-4 w-4" />
                Déconnexion
              </Button>
              
              <Button 
                onClick={() => setShowForm(!showForm)} 
                className="animate-blur-in"
              >
                {showForm ? 'Annuler' : (
                  <>
                    <Plus className="mr-1 h-4 w-4" />
                    Nouvelle Commande
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="orders" className="w-full animate-blur-in">
            <TabsList className="mb-6">
              <TabsTrigger value="orders">Toutes les Commandes</TabsTrigger>
              <TabsTrigger value="add" onClick={() => setShowForm(true)}>Ajouter une Commande</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders" className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par numéro de commande ou nom du client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 input-focus-ring"
                  />
                </div>
              </div>
              
              {filteredOrders.length === 0 ? (
                <div className="bg-muted/30 rounded-lg p-8 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Aucune Commande Trouvée</h3>
                  <p className="text-muted-foreground mt-2">
                    {searchTerm 
                      ? `Aucune commande ne correspond à "${searchTerm}"`
                      : "Vous n'avez pas encore créé de commandes."}
                  </p>
                  {!searchTerm && (
                    <Button 
                      onClick={() => setShowForm(true)} 
                      className="mt-4"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Créer Votre Première Commande
                    </Button>
                  )}
                </div>
              ) : (
                <div className="glassmorphism rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-semibold text-muted-foreground">N° Commande</th>
                          <th className="text-left p-4 font-semibold text-muted-foreground">Client</th>
                          <th className="text-left p-4 font-semibold text-muted-foreground">Statut</th>
                          <th className="text-left p-4 font-semibold text-muted-foreground">Date de Livraison</th>
                          <th className="text-right p-4 font-semibold text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                            <td className="p-4 font-medium">{order.orderNumber}</td>
                            <td className="p-4">
                              <div className="flex items-center">
                                <User className="h-4 w-4 text-muted-foreground mr-2" />
                                {order.customerName}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                getStatusClass(order.status)
                              )}>
                                {getStatusIcon(order.status)}
                                <span className="ml-1">{getStatusText(order.status)}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                                {formatDate(order.deliveryDate)}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => navigate(`/update-order/${order.orderNumber}`)}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <PenLine className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="add">
              {showForm && (
                <div className="glassmorphism rounded-xl overflow-hidden p-6">
                  <h2 className="text-xl font-semibold mb-6">Créer une Nouvelle Commande</h2>
                  <OrderForm onSubmit={handleCreateOrder} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
