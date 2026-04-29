import { Restaurant } from '../types';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Star, MapPin, Clock, Euro } from 'lucide-react';
import { Link } from 'react-router';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const priceSymbol = '€'.repeat(restaurant.priceRange);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-lg">{restaurant.name}</h3>
            <Badge variant="secondary" className="mt-1">
              {restaurant.cuisine}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{restaurant.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {restaurant.description}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{restaurant.city}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{restaurant.openingHours}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Euro className="w-4 h-4" />
          <span>{priceSymbol}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/restaurant/${restaurant.id}`} className="w-full">
          <Button className="w-full">Réserver</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
