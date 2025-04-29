
import React, { createContext, useContext, useState, useEffect } from "react";
import { Bike, SearchFilters } from "../types";
import { bikes, shops } from "../data/mockData";

interface BikeContextType {
  allBikes: Bike[];
  filteredBikes: Bike[];
  selectedBike: Bike | null;
  filters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
  selectBike: (bikeId: string) => void;
  clearSelectedBike: () => void;
  getBikesByShop: (shopId: string) => Bike[];
  addBike: (bike: Omit<Bike, "id" | "rating" | "reviewCount">) => void;
  updateBike: (bikeId: string, updates: Partial<Bike>) => boolean;
  deleteBike: (bikeId: string) => boolean;
  getShopNameById: (shopId: string) => string;
}

const BikeContext = createContext<BikeContextType>({} as BikeContextType);

export const useBikes = () => {
  return useContext(BikeContext);
};

// Helper function to save bikes to localStorage
const saveBikesToStorage = (bikes: Bike[]) => {
  try {
    localStorage.setItem('bikes', JSON.stringify(bikes));
  } catch (error) {
    console.error("Error saving bikes to localStorage:", error);
  }
};

// Helper function to load bikes from localStorage
const loadBikesFromStorage = (): Bike[] => {
  try {
    const storedBikes = localStorage.getItem('bikes');
    if (storedBikes) {
      return JSON.parse(storedBikes);
    }
  } catch (error) {
    console.error("Error loading bikes from localStorage:", error);
  }
  return bikes; // Use default bikes if nothing in storage
};

export const BikeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allBikes, setAllBikes] = useState<Bike[]>(loadBikesFromStorage);
  // Initialize filteredBikes with allBikes to prevent undefined
  const [filteredBikes, setFilteredBikes] = useState<Bike[]>(loadBikesFromStorage);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});

  // Save bikes to localStorage when they change
  useEffect(() => {
    saveBikesToStorage(allBikes);
  }, [allBikes]);

  const setSearchFilters = (newFilters: SearchFilters) => {
    console.log("Applying filters:", newFilters);
    setFilters(newFilters);

    // Always start with all bikes when applying new filters
    let filtered = [...allBikes];
    
    // Apply each filter sequentially
    
    // Apply location filter (shop area)
    if (newFilters.location && newFilters.location.trim() !== '') {
      const shopIds = shops
        .filter(shop => 
          shop.area.toLowerCase().includes(newFilters.location!.toLowerCase()) ||
          shop.city.toLowerCase().includes(newFilters.location!.toLowerCase())
        )
        .map(shop => shop.id);
      
      if (shopIds.length > 0) {
        filtered = filtered.filter(bike => shopIds.includes(bike.shopId));
        console.log("After location filter:", filtered.length, "bikes");
      }
    }

    // Apply date range filter (in a real app, this would check bike availability)
    if (newFilters.dateRange) {
      // We'd check booking data here, but for demo we'll just use all bikes
      filtered = filtered.filter(bike => bike.isAvailable);
      console.log("After date filter:", filtered.length, "bikes");
    }

    // Apply price range filter
    if (newFilters.priceRange && newFilters.priceRange.length === 2) {
      const [min, max] = newFilters.priceRange;
      if (min !== undefined && max !== undefined) {
        filtered = filtered.filter(
          bike => bike.pricePerDay >= min && bike.pricePerDay <= max
        );
        console.log("After price filter:", filtered.length, "bikes, range:", min, "-", max);
      }
    }

    // Apply brand filter
    if (newFilters.brands && newFilters.brands.length > 0) {
      filtered = filtered.filter(bike => newFilters.brands?.includes(bike.brand));
      console.log("After brand filter:", filtered.length, "bikes, brands:", newFilters.brands);
    }

    // Apply gear type filter
    if (newFilters.gearTypes && newFilters.gearTypes.length > 0) {
      filtered = filtered.filter(bike => newFilters.gearTypes?.includes(bike.gearType));
      console.log("After gear type filter:", filtered.length, "bikes, types:", newFilters.gearTypes);
    }

    // Apply shops filter
    if (newFilters.shops && newFilters.shops.length > 0) {
      filtered = filtered.filter(bike => newFilters.shops?.includes(bike.shopId));
      console.log("After shops filter:", filtered.length, "bikes, shops:", newFilters.shops);
    }

    // Apply type filter
    if (newFilters.type && newFilters.type !== "all") {
      filtered = filtered.filter(bike => bike.type.toLowerCase() === newFilters.type!.toLowerCase());
      console.log("After type filter:", filtered.length, "bikes, type:", newFilters.type);
    }

    // Apply sorting
    if (newFilters.sortBy) {
      switch (newFilters.sortBy) {
        case "price-low-to-high":
          filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
          break;
        case "price-high-to-low":
          filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
          break;
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
      }
      console.log("After sorting:", filtered.length, "bikes, sort:", newFilters.sortBy);
    }

    console.log("Final filtered bikes:", filtered.length);
    setFilteredBikes(filtered);
  };

  const selectBike = (bikeId: string) => {
    const bike = allBikes.find(b => b.id === bikeId) || null;
    setSelectedBike(bike);
  };

  const clearSelectedBike = () => {
    setSelectedBike(null);
  };

  const getBikesByShop = (shopId: string) => {
    return allBikes.filter(bike => bike.shopId === shopId);
  };

  const addBike = (bike: Omit<Bike, "id" | "rating" | "reviewCount">) => {
    const newBike: Bike = {
      ...bike,
      id: `bike${allBikes.length + 1}`,
      rating: 0,
      reviewCount: 0
    };

    const updatedBikes = [...allBikes, newBike];
    setAllBikes(updatedBikes);
    
    // Apply current filters to ensure UI updates
    setSearchFilters(filters);
  };

  const updateBike = (bikeId: string, updates: Partial<Bike>): boolean => {
    const bikeIndex = allBikes.findIndex(b => b.id === bikeId);
    
    if (bikeIndex === -1) return false;
    
    const updatedBikes = [...allBikes];
    updatedBikes[bikeIndex] = { ...updatedBikes[bikeIndex], ...updates };
    
    setAllBikes(updatedBikes);
    
    // Update selected bike if this is the one being edited
    if (selectedBike && selectedBike.id === bikeId) {
      setSelectedBike(updatedBikes[bikeIndex]);
    }
    
    // Reapply current filters to update filtered bikes
    setSearchFilters(filters);
    
    return true;
  };

  const deleteBike = (bikeId: string): boolean => {
    const bikeIndex = allBikes.findIndex(b => b.id === bikeId);
    
    if (bikeIndex === -1) return false;
    
    const updatedBikes = allBikes.filter(b => b.id !== bikeId);
    setAllBikes(updatedBikes);
    
    // Clear selected bike if it's the one being deleted
    if (selectedBike && selectedBike.id === bikeId) {
      clearSelectedBike();
    }
    
    // Reapply current filters
    setSearchFilters(filters);
    
    return true;
  };

  const getShopNameById = (shopId: string): string => {
    const shop = shops.find(s => s.id === shopId);
    return shop ? shop.name : "Unknown Shop";
  };

  const value = {
    allBikes,
    filteredBikes,
    selectedBike,
    filters,
    setSearchFilters,
    selectBike,
    clearSelectedBike,
    getBikesByShop,
    addBike,
    updateBike,
    deleteBike,
    getShopNameById
  };

  return (
    <BikeContext.Provider value={value}>
      {children}
    </BikeContext.Provider>
  );
};
