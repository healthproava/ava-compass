# HealthProAssist - AI-Powered Senior Care Placement

**Your intelligent assistant for finding the perfect senior care solution**

HealthProAssist is a comprehensive web application that helps families find, compare, and connect with senior care facilities. Our AI assistant AVA provides personalized guidance through voice and text interactions, making the complex process of finding senior care simple and stress-free.

## 🌟 Key Features

### AVA - AI Voice Assistant
- **Voice-powered conversations** using ElevenLabs technology
- **Intelligent facility search** with personalized recommendations
- **Real-time guidance** through the care selection process
- **Interactive assessments** to understand care needs

### Comprehensive Care Tools
- **Facility Finder** - Search and filter thousands of care facilities
- **Cost Calculator** - Estimate care costs with detailed breakdowns
- **Emergency Contacts** - Quick access to essential emergency services
- **Timeline Planner** - Organize the transition process step-by-step

### Smart Search & Comparison
- **Advanced filtering** by location, care type, amenities, and budget
- **Side-by-side facility comparison** with detailed metrics
- **Interactive maps** with facility locations and details
- **Favorites system** to save and organize potential options

### Specialized Support
- **Veteran care specialists** with VA benefits integration
- **Memory care expertise** for dementia and Alzheimer's
- **Assisted living options** from independent to full-care
- **Home health services** directory and resources

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom design system
- **shadcn/ui** components for consistent interface
- **React Query** for efficient data management
- **React Router** for seamless navigation

### Backend & AI
- **Supabase** for database, authentication, and real-time features
- **ElevenLabs** for advanced voice AI capabilities
- **OpenAI** for intelligent conversation processing
- **Edge Functions** for serverless backend logic

### External Integrations
- **Google Maps API** for location services
- **Serper API** for enhanced search capabilities
- **Stripe** for payment processing
- **Resend** for email communications

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- ElevenLabs API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd healthproassist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   - Configure Supabase project settings
   - Add required API keys to Supabase secrets
   - Set up authentication providers

4. **Start development server**
   ```bash
   npm run dev
   ```

### Required API Keys
Configure these in your Supabase project secrets:
- `ELEVENLABS_API_KEY` - For voice AI functionality
- `OPENAI_API_KEY` - For conversation processing
- `GOOGLE_MAPS_API` - For location services
- `SERPER_API_KEY` - For enhanced search

## 📱 Core Functionality

### For Families
- **Guided Assessment** - AVA helps identify specific care needs
- **Personalized Search** - AI-powered facility recommendations
- **Virtual Tours** - Explore facilities with detailed information
- **Cost Planning** - Transparent pricing and financial planning tools

### For Care Facilities
- **Profile Management** - Showcase amenities and services
- **Lead Generation** - Connect with qualified families
- **Analytics Dashboard** - Track engagement and inquiries
- **Contract Management** - Streamlined paperwork process

### For Care Agents
- **Client Management** - Organize and track family interactions
- **Commission Tracking** - Monitor placements and earnings
- **Resource Library** - Access to care guides and documentation
- **Referral Network** - Connect with other care professionals

## 🏗️ Architecture

### Database Schema
- **User Management** - Multi-role authentication system
- **Facility Data** - Comprehensive care facility information
- **Search & Favorites** - User preferences and saved searches
- **Analytics** - Interaction tracking and insights

### Real-time Features
- **Live Chat** - Instant communication with AVA
- **Search Updates** - Real-time facility availability
- **Notification System** - Important updates and reminders
- **Collaborative Planning** - Family member coordination

## 🔒 Security & Privacy

- **HIPAA Compliance** considerations for health information
- **Row-Level Security** (RLS) for data protection
- **Encrypted Communications** for all sensitive data
- **User Consent Management** for data collection

## 🌐 Deployment

### Lovable Platform
1. Open [Lovable Project](https://lovable.dev/projects/fa81f042-67ff-4842-af16-065835f84a26)
2. Click "Share" → "Publish"
3. Configure custom domain if needed

### Self-Hosting
1. Build the application: `npm run build`
2. Deploy to your preferred hosting platform
3. Configure environment variables
4. Set up Supabase production environment

## 📄 License & Usage

This project is built for senior care placement services. For commercial usage, licensing, or partnerships, please contact the development team.

## 🤝 Contributing

We welcome contributions from developers passionate about improving senior care accessibility. Please follow our contribution guidelines and code of conduct.

---

**Built with ❤️ for families navigating senior care decisions**

*HealthProAssist - Making senior care placement simple, transparent, and stress-free.*