
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Search, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useShops } from "@/contexts/ShopContext";
import { toast } from "@/components/ui/use-toast";

const ShopsPage: React.FC = () => {
  const navigate = useNavigate();
  const { allShops } = useShops();
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [filteredShops, setFilteredShops] = useState(allShops);
  
  // Get unique areas for filter
  const areas = Array.from(new Set(allShops.map(shop => shop.area)));
  
  useEffect(() => {
    let filtered = [...allShops];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(shop => 
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply area filter - update to check for "all" value
    if (selectedArea && selectedArea !== "all") {
      filtered = filtered.filter(shop => shop.area === selectedArea);
    }
    
    setFilteredShops(filtered);
  }, [searchTerm, selectedArea, allShops]);
  
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedArea("all"); // Set to "all" instead of empty string
    toast({
      title: "Filters cleared",
      description: "Showing all shops",
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Rental Shops in Bangalore</h1>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search shops by name, area, or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="w-full md:w-64">
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {areas.map((area) => (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" onClick={handleClearFilters} className="flex items-center gap-2">
          <FilterX size={16} />
          Clear Filters
        </Button>
      </div>
      
      {/* Shop Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShops.map((shop) => (
          <div key={shop.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gray-200">
              {/* Shop image placeholder */}
              <div className="w-full h-full flex items-center justify-center bg-brand-green-100 text-brand-green-600">
                <span className="text-lg font-semibold">{shop.name} Image</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{shop.name}</h3>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>{shop.rating.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="text-sm">{shop.area}, {shop.city}</span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{shop.description}</p>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <span>{shop.openingTime} - {shop.closingTime}</span>
                </div>
                <Button onClick={() => navigate(`/shops/${shop.id}`)}>
                  View Bikes
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* No Results */}
      {filteredShops.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No shops found</h2>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          <Button 
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShopsPage;
