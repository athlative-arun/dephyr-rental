
import React, { useState } from "react";
import { useBookings } from "@/contexts/BookingContext";
import { Booking } from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell,
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search, Calendar, AlertTriangle, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
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
  TabsTrigger 
} from "@/components/ui/tabs";

const AdminBookingsPage: React.FC = () => {
  const { allBookings, updateBookingStatus } = useBookings();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewBookingOpen, setIsViewBookingOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Booking["status"]>("pending");
  const [selectedTab, setSelectedTab] = useState("all");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadgeClass = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusBadgeClass = (status: Booking["paymentStatus"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUpdateStatus = () => {
    if (!selectedBooking) return;
    
    const success = updateBookingStatus(selectedBooking.id, selectedStatus);
    
    if (success) {
      setIsUpdateStatusOpen(false);
      setSelectedBooking(null);
      toast({
        title: "Booking status updated",
        description: `The booking has been marked as ${selectedStatus}.`,
      });
    } else {
      toast({
        title: "Error updating booking status",
        variant: "destructive"
      });
    }
  };

  // Filter bookings based on search term and tab
  const filteredBookings = allBookings.filter(booking => {
    const matchesSearch = 
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userPhone.includes(searchTerm) ||
      booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bikeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.includes(searchTerm);
    
    if (selectedTab === "all") return matchesSearch;
    return matchesSearch && booking.status === selectedTab;
  });

  // Count bookings by status
  const pendingCount = allBookings.filter(b => b.status === "pending").length;
  const confirmedCount = allBookings.filter(b => b.status === "confirmed").length;
  const cancelledCount = allBookings.filter(b => b.status === "cancelled").length;
  const completedCount = allBookings.filter(b => b.status === "completed").length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card onClick={() => setSelectedTab("all")} className={`cursor-pointer ${selectedTab === "all" ? "border-primary" : ""}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{allBookings.length}</CardTitle>
            <CardDescription>All Bookings</CardDescription>
          </CardHeader>
        </Card>
        
        <Card onClick={() => setSelectedTab("pending")} className={`cursor-pointer ${selectedTab === "pending" ? "border-primary" : ""}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-yellow-500">{pendingCount}</CardTitle>
            <CardDescription>Pending</CardDescription>
          </CardHeader>
        </Card>
        
        <Card onClick={() => setSelectedTab("confirmed")} className={`cursor-pointer ${selectedTab === "confirmed" ? "border-primary" : ""}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-500">{confirmedCount}</CardTitle>
            <CardDescription>Confirmed</CardDescription>
          </CardHeader>
        </Card>
        
        <Card onClick={() => setSelectedTab("completed")} className={`cursor-pointer ${selectedTab === "completed" ? "border-primary" : ""}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-blue-500">{completedCount}</CardTitle>
            <CardDescription>Completed</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by customer, bike, shop, or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Bike</TableHead>
              <TableHead>Shop</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell>
                  <div className="text-sm">{booking.userName}</div>
                  <div className="text-xs text-gray-500">{booking.userPhone}</div>
                </TableCell>
                <TableCell>{booking.bikeName}</TableCell>
                <TableCell>{booking.shopName}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1 text-gray-400" />
                    <div className="text-xs">
                      <div>{new Date(booking.startDate).toLocaleDateString()}</div>
                      <div>to {new Date(booking.endDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`px-2 py-1 rounded-full text-xs inline-block font-medium ${getStatusBadgeClass(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`px-2 py-1 rounded-full text-xs inline-block font-medium ${getPaymentStatusBadgeClass(booking.paymentStatus)}`}>
                    {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setIsViewBookingOpen(true);
                      }}
                    >
                      <Eye size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setSelectedStatus(booking.status);
                        setIsUpdateStatusOpen(true);
                      }}
                      disabled={booking.status === "completed" || booking.status === "cancelled"}
                    >
                      <Clock size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                  No bookings found. Try adjusting your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* View Booking Dialog */}
      <Dialog open={isViewBookingOpen} onOpenChange={setIsViewBookingOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">Booking #{selectedBooking.id}</h3>
                  <p className="text-sm text-gray-500">Created on {formatDate(selectedBooking.createdAt)}</p>
                </div>
                <div className="flex space-x-2">
                  <div className={`px-2 py-1 rounded-full text-xs inline-block font-medium ${getStatusBadgeClass(selectedBooking.status)}`}>
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs inline-block font-medium ${getPaymentStatusBadgeClass(selectedBooking.paymentStatus)}`}>
                    {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Customer Information</h4>
                    <div className="text-sm space-y-1">
                      <div>Name: {selectedBooking.userName}</div>
                      <div>Phone: {selectedBooking.userPhone}</div>
                      <div>Email: {selectedBooking.userEmail}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Booking Period</h4>
                    <div className="text-sm space-y-1">
                      <div>Start: {formatDate(selectedBooking.startDate)}</div>
                      <div>End: {formatDate(selectedBooking.endDate)}</div>
                      <div>Duration: {selectedBooking.duration} {selectedBooking.duration === 1 ? 'day' : 'days'}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Shop Information</h4>
                    <div className="text-sm space-y-1">
                      <div>{selectedBooking.shopName}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Bike Information</h4>
                    <div className="flex items-start">
                      <div className="h-16 w-16 bg-gray-100 rounded mr-3">
                        {selectedBooking.bikeImage && (
                          <img 
                            src={selectedBooking.bikeImage} 
                            alt={selectedBooking.bikeName} 
                            className="h-16 w-16 object-cover rounded"
                          />
                        )}
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">{selectedBooking.bikeName}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Payment Information</h4>
                    <div className="text-sm space-y-1">
                      <div>Amount: ₹{selectedBooking.totalAmount.toLocaleString()}</div>
                      {selectedBooking.deposit > 0 && (
                        <div>Security Deposit: ₹{selectedBooking.deposit.toLocaleString()}</div>
                      )}
                      {selectedBooking.paymentId && (
                        <div>Payment ID: {selectedBooking.paymentId}</div>
                      )}
                    </div>
                  </div>
                  
                  {selectedBooking.status === "pending" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start">
                      <AlertTriangle size={18} className="text-yellow-500 mr-2 mt-0.5" />
                      <div className="text-sm text-yellow-700">
                        This booking is pending confirmation. Please review and update the status.
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedBooking.status !== "cancelled" && selectedBooking.status !== "completed" && (
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedStatus("cancelled");
                      setIsViewBookingOpen(false);
                      setIsUpdateStatusOpen(true);
                    }}
                  >
                    <XCircle size={16} className="mr-2" />
                    Cancel Booking
                  </Button>
                  
                  {selectedBooking.status === "pending" && (
                    <Button
                      onClick={() => {
                        setSelectedStatus("confirmed");
                        setIsViewBookingOpen(false);
                        setIsUpdateStatusOpen(true);
                      }}
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Confirm Booking
                    </Button>
                  )}
                  
                  {selectedBooking.status === "confirmed" && (
                    <Button
                      onClick={() => {
                        setSelectedStatus("completed");
                        setIsViewBookingOpen(false);
                        setIsUpdateStatusOpen(true);
                      }}
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Mark as Completed
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Booking Status</DialogTitle>
            <DialogDescription>
              Change the status for this booking.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value: Booking["status"]) => setSelectedStatus(value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedStatus === "cancelled" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="flex items-start">
                    <AlertTriangle size={18} className="text-yellow-500 mr-2 mt-0.5" />
                    <div className="text-sm text-yellow-700">
                      <p className="font-medium">Warning: Cancellation</p>
                      <p>This action will cancel the booking. The customer will be notified. This cannot be undone.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStatusOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookingsPage;
