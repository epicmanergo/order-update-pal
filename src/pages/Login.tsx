
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (password === 'salut123') {
        localStorage.setItem('isAuthenticated', 'true');
        toast.success('Connexion réussie');
        navigate('/admin');
      } else {
        toast.error('Mot de passe incorrect');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="content-container max-w-md mx-auto">
        <div className="glassmorphism rounded-xl overflow-hidden p-6 animate-blur-in">
          <div className="mb-6 text-center">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              Accès Administrateur
            </h1>
            <p className="text-muted-foreground">
              Veuillez entrer le mot de passe pour accéder au panneau d'administration
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
                className="input-focus-ring"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
