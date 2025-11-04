import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useRoute } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar as CalendarIcon, Clock, MapPin, Star, DollarSign, Sparkles, ArrowLeft, Check, ChevronsUpDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DUBAI_AREAS } from "@shared/dubaiAreas";
import { cn } from "@/lib/utils";
import profile1 from "@assets/generated_images/Beautician_profile_one_9fa3b2a4.png";
import profile2 from "@assets/generated_images/Beautician_profile_two_08398f98.png";
import profile3 from "@assets/generated_images/Beautician_profile_three_da0a3188.png";

const profileImages = [profile1, profile2, profile3];

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const bookingSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  scheduledDate: z.date({ required_error: "Please select a date" }),
  scheduledTime: z.string().min(1, "Please select a time"),
  location: z.string().min(5, "Please enter your location"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/customer/dashboard`,
      },
      redirect: 'if_required',
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Booking Confirmed!",
        description: "Your beauty service has been booked successfully.",
      });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        data-testid="button-confirm-payment"
      >
        {isProcessing ? "Processing..." : "Confirm Payment"}
      </Button>
    </form>
  );
}

export default function BeauticianProfile() {
  const [, params] = useRoute('/beauticians/:id');
  const beauticianId = params?.id;
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState<'details' | 'payment'>('details');
  const [openLocationCombobox, setOpenLocationCombobox] = useState(false);

  // Helper to get consistent image index from beautician ID
  const getImageIndex = (id: string | undefined) => {
    if (!id) return 0;
    // Sum character codes to get a consistent number
    const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return sum % profileImages.length;
  };

  // Fetch beautician profile with services
  const { data: beautician, isLoading } = useQuery<any>({
    queryKey: ['/api/beauticians', beauticianId],
    enabled: !!beauticianId,
  });

  // Fetch reviews for this beautician
  const { data: reviews = [] } = useQuery<any[]>({
    queryKey: ['/api/beauticians', beauticianId, 'reviews'],
    enabled: !!beauticianId,
  });

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: "",
      location: "",
      notes: "",
    },
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/bookings', data);
      return res.json();
    },
    onSuccess: (data) => {
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setBookingStep('payment');
      }
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create booking", variant: "destructive" });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to book a service.",
        variant: "default",
      });
      setTimeout(() => {
        window.location.href = '/api/login';
      }, 1500);
      return;
    }

    const selectedServiceData = beautician?.services?.find((s: any) => s.id === data.serviceId);
    if (!selectedServiceData) return;

    // Combine date and time
    const scheduledDateTime = new Date(data.scheduledDate);
    const [hours, minutes] = data.scheduledTime.split(':');
    scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

    createBookingMutation.mutate({
      beauticianId: beautician.id,
      serviceId: data.serviceId,
      scheduledDate: scheduledDateTime.toISOString(),
      location: data.location,
      notes: data.notes,
    });
  };

  const handlePaymentSuccess = () => {
    setIsBookingDialogOpen(false);
    setBookingStep('details');
    setClientSecret(null);
    form.reset();
    queryClient.invalidateQueries({ queryKey: ['/api/bookings/customer'] });
    setTimeout(() => {
      setLocation('/customer/dashboard');
    }, 2000);
  };

  const openBookingDialog = (service: any) => {
    setSelectedService(service);
    form.setValue('serviceId', service.id);
    setIsBookingDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!beautician) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Beautician not found</p>
              <Button onClick={() => setLocation('/find-beauticians')} className="mt-4">
                Back to Search
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setLocation('/find-beauticians')}
            className="mb-6"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>

          {/* Beautician Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex gap-6 flex-1">
                  <Avatar className="h-24 w-24 md:h-32 md:w-32 flex-shrink-0" data-testid="beautician-avatar">
                    <AvatarImage 
                      src={profileImages[getImageIndex(beauticianId)]} 
                      alt={beautician.userName} 
                    />
                    <AvatarFallback>{beautician.userName?.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2" data-testid="beautician-name">
                      {beautician.userName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-primary text-primary" />
                        <span className="font-semibold">{beautician.rating || '5.0'}</span>
                        <span className="text-muted-foreground">({beautician.reviewCount || 0} reviews)</span>
                      </div>
                      <Badge>{beautician.experience}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4" data-testid="beautician-bio">
                      {beautician.bio}
                    </p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{beautician.serviceAreas?.join(', ')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                  <p className="text-3xl font-bold">د.إ {beautician.startingPrice}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold mb-6">Services & Pricing</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {beautician.services?.map((service: any) => (
                <Card key={service.id} data-testid={`service-card-${service.id}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      {service.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="font-semibold">د.إ {service.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration} minutes</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => openBookingDialog(service)}
                      className="w-full"
                      data-testid={`button-book-${service.id}`}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div>
              <h2 className="text-2xl font-serif font-bold mb-6">Customer Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review: any) => (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">{review.customerName}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(review.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {bookingStep === 'details' ? 'Book Your Service' : 'Complete Payment'}
            </DialogTitle>
          </DialogHeader>

          {bookingStep === 'details' ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {selectedService && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="font-semibold mb-2">{selectedService.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>د.إ {selectedService.price}</span>
                      <span>•</span>
                      <span>{selectedService.duration} minutes</span>
                    </div>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left"
                              data-testid="button-select-date"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, 'PPP') : 'Select a date'}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scheduledTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-time">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 9).map((hour) => (
                            <>
                              <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                                {hour}:00 {hour < 12 ? 'AM' : 'PM'}
                              </SelectItem>
                              <SelectItem key={`${hour}:30`} value={`${hour}:30`}>
                                {hour}:30 {hour < 12 ? 'AM' : 'PM'}
                              </SelectItem>
                            </>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Your Location</FormLabel>
                      <Popover open={openLocationCombobox} onOpenChange={setOpenLocationCombobox}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openLocationCombobox}
                              className="w-full justify-between"
                              data-testid="button-select-location"
                            >
                              {field.value || "Select your area in Dubai"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput 
                              placeholder="Search Dubai areas..." 
                              data-testid="input-search-location"
                            />
                            <CommandList>
                              <CommandEmpty>No area found.</CommandEmpty>
                              <CommandGroup>
                                {DUBAI_AREAS.map((area) => (
                                  <CommandItem
                                    key={area}
                                    value={area}
                                    onSelect={(currentValue) => {
                                      field.onChange(currentValue === field.value ? "" : currentValue);
                                      setOpenLocationCombobox(false);
                                    }}
                                    data-testid={`option-location-${area.toLowerCase().replace(/\s+/g, '-')}`}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === area ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {area}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Any special requests or notes..."
                          rows={3}
                          data-testid="textarea-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createBookingMutation.isPending}
                  data-testid="button-proceed-payment"
                >
                  {createBookingMutation.isPending ? "Processing..." : "Proceed to Payment"}
                </Button>
              </form>
            </Form>
          ) : clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm onSuccess={handlePaymentSuccess} />
            </Elements>
          ) : (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
