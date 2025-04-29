import React, { createContext, useContext, useState } from "react";
import { Review } from "../types";
import { reviews } from "../data/mockData";

interface ReviewContextType {
  allReviews: Review[];
  userReviews: (userId: string) => Review[];
  bikeReviews: (bikeId: string) => Review[];
  shopReviews: (shopId: string) => Review[];
  addReview: (review: Omit<Review, "id" | "createdAt">) => void;
  updateReview: (reviewId: string, updates: Partial<Review>) => boolean;
  deleteReview: (reviewId: string) => boolean;
  getAverageRating: (type: "bike" | "shop", id: string) => number;
}

const ReviewContext = createContext<ReviewContextType>({} as ReviewContextType);

export const useReviews = () => {
  return useContext(ReviewContext);
};

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allReviews, setAllReviews] = useState<Review[]>(reviews);

  const userReviews = (userId: string) => {
    return allReviews.filter(review => review.userId === userId);
  };

  const bikeReviews = (bikeId: string) => {
    return allReviews.filter(review => review.bikeId === bikeId);
  };

  const shopReviews = (shopId: string) => {
    return allReviews.filter(review => review.shopId === shopId);
  };

  const addReview = (review: Omit<Review, "id" | "createdAt">) => {
    const newReview: Review = {
      ...review,
      id: `review${allReviews.length + 1}`,
      createdAt: new Date().toISOString()
    };

    setAllReviews([...allReviews, newReview]);
  };

  const updateReview = (reviewId: string, updates: Partial<Review>): boolean => {
    const reviewIndex = allReviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex === -1) return false;
    
    const updatedReviews = [...allReviews];
    updatedReviews[reviewIndex] = { ...updatedReviews[reviewIndex], ...updates };
    
    setAllReviews(updatedReviews);
    return true;
  };

  const deleteReview = (reviewId: string): boolean => {
    const reviewIndex = allReviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex === -1) return false;
    
    const updatedReviews = allReviews.filter(r => r.id !== reviewId);
    setAllReviews(updatedReviews);
    
    return true;
  };

  const getAverageRating = (type: "bike" | "shop", id: string): number => {
    let filteredReviews: Review[];
    
    if (type === "bike") {
      filteredReviews = allReviews.filter(r => r.bikeId === id);
    } else {
      filteredReviews = allReviews.filter(r => r.shopId === id);
    }
    
    if (filteredReviews.length === 0) return 0;
    
    const sum = filteredReviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / filteredReviews.length).toFixed(1));
  };

  const value = {
    allReviews,
    userReviews,
    bikeReviews,
    shopReviews,
    addReview,
    updateReview,
    deleteReview,
    getAverageRating
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};
