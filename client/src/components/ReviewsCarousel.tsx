import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const reviews = [
  { name: "Fatima Al-Hashimi", location: "Dubai Marina", rating: 5, text: "The lash extensions are absolutely stunning! The beautician came right to my villa and the service was so professional. My lashes lasted 6 weeks and looked natural and beautiful. Perfect for busy moms like me!", image: "" },
  { name: "Noura Ahmed", location: "Downtown Dubai", rating: 5, text: "I was preparing for my sister's wedding and booked makeup and hair. The artist understood exactly what I wanted - elegant but not too much. Everyone asked who did my makeup! Will definitely book again for my own wedding.", image: "" },
  { name: "Maryam Al-Mansouri", location: "Jumeirah", rating: 5, text: "As a working professional, I don't have time to go to salons. This service is a blessing! The manicure quality is salon-level but I can do it during lunch break at home. The beautician is always on time and very respectful.", image: "" },
  { name: "Layla Hassan", location: "Palm Jumeirah", rating: 5, text: "I tried the pedicure service for my mother-in-law and she absolutely loved it! The beautician was so gentle and kind. Now we book monthly sessions together. It's become our special bonding time.", image: "" },
  { name: "Aisha Al-Mazrouei", location: "Arabian Ranches", rating: 5, text: "The makeup artist made me feel like a queen! She used high-quality products and took time to understand my skin tone and preferences. I felt confident and beautiful at my event. Highly recommend!", image: "" },
  { name: "Hessa Mohammed", location: "Business Bay", rating: 5, text: "I was skeptical about home services but this exceeded all my expectations. The hygiene standards are excellent, all tools were sanitized, and the results are amazing. My nails have never looked better!", image: "" },
  { name: "Shamma Al-Ketbi", location: "JBR", rating: 5, text: "Perfect service for those of us who value privacy and comfort. The beautician is professional, discreet, and talented. My lash extensions look so natural that people think they're real!", image: "" },
  { name: "Sara Abdullah", location: "Dubai Hills", rating: 5, text: "I booked the full package - manicure, pedicure, and makeup for my graduation. My mother was with me and we both got pampered together at home. The experience was wonderful and stress-free.", image: "" },
  { name: "Amira Al-Nuaimi", location: "Mirdif", rating: 5, text: "The beautician who came to my home was so skilled and friendly. She gave me tips on nail care and recommended products that actually work. It feels like having a personal beauty consultant!", image: "" },
  { name: "Mariam Khalifa", location: "Discovery Gardens", rating: 5, text: "As a new mother, going to salons is impossible. This service is a lifesaver! I can get my nails done while my baby naps. The beautician is understanding and works around my schedule.", image: "" },
  { name: "Latifa Al-Sharqi", location: "Al Barsha", rating: 5, text: "I've tried many makeup artists in Dubai and this is by far the best experience. The artist listened to what I wanted and delivered perfection. My skin looked flawless and the makeup lasted all night.", image: "" },
  { name: "Hanan Salem", location: "Motor City", rating: 5, text: "The pedicure was so relaxing and thorough. She took care of every detail and my feet feel amazing. I appreciated that she brought all professional equipment. Will be a regular customer!", image: "" },
  { name: "Alia Al-Shamsi", location: "Dubai Sports City", rating: 5, text: "I was nervous about getting lash extensions but the beautician explained everything and made me feel comfortable. The results are gorgeous! My eyes look so much bigger and I wake up feeling beautiful.", image: "" },
  { name: "Salama Rashid", location: "Emirates Hills", rating: 5, text: "Exceptional service! The beautician arrived on time with all equipment, was very professional, and the quality is exactly like high-end salons. The convenience of home service is unbeatable.", image: "" },
  { name: "Maitha Al-Falasi", location: "Jumeirah Lake Towers", rating: 5, text: "I book monthly manicures for myself and my daughters. It's become our girls' day tradition. The beautician is patient with my young daughters and makes it fun for them too!", image: "" },
  { name: "Shamsa Hamad", location: "Green Community", rating: 5, text: "The makeup for my engagement party was absolutely stunning. Everyone complimented my look and asked for the artist's contact. She understood exactly the elegant look I wanted.", image: "" },
  { name: "Mozah Al-Mansoori", location: "Dubai Marina", rating: 5, text: "I love that I can book same-day appointments! Last minute event preparation is no longer stressful. The service is reliable, professional, and the results are always perfect.", image: "" },
  { name: "Reem Abdullah", location: "Al Sufouh", rating: 5, text: "The lash extensions transformed my look! I don't need mascara anymore and I wake up ready. The beautician was gentle and precise. Highly recommend to all my friends!", image: "" },
  { name: "Mahra Saeed", location: "Jumeirah Village Circle", rating: 5, text: "Best pedicure I've ever had! She used luxury products and the massage was so relaxing. My feet are soft and the polish application is perfect. Already booked my next appointment.", image: "" },
  { name: "Hessa Khalfan", location: "Dubai Silicon Oasis", rating: 5, text: "As someone who wears abaya daily, I appreciate the privacy of home service. The beautician respects our culture and values. The manicure quality is excellent and long-lasting.", image: "" },
  { name: "Ayesha Majid", location: "International City", rating: 5, text: "The makeup artist is truly talented! She enhanced my natural features without making me look overdone. Perfect for a professional working woman who wants to look polished.", image: "" },
  { name: "Sheikha Al-Maktoum", location: "Nad Al Sheba", rating: 5, text: "I hosted a small gathering and booked the beautician for myself and three friends. We all got manicures together - it was like having a spa party at home! Everyone loved it.", image: "" },
  { name: "Rawdha Hamdan", location: "Jumeirah Park", rating: 5, text: "The professionalism is outstanding. Clean tools, quality products, and skilled techniques. My gel manicure lasted 3 weeks without chipping. This is now my go-to beauty service!", image: "" },
  { name: "Moza Ali", location: "The Springs", rating: 5, text: "I was preparing for family photos and needed everything perfect. The makeup artist created a flawless, camera-ready look that photographed beautifully. My husband couldn't stop complimenting!", image: "" },
  { name: "Asma Darwish", location: "Arabian Ranches", rating: 5, text: "The lash technician is an artist! My lashes look full, long, and natural. She customized the length and curl to suit my eye shape. I receive compliments every day!", image: "" },
  { name: "Khawla Ibrahim", location: "The Meadows", rating: 5, text: "I suffer from sensitive skin and was worried about reactions. The beautician used hypoallergenic products and my skin looked glowing after makeup. She truly cares about her clients!", image: "" },
  { name: "Hamda Saif", location: "Dubai Marina", rating: 5, text: "The convenience is unmatched! I can schedule appointments around my work and family. The beautician is flexible and accommodating. My manicures always look salon-perfect.", image: "" },
  { name: "Shaikha Juma", location: "Umm Suqeim", rating: 5, text: "Best decision to try this service! The pedicure included a wonderful foot massage and my feet feel rejuvenated. The nail art she did was intricate and beautiful. True professional!", image: "" },
  { name: "Meera Al-Zaabi", location: "Al Barari", rating: 5, text: "I've recommended this service to all my friends! The makeup artist made me look and feel stunning for my anniversary dinner. My husband said I looked like a bride again!", image: "" },
  { name: "Wadima Khalid", location: "Town Square", rating: 5, text: "As a bride-to-be, I'm so happy I found this service. The lash extensions look perfect in all my pre-wedding photos. Natural, elegant, and exactly what I wanted!", image: "" },
  { name: "Noof Sultan", location: "Dubai Marina", rating: 5, text: "The beautician treats my home with respect and always cleans up perfectly after the service. My manicures are immaculate and last for weeks. Professional in every way!", image: "" },
  { name: "Budoor Hassan", location: "JLT", rating: 5, text: "I was skeptical about the quality compared to salons, but this is even better! Personal attention, no rushing, and the beautician focuses only on you. Love this concept!", image: "" },
  { name: "Maram Yousef", location: "Business Bay", rating: 5, text: "The makeup application technique is incredible. She contoured my face beautifully and the look was flawless all day. I felt confident and beautiful at my corporate event.", image: "" },
  { name: "Nada Ahmad", location: "The Lakes", rating: 5, text: "I appreciate that the beautician speaks Arabic and understands our beauty preferences. The service feels personalized and culturally aware. My pedicure was relaxing and professional.", image: "" },
  { name: "Afra Mohammed", location: "Palm Jumeirah", rating: 5, text: "The lash extensions are so comfortable I forget I'm wearing them! They look natural and beautiful. I wake up feeling put-together even without makeup.", image: "" },
  { name: "Mouza Rashid", location: "Dubai Hills Estate", rating: 5, text: "Booking is easy, payment is secure, and the service is consistently excellent. My gel manicure never chips and the color selection is extensive. Very satisfied!", image: "" },
  { name: "Mariam Al-Qubaisi", location: "Motor City", rating: 5, text: "The makeup artist created the perfect bridal look for my cousin's henna night. She used high-end products and the makeup lasted through hours of celebration. Stunning work!", image: "" },
  { name: "Hind Abdulla", location: "Dubai Sports City", rating: 5, text: "I love the personalized service! The beautician remembers my preferences and suggests new nail designs each time. It feels like catching up with a friend who makes you beautiful!", image: "" },
  { name: "Shamma Saeed", location: "Damac Hills", rating: 5, text: "The pedicure was thorough and relaxing. She paid attention to every detail and my feet look and feel amazing. The polish application is perfect with no mistakes.", image: "" },
  { name: "Ameera Ali", location: "Jumeirah Golf Estates", rating: 5, text: "I needed last-minute makeup for a wedding and they accommodated me! The artist arrived on time and created a beautiful look quickly. Saved my evening!", image: "" },
  { name: "Manal Khalifa", location: "Dubai Marina", rating: 5, text: "The lash extensions have changed my morning routine! I spend less time on makeup and still look polished. The beautician is skilled, hygienic, and professional.", image: "" },
  { name: "Basma Hamdan", location: "Mirdif", rating: 5, text: "I'm pregnant and it's difficult to go out. This service brings the salon to me! The beautician is gentle, understanding, and makes sure I'm comfortable throughout. Blessing!", image: "" },
  { name: "Ghaida Rashid", location: "Downtown Dubai", rating: 5, text: "The quality of products used is premium! My manicure looks glossy and perfect. The beautician is knowledgeable about the latest trends and techniques. Very impressed!", image: "" },
  { name: "Roudha Saif", location: "Arabian Ranches", rating: 5, text: "I book makeup services for special occasions and it's always flawless. The artist knows how to create looks that photograph well and last all day. My go-to service!", image: "" },
  { name: "Haya Sultan", location: "Al Furjan", rating: 5, text: "The pedicure service is luxurious! Feels like a spa treatment at home. She brought relaxing products and the massage was divine. My feet have never been so pampered.", image: "" },
  { name: "Maitha Jaber", location: "Jumeirah Village Triangle", rating: 5, text: "I trust this service completely! The beautician is certified, professional, and talented. My lash extensions look beautiful and she explained aftercare thoroughly.", image: "" },
  { name: "Anoud Hamad", location: "Dubai Marina", rating: 5, text: "Perfect for busy women! I schedule during my work-from-home hours and it's so convenient. The manicures are pristine and the service is always on time. Love it!", image: "" },
  { name: "Latifa Darwish", location: "Emirates Living", rating: 5, text: "The makeup artist is a magician! She covered my dark circles perfectly and made my eyes pop. I looked refreshed and radiant. Everyone asked what my secret was!", image: "" },
  { name: "Sheikha Bin Saedan", location: "Dubai Hills", rating: 5, text: "I appreciate the attention to hygiene! All tools are sterilized and she wears proper protective equipment. My pedicure was safe, clean, and beautifully done.", image: "" },
  { name: "Nouf Ahmed", location: "JBR", rating: 5, text: "The lash extensions are worth every dirham! They look stunning, feel comfortable, and last for weeks. The beautician is patient and skilled. I'm a customer for life!", image: "" },
];

