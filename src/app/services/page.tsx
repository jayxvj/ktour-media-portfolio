"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import GetQuoteModal from '@/components/GetQuoteModal';
import { Globe, Camera, Video, Building, Package, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ServicesPage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const services = [
    {
      icon: <Globe className="w-16 h-16" />,
      title: 'Google 360° Virtual Tours',
      description: 'Get your business on Google Maps with our certified virtual tour service.',
      features: [
        'Google Street View certification',
        'Seamless integration with Google My Business',
        'Boost local SEO rankings',
        'Increase customer trust and engagement',
        'Mobile-friendly viewing',
        'Analytics and insights',
      ],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Package className="w-16 h-16" />,
      title: '360° Product Shoots',
      description: 'Showcase your products from every angle with interactive 360° photography.',
      features: [
        'Professional product photography',
        'Interactive product viewers',
        'Perfect for e-commerce',
        'High-resolution images',
        'Fast turnaround time',
        'Multiple product angles',
      ],
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Building className="w-16 h-16" />,
      title: '360° Interior & Real Estate',
      description: 'Transform property viewing with immersive interior virtual tours.',
      features: [
        'HDR photography',
        'Floor plan integration',
        'Virtual staging options',
        'Dollhouse view',
        'Measurement tools',
        'Lead capture forms',
      ],
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: <Video className="w-16 h-16" />,
      title: '360° Video Production',
      description: 'Create engaging 360° videos that tell your story in an immersive way.',
      features: [
        '4K & 8K video quality',
        'Professional editing',
        'Sound design',
        'Platform optimization',
        'Social media ready',
        'VR headset compatible',
      ],
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: <Camera className="w-16 h-16" />,
      title: 'Business Branding Photography',
      description: 'Professional photography to elevate your brand image.',
      features: [
        'Corporate headshots',
        'Team photography',
        'Product photography',
        'Event coverage',
        'Lifestyle shots',
        'Social media content',
      ],
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: <Sparkles className="w-16 h-16" />,
      title: 'Custom Virtual Tour Solutions',
      description: 'Tailored virtual experiences for unique business needs.',
      features: [
        'Custom branding',
        'Interactive hotspots',
        'Multi-language support',
        'Advanced analytics',
        'CRM integration',
        'White-label solutions',
      ],
      color: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation onGetQuote={() => setIsQuoteModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Our Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Comprehensive 360° media solutions tailored to your business needs
            </p>
            <Button
              onClick={() => setIsQuoteModalOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Get Started Today
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border border-border shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Gradient Header */}
                <div className={`p-8 bg-gradient-to-r ${service.color} text-white`}>
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-3xl font-bold mb-3">{service.title}</h3>
                  <p className="text-white/90 text-lg">{service.description}</p>
                </div>

                {/* Features List */}
                <div className="p-8">
                  <h4 className="font-semibold text-lg mb-4">What's Included:</h4>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Request Quote
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Simple process, stunning results</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { step: '01', title: 'Consultation', desc: 'We discuss your needs and objectives' },
              { step: '02', title: 'Planning', desc: 'Schedule and plan the shoot details' },
              { step: '03', title: 'Production', desc: 'Professional shooting and capture' },
              { step: '04', title: 'Delivery', desc: 'Edited content delivered and published' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
              Let's create something amazing together. Contact us for a free consultation.
            </p>
            <Button
              onClick={() => setIsQuoteModalOpen(true)}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              Get Your Free Quote
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
      <GetQuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </div>
  );
}
