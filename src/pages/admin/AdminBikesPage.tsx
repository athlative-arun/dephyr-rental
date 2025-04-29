
import React, { useState } from "react";
import { useBikes } from "@/contexts/BikeContext";
import { useShops } from "@/contexts/ShopContext";
import { Bike } from "@/types";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Edit, Trash2, Plus, Eye, Store, Calendar } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const AdminBikesPage: React.FC = () => {
  const { allBikes, addBike, updateBike, deleteBike, getShopNameById } = useBikes();
  const { allShops } = useShops();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [isAddBikeOpen, setIsAddBikeOpen] = useState(false);
  const [isEditBikeOpen, setIsEditBikeOpen] = useState(false);
  const [isDeleteBikeOpen, setIsDeleteBikeOpen] = useState(false);
  const [isViewBikeOpen, setIsViewBikeOpen] = useState(false);

  const [newBike, setNewBike] = useState<Partial<Bike>>({
    name: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    type: "standard",
    cc: 0,
    gearType: "manual",
    pricePerHour: 0,
    pricePerDay: 0,
    deposit: 0,
    description: "",
    images: [],
    features: [],
    shopId: "",
    isAvailable: true
  });

  const filteredBikes = allBikes.filter(bike => 
    bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bike.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bike.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getShopNameById(bike.shopId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const bikeTypes = ["standard", "sports", "cruiser", "adventure", "scooter", "electric"];

  const handleAddBike = () => {
    if (!newBike.name || !newBike.brand || !newBike.shopId || !newBike.pricePerDay) {
      toast({
        title: "Required fields are missing",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    let featuresArray: string[] = [];
    if (typeof newBike.features === 'string') {
      featuresArray = (newBike.features as string).split(',').map(f => f.trim());
    } else if (Array.isArray(newBike.features)) {
      featuresArray = newBike.features;
    }

    addBike({
      name: newBike.name,
      brand: newBike.brand,
      model: newBike.model || "",
      year: newBike.year || new Date().getFullYear(),
      type: newBike.type || "standard",
      cc: newBike.cc || 0,
      gearType: newBike.gearType || "manual",
      pricePerHour: newBike.pricePerHour || 0,
      pricePerDay: newBike.pricePerDay || 0,
      deposit: newBike.deposit || 0,
      description: newBike.description || "",
      images: newBike.images || [],
      features: featuresArray,
      shopId: newBike.shopId!,
      isAvailable: newBike.isAvailable !== undefined ? newBike.isAvailable : true
    });
    
    setNewBike({
      name: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      type: "standard",
      cc: 0,
      gearType: "manual",
      pricePerHour: 0,
      pricePerDay: 0,
      deposit: 0,
      description: "",
      images: [],
      features: [],
      shopId: "",
      isAvailable: true
    });
    
    setIsAddBikeOpen(false);
    
    toast({
      title: "Bike added successfully",
    });
  };

  const handleUpdateBike = () => {
    if (!selectedBike) return;
    
    let featuresArray: string[] = [];
    if (typeof selectedBike.features === 'string') {
      featuresArray = (selectedBike.features as unknown as string).split(',').map(f => f.trim());
      selectedBike.features = featuresArray;
    } else {
      featuresArray = selectedBike.features;
    }
    
    const success = updateBike(selectedBike.id, {
      ...selectedBike,
      features: featuresArray
    });
    
    if (success) {
      setIsEditBikeOpen(false);
      toast({
        title: "Bike updated successfully",
      });
    } else {
      toast({
        title: "Error updating bike",
        variant: "destructive"
      });
    }
  };

  const handleDeleteBike = () => {
    if (!selectedBike) return;
    
    const success = deleteBike(selectedBike.id);
    
    if (success) {
      setIsDeleteBikeOpen(false);
      toast({
        title: "Bike deleted successfully",
      });
    } else {
      toast({
        title: "Error deleting bike",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Bikes</h1>
        
        <Dialog open={isAddBikeOpen} onOpenChange={setIsAddBikeOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Bike
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Bike</DialogTitle>
              <DialogDescription>
                Enter the details for the new bike.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-0 py-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Bike Name*</Label>
                  <Input
                    id="name"
                    value={newBike.name}
                    onChange={(e) => setNewBike({...newBike, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand*</Label>
                  <Input
                    id="brand"
                    value={newBike.brand}
                    onChange={(e) => setNewBike({...newBike, brand: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={newBike.model}
                    onChange={(e) => setNewBike({...newBike, model: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={newBike.year}
                    onChange={(e) => setNewBike({...newBike, year: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cc">Engine CC</Label>
                  <Input
                    id="cc"
                    type="number"
                    value={newBike.cc}
                    onChange={(e) => setNewBike({...newBike, cc: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newBike.type}
                    onValueChange={(value) => setNewBike({...newBike, type: value})}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select bike type" />
                    </SelectTrigger>
                    <SelectContent>
                      {bikeTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gearType">Gear Type</Label>
                  <Select
                    value={newBike.gearType}
                    onValueChange={(value: "manual" | "automatic") => setNewBike({...newBike, gearType: value})}
                  >
                    <SelectTrigger id="gearType">
                      <SelectValue placeholder="Select gear type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatic">Automatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricePerHour">Hourly Price (₹)</Label>
                  <Input
                    id="pricePerHour"
                    type="number"
                    value={newBike.pricePerHour}
                    onChange={(e) => setNewBike({...newBike, pricePerHour: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricePerDay">Daily Price (₹)*</Label>
                  <Input
                    id="pricePerDay"
                    type="number"
                    value={newBike.pricePerDay}
                    onChange={(e) => setNewBike({...newBike, pricePerDay: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit">Security Deposit (₹)</Label>
                  <Input
                    id="deposit"
                    type="number"
                    value={newBike.deposit}
                    onChange={(e) => setNewBike({...newBike, deposit: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shopId">Shop*</Label>
                <Select
                  value={newBike.shopId}
                  onValueChange={(value) => setNewBike({...newBike, shopId: value})}
                >
                  <SelectTrigger id="shopId">
                    <SelectValue placeholder="Select shop" />
                  </SelectTrigger>
                  <SelectContent>
                    {allShops.map((shop) => (
                      <SelectItem key={shop.id} value={shop.id}>
                        {shop.name} ({shop.area})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newBike.description}
                  onChange={(e) => setNewBike({...newBike, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="features">Features (comma separated)</Label>
                <Input
                  id="features"
                  placeholder="e.g. Tubeless tires, USB Charging, GPS"
                  value={Array.isArray(newBike.features) ? newBike.features.join(', ') : ''}
                  onChange={(e) => setNewBike({...newBike, features: e.target.value.split(',').map(f => f.trim())})}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isAvailable" 
                  checked={newBike.isAvailable}
                  onCheckedChange={(checked) => 
                    setNewBike({...newBike, isAvailable: checked as boolean})
                  }
                />
                <Label htmlFor="isAvailable">Bike is available for rental</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddBike}>Add Bike</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search bikes by name, brand, model, or shop..."
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
              <TableHead>Bike</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Shop</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBikes.map((bike) => (
              <TableRow key={bike.id}>
                <TableCell>
                  <div className="font-medium">{bike.name}</div>
                  <div className="text-sm text-gray-500">{bike.brand} {bike.model}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{bike.year} • {bike.cc}cc</div>
                  <div className="text-sm text-gray-500 capitalize">{bike.type} • {bike.gearType}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Store size={14} className="mr-1 text-gray-400" />
                    <span className="text-sm">{getShopNameById(bike.shopId)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">₹{bike.pricePerDay}/day</div>
                  {bike.pricePerHour > 0 && (
                    <div className="text-sm text-gray-500">₹{bike.pricePerHour}/hour</div>
                  )}
                </TableCell>
                <TableCell>
                  <div className={`px-2 py-1 rounded-full text-xs inline-block font-medium ${
                    bike.isAvailable 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {bike.isAvailable ? "Available" : "Unavailable"}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedBike(bike);
                        setIsViewBikeOpen(true);
                      }}
                    >
                      <Eye size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedBike(bike);
                        setIsEditBikeOpen(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setSelectedBike(bike);
                        setIsDeleteBikeOpen(true);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredBikes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No bikes found. Try adjusting your search or add a new bike.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isViewBikeOpen} onOpenChange={setIsViewBikeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bike Details</DialogTitle>
          </DialogHeader>
          {selectedBike && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{selectedBike.name}</h3>
                  <div className="text-sm text-gray-500">{selectedBike.brand} {selectedBike.model} ({selectedBike.year})</div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Specifications</h4>
                  <div className="text-sm space-y-1">
                    <div>Engine: {selectedBike.cc}cc</div>
                    <div>Type: {selectedBike.type.charAt(0).toUpperCase() + selectedBike.type.slice(1)}</div>
                    <div>Gear: {selectedBike.gearType.charAt(0).toUpperCase() + selectedBike.gearType.slice(1)}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Shop</h4>
                  <div className="flex items-center text-sm">
                    <Store size={14} className="mr-1 text-gray-400" />
                    {getShopNameById(selectedBike.shopId)}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Pricing</h4>
                  <div className="text-sm space-y-1">
                    <div>₹{selectedBike.pricePerDay}/day</div>
                    {selectedBike.pricePerHour > 0 && <div>₹{selectedBike.pricePerHour}/hour</div>}
                    {selectedBike.deposit > 0 && <div>Security Deposit: ₹{selectedBike.deposit}</div>}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Status</h4>
                  <div className={`px-2 py-1 rounded-full text-xs inline-block font-medium ${
                    selectedBike.isAvailable 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {selectedBike.isAvailable ? "Available" : "Unavailable"}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm">{selectedBike.description}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Features</h4>
                  <ul className="list-disc pl-5 text-sm">
                    {selectedBike && Array.isArray(selectedBike.features) ? 
                      selectedBike.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      )) : 
                      (typeof selectedBike?.features === 'string' ? 
                        (selectedBike?.features as unknown as string).split(',').map((feature, index) => (
                          <li key={index}>{feature.trim()}</li>
                        )) : 
                        [])}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Ratings</h4>
                  <div className="flex items-center">
                    <div className="flex text-amber-400">
                      {Array(5).fill(0).map((_, i) => (
                        <svg 
                          key={i}
                          className={`h-4 w-4 ${i < Math.round(selectedBike.rating) ? "fill-current" : "stroke-current fill-none"}`}
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm">
                      {selectedBike.rating}/5 ({selectedBike.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                
                {selectedBike.images && selectedBike.images.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Bike Images</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedBike.images.map((image, index) => (
                        <div key={index} className="aspect-video bg-gray-100 rounded overflow-hidden">
                          <img 
                            src={image} 
                            alt={`${selectedBike.name} ${index + 1}`} 
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
      
      <Dialog open={isEditBikeOpen} onOpenChange={setIsEditBikeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Bike</DialogTitle>
            <DialogDescription>
              Update bike details.
            </DialogDescription>
          </DialogHeader>
          {selectedBike && (
            <div className="grid gap-0 py-">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Bike Name*</Label>
                  <Input
                    id="edit-name"
                    value={selectedBike.name}
                    onChange={(e) => setSelectedBike({...selectedBike, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-brand">Brand*</Label>
                  <Input
                    id="edit-brand"
                    value={selectedBike.brand}
                    onChange={(e) => setSelectedBike({...selectedBike, brand: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-model">Model</Label>
                  <Input
                    id="edit-model"
                    value={selectedBike.model}
                    onChange={(e) => setSelectedBike({...selectedBike, model: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-year">Year</Label>
                  <Input
                    id="edit-year"
                    type="number"
                    value={selectedBike.year}
                    onChange={(e) => setSelectedBike({...selectedBike, year: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cc">Engine CC</Label>
                  <Input
                    id="edit-cc"
                    type="number"
                    value={selectedBike.cc}
                    onChange={(e) => setSelectedBike({...selectedBike, cc: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type</Label>
                  <Select
                    value={selectedBike.type}
                    onValueChange={(value) => setSelectedBike({...selectedBike, type: value})}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Select bike type" />
                    </SelectTrigger>
                    <SelectContent>
                      {bikeTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-gearType">Gear Type</Label>
                  <Select
                    value={selectedBike.gearType}
                    onValueChange={(value: "manual" | "automatic") => setSelectedBike({...selectedBike, gearType: value})}
                  >
                    <SelectTrigger id="edit-gearType">
                      <SelectValue placeholder="Select gear type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatic">Automatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-pricePerHour">Hourly Price (₹)</Label>
                  <Input
                    id="edit-pricePerHour"
                    type="number"
                    value={selectedBike.pricePerHour}
                    onChange={(e) => setSelectedBike({...selectedBike, pricePerHour: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pricePerDay">Daily Price (₹)*</Label>
                  <Input
                    id="edit-pricePerDay"
                    type="number"
                    value={selectedBike.pricePerDay}
                    onChange={(e) => setSelectedBike({...selectedBike, pricePerDay: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-deposit">Security Deposit (₹)</Label>
                  <Input
                    id="edit-deposit"
                    type="number"
                    value={selectedBike.deposit}
                    onChange={(e) => setSelectedBike({...selectedBike, deposit: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-shopId">Shop*</Label>
                <Select
                  value={selectedBike.shopId}
                  onValueChange={(value) => setSelectedBike({...selectedBike, shopId: value})}
                >
                  <SelectTrigger id="edit-shopId">
                    <SelectValue placeholder="Select shop" />
                  </SelectTrigger>
                  <SelectContent>
                    {allShops.map((shop) => (
                      <SelectItem key={shop.id} value={shop.id}>
                        {shop.name} ({shop.area})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedBike.description}
                  onChange={(e) => setSelectedBike({...selectedBike, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-features">Features (comma separated)</Label>
                <Input
                  id="edit-features"
                  placeholder="e.g. Tubeless tires, USB Charging, GPS"
                  value={Array.isArray(selectedBike.features) ? selectedBike.features.join(', ') : ''}
                  onChange={(e) => setSelectedBike({...selectedBike, features: e.target.value.split(',').map(f => f.trim())})}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="edit-isAvailable" 
                  checked={selectedBike.isAvailable}
                  onCheckedChange={(checked) => 
                    setSelectedBike({...selectedBike, isAvailable: checked as boolean})
                  }
                />
                <Label htmlFor="edit-isAvailable">Bike is available for rental</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleUpdateBike}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteBikeOpen} onOpenChange={setIsDeleteBikeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this bike? This will remove all associated bookings and reviews. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteBikeOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBike}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBikesPage;
