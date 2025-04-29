
import React, { createContext, useContext, useState, useEffect } from "react";
import { Booking, DateTimeRange, Payment } from "../types";
import { bookings, payments } from "../data/mockData";

interface BookingContextType {
  allBookings: Booking[];
  userBookings: (userId: string) => Booking[];
  shopBookings: (shopId: string) => Booking[];
  bikeBookings: (bikeId: string) => Booking[];
  createBooking: (booking: Omit<Booking, "id" | "createdAt" | "updatedAt" | "status" | "paymentStatus">) => string;
  updateBookingStatus: (bookingId: string, status: Booking["status"]) => boolean;
  cancelBooking: (bookingId: string) => boolean;
  getBookingById: (bookingId: string) => Booking | undefined;
  createPayment: (
    bookingId: string, 
    userId: string, 
    amount: number, 
    paymentDetails?: {
      razorpayPaymentId: string;
      razorpayOrderId: string;
      razorpaySignature: string;
    }
  ) => string | null;
  checkAvailability: (bikeId: string, dateRange: DateTimeRange) => boolean;
}

const BookingContext = createContext<BookingContextType>({} as BookingContextType);

export const useBookings = () => {
  return useContext(BookingContext);
};

// Helper function to save bookings to localStorage
const saveBookingsToStorage = (bookings: Booking[]) => {
  try {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  } catch (error) {
    console.error("Error saving bookings to localStorage:", error);
  }
};

// Helper function to load bookings from localStorage
const loadBookingsFromStorage = (): Booking[] => {
  try {
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      return JSON.parse(storedBookings);
    }
  } catch (error) {
    console.error("Error loading bookings from localStorage:", error);
  }
  return bookings; // Use default bookings if nothing in storage
};

// Helper function to save payments to localStorage
const savePaymentsToStorage = (payments: Payment[]) => {
  try {
    localStorage.setItem('payments', JSON.stringify(payments));
  } catch (error) {
    console.error("Error saving payments to localStorage:", error);
  }
};

// Helper function to load payments from localStorage
const loadPaymentsFromStorage = (): Payment[] => {
  try {
    const storedPayments = localStorage.getItem('payments');
    if (storedPayments) {
      return JSON.parse(storedPayments);
    }
  } catch (error) {
    console.error("Error loading payments from localStorage:", error);
  }
  return payments; // Use default payments if nothing in storage
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allBookings, setAllBookings] = useState<Booking[]>(loadBookingsFromStorage);
  const [allPayments, setAllPayments] = useState<Payment[]>(loadPaymentsFromStorage);

  // Initialize data on mount
  useEffect(() => {
    // If localStorage is empty, save initial data
    if (!localStorage.getItem('bookings')) {
      saveBookingsToStorage(bookings);
    }
    if (!localStorage.getItem('payments')) {
      savePaymentsToStorage(payments);
    }
  }, []);

  // Save bookings and payments to localStorage when they change
  useEffect(() => {
    saveBookingsToStorage(allBookings);
  }, [allBookings]);

  useEffect(() => {
    savePaymentsToStorage(allPayments);
  }, [allPayments]);

  const userBookings = (userId: string) => {
    return allBookings.filter(booking => booking.userId === userId);
  };

  const shopBookings = (shopId: string) => {
    return allBookings.filter(booking => booking.shopId === shopId);
  };

  const bikeBookings = (bikeId: string) => {
    return allBookings.filter(booking => booking.bikeId === bikeId);
  };

  const createBooking = (
    booking: Omit<Booking, "id" | "createdAt" | "updatedAt" | "status" | "paymentStatus">
  ): string => {
    const now = new Date().toISOString();
    const newBooking: Booking = {
      ...booking,
      id: `booking${allBookings.length + 1}`,
      status: "pending",
      paymentStatus: "pending",
      createdAt: now,
      updatedAt: now
    };

    setAllBookings([...allBookings, newBooking]);
    return newBooking.id;
  };

  const updateBookingStatus = (bookingId: string, status: Booking["status"]): boolean => {
    const bookingIndex = allBookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) return false;
    
    const updatedBookings = [...allBookings];
    updatedBookings[bookingIndex] = { 
      ...updatedBookings[bookingIndex], 
      status,
      updatedAt: new Date().toISOString()
    };
    
    setAllBookings(updatedBookings);
    return true;
  };

  const cancelBooking = (bookingId: string): boolean => {
    return updateBookingStatus(bookingId, "cancelled");
  };

  const getBookingById = (bookingId: string): Booking | undefined => {
    return allBookings.find(b => b.id === bookingId);
  };

  const createPayment = (
    bookingId: string, 
    userId: string, 
    amount: number, 
    paymentDetails?: {
      razorpayPaymentId: string;
      razorpayOrderId: string;
      razorpaySignature: string;
    }
  ): string | null => {
    // Check if booking exists
    const booking = allBookings.find(b => b.id === bookingId);
    if (!booking) return null;
    
    const now = new Date().toISOString();
    const newPayment: Payment = {
      id: `payment${allPayments.length + 1}`,
      bookingId,
      userId,
      amount,
      status: paymentDetails ? "completed" : "pending",
      razorpayPaymentId: paymentDetails?.razorpayPaymentId,
      razorpayOrderId: paymentDetails?.razorpayOrderId,
      razorpaySignature: paymentDetails?.razorpaySignature,
      createdAt: now,
      updatedAt: now
    };
    
    setAllPayments([...allPayments, newPayment]);
    
    // Update booking payment status and add payment ID
    const bookingIndex = allBookings.findIndex(b => b.id === bookingId);
    const updatedBookings = [...allBookings];
    updatedBookings[bookingIndex] = { 
      ...updatedBookings[bookingIndex], 
      paymentId: newPayment.id,
      paymentStatus: paymentDetails ? "completed" : "pending",
      status: paymentDetails ? "confirmed" : "pending",
      updatedAt: now
    };
    
    setAllBookings(updatedBookings);
    
    return newPayment.id;
  };

  const checkAvailability = (bikeId: string, dateRange: DateTimeRange): boolean => {
    // Convert dateRange to ISO strings for comparison
    const startDateStr = dateRange.startDate.toISOString();
    const endDateStr = dateRange.endDate.toISOString();
    
    // Check for overlapping bookings
    const overlappingBookings = allBookings.filter(booking => {
      if (booking.bikeId !== bikeId) return false;
      if (booking.status === "cancelled") return false;
      
      // Check if date ranges overlap
      return (
        (startDateStr >= booking.startDate && startDateStr < booking.endDate) ||
        (endDateStr > booking.startDate && endDateStr <= booking.endDate) ||
        (startDateStr <= booking.startDate && endDateStr >= booking.endDate)
      );
    });
    
    return overlappingBookings.length === 0;
  };

  const value = {
    allBookings,
    userBookings,
    shopBookings,
    bikeBookings,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    getBookingById,
    createPayment,
    checkAvailability
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
