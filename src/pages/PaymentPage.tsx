
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useBookings } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const PaymentPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { getBookingById, createPayment } = useBookings();
  const { isLoggedIn, currentUser } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  
  const booking = bookingId ? getBookingById(bookingId) : undefined;
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/payment/${bookingId}` } });
      return;
    }
    
    if (!booking) {
      toast({
        title: "Booking not found",
        description: "The booking you're trying to pay for could not be found.",
        variant: "destructive",
      });
      navigate("/dashboard/bookings");
      return;
    }
  }, [isLoggedIn, booking, bookingId, navigate]);

  // Razorpay implementation
  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!booking || !currentUser) return;
    
    setIsLoading(true);
    
    const res = await initializeRazorpay();
    
    if (!res) {
      toast({
        title: "Payment failed",
        description: "Razorpay SDK failed to load. Please try again later.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // In a real implementation, you would create an order on your backend
    // For this demo, we'll generate a static order
    const options = {
      key: "rzp_test_AJ6goSYtjPmvJ5", // Your Razorpay Key ID
      amount: (booking.totalAmount + booking.deposit) * 100, // Amount in paisa
      currency: "INR",
      name: "Bangalore Wheels",
      description: `Bike rental payment for ${booking.bikeName}`,
      image: "/logo.svg",
      order_id: `order_${Date.now()}`, // In a real implementation, this would come from your backend
      handler: function (response: any) {
        // Handle payment success
        const paymentDetails = {
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };
        
        // Create payment record
        const paymentId = createPayment(
          booking.id,
          currentUser.id,
          booking.totalAmount + booking.deposit,
          paymentDetails
        );
        
        if (paymentId) {
          toast({
            title: "Payment successful",
            description: "Your booking has been confirmed.",
          });
          navigate(`/payment-success/${booking.id}`);
        } else {
          toast({
            title: "Payment processing error",
            description: "There was an error processing your payment. Please contact support.",
            variant: "destructive",
          });
        }
      },
      prefill: {
        name: currentUser.name,
        email: currentUser.email,
        contact: currentUser.phone,
      },
      notes: {
        booking_id: booking.id,
        bike_name: booking.bikeName,
        shop_name: booking.shopName,
      },
      theme: {
        color: "#0066C1",
      },
    };
    
    const razorpay = new (window as any).Razorpay(options);
    razorpay.on("payment.failed", function (response: any) {
      toast({
        title: "Payment failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
      console.error("Payment failed:", response.error);
    });
    
    razorpay.open();
    setIsLoading(false);
  };
  
  if (!booking || !isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading payment details...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
              
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 bg-gray-200 rounded-md mr-4">
                  {/* Bike image placeholder */}
                  <div className="w-full h-full flex items-center justify-center bg-brand-blue-100 text-brand-blue-600 rounded-md">
                    <span className="font-semibold">Bike</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">{booking.bikeName}</h3>
                  <p className="text-sm text-gray-600">{booking.shopName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm text-gray-600">Pickup Date</label>
                  <p className="font-medium">{format(new Date(booking.startDate), "dd MMM yyyy, HH:mm")}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Return Date</label>
                  <p className="font-medium">{format(new Date(booking.endDate), "dd MMM yyyy, HH:mm")}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Duration</label>
                  <p className="font-medium">{booking.duration} hours</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Booking ID</label>
                  <p className="font-medium">{booking.id}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rental charges</span>
                  <span>₹{booking.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Security deposit (refundable)</span>
                  <span>₹{booking.deposit}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total amount</span>
                  <span>₹{booking.totalAmount + booking.deposit}</span>
                </div>
              </div>
            </div>
            
            {/* Personal Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={currentUser?.name || ""}
                      disabled
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={currentUser?.email || ""}
                      disabled
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={currentUser?.phone || ""}
                    disabled
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Summary */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{booking.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Security deposit</span>
                  <span>₹{booking.deposit}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{booking.totalAmount + booking.deposit}</span>
                </div>
              </div>
              
              <Button
                className="w-full mb-4"
                size="lg"
                disabled={isLoading}
                onClick={handlePayment}
              >
                {isLoading ? "Processing..." : "Pay Now"}
              </Button>
              
              <div className="text-xs text-gray-500 text-center">
                <p>By proceeding, you agree to our <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.</p>
              </div>
              
              <div className="flex justify-center items-center mt-4 space-x-2">
                <span className="text-xs text-gray-500">Powered by</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="12" viewBox="0 0 60 12" fill="none">
                  <path d="M14.8 1.5H11.7V10.5H14.8C17.6 10.5 19.3 8.7 19.3 6C19.3 3.3 17.6 1.5 14.8 1.5ZM14.8 8.3H14V3.7H14.8C16.3 3.7 17 4.6 17 6C17 7.4 16.3 8.3 14.8 8.3Z" fill="#072654"/>
                  <path d="M26.7 5.7C25.4 5.3 25 5.1 25 4.6C25 4.1 25.4 3.8 26.1 3.8C26.9 3.8 27.7 4.2 28.1 4.5L29 2.9C28.3 2.3 27.2 1.9 26.1 1.9C24.3 1.9 22.9 3 22.9 4.7C22.9 6.3 23.9 7 25.6 7.5C26.9 7.9 27.3 8.1 27.3 8.6C27.3 9.1 26.8 9.5 26 9.5C25 9.5 24.1 9 23.6 8.5L22.6 10.1C23.4 10.9 24.6 11.3 26 11.3C28 11.3 29.4 10.1 29.4 8.5C29.4 6.8 28.4 6.2 26.7 5.7Z" fill="#072654"/>
                  <path d="M58.6 5.7C57.3 5.3 56.9 5.1 56.9 4.6C56.9 4.1 57.3 3.8 58 3.8C58.8 3.8 59.6 4.2 60 4.5L60.9 2.9C60.2 2.3 59.1 1.9 58 1.9C56.2 1.9 54.8 3 54.8 4.7C54.8 6.3 55.8 7 57.5 7.5C58.8 7.9 59.2 8.1 59.2 8.6C59.2 9.1 58.7 9.5 57.9 9.5C56.9 9.5 56 9 55.5 8.5L54.5 10.1C55.3 10.9 56.5 11.3 57.9 11.3C59.9 11.3 61.3 10.1 61.3 8.5C61.3 6.8 60.3 6.2 58.6 5.7Z" fill="#072654"/>
                  <path d="M35.2 1.9C33.1 1.9 31.6 3.5 31.6 5.7V10.5H33.7V7.9H37.6V10.5H39.7V5.7C39.7 3.5 38.2 1.9 36.1 1.9H35.2ZM37.6 6H33.7V5.7C33.7 4.5 34.3 3.7 35.6 3.7H36.1C37.4 3.7 38 4.5 38 5.7V6H37.6Z" fill="#072654"/>
                  <path d="M46.8 1.9C44.5 1.9 42.8 3.6 42.8 6.5C42.8 9.4 44.5 11.1 46.8 11.1H47.2C49.5 11.1 51.2 9.4 51.2 6.5C51.2 3.6 49.5 1.9 47.2 1.9H46.8ZM46.8 9.1H47.2C48.2 9.1 49 8.2 49 6.5C49 4.8 48.2 3.9 47.2 3.9H46.8C45.8 3.9 45 4.8 45 6.5C45 8.2 45.8 9.1 46.8 9.1Z" fill="#072654"/>
                  <path d="M7.3 1.9C5 1.9 3.3 3.6 3.3 6.5C3.3 9.4 5 11.1 7.3 11.1H7.7C10 11.1 11.7 9.4 11.7 6.5C11.7 3.6 10 1.9 7.7 1.9H7.3ZM7.3 9.1H7.7C8.7 9.1 9.5 8.2 9.5 6.5C9.5 4.8 8.7 3.9 7.7 3.9H7.3C6.3 3.9 5.5 4.8 5.5 6.5C5.5 8.2 6.3 9.1 7.3 9.1Z" fill="#3395FF"/>
                  <path d="M0 1.5V10.5H2.1V1.5H0Z" fill="#3395FF"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
