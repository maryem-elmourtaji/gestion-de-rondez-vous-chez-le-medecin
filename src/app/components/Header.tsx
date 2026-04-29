import { Link } from 'react-router';
import { Button } from './ui/button';
import { UtensilsCrossed, Calendar } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6" />
          <span className="font-semibold text-lg">RestauBook</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost">Restaurants</Button>
          </Link>
          <Link to="/reservations">
            <Button variant="ghost" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Mes Réservations
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
