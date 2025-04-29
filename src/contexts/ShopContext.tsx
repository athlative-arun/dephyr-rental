
import React, { createContext, useContext, useState, useEffect } from "react";
import { Shop } from "../types";
import { shops } from "../data/mockData";

interface ShopContextType {
  allShops: Shop[];
  selectedShop: Shop | null;
  selectShop: (shopId: string) => void;
  clearSelectedShop: () => void;
  addShop: (shop: Omit<Shop, "id" | "rating" | "reviewCount">) => void;
  updateShop: (shopId: string, updates: Partial<Shop>) => boolean;
  deleteShop: (shopId: string) => boolean;
}

const ShopContext = createContext<ShopContextType>({} as ShopContextType);

export const useShops = () => {
  return useContext(ShopContext);
};

// Helper function to save shops to localStorage
const saveShopsToStorage = (shops: Shop[]) => {
  try {
    localStorage.setItem('shops', JSON.stringify(shops));
  } catch (error) {
    console.error("Error saving shops to localStorage:", error);
  }
};

// Helper function to load shops from localStorage
const loadShopsFromStorage = (): Shop[] => {
  try {
    const storedShops = localStorage.getItem('shops');
    if (storedShops) {
      return JSON.parse(storedShops);
    }
  } catch (error) {
    console.error("Error loading shops from localStorage:", error);
  }
  return shops; // Use default shops if nothing in storage
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allShops, setAllShops] = useState<Shop[]>(loadShopsFromStorage);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  // Save shops to localStorage when they change
  useEffect(() => {
    saveShopsToStorage(allShops);
  }, [allShops]);

  const selectShop = (shopId: string) => {
    const shop = allShops.find(s => s.id === shopId) || null;
    setSelectedShop(shop);
  };

  const clearSelectedShop = () => {
    setSelectedShop(null);
  };

  const addShop = (shop: Omit<Shop, "id" | "rating" | "reviewCount">) => {
    const newShop: Shop = {
      ...shop,
      id: `shop${allShops.length + 1}`,
      rating: 0,
      reviewCount: 0
    };

    setAllShops([...allShops, newShop]);
  };

  const updateShop = (shopId: string, updates: Partial<Shop>): boolean => {
    const shopIndex = allShops.findIndex(s => s.id === shopId);
    
    if (shopIndex === -1) return false;
    
    const updatedShops = [...allShops];
    updatedShops[shopIndex] = { ...updatedShops[shopIndex], ...updates };
    
    setAllShops(updatedShops);
    
    // Update selected shop if this is the one being edited
    if (selectedShop && selectedShop.id === shopId) {
      setSelectedShop(updatedShops[shopIndex]);
    }
    
    return true;
  };

  const deleteShop = (shopId: string): boolean => {
    const shopIndex = allShops.findIndex(s => s.id === shopId);
    
    if (shopIndex === -1) return false;
    
    const updatedShops = allShops.filter(s => s.id !== shopId);
    setAllShops(updatedShops);
    
    // Clear selected shop if it's the one being deleted
    if (selectedShop && selectedShop.id === shopId) {
      clearSelectedShop();
    }
    
    return true;
  };

  const value = {
    allShops,
    selectedShop,
    selectShop,
    clearSelectedShop,
    addShop,
    updateShop,
    deleteShop
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};
