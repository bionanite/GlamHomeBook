import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface ServiceCardProps {
  image: string;
  title: string;
  description: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
}

export default function ServiceCard({ image, title, description, priceRange, rating, reviewCount }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300 group">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="font-serif text-2xl font-semibold mb-2" data-testid={`text-service-title`}>
          {title}
        </h3>
        <p className="text-muted-foreground mb-4 text-sm" data-testid={`text-service-description`}>
          {description}
        </p>
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-primary text-primary' : 'text-muted'}`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-2" data-testid={`text-rating`}>
            {rating} ({reviewCount} reviews)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg" data-testid={`text-price-range`}>
            {priceRange}
          </span>
          <Button data-testid={`button-book-service`}>
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
