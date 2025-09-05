import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react";
import { usePageSEO } from "@/hooks/useSEO";

const Contact = () => {
  // Set SEO for contact page
  usePageSEO('contact');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Address",
      details: ["123 Crafting Street", "Minecraft City, MC 12345"],
      color: "bg-minecraft-grass"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: ["+1 (555) CRAFT-MC", "+1 (555) 272-3862"],
      color: "bg-minecraft-gold"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["support@minecraftstore.com", "orders@minecraftstore.com"],
      color: "bg-minecraft-diamond"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat - Sun: 10:00 AM - 4:00 PM"],
      color: "bg-minecraft-redstone"
    }
  ];

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes! We ship worldwide. International shipping typically takes 7-14 business days."
    },
    {
      question: "What's your return policy?",
      answer: "We offer a 30-day return policy for all items in original condition with tags attached."
    },
    {
      question: "Are the items officially licensed?",
      answer: "Our products are inspired by Minecraft but are not official Mojang merchandise."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-grass-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-6 h-6 bg-minecraft-gold absolute top-12 right-16 animate-block-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-8 h-8 bg-minecraft-diamond absolute top-28 left-20 animate-block-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-4 h-4 bg-minecraft-redstone absolute bottom-20 right-1/3 animate-block-bounce" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl font-bold text-primary-foreground mb-6 font-minecraft">
              Contact Us
            </h1>
            <p className="text-2xl text-primary-foreground/90 max-w-3xl mx-auto font-minecraft">
              Have questions? We're here to help! Reach out to our friendly support team
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div
                key={info.title}
                className="text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${info.color} text-primary-foreground w-16 h-16 mx-auto mb-6 flex items-center justify-center block-shadow hover:shadow-block-hover transition-all duration-200`}>
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 font-minecraft">
                  {info.title}
                </h3>
                <div className="space-y-1">
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-muted-foreground font-minecraft">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-fade-in">
              <div className="bg-card border-2 border-border p-8 block-shadow">
                <div className="flex items-center mb-6">
                  <MessageSquare className="w-8 h-8 text-minecraft-grass mr-3" />
                  <h2 className="text-3xl font-bold text-foreground font-minecraft">
                    Send us a Message
                  </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2 font-minecraft">
                        Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="font-minecraft"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-foreground mb-2 font-minecraft">
                        Email *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="font-minecraft"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2 font-minecraft">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="font-minecraft"
                      placeholder="How can we help?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-foreground mb-2 font-minecraft">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="font-minecraft resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  
                  <Button type="submit" variant="grass" size="lg" className="w-full">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-3xl font-bold text-foreground mb-8 font-minecraft">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-card border-2 border-border p-6 block-shadow animate-scale-in"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <h3 className="text-lg font-bold text-foreground mb-3 font-minecraft">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground font-minecraft">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick Contact Options */}
              <div className="mt-8 space-y-4">
                <h3 className="text-xl font-bold text-foreground font-minecraft">
                  Need immediate help?
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="diamond" className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Us Now
                  </Button>
                  <Button variant="gold" className="flex-1">
                    <Mail className="w-4 h-4 mr-2" />
                    Live Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-minecraft">
              Find Our Store
            </h2>
            <p className="text-xl text-muted-foreground font-minecraft">
              Visit us in person at our flagship location
            </p>
          </div>
          
          <div className="bg-muted/20 border-2 border-border p-8 text-center animate-fade-in">
            <MapPin className="w-24 h-24 text-minecraft-grass mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4 font-minecraft">
              MineCraft Store Headquarters
            </h3>
            <p className="text-lg text-muted-foreground mb-6 font-minecraft">
              123 Crafting Street, Minecraft City, MC 12345
            </p>
            <div className="bg-card border-2 border-border h-64 flex items-center justify-center">
              <p className="text-muted-foreground font-minecraft">
                Interactive map would be embedded here
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;