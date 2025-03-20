
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PackageX, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 md:pt-0 px-4">
      <div className="max-w-md w-full text-center">
        <div className="rounded-full bg-red-50 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
          <PackageX className="h-10 w-10 text-red-500" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-2 animate-slide-in">
          Page Non Trouvée
        </h1>
        
        <p className="text-muted-foreground mb-6 animate-fade-in">
          Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-blur-in">
          <Button variant="default" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'Accueil
            </Link>
          </Button>
          
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour en Arrière
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
