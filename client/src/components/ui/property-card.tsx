import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Ruler, Tag } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useLocation } from "wouter";
import { Property } from "@/types/property";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  property: Property;
  className?: string;
  showActions?: boolean;
}

export function PropertyCard({
  property,
  className = "",
  showActions = true
}: PropertyCardProps) {
  const {
    id,
    title,
    price,
    location,
    bedrooms,
    bathrooms,
    area,
    propertyType,
    forSale,
    forRent,
    featured = false,
    images = [],
    status = "active",
    ownerName,
    ownerPhotoURL
  } = property;

  const [, navigate] = useLocation();

  const handleClick = () => {
    navigate(`/property/${id}`);
  };

  // Format the price with commas for thousands
  const formattedPrice = formatPrice(price);

  // Get the first image or use a placeholder
  const primaryImage = images && images.length > 0
    ? images[0]
    : "https://placehold.co/600x400?text=No+Image";

  // Status badge color
  const statusColors = {
    active: "bg-green-100 text-green-800",
    sold: "bg-red-100 text-red-800",
    rented: "bg-blue-100 text-blue-800",
    inactive: "bg-gray-100 text-gray-800",
  };

  const statusColor = status && statusColors[status as keyof typeof statusColors]
    ? statusColors[status as keyof typeof statusColors]
    : statusColors.active;

  return (
    <div onClick={() => navigate(`/property/${id}`)}>
      <Card className={`overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer ${className}`}  role="button" tabIndex={0}>
        <div className="relative">
          {featured && (
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-yellow-500 hover:bg-yellow-600">Featured</Badge>
            </div>
          )}
          {status && (
            <div className="absolute top-2 right-2 z-10">
              <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          )}
          <div className="h-48 overflow-hidden">
            <img
              src={primaryImage}
              alt={title}
              className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
            />
          </div>
        </div>
        <CardContent className="p-4">
          <div className="font-semibold text-lg line-clamp-1">{title}</div>
          <div className="text-sm text-muted-foreground mb-2">{location}</div>
          <div className="text-xl font-bold mb-2">{formattedPrice} SAR</div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{bedrooms} Bed{bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{bathrooms} Bath{bathrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <Ruler className="h-4 w-4" />
              <span>{area} m²</span>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {forSale && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                For Sale
              </Badge>
            )}
            {forRent && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                For Rent
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={ownerPhotoURL || ""} alt={ownerName || "Owner"} />
              <AvatarFallback>{ownerName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="text-sm font-medium">{ownerName || "Unknown owner"}</div>
          </div>
          {showActions && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/property/${id}`);
              }}
            >
              View Details
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}