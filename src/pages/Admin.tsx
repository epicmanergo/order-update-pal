
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
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
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
      toast.success('Order created successfully');
      setOrders(getAllOrders());
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to create order');
      console.error(error);
    }
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
  
  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
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
                Order Management
              </h1>
              <p className="text-muted-foreground mt-1 animate-fade-in">
                View, create, and update order information
              </p>
            </div>
            
            <Button 
              onClick={() => setShowForm(!showForm)} 
              className="animate-blur-in"
            >
              {showForm ? 'Cancel' : (
                <>
                  <Plus className="mr-1 h-4 w-4" />
                  New Order
                </>
              )}
            </Button>
          </div>
          
          <Tabs defaultValue="orders" className="w-full animate-blur-in">
            <TabsList className="mb-6">
              <TabsTrigger value="orders">All Orders</TabsTrigger>
              <TabsTrigger value="add" onClick={() => setShowForm(true)}>Add New Order</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders" className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders by number or customer name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 input-focus-ring"
                  />
                </div>
              </div>
              
              {filteredOrders.length === 0 ? (
                <div className="bg-muted/30 rounded-lg p-8 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Orders Found</h3>
                  <p className="text-muted-foreground mt-2">
                    {searchTerm 
                      ? `No orders match "${searchTerm}"`
                      : "You haven't created any orders yet."}
                  </p>
                  {!searchTerm && (
                    <Button 
                      onClick={() => setShowForm(true)} 
                      className="mt-4"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Create Your First Order
                    </Button>
                  )}
                </div>
              ) : (
                <div className="glassmorphism rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-semibold text-muted-foreground">Order Number</th>
                          <th className="text-left p-4 font-semibold text-muted-foreground">Customer</th>
                          <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
                          <th className="text-left p-4 font-semibold text-muted-foreground">Delivery Date</th>
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
                                <span className="ml-1 capitalize">{order.status}</span>
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
                                Update
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
                  <h2 className="text-xl font-semibold mb-6">Create New Order</h2>
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
