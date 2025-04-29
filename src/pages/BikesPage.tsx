// Full mobile-responsive BikesPage component
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useBikes } from "@/contexts/BikeContext";
import { useShops } from "@/contexts/ShopContext";
import { SearchFilters } from "@/types";
import { toast } from "@/components/ui/use-toast";

const BikesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { allBikes, filteredBikes, filters, setSearchFilters } = useBikes();
  const { allShops } = useShops();
  const searchParams = new URLSearchParams(location.search);

  const [locationFilter, setLocationFilter] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedGearTypes, setSelectedGearTypes] = useState<("manual" | "automatic")[]>([]);
  const [selectedShops, setSelectedShops] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("default");

  const brands = Array.from(new Set((allBikes || []).map(bike => bike.brand)));
  const bikeTypes = ["all", ...Array.from(new Set((allBikes || []).map(bike => bike.type)))]
  const minPrice = allBikes.length > 0 ? Math.min(...allBikes.map(b => b.pricePerDay)) : 0;
  const maxPrice = allBikes.length > 0 ? Math.max(...allBikes.map(b => b.pricePerDay)) : 2000;

  useEffect(() => {
    if (allBikes.length > 0) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [allBikes, minPrice, maxPrice]);

  useEffect(() => {
    const locationParam = searchParams.get("location");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const bikeType = searchParams.get("type");

    if (locationParam) setLocationFilter(locationParam);
    if (startDateParam && endDateParam) {
      try {
        setDateRange({ from: new Date(startDateParam), to: new Date(endDateParam) });
      } catch (err) {
        console.error("Invalid date in URL params", err);
      }
    }
    if (bikeType) setSelectedType(bikeType);

    const initFilters: SearchFilters = {};
    if (locationParam) initFilters.location = locationParam;
    if (startDateParam && endDateParam) {
      try {
        initFilters.dateRange = {
          startDate: new Date(startDateParam),
          endDate: new Date(endDateParam),
        };
      } catch (err) {
        console.error("Invalid date", err);
      }
    }
    if (bikeType) initFilters.type = bikeType;

    if (Object.keys(initFilters).length > 0) setSearchFilters(initFilters);
  }, [searchParams]);

  const applyFilters = () => {
    const newFilters: SearchFilters = {};
    if (locationFilter) newFilters.location = locationFilter;
    if (dateRange?.from) {
      newFilters.dateRange = {
        startDate: dateRange.from,
        endDate: dateRange.to || addDays(dateRange.from, 1),
      };
    }
    if (priceRange[0] !== minPrice || priceRange[1] !== maxPrice) newFilters.priceRange = priceRange;
    if (selectedBrands.length) newFilters.brands = selectedBrands;
    if (selectedGearTypes.length) newFilters.gearTypes = selectedGearTypes;
    if (selectedShops.length) newFilters.shops = selectedShops;
    if (selectedType !== "all") newFilters.type = selectedType;
    if (sortOption !== "default") newFilters.sortBy = sortOption as any;

    setSearchFilters(newFilters);
    toast({ title: "Filters applied", description: `Found ${filteredBikes?.length || 0} bikes matching your criteria` });
  };

  const resetFilters = () => {
    setLocationFilter("");
    setDateRange(undefined);
    setPriceRange([minPrice, maxPrice]);
    setSelectedBrands([]);
    setSelectedGearTypes([]);
    setSelectedShops([]);
    setSelectedType("all");
    setSortOption("default");
    setSearchFilters({});
    toast({ title: "Filters reset", description: "Showing all available bikes" });
  };

  const renderFilters = () => (
    <div className="space-y-6" >
      <div className="space-y-4">
        <h3 className="font-medium">Location</h3>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input className="pl-10" type="text" value={locationFilter} placeholder="Location" onChange={e => setLocationFilter(e.target.value)} />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-medium">Dates</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-full justify-start text-left", !dateRange && "text-muted-foreground")}> <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (dateRange.to ? `${format(dateRange.from, "LLL dd")} - ${format(dateRange.to, "LLL dd")}` : format(dateRange.from, "LLL dd, y")) : "Select dates"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-4">
        <h3 className="font-medium">Price Range (₹/day)</h3>
        <Slider defaultValue={priceRange} min={minPrice} max={maxPrice} step={100} onValueChange={(value) => setPriceRange(value as [number, number])} />
        <div className="flex justify-between text-sm">
          <span>₹{priceRange[0]}</span><span>₹{priceRange[1]}</span>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-medium">Bike Type</h3>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>{bikeTypes.map(type => <SelectItem key={type} value={type}>{type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        <h3 className="font-medium">Brands</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox checked={selectedBrands.includes(brand)} onCheckedChange={(checked) => setSelectedBrands(checked ? [...selectedBrands, brand] : selectedBrands.filter(b => b !== brand))} />
              <label className="text-sm font-medium">{brand}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-medium">Gear Type</h3>
        {["manual", "automatic"].map(gt => (
          <div key={gt} className="flex items-center space-x-2">
            <Checkbox checked={selectedGearTypes.includes(gt as any)} onCheckedChange={(checked) => setSelectedGearTypes(checked ? [...selectedGearTypes, gt as any] : selectedGearTypes.filter(g => g !== gt))} />
            <label className="text-sm font-medium">{gt.charAt(0).toUpperCase() + gt.slice(1)}</label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
  <div className="min-h-screen w-full bg-[#FDFFE0]">
    <div className="container mx-auto px-4 py-8 bg-[#FDFFE0]">
      <h1 className="text-3xl font-bold mb-6">Explore Bikes</h1>

      {/* Mobile filter button */}
      <div className="mb-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <Filter size={16} /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
            <div className="overflow-y-auto h-[calc(100vh-140px)] pr-2">{renderFilters()}</div>
            <SheetFooter className="mt-4">
              <Button onClick={applyFilters} className="w-full bg-[#ff8000]">Apply Filters</Button>
              <Button variant="outline" onClick={resetFilters} className="w-full mt-2">Reset Filters</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col md:flex-row md:gap-0">
        {/* Desktop filters */}
        <div className="hidden md:block w-64 flex-shrink-0 space-y-6 sticky top-24 border-r border-gray-300 pr-4">
          {renderFilters()}
          <div className="pt-4 space-y-4">
            <Button onClick={applyFilters} className="w-full bg-[#ff8000]">Apply Filters</Button>
            <Button variant="outline" onClick={resetFilters} className="w-full">Reset Filters</Button>
          </div>
        </div>
        
        {/* Main Content */}

        <div className="flex-1 md:pl-6">
          <p className="text-gray-600 mb-6">{filteredBikes?.length || 0} {(filteredBikes?.length || 0) === 1 ? "bike" : "bikes"} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {(filteredBikes || []).map((bike) => (
              <div key={bike.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">

                <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-lg font-semibold">{bike.name} Image</span>
                  <div className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded-md text-sm font-medium">{bike.gearType}</div>
                </div>
                <div className="p-4">
                  <hr/>
                  <h3 className="text-lg font-semibold">{bike.name}</h3>
                  <p className="text-gray-600 text-sm">{bike.brand} | {bike.cc}cc</p>
                  <p className="text-gray-600 text-sm mb-2">{useBikes().getShopNameById(bike.shopId)}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {bike.features.slice(0, 3).map((feature, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">{feature}</span>
                    ))}
                    {bike.features.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">+{bike.features.length - 3} more</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-900 font-bold">₹{bike.pricePerDay}<span className="text-gray-600 font-normal text-sm">/day</span></p>
                      <p className="text-gray-600 text-xs">₹{bike.pricePerHour}/hour</p>
                    </div>
                    <Button className="bg-[#ff8000] hover:bg-orange-600" onClick={() => navigate(`/bikes/${bike.id}`)}>View Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(!filteredBikes || filteredBikes.length === 0) && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">No bikes found</h2>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default BikesPage;
