
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { format, addDays, differenceInHours, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Star, Clock, Info, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useBikes } from "@/contexts/BikeContext";
import { useShops } from "@/contexts/ShopContext";
import { useReviews } from "@/contexts/ReviewContext";
import { useBookings } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { DateTimeRange } from "@/types";

const BikeDetailPage: React.FC = () => {
  const { bikeId } = useParams<{ bikeId: string }>();
  const navigate = useNavigate();
  const { selectBike, selectedBike, getShopNameById } = useBikes();
  const { selectShop, selectedShop } = useShops();
  const { bikeReviews } = useReviews();
  const { checkAvailability, createBooking } = useBookings();
  const { isLoggedIn, currentUser } = useAuth();
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
  const [duration, setDuration] = useState<{ hours: number; days: number }>({ hours: 24, days: 1 });
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  
  useEffect(() => {
    if (bikeId) {
      selectBike(bikeId);
    }
  }, [bikeId, selectBike]);
  
  useEffect(() => {
    if (selectedBike && selectedBike.shopId) {
      selectShop(selectedBike.shopId);
    }
  }, [selectedBike, selectShop]);
  
  // Calculate duration and total amount when date changes
  useEffect(() => {
    if (selectedBike && date?.from && date?.to) {
      const hours = differenceInHours(date.to, date.from);
      const days = differenceInDays(date.to, date.from);
      
      setDuration({ hours, days: days > 0 ? days : 1 });
      
      // Calculate cost based on hours and daily rate
      let totalCost;
      if (hours < 24) {
        totalCost = selectedBike.pricePerHour * hours;
      } else {
        totalCost = selectedBike.pricePerDay * Math.max(1, days);
      }
      
      setTotalAmount(totalCost);
      
      // Check availability
      if (date.from && date.to) {
        const dateRange: DateTimeRange = {
          startDate: date.from,
          endDate: date.to,
        };
        const available = checkAvailability(selectedBike.id, dateRange);
        setIsAvailable(available);
      }
    }
  }, [date, selectedBike, checkAvailability]);
  
  const handleBookNow = () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/bikes/${bikeId}` } });
      return;
    }
    
    if (!selectedBike || !date?.from || !date?.to || !currentUser) {
      return;
    }
    
    // Create booking
    const bookingData = {
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      userEmail: currentUser.email,
      bikeId: selectedBike.id,
      bikeName: selectedBike.name,
      bikeImage: selectedBike.images[0],
      shopId: selectedBike.shopId,
      shopName: getShopNameById(selectedBike.shopId),
      startDate: date.from.toISOString(),
      endDate: date.to.toISOString(),
      duration: duration.hours,
      totalAmount,
      deposit: selectedBike.deposit,
    };
    
    const bookingId = createBooking(bookingData);
    
    // Navigate to payment page
    navigate(`/payment/${bookingId}`);
  };
  
  if (!selectedBike) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading bike details...</p>
      </div>
    );
  }
  
  const reviews = bikeReviews(selectedBike.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bike Images and Details */}
        <div className="lg:col-span-2">
          {/* Bike Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {selectedBike.images.map((image, index) => (
              <div 
                key={index} 
                className={`bg-gray-200 rounded-lg overflow-hidden ${
                  index === 0 ? "md:col-span-2 h-64" : "h-40"
                }`}
              >
                {/* Image placeholder - would be actual image in production */}
                <div className="w-full h-full flex items-center justify-center bg-brand-blue-100 text-brand-blue-600">
                  <span className="text-lg font-semibold">{selectedBike.name} Image {index + 1}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold">{selectedBike.name}</h1>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-semibold">{selectedBike.rating.toFixed(1)}</span>
                <span className="text-gray-600 ml-1">({selectedBike.reviewCount} reviews)</span>
              </div>
            </div>
            <p className="text-lg text-gray-600 mb-4">
              {selectedBike.brand} {selectedBike.model} • {selectedBike.cc}cc • {selectedBike.gearType === "manual" ? "Manual" : "Automatic"}
            </p>
            <p className="text-gray-600 mb-6">{getShopNameById(selectedBike.shopId)}</p>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="shop">Shop Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Bike Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-gray-500 text-sm">Brand</h3>
                    <p className="font-medium">{selectedBike.brand}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Model</h3>
                    <p className="font-medium">{selectedBike.model}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Year</h3>
                    <p className="font-medium">{selectedBike.year}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Type</h3>
                    <p className="font-medium">{selectedBike.type}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Engine</h3>
                    <p className="font-medium">{selectedBike.cc}cc</p>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Gear Type</h3>
                    <p className="font-medium">{selectedBike.gearType === "manual" ? "Manual" : "Automatic"}</p>
                  </div>
                </div>
                <Separator className="my-4" />
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-700">{selectedBike.description}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedBike.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <ShieldCheck className="w-5 h-5 text-primary mr-2" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Reviews</h2>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 mr-1" />
                    <span className="font-semibold">{selectedBike.rating.toFixed(1)}</span>
                    <span className="text-gray-600 ml-1">({selectedBike.reviewCount} reviews)</span>
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
                  <p className="text-gray-500">No reviews yet for this bike.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="shop" className="mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                {selectedShop ? (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-semibold">{selectedShop.name}</h2>
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 mr-1" />
                        <span className="font-semibold">{selectedShop.rating.toFixed(1)}</span>
                        <span className="text-gray-600 ml-1">({selectedShop.reviewCount} reviews)</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span>{selectedShop.address}, {selectedShop.area}, {selectedShop.city}, {selectedShop.pincode}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-2" />
                        <span>Open {selectedShop.openingTime} - {selectedShop.closingTime}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{selectedShop.description}</p>
                    
                    <div className="h-40 bg-gray-200 rounded-lg mb-4">
                      {/* Map placeholder - would be actual map in production */}
                      <div className="w-full h-full flex items-center justify-center bg-brand-green-100 text-brand-green-600">
                        <span className="text-lg font-semibold">Map Location</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(`/shops/${selectedShop.id}`)}
                    >
                      View Shop
                    </Button>
                  </>
                ) : (
                  <p className="text-gray-500">Loading shop information...</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-lg sticky top-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-2xl font-bold mb-1">₹{selectedBike.pricePerDay}<span className="text-gray-600 font-normal text-sm">/day</span></p>
                <p className="text-gray-600">₹{selectedBike.pricePerHour}/hour</p>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-semibold">{selectedBike.rating.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Dates</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} 
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick dates</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-700">Duration:</span>
                <span className="font-medium">
                  {duration.days > 0 ? `${duration.days} day${duration.days > 1 ? 's' : ''}` : `${duration.hours} hour${duration.hours > 1 ? 's' : ''}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Rental charges:</span>
                <span className="font-medium">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Security deposit:</span>
                <span className="font-medium">₹{selectedBike.deposit}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Total amount:</span>
                <span className="font-bold">₹{totalAmount + selectedBike.deposit}</span>
              </div>
              <div className="text-xs text-gray-500">
                (Security deposit will be refunded after returning the bike)
              </div>
            </div>
            <Button 
              className="w-full mb-4" 
              size="lg"
              onClick={handleBookNow}
            >
              {isLoggedIn ? "Book Now" : "Login to Book"}
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              You won't be charged yet
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeDetailPage;
