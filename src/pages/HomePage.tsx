import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useEffect } from "react";
import InfiniteScrollAnimation from "@/components/ui/InfiniteScrollAnimation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useBikes } from "@/contexts/BikeContext";
import { useShops } from "@/contexts/ShopContext";
import { SearchFilters } from "@/types";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { allBikes } = useBikes();
  const { allShops } = useShops();

  const [location, setLocation] = useState<string>("");
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });

  const handleSearch = () => {
    const filters: SearchFilters = {
      location: location || undefined,
      dateRange: date
        ? {
            startDate: date.from || new Date(),
            endDate: date.to || addDays(date.from || new Date(), 1),
          }
        : undefined,
    };

    const params = new URLSearchParams();
    if (filters.location) params.append("location", filters.location);
    if (filters.dateRange) {
      params.append("startDate", filters.dateRange.startDate.toISOString());
      params.append("endDate", filters.dateRange.endDate.toISOString());
    }

    navigate(`/bikes?${params.toString()}`);
  };

  const bikeTypes = Array.from(new Set(allBikes.map((bike) => bike.type)));

  const featuredShops = [...allShops]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
       <section
  className="relative flex flex-col md:flex-row items-center overflow-hidden min-h-[91vh]"
  style={{
    backgroundImage: "url('/images/bikes/HOME_BG (2).jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  {/* Left Content */}
  <div className="w-full md:w-1/2 px-6 md:px-16 py-10 relative z-10 text-center md:text-left">
    {/* Headline */}
    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
      <span className="text-[#192655]">Own </span>
      <span className="bg-[#FF5F00] bg-clip-text text-transparent">Your Drive</span>
      <br />
      <span className="bg-black bg-clip-text text-[#192655]">AnyWhere !</span>
    </h1>

    {/* Subheadline */}
    <p className="text-lg md:text-2xl text-black mb-8">
      You Don't Need To Own a Vehicles<br />
      <span className="text-black font-medium">To Make Memories</span>
    </p>

    {/* Search Box */}
    <div className="bg-zinc-900/80 backdrop-blur-sm p-4 rounded-xl shadow-2xl max-w-2xl mx-auto md:mx-0">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Date Picker */}
        <div className="md:col-span-7">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left h-12 font-normal bg-zinc-800 text-white border-zinc-600",
                  !date && "text-gray-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
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

        {/* Search Button */}
        <div className="md:col-span-5">
          <Button
            className="w-full h-12 bg-[#FF8000] text-black font-semibold hover:opacity-90 transition"
            onClick={handleSearch}
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </div>
  </div>

  {/* Right Side - Bike Image */}
<div className="w-full md:w-1/2 h-full items-center justify-center relative mt-10 md:mt-0 ">
  {/* Background image */}
  <img
    src="/images/bikes/pngwing.com (10).png"
    alt="Luxury Bike Background"
    className="w-full h-auto object-contain absolute top-20 -left-24 z-0 scale-75 hidden md:flex"
  />

  {/* Foreground image */}
  <img
    src="/images/bikes/pngwing.com (13).png"
    alt="Luxury Bike Foreground"
    className="w-full h-96 object-contain relative z-10 p-10 top-16 left-32 scale-65 mt-24"
  />
</div>
</section>

          {/* Featured Categories */}
        <section className="bg-[#FDFFE0] py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore By Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bikeTypes.slice(0, 4).map((type, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
              >
                <div className="h-48 bg-gray-200">
                  {/* Placeholder for type image */}
                  <div className="w-full h-full flex items-center justify-center bg-brand-blue-100 text-brand-blue-600">
                    <span className="text-lg font-semibold">{type} </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{type}{/*bikes*/}</h3>
                  <p className="text-gray-600 mb-4">Explore our range of {type.toLowerCase()} {/*bikes*/}</p>
                  <Button 
                    variant="outline" 
                    className="w-full bg-orange-500"
                    onClick={() => navigate(`/bikes?type=${type.toLowerCase()}`)}
                  >
                    View All
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
{/*image*/}
<section className="bg-white flex items-center justify-center mt-0 mb-12 px-6">
  <div className="flex flex-col md:flex-row items-center gap-10">
    
    {/* Text Section */}
    <div className="text-center md:text-left">
  {/* Mini Text above DRIVE */}
  <p className="text-sm md:text-base text-gray-500 uppercase tracking-wide">
    Explore the road your way
  </p>

  <h1 className="text-5xl md:text-8xl font-extrabold">
    <span className="text-black">#LETS</span><span className="text-orange-500">DRIVE</span>
  </h1>

  {/* Mini Text above RIDE */}
  <p className="text-sm md:text-base text-gray-500 uppercase tracking-wide pt-12 md:pl-32 pl-0">
    Feel the thrill on two wheels
  </p>
  
  <h1 className="text-5xl md:text-8xl font-extrabold md:pl-32 pl-0">
    <span className="text-black">#LETS</span><span className="text-orange-500">RIDE</span>
  </h1>
</div>


    {/* Image Section */}
    <motion.div
      className="max-w-xs sm:max-w-sm md:max-w-xl -mt-10 md:mt-0"
      initial={{ x: -200, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.5 }}
    >
      <img
        src="/images/bikes/pngwing.com (6).png"
        alt="Car"
        className="w-full h-auto object-contain"
      />
    </motion.div>

  </div>
</section>



{/* How It Works */}

<section className="relative bg-[#FBF4DB] min-h-[600px] w-[95%] py-12 px-4 sm:px-6 md:px-12 mb-12 overflow-hidden rounded-2xl mx-auto">

  {/* Road SVG - shown only on larger screens */}
  <div className="absolute inset-0 z-0 mt-20 hidden sm:block">
    <svg viewBox="0 0 1600 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[500px]">
      <path 
        d="M0,250 
           C200,-100 200,600 400,250 
           C600,-100 600,600 800,250 
           C1000,-100 1000,600 1200,250 
           C1400,-100 1400,600 1600,250" 
        stroke="#000000" 
        strokeWidth="16" 
        fill="none" 
        strokeLinecap="round"
      />
      <path 
        d="M0,250 
           C200,-100 200,600 400,250 
           C600,-100 600,600 800,250 
           C1000,-100 1000,600 1200,250 
           C1400,-100 1400,600 1600,250" 
        stroke="#FCD34D" 
        strokeWidth="4" 
        fill="none" 
        strokeDasharray="20,20"
      />
    </svg>
  </div>

  <div className="relative z-10">
    <div className="text-center mb-20 sm:mb-32">
      <h2 className="text-4xl font-bold text-gray-800">How It Works</h2>
    </div>

    {/* Grid layout on sm+ screens, stacked vertical on mobile */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-10 text-center">

      <div className="flex flex-col items-center px-1 sm:-mt-10 sm:-mr-60">
        <div className="text-orange-500 text-4xl font-bold mb-2">1.</div>
        <h3 className="font-bold text-base mb-1">Find a Bike</h3>
        <p className="text-sm text-gray-600">
          Choose your desired vehicle from<br /> our available options.
        </p>
      </div>

      <div className="flex flex-col items-center px-1 sm:mt-20 sm:-mr-36">
        <div className="text-orange-500 text-4xl font-bold mb-2">2.</div>
        <h3 className="font-bold text-base mb-1">Book Your Ride</h3>
        <p className="text-sm text-gray-600">
          Pick up or get it <br /> delivered to your doorstep.
        </p>
      </div>

      <div className="flex flex-col items-center px-1 sm:-mt-12 sm:-mr-12">
        <div className="text-orange-500 text-4xl font-bold mb-2">3.</div>
        <h3 className="font-bold text-base mb-1">Secure Payment</h3>
        <p className="text-sm text-gray-600">
          Pay easily through our <br /> secure system.
        </p>
      </div>

      <div className="flex flex-col items-center px-1 sm:mt-20 sm:-ml-12">
        <div className="text-orange-500 text-4xl font-bold mb-2">4.</div>
        <h3 className="font-bold text-base mb-1">Shop Pickup</h3>
        <p className="text-sm text-gray-600">
          Pick your vehicle from the <br /> nearest hub.
        </p>
      </div>

      <div className="flex flex-col items-center px-1 sm:-mt-12 sm:-ml-32">
        <div className="text-orange-500 text-4xl font-bold mb-2">5.</div>
        <h3 className="font-bold text-base mb-1">Enjoy Your Ride</h3>
        <p className="text-sm text-gray-600">
          Have a great time with<br /> your rental vehicle.
        </p>
      </div>

      <div className="flex flex-col items-center px-1 sm:mt-16 sm:-ml-60">
        <div className="text-orange-500 text-4xl font-bold mb-2">6.</div>
        <h3 className="font-bold text-base mb-1">Return & Review</h3>
        <p className="text-sm text-gray-600">
          Return the vehicle and leave<br /> your feedback.
        </p>
      </div>
    </div>
  </div>
</section>



{/* CTA Section */}
<section className="py-24 min-h-[500px] text-white relative">
  <div className="absolute inset-0 overflow-hidden">
    <video 
      className="w-full h-full object-cover" 
      autoPlay 
      loop 
      muted 
      playsInline
    >
      <source src="/images/bikes/video2.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div className="absolute inset-0 bg-black/40"></div> 
  </div>

  <div className="container mx-auto px-4 text-center relative z-10">
    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Explore Bangalore?</h2>
    <p className="text-xl mb-8 max-w-2xl mx-auto">
      Book your bike today and experience the city like never before.
    </p>
    <Button   
  size="lg"
  className="bg-orange-500 hover:bg-orange-600 text-white"
  onClick={() => navigate("/bikes")}
>
  Browse Bikes
</Button>
  </div>
</section>
    </div>
  );
};

export default HomePage;

