
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import AvaWidget from './AvaWidget';
import ResultsContainer from './ResultsContainer';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Heart, 
  Shield, 
  Clock,
  DollarSign,
  Users,
  Accessibility,
  Home,
  Building,
  User,
  Calendar,
  Activity,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Mic,
  FileText
} from 'lucide-react';

const FindCarePage = () => {
  const [showResults, setShowResults] = useState(false);
  const [step, setStep] = useState(1);
  const [assessmentMode, setAssessmentMode] = useState<'voice' | 'form'>('voice');
  const [facilities, setFacilities] = useState<any[]>([]);
  const [summary, setSummary] = useState<string>('');
  const { toast } = useToast();
  const totalSteps = 5;
  
  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dateOfBirth: "",
    gender: "",
    
    // Step 2: Health & Care Needs
    healthConditions: "",
    medications: "",
    mobilityStatus: "",
    adlNeeds: [] as string[],
    medicalEquipment: "",
    currentProvider: "",
    
    // Step 3: Preferences & Budget
    careType: "",
    preferredLocation: "",
    locationRadius: "15",
    roomPreference: "",
    monthlyBudget: "",
    paymentMethod: [] as string[],
    amenities: [] as string[],
    
    // Step 4: Document Upload
    medicalRecords: false,
    insuranceInfo: false,
    financialInfo: false,
    legalDocuments: false,
  });

  // Mock facility data
  const mockFacilities = [
    {
      id: 1,
      name: "Sunset Manor Senior Living",
      type: "Assisted Living",
      rating: 4.8,
      reviews: 127,
      address: "1234 Oak Street, Austin, TX 78701",
      phone: "(512) 555-0123",
      email: "info@sunsetmanor.com",
      price: "$3,200 - $4,800/month",
      features: ["Memory Care", "24/7 Nursing", "Veteran Friendly", "Pet Friendly"],
      image: "/api/placeholder/300/200",
      description: "A warm, homelike environment providing personalized care for seniors with dignity and respect."
    },
    {
      id: 2,
      name: "Heritage Gardens Care Center",
      type: "Memory Care",
      rating: 4.6,
      reviews: 89,
      address: "5678 Pine Avenue, Austin, TX 78704",
      phone: "(512) 555-0456",
      email: "contact@heritagegardens.com",
      price: "$4,500 - $6,200/month",
      features: ["Specialized Memory Care", "Secure Environment", "Music Therapy", "Family Support"],
      image: "/api/placeholder/300/200",
      description: "Specialized memory care with innovative programs designed for residents with Alzheimer's and dementia."
    },
    {
      id: 3,
      name: "Veterans' Haven Residence",
      type: "Independent Living",
      rating: 4.9,
      reviews: 156,
      address: "9012 Military Drive, Austin, TX 78745",
      phone: "(512) 555-0789",
      email: "welcome@veteranshaven.com",
      price: "$2,800 - $3,900/month",
      features: ["VA Benefits Accepted", "Veteran Community", "Transportation", "Fitness Center"],
      image: "/api/placeholder/300/200",
      description: "Exclusively serving our nation's heroes with honor, respect, and comprehensive veteran-focused care."
    }
  ];
  
  // Update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    if (name.startsWith('adlNeeds-') || name.startsWith('amenities-') || name.startsWith('paymentMethod-')) {
      const [groupName, value] = name.split('-');
      
      // Get current array
      const currentArray = [...formData[groupName as keyof typeof formData] as string[]];
      
      // Add or remove item
      if (checked) {
        if (!currentArray.includes(value)) {
          setFormData({
            ...formData,
            [groupName]: [...currentArray, value]
          });
        }
      } else {
        setFormData({
          ...formData,
          [groupName]: currentArray.filter(item => item !== value)
        });
      }
    } else {
      // For regular boolean checkboxes
      setFormData({
        ...formData,
        [name]: checked
      });
    }
  };
  
  // Navigation functions
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Final submit - show results
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Listen for events from AVA widget
  useEffect(() => {
    const handleSearchResults = (event: CustomEvent) => {
      console.log('Search results event:', event.detail);
      if (event.detail.facilities) {
        setFacilities(event.detail.facilities);
        setShowResults(true);
      }
      if (event.detail.summary) {
        setSummary(event.detail.summary);
      }
    };

    const handleShowToast = (event: CustomEvent) => {
      toast({
        title: "AVA Assistant",
        description: event.detail.message,
        duration: 5000,
      });
    };

    window.addEventListener('show-search-results', handleSearchResults as EventListener);
    window.addEventListener('show-toast', handleShowToast as EventListener);

    return () => {
      window.removeEventListener('show-search-results', handleSearchResults as EventListener);
      window.removeEventListener('show-toast', handleShowToast as EventListener);
    };
  }, [toast]);

  if (showResults) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-surface-soft">
        <div className="container mx-auto px-4">
          {/* Results Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Your Perfect Matches
            </h1>
            <p className="text-xl text-text-secondary">
              Based on your preferences, AVA found these highly rated facilities in your area.
            </p>
          </div>

          {/* Facility Results */}
          <div className="space-y-8">
            {mockFacilities.map((facility) => (
              <Card key={facility.id} className="glass-card hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Facility Image */}
                    <div className="relative">
                      <img
                        src={facility.image}
                        alt={facility.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Badge className="absolute top-2 left-2 bg-primary-bright text-white">
                        {facility.type}
                      </Badge>
                    </div>

                    {/* Facility Details */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-text-primary mb-2">
                            {facility.name}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(facility.rating)
                                      ? 'text-warning fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-text-secondary">
                              {facility.rating} ({facility.reviews} reviews)
                            </span>
                          </div>
                          <div className="flex items-center text-text-secondary mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            {facility.address}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-bright">
                            {facility.price}
                          </div>
                        </div>
                      </div>

                      <p className="text-text-secondary">{facility.description}</p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2">
                        {facility.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="border-primary-bright text-primary-bright">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-4">
                        <Button className="bg-primary-bright hover:bg-primary-dark">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </Button>
                        <Button variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                        <Button variant="outline">
                          <Heart className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline">
                          Schedule Tour
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Card className="glass-card max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-text-primary mb-4">
                  Need help choosing the right facility?
                </h3>
                <p className="text-text-secondary mb-6">
                  Schedule a free consultation with one of our care placement experts 
                  to discuss your options in detail.
                </p>
                <Button size="lg" className="bg-accent-patriotic hover:bg-accent-patriotic/90">
                  Schedule Free Consultation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface-soft">
      <div className="container mx-auto px-4">
        {/* Assessment Mode Selection */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Find Your Perfect Care
                </h1>
                <p className="text-xl text-text-secondary">
                  Choose your preferred way to complete your care assessment
                </p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => setAssessmentMode('voice')}
                  variant={assessmentMode === 'voice' ? 'default' : 'outline'}
                  size="lg"
                  className="flex items-center space-x-2"
                >
                  <Mic className="h-5 w-5" />
                  <span>Voice Assessment with AVA</span>
                </Button>
                <Button
                  onClick={() => setAssessmentMode('form')}
                  variant={assessmentMode === 'form' ? 'default' : 'outline'}
                  size="lg"
                  className="flex items-center space-x-2"
                >
                  <FileText className="h-5 w-5" />
                  <span>Traditional Form</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Split Screen Layout */}
        <div className="flex gap-6">
          {/* Left Side - Assessment */}
          <div className="w-1/2">
            {assessmentMode === 'voice' ? (
              <AvaWidget isFullScreen={true} />
            ) : (
              <div className="max-w-4xl mx-auto">
          {/* AVA Bot Box */}
          <Card className="glass-card mb-8 border-primary-bright/20">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary-bright flex items-center justify-center flex-shrink-0">
                  <img 
                    src="/lovable-uploads/3313fb44-68a6-4a0a-bd78-1fb211a5fe2f.png" 
                    alt="AVA" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-text-primary mb-2">AVA Assistant</h3>
                  <p className="text-text-secondary">
                    Hi! I'm AVA, your AI-powered care placement assistant. I'll help you find the perfect senior care facility 
                    by collecting detailed information about your needs. This comprehensive form will help us match you with 
                    the most suitable care options available.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">Step {step} of {totalSteps}</span>
              <span className="text-sm text-text-secondary">{Math.round((step / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-bright h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Card */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-text-primary">
                {step === 1 && "Basic Information"}
                {step === 2 && "Health & Care Needs"}
                {step === 3 && "Preferences & Budget"}
                {step === 4 && "Document Upload"}
                {step === 5 && "Review & Submit"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Let's start with some basic information"}
                {step === 2 && "Tell us about health conditions and care requirements"}
                {step === 3 && "Share your preferences and budget constraints"}
                {step === 4 && "Upload relevant documents to help us better assist you"}
                {step === 5 && "Review your information before submitting"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="min-h-[400px]">
                {/* Step 1: Basic Information */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="firstName" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="John"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="email" 
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="phone" 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="address" 
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="pl-10"
                          placeholder="123 Main St"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city" 
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Anytown"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input 
                          id="state" 
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="CA"
                        />
                      </div>
                      
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input 
                          id="zipCode" 
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          placeholder="12345"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="dateOfBirth" 
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select 
                          value={formData.gender} 
                          onValueChange={(value) => handleSelectChange("gender", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Health & Care Needs */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="healthConditions">Health Conditions</Label>
                      <div className="relative">
                        <Heart className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea 
                          id="healthConditions" 
                          name="healthConditions"
                          value={formData.healthConditions}
                          onChange={handleChange}
                          className="pl-10"
                          placeholder="Please list any diagnosed health conditions..."
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="medications">Current Medications</Label>
                      <Textarea 
                        id="medications" 
                        name="medications"
                        value={formData.medications}
                        onChange={handleChange}
                        placeholder="Please list current medications and dosages..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Mobility Status</Label>
                      <RadioGroup 
                        value={formData.mobilityStatus}
                        onValueChange={(value) => handleSelectChange("mobilityStatus", value)}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="independent" id="mobility-independent" />
                            <Label htmlFor="mobility-independent">Fully Independent</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cane" id="mobility-cane" />
                            <Label htmlFor="mobility-cane">Uses Cane/Walker</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="wheelchair" id="mobility-wheelchair" />
                            <Label htmlFor="mobility-wheelchair">Uses Wheelchair</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="bedridden" id="mobility-bedridden" />
                            <Label htmlFor="mobility-bedridden">Bedridden</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Activities of Daily Living (ADL) Needs</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {["Bathing", "Dressing", "Toileting", "Eating", "Medication Management", "Mobility Assistance", "Transportation"].map((adl) => (
                          <div key={adl} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`adl-${adl}`} 
                              checked={formData.adlNeeds.includes(adl)}
                              onCheckedChange={(checked) => handleCheckboxChange(`adlNeeds-${adl}`, !!checked)}
                            />
                            <Label htmlFor={`adl-${adl}`} className="text-sm">{adl}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="medicalEquipment">Medical Equipment Needed</Label>
                      <Input 
                        id="medicalEquipment" 
                        name="medicalEquipment"
                        value={formData.medicalEquipment}
                        onChange={handleChange}
                        placeholder="Oxygen, hospital bed, etc."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentProvider">Current Care Provider (if any)</Label>
                      <Input 
                        id="currentProvider" 
                        name="currentProvider"
                        value={formData.currentProvider}
                        onChange={handleChange}
                        placeholder="Current care provider name..."
                      />
                    </div>
                  </div>
                )}
                
                {/* Step 3: Preferences & Budget */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Type of Care Needed</Label>
                      <RadioGroup 
                        value={formData.careType}
                        onValueChange={(value) => handleSelectChange("careType", value)}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="independent" id="care-independent" />
                            <Label htmlFor="care-independent">Independent Living</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="assisted" id="care-assisted" />
                            <Label htmlFor="care-assisted">Assisted Living</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="memory" id="care-memory" />
                            <Label htmlFor="care-memory">Memory Care</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="nursing" id="care-nursing" />
                            <Label htmlFor="care-nursing">Nursing Home</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preferredLocation">Preferred Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="preferredLocation" 
                            name="preferredLocation"
                            value={formData.preferredLocation}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="City, State or ZIP"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="locationRadius">Search Radius (miles)</Label>
                        <Select 
                          value={formData.locationRadius} 
                          onValueChange={(value) => handleSelectChange("locationRadius", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select radius" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 miles</SelectItem>
                            <SelectItem value="10">10 miles</SelectItem>
                            <SelectItem value="15">15 miles</SelectItem>
                            <SelectItem value="25">25 miles</SelectItem>
                            <SelectItem value="50">50 miles</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Room Preference</Label>
                      <RadioGroup 
                        value={formData.roomPreference}
                        onValueChange={(value) => handleSelectChange("roomPreference", value)}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="private" id="room-private" />
                            <Label htmlFor="room-private">Private Room</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="shared" id="room-shared" />
                            <Label htmlFor="room-shared">Shared Room</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="studio" id="room-studio" />
                            <Label htmlFor="room-studio">Studio Apartment</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1-bedroom" id="room-1-bedroom" />
                            <Label htmlFor="room-1-bedroom">1-Bedroom Apartment</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="monthlyBudget">Monthly Budget</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Select 
                          value={formData.monthlyBudget} 
                          onValueChange={(value) => handleSelectChange("monthlyBudget", value)}
                        >
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2000-3000">$2,000 - $3,000</SelectItem>
                            <SelectItem value="3000-4000">$3,000 - $4,000</SelectItem>
                            <SelectItem value="4000-5000">$4,000 - $5,000</SelectItem>
                            <SelectItem value="5000-6000">$5,000 - $6,000</SelectItem>
                            <SelectItem value="6000+">$6,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Payment Methods</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {["Private Pay", "Long-term Care Insurance", "Medicare", "Medicaid", "Veterans Benefits"].map((method) => (
                          <div key={method} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`payment-${method}`} 
                              checked={formData.paymentMethod.includes(method)}
                              onCheckedChange={(checked) => handleCheckboxChange(`paymentMethod-${method}`, !!checked)}
                            />
                            <Label htmlFor={`payment-${method}`} className="text-sm">{method}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Important Amenities</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {["Pet Friendly", "Outdoor Spaces", "Private Dining", "Fitness Center", "Beauty Salon", "Transportation", "Religious Services", "Activities Program"].map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`amenity-${amenity}`} 
                              checked={formData.amenities.includes(amenity)}
                              onCheckedChange={(checked) => handleCheckboxChange(`amenities-${amenity}`, !!checked)}
                            />
                            <Label htmlFor={`amenity-${amenity}`} className="text-sm">{amenity}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 4: Document Upload */}
                {step === 4 && (
                  <div className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                      Uploading relevant documents helps us better assist you and speeds up the application process with facilities. 
                      Please check the documents you can provide.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-3 rounded-md border">
                        <Checkbox 
                          id="medicalRecords" 
                          checked={formData.medicalRecords}
                          onCheckedChange={(checked) => handleCheckboxChange("medicalRecords", !!checked)}
                        />
                        <div>
                          <Label htmlFor="medicalRecords">Medical Records</Label>
                          <p className="text-sm text-muted-foreground">
                            Recent doctor's summary, medication list, or care notes
                          </p>
                          <div className="mt-2">
                            <Label htmlFor="medicalRecordsFile" className="cursor-pointer">
                              <div className="flex items-center justify-center border border-dashed rounded-md p-4 hover:bg-slate-50">
                                <UploadCloud className="h-6 w-6 text-muted-foreground mr-2" />
                                <span className="text-sm text-muted-foreground">
                                  Click to upload medical records
                                </span>
                              </div>
                            </Label>
                            <input 
                              type="file" 
                              id="medicalRecordsFile" 
                              className="hidden"
                              accept=".pdf,.doc,.docx,.jpg,.png" 
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-3 rounded-md border">
                        <Checkbox 
                          id="insuranceInfo" 
                          checked={formData.insuranceInfo}
                          onCheckedChange={(checked) => handleCheckboxChange("insuranceInfo", !!checked)}
                        />
                        <div>
                          <Label htmlFor="insuranceInfo">Insurance Information</Label>
                          <p className="text-sm text-muted-foreground">
                            Medicare, Medicaid, private insurance cards or policy information
                          </p>
                          <div className="mt-2">
                            <Label htmlFor="insuranceInfoFile" className="cursor-pointer">
                              <div className="flex items-center justify-center border border-dashed rounded-md p-4 hover:bg-slate-50">
                                <UploadCloud className="h-6 w-6 text-muted-foreground mr-2" />
                                <span className="text-sm text-muted-foreground">
                                  Click to upload insurance documents
                                </span>
                              </div>
                            </Label>
                            <input 
                              type="file" 
                              id="insuranceInfoFile" 
                              className="hidden"
                              accept=".pdf,.doc,.docx,.jpg,.png" 
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-3 rounded-md border">
                        <Checkbox 
                          id="financialInfo" 
                          checked={formData.financialInfo}
                          onCheckedChange={(checked) => handleCheckboxChange("financialInfo", !!checked)}
                        />
                        <div>
                          <Label htmlFor="financialInfo">Financial Information</Label>
                          <p className="text-sm text-muted-foreground">
                            Proof of income, assets, or benefit statements
                          </p>
                          <div className="mt-2">
                            <Label htmlFor="financialInfoFile" className="cursor-pointer">
                              <div className="flex items-center justify-center border border-dashed rounded-md p-4 hover:bg-slate-50">
                                <UploadCloud className="h-6 w-6 text-muted-foreground mr-2" />
                                <span className="text-sm text-muted-foreground">
                                  Click to upload financial documents
                                </span>
                              </div>
                            </Label>
                            <input 
                              type="file" 
                              id="financialInfoFile" 
                              className="hidden"
                              accept=".pdf,.doc,.docx,.jpg,.png" 
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-3 rounded-md border">
                        <Checkbox 
                          id="legalDocuments" 
                          checked={formData.legalDocuments}
                          onCheckedChange={(checked) => handleCheckboxChange("legalDocuments", !!checked)}
                        />
                        <div>
                          <Label htmlFor="legalDocuments">Legal Documents</Label>
                          <p className="text-sm text-muted-foreground">
                            Power of attorney, advance directives, or other legal paperwork
                          </p>
                          <div className="mt-2">
                            <Label htmlFor="legalDocumentsFile" className="cursor-pointer">
                              <div className="flex items-center justify-center border border-dashed rounded-md p-4 hover:bg-slate-50">
                                <UploadCloud className="h-6 w-6 text-muted-foreground mr-2" />
                                <span className="text-sm text-muted-foreground">
                                  Click to upload legal documents
                                </span>
                              </div>
                            </Label>
                            <input 
                              type="file" 
                              id="legalDocumentsFile" 
                              className="hidden"
                              accept=".pdf,.doc,.docx,.jpg,.png" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-4">
                      Note: Document upload is optional at this stage. You can also provide documents later 
                      during the facility application process.
                    </p>
                  </div>
                )}
                
                {/* Step 5: Review */}
                {step === 5 && (
                  <div className="space-y-4">
                    <p className="text-sm">
                      Please review your information before submitting. You can go back to any step to make changes.
                    </p>
                    
                    <div className="space-y-6">
                      <div className="border rounded-md p-4 space-y-3">
                        <h3 className="font-medium">Basic Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm font-medium">Name:</p>
                            <p className="text-sm">{formData.firstName} {formData.lastName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Contact:</p>
                            <p className="text-sm">{formData.email}</p>
                            <p className="text-sm">{formData.phone}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-sm font-medium">Address:</p>
                            <p className="text-sm">{formData.address}, {formData.city}, {formData.state} {formData.zipCode}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4 space-y-3">
                        <h3 className="font-medium">Health & Care Needs</h3>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium">Mobility Status:</p>
                            <p className="text-sm">{formData.mobilityStatus || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">ADL Needs:</p>
                            <p className="text-sm">{formData.adlNeeds.length > 0 ? formData.adlNeeds.join(", ") : "None specified"}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4 space-y-3">
                        <h3 className="font-medium">Preferences & Budget</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm font-medium">Care Type:</p>
                            <p className="text-sm">{formData.careType || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Monthly Budget:</p>
                            <p className="text-sm">{formData.monthlyBudget || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Location:</p>
                            <p className="text-sm">{formData.preferredLocation || "Not specified"} (within {formData.locationRadius} miles)</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Room Preference:</p>
                            <p className="text-sm">{formData.roomPreference || "Not specified"}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4 space-y-3">
                        <h3 className="font-medium">Documents Ready</h3>
                        <ul className="text-sm list-disc pl-5 space-y-1">
                          {formData.medicalRecords && <li>Medical Records</li>}
                          {formData.insuranceInfo && <li>Insurance Information</li>}
                          {formData.financialInfo && <li>Financial Information</li>}
                          {formData.legalDocuments && <li>Legal Documents</li>}
                          {!formData.medicalRecords && !formData.insuranceInfo && !formData.financialInfo && !formData.legalDocuments && <li>No documents selected</li>}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm">
                        By clicking Submit, you confirm that the information provided is accurate to the best of your knowledge.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button
                onClick={handleNext}
                className="bg-primary-bright hover:bg-primary-dark"
              >
                {step === totalSteps ? 'Submit' : 'Next'}
                {step !== totalSteps && <ChevronRight className="h-4 w-4 ml-2" />}
              </Button>
            </CardFooter>
          </Card>
              </div>
            )}
          </div>

          {/* Right Side - Results */}
          <div className="w-1/2">
            <ResultsContainer 
              facilities={facilities}
              summary={summary}
              isVisible={true}
            />
          </div>
        </div>
        
        <Toaster />
      </div>
    </div>
  );
};

export default FindCarePage;
