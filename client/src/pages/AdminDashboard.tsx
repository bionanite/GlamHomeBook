import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle, XCircle, Clock, User, MapPin, DollarSign, MessageCircle, Send } from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedCustomer, setSelectedCustomer] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && isAuthenticated && (user as any)?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      setTimeout(() => {
        setLocation('/');
      }, 1500);
    } else if (!authLoading && !isAuthenticated) {
      window.location.href = '/api/login';
    }
  }, [user, authLoading, isAuthenticated, toast, setLocation]);

  // Fetch pending beauticians
  const { data: pendingBeauticians = [], isLoading: loadingBeauticians } = useQuery<any[]>({
    queryKey: ['/api/admin/beauticians/pending'],
    enabled: isAuthenticated && (user as any)?.role === 'admin',
  });

  // Fetch all bookings
  const { data: bookings = [], isLoading: loadingBookings } = useQuery<any[]>({
    queryKey: ['/api/admin/bookings'],
    enabled: isAuthenticated && (user as any)?.role === 'admin',
  });

  // Approve beautician mutation
  const approveBeauticianMutation = useMutation({
    mutationFn: async (beauticianId: string) => {
      const response = await fetch(`/api/admin/beauticians/${beauticianId}/approve`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to approve beautician');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/beauticians/pending'] });
      toast({ title: "Success", description: "Beautician approved successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to approve beautician", variant: "destructive" });
    },
  });

  // Reject beautician mutation
  const rejectBeauticianMutation = useMutation({
    mutationFn: async (beauticianId: string) => {
      const response = await fetch(`/api/admin/beauticians/${beauticianId}/reject`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to reject beautician');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/beauticians/pending'] });
      toast({ title: "Success", description: "Beautician application rejected" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to reject beautician", variant: "destructive" });
    },
  });

  // Update booking status mutation
  const updateBookingMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update booking');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bookings'] });
      toast({ title: "Success", description: "Booking status updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update booking", variant: "destructive" });
    },
  });

  // Fetch all customers
  const { data: customers = [] } = useQuery<any[]>({
    queryKey: ['/api/users'],
    enabled: isAuthenticated && (user as any)?.role === 'admin',
  });

  // Send offer to customer mutation
  const sendOfferMutation = useMutation({
    mutationFn: async (customerId: string) => {
      const res = await apiRequest('POST', '/api/offers/send', { customerId });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Offer sent successfully to customer" });
      setSelectedCustomer("");
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to send offer", 
        variant: "destructive" 
      });
    },
  });

  // Trigger automated offers mutation
  const triggerAutomatedMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/offers/trigger-automated', {});
      return res.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: "Success", 
        description: `Automated offers processed: ${data.sent} sent, ${data.failed} failed` 
      });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to trigger automated offers", 
        variant: "destructive" 
      });
    },
  });

  if (authLoading || !isAuthenticated || (user as any)?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage beautician applications and bookings
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="beauticians" className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-3">
              <TabsTrigger value="beauticians" data-testid="tab-beauticians">
                Beautician Applications ({pendingBeauticians.length})
              </TabsTrigger>
              <TabsTrigger value="bookings" data-testid="tab-bookings">
                Bookings ({bookings.length})
              </TabsTrigger>
              <TabsTrigger value="notifications" data-testid="tab-notifications">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Offers
              </TabsTrigger>
            </TabsList>

            {/* Beautician Applications Tab */}
            <TabsContent value="beauticians" className="space-y-4">
              {loadingBeauticians ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">Loading applications...</p>
                  </CardContent>
                </Card>
              ) : pendingBeauticians.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No pending applications</p>
                  </CardContent>
                </Card>
              ) : (
                pendingBeauticians.map((beautician: any) => (
                  <Card key={beautician.id} data-testid={`card-beautician-${beautician.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                              <User className="h-8 w-8" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-xl mb-1">Beautician Application</CardTitle>
                            <CardDescription>
                              Submitted {format(new Date(beautician.createdAt), 'PPP')}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary">Pending Review</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Experience</p>
                          <p className="font-medium">{beautician.experience} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Starting Price</p>
                          <p className="font-medium">AED {beautician.startingPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Availability</p>
                          <p className="font-medium capitalize">{beautician.availability}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Service Areas</p>
                          <div className="flex flex-wrap gap-1">
                            {beautician.serviceAreas.map((area: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">{area}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {beautician.bio && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Bio</p>
                          <p className="text-sm">{beautician.bio}</p>
                        </div>
                      )}

                      <div className="flex gap-3 pt-4 border-t">
                        <Button
                          onClick={() => approveBeauticianMutation.mutate(beautician.id)}
                          disabled={approveBeauticianMutation.isPending}
                          className="flex-1"
                          data-testid={`button-approve-${beautician.id}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {approveBeauticianMutation.isPending ? "Approving..." : "Approve"}
                        </Button>
                        <Button
                          onClick={() => rejectBeauticianMutation.mutate(beautician.id)}
                          disabled={rejectBeauticianMutation.isPending}
                          variant="destructive"
                          className="flex-1"
                          data-testid={`button-reject-${beautician.id}`}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          {rejectBeauticianMutation.isPending ? "Rejecting..." : "Reject"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-4">
              {loadingBookings ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">Loading bookings...</p>
                  </CardContent>
                </Card>
              ) : bookings.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No bookings found</p>
                  </CardContent>
                </Card>
              ) : (
                bookings.map((booking: any) => (
                  <Card key={booking.id} data-testid={`card-booking-${booking.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-1">Booking #{booking.id.slice(0, 8)}</CardTitle>
                          <CardDescription>
                            Created {format(new Date(booking.createdAt), 'PPP')}
                          </CardDescription>
                        </div>
                        <Badge 
                          variant={
                            booking.status === 'confirmed' ? 'default' : 
                            booking.status === 'completed' ? 'secondary' :
                            booking.status === 'cancelled' ? 'destructive' : 
                            'outline'
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Scheduled Date</p>
                            <p className="font-medium">{format(new Date(booking.scheduledDate), 'PPP p')}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-medium">{booking.location}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Total Amount</p>
                            <p className="font-medium">AED {booking.totalAmount}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Platform Fee</p>
                            <p className="font-medium">AED {booking.platformFee}</p>
                          </div>
                        </div>
                      </div>

                      {booking.status === 'pending' && (
                        <div className="flex gap-3 pt-4 border-t">
                          <Button
                            onClick={() => updateBookingMutation.mutate({ bookingId: booking.id, status: 'confirmed' })}
                            disabled={updateBookingMutation.isPending}
                            className="flex-1"
                            data-testid={`button-confirm-${booking.id}`}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirm
                          </Button>
                          <Button
                            onClick={() => updateBookingMutation.mutate({ bookingId: booking.id, status: 'cancelled' })}
                            disabled={updateBookingMutation.isPending}
                            variant="destructive"
                            className="flex-1"
                            data-testid={`button-cancel-${booking.id}`}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* WhatsApp Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <CardTitle>WhatsApp Offer Management</CardTitle>
                  </div>
                  <CardDescription>
                    Send personalized beauty offers to customers via WhatsApp
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Manual Offer Sending */}
                  <div className="space-y-4 pb-6 border-b">
                    <h3 className="text-lg font-semibold">Send Offer to Customer</h3>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                          <SelectTrigger data-testid="select-customer">
                            <SelectValue placeholder="Select a customer" />
                          </SelectTrigger>
                          <SelectContent>
                            {customers.length === 0 ? (
                              <SelectItem value="none" disabled>No customers found</SelectItem>
                            ) : (
                              customers.map((customer: any) => (
                                <SelectItem key={customer.id} value={customer.id}>
                                  {customer.firstName} {customer.lastName} ({customer.email})
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() => selectedCustomer && sendOfferMutation.mutate(selectedCustomer)}
                        disabled={!selectedCustomer || sendOfferMutation.isPending}
                        data-testid="button-send-offer"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {sendOfferMutation.isPending ? "Sending..." : "Send Offer"}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Analyzes customer's booking history and sends a personalized offer based on their preferences
                    </p>
                  </div>

                  {/* Automated Offer Trigger */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Trigger Automated Offers</h3>
                    <div>
                      <Button
                        onClick={() => triggerAutomatedMutation.mutate()}
                        disabled={triggerAutomatedMutation.isPending}
                        variant="secondary"
                        className="w-full"
                        data-testid="button-trigger-automated"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {triggerAutomatedMutation.isPending ? "Processing..." : "Run Automated Offer Generation"}
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        Processes all eligible customers and sends personalized offers based on their booking patterns
                      </p>
                    </div>
                  </div>

                  {/* Scheduler Info */}
                  <div className="bg-muted/50 rounded-md p-4 space-y-2">
                    <h4 className="font-semibold text-sm">Automated Schedule</h4>
                    <p className="text-sm text-muted-foreground">
                      The system automatically sends offers twice daily:
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>10:00 AM Dubai time (daily offers)</li>
                      <li>2:00 PM Dubai time (afternoon reminders)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
