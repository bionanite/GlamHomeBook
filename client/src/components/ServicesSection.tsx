import ServiceCard from "./ServiceCard";
import manicureImage from "@assets/generated_images/Luxury_manicure_service_c3f81114.png";
import pedicureImage from "@assets/generated_images/Elegant_pedicure_service_39b8f677.png";
import lashesImage from "@assets/generated_images/Lash_extension_application_101aa6dc.png";
import makeupImage from "@assets/generated_images/Professional_makeup_application_97e65ba7.png";

export default function ServicesSection() {
  const services = [
    {
      image: manicureImage,
      title: "Premium Manicure",
      description: "Elegant nail care with luxury products and expert techniques",
      priceRange: "AED 150 - 300",
      rating: 4.8,
      reviewCount: 124,
    },
    {
      image: pedicureImage,
      title: "Luxury Pedicure",
      description: "Relaxing foot care treatment with premium products",
      priceRange: "AED 180 - 350",
      rating: 4.9,
      reviewCount: 156,
    },
    {
      image: lashesImage,
      title: "Lash Extensions",
      description: "Professional lash application for stunning, lasting results",
      priceRange: "AED 250 - 500",
      rating: 4.7,
      reviewCount: 98,
    },
    {
      image: makeupImage,
      title: "Makeup Artistry",
      description: "Expert makeup for any occasion, from natural to glamorous",
      priceRange: "AED 300 - 800",
      rating: 4.9,
      reviewCount: 203,
    },
  ];

  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Our Premium Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Indulge in luxury beauty treatments delivered to your home by Dubai's finest beauticians
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
