
import React, { useState } from "react";
import { useReviews } from "@/contexts/ReviewContext";
import { useAuth } from "@/contexts/AuthContext";
import { useBikes } from "@/contexts/BikeContext";
import { useShops } from "@/contexts/ShopContext";
import { Review } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Star, Bike as BikeIcon, Store as StoreIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const UserReviews: React.FC = () => {
  const { currentUser } = useAuth();
  const { userReviews, updateReview, deleteReview } = useReviews();
  const { allBikes } = useBikes();
  const { allShops } = useShops();
  
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedRating, setEditedRating] = useState(0);
  const [editedComment, setEditedComment] = useState("");
  
  const userId = currentUser?.id || "";
  const myReviews = userReviews(userId);
  
  const bikeReviews = myReviews.filter(review => {
    const bike = allBikes.find(b => b.id === review.bikeId);
    return bike !== undefined;
  });
  
  const shopReviews = myReviews.filter(review => {
    const shop = allShops.find(s => s.id === review.shopId);
    return shop !== undefined;
  });
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    });
  };
  
  const getBikeName = (bikeId: string) => {
    const bike = allBikes.find(b => b.id === bikeId);
    return bike ? bike.name : "Unknown Bike";
  };
  
  const getShopName = (shopId: string) => {
    const shop = allShops.find(s => s.id === shopId);
    return shop ? shop.name : "Unknown Shop";
  };
  
  const handleEditReview = () => {
    if (!selectedReview) return;
    
    setIsEditDialogOpen(true);
    setEditedRating(selectedReview.rating);
    setEditedComment(selectedReview.comment);
  };
  
  const handleDeleteReview = () => {
    if (!selectedReview) return;
    
    setIsDeleteDialogOpen(true);
  };
  
  const handleUpdateReview = () => {
    if (!selectedReview) return;
    
    if (editedRating < 1 || editedRating > 5) {
      toast({
        title: "Invalid rating",
        description: "Rating must be between 1 and 5.",
        variant: "destructive"
      });
      return;
    }
    
    if (!editedComment.trim()) {
      toast({
        title: "Comment required",
        description: "Please provide a comment for your review.",
        variant: "destructive"
      });
      return;
    }
    
    const success = updateReview(selectedReview.id, {
      rating: editedRating,
      comment: editedComment
    });
    
    if (success) {
      setIsEditDialogOpen(false);
      toast({
        title: "Review updated",
        description: "Your review has been updated successfully."
      });
    } else {
      toast({
        title: "Update failed",
        description: "Failed to update your review. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleConfirmDelete = () => {
    if (!selectedReview) return;
    
    const success = deleteReview(selectedReview.id);
    
    if (success) {
      setIsDeleteDialogOpen(false);
      toast({
        title: "Review deleted",
        description: "Your review has been deleted successfully."
      });
    } else {
      toast({
        title: "Delete failed",
        description: "Failed to delete your review. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const renderReviewCard = (review: Review) => (
    <Card key={review.id} className="overflow-hidden">
      <div className="bg-muted/40 p-4 flex justify-between items-center border-b">
        <div className="flex items-center">
          {review.bikeId && (
            <div className="flex items-center text-sm mr-3">
              <BikeIcon size={16} className="mr-1 text-gray-500" />
              <span>{getBikeName(review.bikeId)}</span>
            </div>
          )}
          
          {review.shopId && (
            <div className="flex items-center text-sm">
              <StoreIcon size={16} className="mr-1 text-gray-500" />
              <span>{getShopName(review.shopId)}</span>
            </div>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground">
          {formatDate(review.createdAt)}
        </div>
      </div>
      
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex text-amber-400">
            {Array(5).fill(0).map((_, i) => (
              <Star 
                key={i}
                size={18}
                className={`${i < review.rating ? "fill-current" : ""}`}
              />
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0" 
              onClick={() => {
                setSelectedReview(review);
                handleEditReview();
              }}
            >
              <Pencil size={16} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50" 
              onClick={() => {
                setSelectedReview(review);
                handleDeleteReview();
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        
        <p className="text-gray-700">{review.comment}</p>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Reviews</CardTitle>
          <CardDescription>
            Manage your reviews for bikes and shops
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">
                All Reviews
                <span className="ml-2 rounded-full bg-gray-200 w-6 h-6 text-xs flex items-center justify-center text-gray-800">
                  {myReviews.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="bikes">
                <BikeIcon size={16} className="mr-2" />
                Bikes
                <span className="ml-2 rounded-full bg-gray-200 w-6 h-6 text-xs flex items-center justify-center text-gray-800">
                  {bikeReviews.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="shops">
                <StoreIcon size={16} className="mr-2" />
                Shops
                <span className="ml-2 rounded-full bg-gray-200 w-6 h-6 text-xs flex items-center justify-center text-gray-800">
                  {shopReviews.length}
                </span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {myReviews.length > 0 ? (
                myReviews.map(review => renderReviewCard(review))
              ) : (
                <div className="text-center py-8">
                  <h3 className="font-medium text-lg mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-4">You haven't written any reviews yet.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="bikes" className="space-y-4">
              {bikeReviews.length > 0 ? (
                bikeReviews.map(review => renderReviewCard(review))
              ) : (
                <div className="text-center py-8">
                  <h3 className="font-medium text-lg mb-2">No bike reviews</h3>
                  <p className="text-muted-foreground">You haven't reviewed any bikes yet.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="shops" className="space-y-4">
              {shopReviews.length > 0 ? (
                shopReviews.map(review => renderReviewCard(review))
              ) : (
                <div className="text-center py-8">
                  <h3 className="font-medium text-lg mb-2">No shop reviews</h3>
                  <p className="text-muted-foreground">You haven't reviewed any shops yet.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Edit Review Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription>
              Update your review for {selectedReview?.bikeId ? getBikeName(selectedReview.bikeId) : getShopName(selectedReview?.shopId || "")}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setEditedRating(rating)}
                  >
                    <Star 
                      size={32}
                      className={`${rating <= editedRating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-center">
                <span className="text-sm text-muted-foreground">
                  {editedRating} out of 5 stars
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Your Review
              </label>
              <Textarea
                id="comment"
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                rows={4}
                placeholder="Share your experience..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateReview}>
              Update Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Review Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserReviews;
