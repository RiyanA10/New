import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/ui/property-card";
import { useQuery } from "@tanstack/react-query";
import { Property } from "@shared/schema";
import { Link } from "wouter";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: featuredProperties } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
  });

  const [firebaseFeaturedProperties, setFirebaseFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    try {
      const featuredQuery = query(
        collection(db, "properties"),
        where("featured", "==", true),
        orderBy("createdAt", "desc"),
        limit(6)
      );

      const unsubscribe = onSnapshot(
        featuredQuery,
        (snapshot) => {
          const properties = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setFirebaseFeaturedProperties(properties);
          setLoading(false);
        },
        (error) => {
          console.error("Error in properties listener:", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up featured properties listener:", error);
      setLoading(false);
    }
  }, []);


  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-orange-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              Find Your Perfect Home Match
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover properties tailored to your lifestyle and preferences
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link href="/search">Browse Properties</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/lifestyle">Take Lifestyle Quiz</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading...</p>
            ) : (
              firebaseFeaturedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} showActions={false} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}