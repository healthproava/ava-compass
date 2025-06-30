import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Heart, Shield, Users, Star, CheckCircle, ArrowRight, Phone, Mail, MapPin, Award, Clock, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import ParallaxDivider from './ParallaxDivider';
import FeedbackSystem from './FeedbackSystem';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const features = [{
    icon: Heart,
    title: "AI-Powered Matching",
    description: "AVA uses advanced AI to match seniors with the perfect care facilities based on their unique needs and preferences.",
    color: "from-pink-500 to-rose-500"
  }, {
    icon: Shield,
    title: "Veteran-Focused Care",
    description: "Specialized support for veterans with access to VA benefits and military-friendly care facilities.",
    color: "from-blue-500 to-indigo-500"
  }, {
    icon: Users,
    title: "Professional Network",
    description: "Connect with certified care placement professionals who understand your local market and needs.",
    color: "from-emerald-500 to-teal-500"
  }];
  const steps = [{
    number: "01",
    title: "Tell AVA Your Needs",
    description: "Share your care requirements, preferences, and budget with our AI assistant AVA."
  }, {
    number: "02",
    title: "Get Matched",
    description: "AVA analyzes thousands of facilities to find the best matches for your specific situation."
  }, {
    number: "03",
    title: "Connect & Tour",
    description: "Schedule virtual or in-person tours with your top matches and make an informed decision."
  }];
  const testimonials = [{
    name: "Sarah Johnson",
    role: "Daughter & Caregiver",
    content: "AVA helped us find the perfect memory care facility for my father. The process was seamless and the staff was incredibly supportive.",
    rating: 5
  }, {
    name: "Michael Chen",
    role: "Professional Agent",
    content: "As a care placement professional, HealthProAssist has revolutionized how I serve my clients. The advanced features save me hours every week.",
    rating: 5
  }, {
    name: "Robert Martinez",
    role: "Army Veteran",
    content: "Finally, a service that understands veteran needs. They helped me find a facility that accepts VA benefits and feels like home.",
    rating: 5
  }];
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient pt-24 pb-16 text-white relative bg-sky-700">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              Powered by AI • Trusted by Families
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-glow">
              Find the Perfect Senior Care with
              <span className="block text-white/90">AI-Powered Matching</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed text-shadow">
              Meet AVA, your personal AI assistant who understands veteran and civilian care needs. 
              Get matched with vetted facilities in minutes, not weeks.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" asChild className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 text-lg shadow-2xl">
                <Link to="/find-care">
                  <Search className="mr-2 h-5 w-5" />
                  Start Your Search
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg shadow-2xl">
                Meet AVA
              </Button>
            </div>

            {/* Hero Stats */}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-glow">10,000+</div>
                <div className="text-white/80">Verified Facilities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-glow">98%</div>
                <div className="text-white/80">Match Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 text-glow">24/7</div>
                <div className="text-white/80">AVA Availability</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parallax Divider */}
      <ParallaxDivider />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Why Choose HealthProAssist?
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with human expertise 
              to deliver personalized senior care solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
            {features.map((feature, index) => <Card key={index} className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 shadow-lg">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10`}></div>
                <CardContent className="p-6 text-center relative z-10 bg-white/95 backdrop-blur-sm">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-3">{feature.title}</h3>
                  <p className="text-text-secondary">{feature.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Parallax Divider */}
      <ParallaxDivider />

      {/* AVA's Process Section */}
      <section className="py-16 bg-surface-soft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              How AVA Works
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Our simple 3-step process powered by advanced AI gets you connected 
              with the right care in no time.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => <div key={index} className="flex items-start mb-12 last:mb-0 animate-fade-in">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-6 shadow-lg">
                  {step.number}
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-semibold text-text-primary mb-3">{step.title}</h3>
                  <p className="text-lg text-text-secondary">{step.description}</p>
                </div>
                {index < steps.length - 1 && <ArrowRight className="h-6 w-6 text-red-500 mt-4 ml-6 hidden md:block" />}
              </div>)}
          </div>
        </div>
      </section>

      {/* Parallax Divider */}
      <ParallaxDivider />

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-text-secondary">
              Real stories from families and professionals who found success with HealthProAssist.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <Card key={index} className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-5 w-5 text-warning fill-current" />)}
                  </div>
                  <p className="text-text-primary mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-text-primary">{testimonial.name}</div>
                    <div className="text-sm text-text-secondary">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-16 bg-surface-soft">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <FeedbackSystem />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated with Senior Care Insights
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get weekly tips, industry updates, and exclusive resources delivered to your inbox.
          </p>

          <div className="max-w-md mx-auto flex gap-4">
            <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white text-text-primary" />
            <Button className="bg-sky-500 hover:bg-sky-600 text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Parallax Divider */}
      <ParallaxDivider />

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-text-secondary">
                Have questions? Our team is here to help you find the perfect care solution.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="glass-card text-center">
                <CardContent className="p-6">
                  <Phone className="h-12 w-12 text-primary-bright mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Call Us</h3>
                  <p className="text-text-secondary">
                    <a href="tel:1-623-300-2065" className="hover:text-primary-bright">
                      1 (623) 300-2065
                    </a>
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card text-center">
                <CardContent className="p-6">
                  <Mail className="h-12 w-12 text-primary-bright mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Email Us</h3>
                  <p className="text-text-secondary">
                    <a href="mailto:contact@healthproassist.com" className="hover:text-primary-bright">
                      contact@healthproassist.com
                    </a>
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card text-center">
                <CardContent className="p-6">
                  <MapPin className="h-12 w-12 text-primary-bright mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Visit Us</h3>
                  <p className="text-text-secondary">
                    Nationwide Service<br />
                    Located in Arizona, USA
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default HomePage;