export default function ReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const getReviewsPerPage = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };
  
  const [reviewsPerPage, setReviewsPerPage] = useState(getReviewsPerPage());
  
  useEffect(() => {
    const handleResize = () => {
      setReviewsPerPage(getReviewsPerPage());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    setCurrentIndex(0);
  }, [reviewsPerPage]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.ceil(reviews.length / reviewsPerPage) - 1;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, reviewsPerPage]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      const maxIndex = Math.ceil(reviews.length / reviewsPerPage) - 1;
      return prev <= 0 ? maxIndex : prev - 1;
    });
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => {
      const maxIndex = Math.ceil(reviews.length / reviewsPerPage) - 1;
      return prev >= maxIndex ? 0 : prev + 1;
    });
  };

  const visibleReviews = reviews.slice(
    currentIndex * reviewsPerPage,
    (currentIndex + 1) * reviewsPerPage
  );

  return (
    <section className="py-24 px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Loved by Dubai Women
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their beauty needs
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out gap-8"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }).map((_, pageIndex) => (
                <div
                  key={pageIndex}
                  className={`min-w-full grid gap-8 ${
                    reviewsPerPage === 1 ? 'grid-cols-1' :
                    reviewsPerPage === 2 ? 'grid-cols-2' :
                    'grid-cols-3'
                  }`}
                >
                  {reviews
                    .slice(pageIndex * reviewsPerPage, (pageIndex + 1) * reviewsPerPage)
                    .map((review, idx) => (
                      <Card key={`${pageIndex}-${idx}`} className="hover-elevate transition-all duration-300">
                        <CardContent className="p-6">
                          <Quote className="h-8 w-8 text-primary/20 mb-4" />
                          <div className="flex gap-1 mb-4">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                            ))}
                          </div>
                          <p className="text-foreground mb-6 leading-relaxed" data-testid={`text-review-${pageIndex}-${idx}`}>
                            "{review.text}"
                          </p>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {review.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-sm" data-testid={`text-reviewer-name-${pageIndex}-${idx}`}>
                                {review.name}
                              </p>
                              <p className="text-xs text-muted-foreground" data-testid={`text-reviewer-location-${pageIndex}-${idx}`}>
                                {review.location}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 bg-background shadow-lg hover:scale-110 transition-transform h-10 w-10 md:h-12 md:w-12"
            onClick={goToPrevious}
            data-testid="button-reviews-prev"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 bg-background shadow-lg hover:scale-110 transition-transform h-10 w-10 md:h-12 md:w-12"
            onClick={goToNext}
            data-testid="button-reviews-next"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
        </div>

        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-12 bg-primary" : "w-2 bg-muted hover-elevate"
              }`}
              data-testid={`button-reviews-dot-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
