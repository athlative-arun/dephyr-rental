
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Calendar, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useShops } from "@/contexts/ShopContext";
import { useBikes } from "@/contexts/BikeContext";
import { useReviews } from "@/contexts/ReviewContext";

const ShopDetailPage: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { selectShop, selectedShop } = useShops();
  const { getBikesByShop, allBikes } = useBikes();
  const { shopReviews } = useReviews();
  
  // Fetch shop details
  useEffect(() => {
    if (shopId) {
      selectShop(shopId);
    }
  }, [shopId, selectShop]);
  
  if (!selectedShop) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading shop details...</p>
      </div>
    );
  }
  
  const shopBikes = getBikesByShop(selectedShop.id);
  const reviews = shopReviews(selectedShop.id);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Shop Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="h-64 bg-gray-200 relative">
          {/* Shop image placeholder */}
          <div className="w-full h-full flex items-center justify-center bg-brand-green-100 text-brand-green-600">
            <span className="text-xl font-semibold">{selectedShop.name} Image</span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{selectedShop.name}</h1>
              <div className="flex items-center mb-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(selectedShop.rating) ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {selectedShop.rating.toFixed(1)} ({selectedShop.reviewCount} reviews)
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
              <Button variant="outline" onClick={() => window.open(`tel:${selectedShop.phone}`)}>
                <Phone className="mr-2 h-4 w-4" />
                Call Shop
              </Button>
              <Button onClick={() => navigate("/bikes")}>
                Browse All Bikes
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-gray-600 mr-2 mt-0.5" />
              <span className="text-gray-700">
                {selectedShop.address}, {selectedShop.area}, {selectedShop.city}, {selectedShop.pincode}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-gray-700">Open {selectedShop.openingTime} - {selectedShop.closingTime}</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-gray-700">{selectedShop.phone}</span>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-600 mr-2" />
              <span className="text-gray-700">{selectedShop.email}</span>
            </div>
          </div>
          
          <p className="text-gray-700">{selectedShop.description}</p>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="bikes">
        <TabsList className="mb-6">
          <TabsTrigger value="bikes">Available Bikes</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bikes">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Available Bikes ({shopBikes.length})</h2>
            
            {shopBikes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shopBikes.map((bike) => (
                  <div key={bike.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 bg-gray-200">
                      {/* Bike image placeholder */}
                      <div className="w-full h-full flex items-center justify-center bg-brand-blue-100 text-brand-blue-600">
                        <span className="text-lg font-semibold">{bike.name} Image</span>
                      </div>
                      <div className="absolute top-2 right-2 bg-accent text-white px-2 py-1 rounded-md text-sm font-medium">
                        {bike.gearType === "manual" ? "Manual" : "Automatic"}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{bike.name}</h3>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span>{bike.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{bike.brand} | {bike.cc}cc</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {bike.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                            {feature}
                          </span>
                        ))}
                        {bike.features.length > 3 && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                            +{bike.features.length - 3} more
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-900 font-bold">₹{bike.pricePerDay}<span className="text-gray-600 font-normal text-sm">/day</span></p>
                          <p className="text-gray-600 text-xs">₹{bike.pricePerHour}/hour</p>
                        </div>
                        <Button onClick={() => navigate(`/bikes/${bike.id}`)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">No bikes available</h3>
                <p className="text-gray-600 mb-6">This shop doesn't have any bikes listed at the moment.</p>
                <Button variant="outline" onClick={() => navigate("/bikes")}>
                  Browse All Bikes
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="reviews">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Reviews</h2>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-semibold">{selectedShop.rating.toFixed(1)}</span>
                <span className="text-gray-600 ml-1">({selectedShop.reviewCount} reviews)</span>
              </div>
            </div>
            
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center mb-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 mr-3">
                        {review.userImage ? (
                          <img 
                            src={review.userImage} 
                            alt={review.userName} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                            {review.userName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">{review.userName}</h4>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "text-yellow-400" : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <span className="ml-auto text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet for this shop.</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="location">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-2xl font-bold mb-6">Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Address</h3>
                <div className="flex items-start mb-4">
                  <MapPin className="w-5 h-5 text-gray-600 mr-2 mt-0.5" />
                  <span className="text-gray-700">
                    {selectedShop.address}, {selectedShop.area}, {selectedShop.city}, {selectedShop.pincode}
                  </span>
                </div>
                
                <h3 className="font-medium mb-3">Contact Information</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="text-gray-700">{selectedShop.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="text-gray-700">{selectedShop.email}</span>
                  </div>
                </div>
                
                <h3 className="font-medium mb-3">Opening Hours</h3>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-gray-700">Open {selectedShop.openingTime} - {selectedShop.closingTime}</span>
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="flex items-center"
                    onClick={() => window.open(`https://maps.google.com/?q=${selectedShop.latitude},${selectedShop.longitude}`, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in Google Maps
                  </Button>
                </div>
              </div>
              
              <div className="h-64 bg-gray-200 rounded-lg">
                {/* Map placeholder - would be actual map in production */}
                <div className="w-full h-full flex items-center justify-center bg-brand-green-100 text-brand-green-600">
                  <span className="text-lg font-semibold">Map Location</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShopDetailPage;
