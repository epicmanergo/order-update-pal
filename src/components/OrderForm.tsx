
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  AtSign, 
  User, 
  Phone, 
  Package, 
  AlertTriangle,
  Check,
  Truck,
  Clock
} from 'lucide-react';
import { Order } from '@/utils/ordersData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface OrderFormProps {
  initialData?: Order;
  onSubmit: (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  submitButtonText?: string;
}

const OrderForm: React.FC<OrderFormProps> = ({ 
  initialData, 
  onSubmit,
  submitButtonText = 'Créer la Commande'
}) => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(
    initialData?.deliveryDate ? new Date(initialData.deliveryDate) : undefined
  );
  
  const [formData, setFormData] = useState<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>({
    orderNumber: initialData?.orderNumber || '',
    customerName: initialData?.customerName || '',
    customerEmail: initialData?.customerEmail || '',
    customerPhone: initialData?.customerPhone || '',
    deliveryDate: initialData?.deliveryDate || '',
    status: initialData?.status || 'processing',
    delayReason: initialData?.delayReason || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      status: value as Order['status'],
      // Reset delay reason if status is not delayed
      delayReason: value === 'delayed' ? prev.delayReason : ''
    }));
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setFormData(prev => ({ 
        ...prev, 
        deliveryDate: format(selectedDate, 'yyyy-MM-dd') 
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.orderNumber || !formData.customerName || !formData.deliveryDate) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // If status is delayed, delay reason is required
    if (formData.status === 'delayed' && !formData.delayReason) {
      toast.error('Veuillez indiquer la raison du retard');
      return;
    }
    
    onSubmit(formData);
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delayed': return <AlertTriangle className="h-4 w-4" />;
      case 'delivered': return <Check className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="orderNumber" className="text-base flex items-center gap-1.5">
            <Package className="h-4 w-4" />
            Numéro de Commande <span className="text-red-500">*</span>
          </Label>
          <Input
            id="orderNumber"
            name="orderNumber"
            placeholder="ex: ORD-2023-001"
            className="input-focus-ring"
            value={formData.orderNumber}
            onChange={handleChange}
            required
            disabled={!!initialData} // Disable editing of order number for updates
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="customerName" className="text-base flex items-center gap-1.5">
              <User className="h-4 w-4" />
              Nom du Client <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customerName"
              name="customerName"
              placeholder="Nom Complet"
              className="input-focus-ring"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customerEmail" className="text-base flex items-center gap-1.5">
              <AtSign className="h-4 w-4" />
              Adresse Email
            </Label>
            <Input
              id="customerEmail"
              name="customerEmail"
              type="email"
              placeholder="client@exemple.com"
              className="input-focus-ring"
              value={formData.customerEmail}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customerPhone" className="text-base flex items-center gap-1.5">
              <Phone className="h-4 w-4" />
              Numéro de Téléphone
            </Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              placeholder="ex: 06 12 34 56 78"
              className="input-focus-ring"
              value={formData.customerPhone}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-base flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Date de Livraison <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal input-focus-ring",
                    !date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, 'd MMMM yyyy', { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label className="text-base">Statut de la Commande</Label>
          <RadioGroup
            defaultValue={formData.status}
            value={formData.status}
            onValueChange={handleStatusChange}
            className="grid grid-cols-2 md:grid-cols-4 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="processing" id="processing" />
              <Label htmlFor="processing" className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>En traitement</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="shipped" id="shipped" />
              <Label htmlFor="shipped" className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-amber-500" />
                <span>Expédié</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="delayed" id="delayed" />
              <Label htmlFor="delayed" className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span>Retardé</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="delivered" id="delivered" />
              <Label htmlFor="delivered" className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" />
                <span>Livré</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {formData.status === 'delayed' && (
          <div className="space-y-2 animate-fade-in">
            <Label htmlFor="delayReason" className="text-base flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Raison du Retard <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="delayReason"
              name="delayReason"
              placeholder="Expliquez pourquoi la commande est retardée..."
              rows={3}
              className="input-focus-ring"
              value={formData.delayReason}
              onChange={handleChange}
              required
            />
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button type="submit" className="sm:flex-1">
          {getStatusIcon(formData.status)}
          <span className="ml-1">{submitButtonText}</span>
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="sm:flex-1"
        >
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default OrderForm;
