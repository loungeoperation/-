import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import WhyWeDoIt from './components/WhyWeDoIt';
import ProofSection from './components/ProofSection';
import CoreValue from './components/CoreValue';
import InboundForm from './components/InboundForm';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [currentAuthUser, setCurrentAuthUser] = useState<User | null>(null);

  // Monitor auth changes for header display status
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usr) => {
      setCurrentAuthUser(usr);
    });
    return () => unsub();
  }, []);

  const handleCtaClick = () => {
    const formElement = document.getElementById('inbound-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminToggle = () => {
    setIsAdminView(!isAdminView);
    // Smooth scroll up to top of screen when switching views
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="font-sans min-h-screen bg-brand-navy-950 text-gray-200 selection:bg-brand-gold-500 selection:text-brand-navy-950 overflow-x-hidden flex flex-col justify-between" id="app-wrapper">
      
      {/* GLOBAL BACKGROUND GLOW */}
      <div className="fixed inset-0 z-0 bg-radial from-brand-navy-900/40 via-brand-navy-950/90 to-brand-navy-950 pointer-events-none"></div>

      {/* HEADER BAR */}
      <Header 
        onAdminClick={handleAdminToggle} 
        isAdminView={isAdminView} 
        userEmail={currentAuthUser?.email || null}
      />

      {/* CORE WRAPPED SWITCHER */}
      <main className="relative z-10 flex-grow" id="main-content-area">
        <AnimatePresence mode="wait">
          {isAdminView ? (
            /* CASE 1: BACKOFFICE ADMINISTRATION PLATFORM */
            <motion.div
              key="admin-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              id="admin-outer-container"
            >
              <AdminPanel />
            </motion.div>
          ) : (
            /* CASE 2: MAIN USER-FACING LANDING PORTAL (ONE PAGE STRUCTURE) */
            <motion.div
              key="landing-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-0"
              id="landing-outer-container"
            >
              <HeroSection onCtaClick={handleCtaClick} />
              
              <WhyWeDoIt />
              
              <ProofSection />
              
              <CoreValue />
              
              <InboundForm onSubmissionSuccess={(data) => {
                console.log("Inbound form submission synchronized to main app state: ", data);
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER SECTION */}
      <Footer onAdminClick={handleAdminToggle} />
    </div>
  );
}
