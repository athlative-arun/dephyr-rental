
import React, { useState, useEffect } from "react";
import { useBookings } from "@/contexts/BookingContext";
import { useBikes } from "@/contexts/BikeContext";
import { useShops } from "@/contexts/ShopContext";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const AdminAnalyticsPage: React.FC = () => {
  const { allBookings } = useBookings();
  const { allBikes } = useBikes();
  const { allShops } = useShops();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "3m" | "1y">("30d");
  const [selectedShop, setSelectedShop] = useState<string>("all");
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [bookingData, setBookingData] = useState<any[]>([]);
  
  // Calculate the analytics data when dependencies change
  useEffect(() => {
    if (allBookings && allBookings.length > 0) {
      const filtered = getFilteredBookings();
      
      // Calculate time series data for revenue
      setRevenueData(getTimeSeriesData());
      
      // Calculate time series data for bookings
      setBookingData(months.map((month, index) => ({
        name: month,
        bookings: monthlyCounts[index]
      })));
    }
  }, [allBookings, timeRange, selectedShop]);
  
  const getFilteredBookings = () => {
    if (!allBookings || allBookings.length === 0) {
      return [];
    }
    
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "3m":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    return allBookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt);
      const matchesTime = bookingDate >= startDate;
      
      if (selectedShop && selectedShop !== "all") {
        return matchesTime && booking.shopId === selectedShop;
      }
      
      return matchesTime;
    });
  };
  
  const filteredBookings = getFilteredBookings();
  
  // Get monthly booking data
  const currentYear = new Date().getFullYear();
  const monthlyCounts = Array(12).fill(0);
  const monthlyRevenue = Array(12).fill(0);
  
  if (allBookings && allBookings.length > 0) {
    allBookings.forEach(booking => {
      const date = new Date(booking.createdAt);
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        monthlyCounts[month]++;
        monthlyRevenue[month] += booking.totalAmount;
      }
    });
  }
  
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const bookingChartData = months.map((month, index) => ({
    name: month,
    bookings: monthlyCounts[index]
  }));
  
  const revenueChartData = months.map((month, index) => ({
    name: month,
    revenue: monthlyRevenue[index]
  }));
  
  const totalRevenue = filteredBookings
    .filter(b => b.paymentStatus === "completed")
    .reduce((sum, booking) => sum + booking.totalAmount, 0);
  
  const totalBookings = filteredBookings.length;
  
  const avgBookingValue = totalBookings > 0 
    ? Math.round(totalRevenue / totalBookings) 
    : 0;
  
  const completedBookings = filteredBookings.filter(b => b.status === "completed").length;
  const completionRate = totalBookings > 0 
    ? Math.round((completedBookings / totalBookings) * 100) 
    : 0;
  
  const revenueByShop = () => {
    if (!allShops || allShops.length === 0) {
      return [];
    }
    
    const shopRevenue: Record<string, number> = {};
    
    filteredBookings
      .filter(b => b.paymentStatus === "completed")
      .forEach(booking => {
        if (!shopRevenue[booking.shopId]) {
          shopRevenue[booking.shopId] = 0;
        }
        shopRevenue[booking.shopId] += booking.totalAmount;
      });
    
    return Object.entries(shopRevenue).map(([shopId, revenue]) => {
      const shop = allShops.find(s => s.id === shopId);
      return {
        name: shop ? shop.name : "Unknown",
        value: revenue
      };
    }).sort((a, b) => b.value - a.value);
  };
  
  const bookingsByBike = () => {
    if (!allBikes || !filteredBookings || filteredBookings.length === 0) {
      return [];
    }
    
    const bikeBookings: Record<string, number> = {};
    
    filteredBookings.forEach(booking => {
      if (!bikeBookings[booking.bikeId]) {
        bikeBookings[booking.bikeId] = 0;
      }
      bikeBookings[booking.bikeId]++;
    });
    
    return Object.entries(bikeBookings).map(([bikeId, count]) => {
      const bike = allBikes.find(b => b.id === bikeId);
      return {
        name: bike ? bike.name : "Unknown",
        value: count
      };
    }).sort((a, b) => b.value - a.value).slice(0, 5);
  };
  
  const getTimeSeriesData = () => {
    const data: Record<string, number> = {};
    const format = timeRange === "1y" ? "MMM" : "MM/DD";
    
    filteredBookings
      .filter(b => b.paymentStatus === "completed")
      .forEach(booking => {
        const date = new Date(booking.createdAt);
        let key: string;
        
        if (timeRange === "1y") {
          key = date.toLocaleString('default', { month: 'short' });
        } else {
          key = `${date.getMonth() + 1}/${date.getDate()}`;
        }
        
        if (!data[key]) {
          data[key] = 0;
        }
        data[key] += booking.totalAmount;
      });
    
    return Object.entries(data).map(([date, amount]) => ({
      date,
      amount
    }));
  };
  
  const getStatusDistribution = () => {
    const statusCount = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    };
    
    filteredBookings.forEach(booking => {
      statusCount[booking.status]++;
    });
    
    return [
      { name: "Completed", value: statusCount.completed, color: "#10B981" },
      { name: "Confirmed", value: statusCount.confirmed, color: "#3B82F6" },
      { name: "Pending", value: statusCount.pending, color: "#F59E0B" },
      { name: "Cancelled", value: statusCount.cancelled, color: "#EF4444" }
    ];
  };
  
  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"];
  
  const handleExportData = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,User,Bike,Shop,Amount,Status\n";
    
    filteredBookings.forEach(booking => {
      const row = [
        new Date(booking.createdAt).toLocaleDateString(),
        booking.userName,
        booking.bikeName,
        booking.shopName,
        booking.totalAmount,
        booking.status
      ].join(",");
      csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bookings-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <Select value={timeRange} onValueChange={(v: "7d" | "30d" | "3m" | "1y") => setTimeRange(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="3m">Last 3 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full sm:w-48">
            <Select value={selectedShop} onValueChange={setSelectedShop}>
              <SelectTrigger>
                <SelectValue placeholder="All shops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All shops</SelectItem>
                {allShops && allShops.map(shop => (
                  <SelectItem key={shop.id} value={shop.id}>
                    {shop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" className="ml-auto" onClick={handleExportData}>
            <Download size={16} className="mr-2" />
            Export Data
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">₹{totalRevenue.toLocaleString()}</CardTitle>
            <CardDescription>Total Revenue</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{totalBookings}</CardTitle>
            <CardDescription>Total Bookings</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">₹{avgBookingValue.toLocaleString()}</CardTitle>
            <CardDescription>Avg. Booking Value</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{completionRate}%</CardTitle>
            <CardDescription>Completion Rate</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <Tabs defaultValue="revenue">
        <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="shops">Shops</TabsTrigger>
          <TabsTrigger value="bikes">Bikes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>
                Total revenue for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getTimeSeriesData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`₹${value}`, 'Revenue']}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Shop</CardTitle>
                <CardDescription>
                  Total revenue for each shop
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueByShop()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip
                        formatter={(value) => [`₹${value}`, 'Revenue']}
                      />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Booking Status Distribution</CardTitle>
                <CardDescription>
                  Distribution of booking statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getStatusDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {getStatusDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip
                        formatter={(value) => [value, 'Bookings']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Bookings Over Time</CardTitle>
              <CardDescription>
                Number of bookings for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={bookingChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, 'Bookings']} />
                    <Bar dataKey="bookings" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shops">
          <Card>
            <CardHeader>
              <CardTitle>Shop Performance</CardTitle>
              <CardDescription>
                Comparative performance of different shops
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueByShop()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                    <Bar dataKey="value" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bikes">
          <Card>
            <CardHeader>
              <CardTitle>Top Booked Bikes</CardTitle>
              <CardDescription>
                Most popular bikes by number of bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={bookingsByBike()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [value, 'Bookings']}
                    />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalyticsPage;
