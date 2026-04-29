import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StrategicAdvantage from './components/StrategicAdvantage';
import AcquisitionCapacity from './components/AcquisitionCapacity';
import TrustCommandCenter from './components/TrustCommandCenter';
import ReverseEclipse from './components/ReverseEclipse';
import MapDossier from './components/MapDossier';
import RedAlertPortal from './components/RedAlertPortal';
import StatsCounter from './components/StatsCounter';
import ServiceAreas from './components/ServiceAreas';
import RelocationIntelligence from './components/RelocationIntelligence';
import ActiveInventory from './components/ActiveInventory';
import ChatLauncher from './components/ChatLauncher';
import MarketValidation from './components/MarketValidation';
import IntelFAQ from './components/IntelFAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import DMCANotice from './pages/DMCANotice';
import EmailPreview from './pages/EmailPreview';
import { ListingsProvider } from './context/ListingsContext';
import { LeadFormModalProvider } from './context/LeadFormModalContext';

function HomePage() {
  return (
    <LeadFormModalProvider>
      <ListingsProvider>
        <Navbar />
        <div className="site-content">
          <Hero />
          <ActiveInventory />
          <StrategicAdvantage />
          <ReverseEclipse />
          <MapDossier />
          <AcquisitionCapacity />
          <TrustCommandCenter />
          <StatsCounter />
          <RedAlertPortal />
          <MarketValidation />
          <ServiceAreas />
          <RelocationIntelligence />
          <IntelFAQ />
        </div>
        <FinalCTA />
        <Footer />
        <ChatLauncher />
      </ListingsProvider>
    </LeadFormModalProvider>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/dmca-notice" element={<DMCANotice />} />
      <Route path="/email-preview" element={<EmailPreview />} />
    </Routes>
  );
}

export default App;
