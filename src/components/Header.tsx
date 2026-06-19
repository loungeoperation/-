import React from 'react';
import { Shield, Volume2, Building, Layers } from 'lucide-react';

interface HeaderProps {
  onAdminClick: () => void;
  isAdminView: boolean;
  userEmail: string | null;
}

export default function Header({ onAdminClick, isAdminView, userEmail }: HeaderProps) {
  const handleScroll = (id: string) => {
    if (isAdminView) {
      onAdminClick(); // switch back to user landing
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-navy-950/90 backdrop-blur-md border-b border-brand-gold-500/20 py-4 uppercase tracking-widest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => {
            if (isAdminView) onAdminClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center space-x-2 cursor-pointer group"
          id="logo-brand"
        >
          <div className="w-8 h-8 rounded-sm bg-brand-gold-500 flex items-center justify-center font-bold text-brand-navy-950 text-sm group-hover:scale-105 transition-transform">
            LO
          </div>
          <div>
            <span className="font-display font-bold text-gray-100 text-sm tracking-[0.2em] sm:text-base">
              LOUNGE <span className="text-brand-gold-500">OPERATION</span>
            </span>
            <span className="hidden sm:inline-block ml-3 px-2 py-0.5 border border-brand-gold-500/30 text-[10px] text-brand-gold-400 font-mono scale-90">
              PREMIUM ONLY
            </span>
          </div>
        </div>

        {/* Navigation / Actions */}
        <div className="flex items-center space-x-2 sm:space-x-6">
          {!isAdminView && (
            <nav className="hidden md:flex items-center space-x-6 text-xs text-gray-300 font-medium">
              <button 
                onClick={() => handleScroll('why-we-do-it')} 
                className="hover:text-brand-gold-400 pb-1 border-b border-transparent hover:border-brand-gold-400/30 transition-all cursor-pointer"
                id="link-why-we-do-it"
              >
                철학 (Why)
              </button>
              <button 
                onClick={() => handleScroll('proof')} 
                className="hover:text-brand-gold-400 pb-1 border-b border-transparent hover:border-brand-gold-400/30 transition-all cursor-pointer"
                id="link-proof"
              >
                성과 (Proof)
              </button>
              <button 
                onClick={() => handleScroll('core-weapons')} 
                className="hover:text-brand-gold-400 pb-1 border-b border-transparent hover:border-brand-gold-400/30 transition-all cursor-pointer"
                id="link-core-weapons"
              >
                핵심 무기
              </button>
              <button 
                onClick={() => handleScroll('inbound-form')} 
                className="bg-gradient-to-r from-brand-gold-500 via-brand-gold-450 to-brand-gold-400 hover:from-brand-gold-400 hover:to-brand-gold-300 text-brand-navy-950 px-5 py-2.5 rounded-sm font-extrabold tracking-wider hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.35)] cursor-pointer text-xs sm:text-sm whitespace-nowrap"
                id="link-apply"
              >
                30초 진단 신청
              </button>
            </nav>
          )}

          <button
            onClick={onAdminClick}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-medium border transition-all duration-300 cursor-pointer ${
              isAdminView 
                ? 'bg-brand-gold-500 text-brand-navy-950 border-brand-gold-500 hover:bg-brand-gold-400 opacity-100' 
                : 'bg-brand-navy-900 text-brand-gold-400 border-brand-gold-500/30 hover:border-brand-gold-500 hover:bg-brand-navy-800 opacity-0 hover:opacity-100'
            }`}
            title="관리자 전용 문의 리스트"
            id="admin-toggle-btn"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isAdminView ? '랜딩페이지 돌아가기' : '관리자 오피스'}
            </span>
            <span className="sm:hidden">
              {isAdminView ? '랜딩' : '관리자'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
