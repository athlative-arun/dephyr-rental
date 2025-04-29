
import React, { useState } from "react";
import { useShops } from "@/contexts/ShopContext";
import { Shop } from "@/types";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Edit, Trash2, Store, Eye, MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const AdminShopsPage: React.FC = () => {
  const { allShops, addShop, updateShop, deleteShop } = useShops();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isAddShopOpen, setIsAddShopOpen] = useState(false);
  const [isEditShopOpen, setIsEditShopOpen] = useState(false);
  const [isDeleteShopOpen, setIsDeleteShopOpen] = useState(false);
  const [isViewShopOpen, setIsViewShopOpen] = useState(false);

  const [newShop, setNewShop] = useState<Partial<Shop>>({
    name: "",
    address: "",
    city: "Bangalore",
    area: "",
    pincode: "",
    phone: "",
    email: "",
    description: "",
    openingTime: "09:00",
    closingTime: "18:00",
    images: [],
    isActive: true,
    latitude: 12.9716,
    longitude: 77.5946
  });

  const filteredShops = allShops.filter(shop => 
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddShop = () => {
    if (!newShop.name || !newShop.address || !newShop.area || !newShop.phone) {
      toast({
        title: "Required fields are missing",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    addShop({
      name: newShop.name || "",
      address: newShop.address || "",
      city: newShop.city || "Bangalore",
      area: newShop.area || "",
      pincode: newShop.pincode || "",
      phone: newShop.phone || "",
      email: newShop.email || "",
      description: newShop.description || "",
      openingTime: newShop.openingTime || "09:00",
      closingTime: newShop.closingTime || "18:00",
      images: newShop.images || [],
      isActive: newShop.isActive !== undefined ? newShop.isActive : true,
      latitude: newShop.latitude || 12.9716,
      longitude: newShop.longitude || 77.5946
    });
    
    setNewShop({
      name: "",
      address: "",
      city: "Bangalore",
      area: "",
      pincode: "",
      phone: "",
      email: "",
      description: "",
      openingTime: "09:00",
      closingTime: "18:00",
      images: [],
      isActive: true,
      latitude: 12.9716,
      longitude: 77.5946
    });
    
    setIsAddShopOpen(false);
    
    toast({
      title: "Shop added successfully",
    });
  };

  const handleUpdateShop = () => {
    if (!selectedShop) return;
    
    const success = updateShop(selectedShop.id, selectedShop);
    
    if (success) {
      setIsEditShopOpen(false);
      toast({
        title: "Shop updated successfully",
      });
    } else {
      toast({
        title: "Error updating shop",
        variant: "destructive"
      });
    }
  };

  const handleDeleteShop = () => {
    if (!selectedShop) return;
    
    const success = deleteShop(selectedShop.id);
    
    if (success) {
      setIsDeleteShopOpen(false);
      toast({
        title: "Shop deleted successfully",
      });
    } else {
      toast({
        title: "Error deleting shop",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Rental Shops</h1>
        
        <Dialog open={isAddShopOpen} onOpenChange={setIsAddShopOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Store size={16} />
              Add Shop
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Rental Shop</DialogTitle>
              <DialogDescription>
                Enter the details for the new rental shop.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-0 py-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Shop Name*</Label>
                  <Input
                    id="name"
                    value={newShop.name}
                    onChange={(e) => setNewShop({...newShop, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area*</Label>
                  <Input
                    id="area"
                    value={newShop.area}
                    onChange={(e) => setNewShop({...newShop, area: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address*</Label>
                <Input
                  id="address"
                  value={newShop.address}
                  onChange={(e) => setNewShop({...newShop, address: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newShop.city}
                    onChange={(e) => setNewShop({...newShop, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input
                    id="pincode"
                    value={newShop.pincode}
                    onChange={(e) => setNewShop({...newShop, pincode: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number*</Label>
                  <Input
                    id="phone"
                    value={newShop.phone}
                    onChange={(e) => setNewShop({...newShop, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newShop.email}
                    onChange={(e) => setNewShop({...newShop, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openingTime">Opening Time</Label>
                  <Input
                    id="openingTime"
                    type="time"
                    value={newShop.openingTime}
                    onChange={(e) => setNewShop({...newShop, openingTime: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closingTime">Closing Time</Label>
                  <Input
                    id="closingTime"
                    type="time"
                    value={newShop.closingTime}
                    onChange={(e) => setNewShop({...newShop, closingTime: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newShop.description}
                  onChange={(e) => setNewShop({...newShop, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isActive" 
                  checked={newShop.isActive}
                  onCheckedChange={(checked) => 
                    setNewShop({...newShop, isActive: checked as boolean})
                  }
                />
                <Label htmlFor="isActive">Shop is active and ready for bookings</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddShop}>Add Shop</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search shops by name, area, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShops.map((shop) => (
              <TableRow key={shop.id}>
                <TableCell className="font-medium">{shop.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1 text-gray-400" />
                    {shop.area}, {shop.city}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <div className="flex items-center">
                      <Phone size={14} className="mr-1 text-gray-400" />
                      {shop.phone}
                    </div>
                    <div className="flex items-center">
                      <Mail size={14} className="mr-1 text-gray-400" />
                      {shop.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1 text-gray-400" />
                    {shop.openingTime} - {shop.closingTime}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`px-2 py-1 rounded-full text-xs inline-block font-medium ${
                    shop.isActive 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {shop.isActive ? "Active" : "Inactive"}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedShop(shop);
                        setIsViewShopOpen(true);
                      }}
                    >
                      <Eye size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedShop(shop);
                        setIsEditShopOpen(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setSelectedShop(shop);
                        setIsDeleteShopOpen(true);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredShops.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No shops found. Try adjusting your search or add a new shop.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* View Shop Dialog */}
      <Dialog open={isViewShopOpen} onOpenChange={setIsViewShopOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Shop Details</DialogTitle>
          </DialogHeader>
          {selectedShop && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedShop.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin size={14} className="mr-1" />
                    {selectedShop.area}, {selectedShop.city}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Address</h4>
                  <p className="text-sm">{selectedShop.address}, {selectedShop.pincode}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Contact</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center">
                      <Phone size={14} className="mr-1 text-gray-400" />
                      {selectedShop.phone}
                    </div>
                    <div className="flex items-center">
                      <Mail size={14} className="mr-1 text-gray-400" />
                      {selectedShop.email}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Working Hours</h4>
                  <div className="flex items-center text-sm">
                    <Clock size={14} className="mr-1 text-gray-400" />
                    {selectedShop.openingTime} - {selectedShop.closingTime}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Status</h4>
                  <div className={`px-2 py-1 rounded-full text-xs inline-block font-medium ${
                    selectedShop.isActive 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {selectedShop.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm">{selectedShop.description}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Ratings</h4>
                  <div className="flex items-center">
                    <div className="flex text-amber-400">
                      {Array(5).fill(0).map((_, i) => (
                        <svg 
                          key={i}
                          className={`h-4 w-4 ${i < Math.round(selectedShop.rating) ? "fill-current" : "stroke-current fill-none"}`}
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm">
                      {selectedShop.rating}/5 ({selectedShop.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                
                {selectedShop.images && selectedShop.images.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Shop Images</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedShop.images.map((image, index) => (
                        <div key={index} className="aspect-video bg-gray-100 rounded overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${selectedShop.name} ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Shop Dialog */}
      <Dialog open={isEditShopOpen} onOpenChange={setIsEditShopOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Shop</DialogTitle>
            <DialogDescription>
              Update shop details.
            </DialogDescription>
          </DialogHeader>
          {selectedShop && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Shop Name*</Label>
                  <Input
                    id="edit-name"
                    value={selectedShop.name}
                    onChange={(e) => setSelectedShop({...selectedShop, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-area">Area*</Label>
                  <Input
                    id="edit-area"
                    value={selectedShop.area}
                    onChange={(e) => setSelectedShop({...selectedShop, area: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address*</Label>
                <Input
                  id="edit-address"
                  value={selectedShop.address}
                  onChange={(e) => setSelectedShop({...selectedShop, address: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    value={selectedShop.city}
                    onChange={(e) => setSelectedShop({...selectedShop, city: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pincode">PIN Code</Label>
                  <Input
                    id="edit-pincode"
                    value={selectedShop.pincode}
                    onChange={(e) => setSelectedShop({...selectedShop, pincode: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone Number*</Label>
                  <Input
                    id="edit-phone"
                    value={selectedShop.phone}
                    onChange={(e) => setSelectedShop({...selectedShop, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedShop.email}
                    onChange={(e) => setSelectedShop({...selectedShop, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-openingTime">Opening Time</Label>
                  <Input
                    id="edit-openingTime"
                    type="time"
                    value={selectedShop.openingTime}
                    onChange={(e) => setSelectedShop({...selectedShop, openingTime: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-closingTime">Closing Time</Label>
                  <Input
                    id="edit-closingTime"
                    type="time"
                    value={selectedShop.closingTime}
                    onChange={(e) => setSelectedShop({...selectedShop, closingTime: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedShop.description}
                  onChange={(e) => setSelectedShop({...selectedShop, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="edit-isActive" 
                  checked={selectedShop.isActive}
                  onCheckedChange={(checked) => 
                    setSelectedShop({...selectedShop, isActive: checked as boolean})
                  }
                />
                <Label htmlFor="edit-isActive">Shop is active and ready for bookings</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleUpdateShop}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Shop Dialog */}
      <Dialog open={isDeleteShopOpen} onOpenChange={setIsDeleteShopOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this shop? All associated bikes and bookings will also be affected. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteShopOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteShop}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminShopsPage;
