
import React, { useState } from "react";
import { useReviews } from "@/contexts/ReviewContext";
import { useBikes } from "@/contexts/BikeContext";
import { useShops } from "@/contexts/ShopContext";
import { Review } from "@/types";
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
import { Input } from "@/components/ui/input";
import { Search, Trash2, Eye, Star, Store, Bike, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const AdminReviewsPage: React.FC = () => {
  const { allReviews, deleteReview } = useReviews();
  const { allBikes } = useBikes();
  const { allShops } = useShops();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isViewReviewOpen, setIsViewReviewOpen] = useState(false);
  const [isDeleteReviewOpen, setIsDeleteReviewOpen] = useState(false);
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

  const getBikeName = (bikeId: string) => {
    const bike = allBikes.find(b => b.id === bikeId);
    return bike ? bike.name : "Unknown Bike";
  };

  const getShopName = (shopId: string) => {
    const shop = allShops.find(s => s.id === shopId);
    return shop ? shop.name : "Unknown Shop";
  };

  const handleDeleteReview = () => {
    if (!selectedReview) return;
    
    const success = deleteReview(selectedReview.id);
    
    if (success) {
      setIsDeleteReviewOpen(false);
      toast({
        title: "Review deleted successfully",
      });
    } else {
      toast({
        title: "Error deleting review",
        variant: "destructive"
      });
    }
  };

  // Filter reviews based on search term and tab
  const filteredReviews = allReviews.filter(review => {
    const bikeNameMatch = getBikeName(review.bikeId).toLowerCase().includes(searchTerm.toLowerCase());
    const shopNameMatch = getShopName(review.shopId).toLowerCase().includes(searchTerm.toLowerCase());
    const userNameMatch = review.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const commentMatch = review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSearch = bikeNameMatch || shopNameMatch || userNameMatch || commentMatch;
    
    if (selectedTab === "all") return matchesSearch;
    if (selectedTab === "high-rating") return matchesSearch && review.rating >= 4;
    if (selectedTab === "low-rating") return matchesSearch && review.rating <= 2;
    return matchesSearch;
  });
  
  // Reviews statistics
  const averageRating = allReviews.length > 0 
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : 0;
  
  const highRatingCount = allReviews.filter(r => r.rating >= 4).length;
  const lowRatingCount = allReviews.filter(r => r.rating <= 2).length;
  const totalReviews = allReviews.length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reviews & Ratings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card onClick={() => setSelectedTab("all")} className={`cursor-pointer ${selectedTab === "all" ? "border-primary" : ""}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{totalReviews}</CardTitle>
            <CardDescription>Total Reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm">Average: {averageRating}/5</div>
          </CardContent>
        </Card>
        
        <Card onClick={() => setSelectedTab("high-rating")} className={`cursor-pointer ${selectedTab === "high-rating" ? "border-primary" : ""}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-500">{highRatingCount}</CardTitle>
            <CardDescription>High Ratings (4-5 ⭐)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{Math.round((highRatingCount / totalReviews) * 100) || 0}% of total</div>
          </CardContent>
        </Card>
        
        <Card onClick={() => setSelectedTab("low-rating")} className={`cursor-pointer ${selectedTab === "low-rating" ? "border-primary" : ""}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-red-500">{lowRatingCount}</CardTitle>
            <CardDescription>Low Ratings (1-2 ⭐)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{Math.round((lowRatingCount / totalReviews) * 100) || 0}% of total</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{allReviews.filter(r => new Date(r.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}</CardTitle>
            <CardDescription>Recent Reviews (30d)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm">Last review: {allReviews.length > 0 ? formatDate(allReviews[allReviews.length - 1].createdAt) : "None"}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by user, bike, shop, or review content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="high-rating">High Ratings</TabsTrigger>
          <TabsTrigger value="low-rating">Low Ratings</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <div className="font-medium">{review.userName}</div>
                </TableCell>
                <TableCell>
                  <div className="flex text-amber-400">
                    {Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={i}
                        size={16}
                        className={i < review.rating ? "fill-current" : ""}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm truncate max-w-[200px]">{review.comment}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="flex items-center">
                      <Bike size={14} className="mr-1 text-gray-400" />
                      {getBikeName(review.bikeId)}
                    </div>
                    <div className="flex items-center">
                      <Store size={14} className="mr-1 text-gray-400" />
                      {getShopName(review.shopId)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedReview(review);
                        setIsViewReviewOpen(true);
                      }}
                    >
                      <Eye size={16} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setSelectedReview(review);
                        setIsDeleteReviewOpen(true);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredReviews.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No reviews found. Try adjusting your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* View Review Dialog */}
      <Dialog open={isViewReviewOpen} onOpenChange={setIsViewReviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    {selectedReview.userImage ? (
                      <img 
                        src={selectedReview.userImage} 
                        alt={selectedReview.userName} 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold">{selectedReview.userName.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedReview.userName}</h3>
                    <div className="text-sm text-gray-500">{formatDate(selectedReview.createdAt)}</div>
                  </div>
                </div>
                
                <div className="flex text-amber-400">
                  {Array(5).fill(0).map((_, i) => (
                    <Star 
                      key={i}
                      size={18}
                      className={i < selectedReview.rating ? "fill-current" : ""}
                    />
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-gray-700">{selectedReview.comment}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Bike Details</h4>
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                      <Bike size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium">{getBikeName(selectedReview.bikeId)}</div>
                      <div className="text-sm text-gray-500">ID: {selectedReview.bikeId}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Shop Details</h4>
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                      <Store size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium">{getShopName(selectedReview.shopId)}</div>
                      <div className="text-sm text-gray-500">ID: {selectedReview.shopId}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedReview.rating <= 2 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start">
                  <AlertTriangle size={18} className="text-yellow-500 mr-2 mt-0.5" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium">Low Rating Alert</p>
                    <p>This review has a low rating and may require attention from the shop owner.</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsViewReviewOpen(false);
                setIsDeleteReviewOpen(true);
              }}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 size={16} className="mr-2" />
              Delete Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Review Dialog */}
      <Dialog open={isDeleteReviewOpen} onOpenChange={setIsDeleteReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteReviewOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteReview}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminReviewsPage;
