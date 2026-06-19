import React from 'react';
import { ShieldCheck, Heart, Sparkles, Building } from 'lucide-react';

interface FooterProps {
  onAdminClick: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  return (
    <footer className="bg-brand-navy-950 border-t border-brand-gold-500/10 py-16 px-4 sm:px-6 lg:px-8 relative z-10 text-gray-400">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Core Slogan Sincerity Banner */}
        <div className="text-center max-w-2xl mb-12 space-y-3" id="footer-slogan-box">
          <div className="flex justify-center mb-1">
            <Sparkles className="w-5 h-5 text-brand-gold-400 opacity-60 animate-pulse" />
          </div>
          <p className="text-sm sm:text-base font-display text-gray-200 tracking-wide font-medium italic leading-[2.2]">
            &ldquo;우리는 아무 업체나 많이 수락하지 않습니다.<br />
            하지만, 우리와 손잡는 <span className="text-brand-gold-400 font-semibold not-italic">단 한 곳</span>은<br />
            우리의 모든 리소스와 장인정신을 던져 <span className="text-white font-bold not-italic underline decoration-brand-gold-400/50 decoration-2 underline-offset-4 bg-brand-gold-500/10 px-1 py-0.5 rounded">무조건 지역 1등</span>으로 만듭니다.&rdquo;
          </p>
          <div className="h-[1px] w-24 bg-brand-gold-500/20 mx-auto mt-4"></div>
        </div>

        {/* Brand visual detail layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-brand-gold-500/10 pt-12 items-center text-center md:text-left text-xs mb-10" id="footer-meta-grid">
          <div>
            <div className="flex items-center justify-center md:justify-start space-x-2 font-display font-bold text-gray-100 text-sm tracking-wider uppercase">
              <div className="w-6 h-6 rounded-sm bg-brand-gold-500 flex items-center justify-center text-brand-navy-950 font-bold text-xs">
                LO
              </div>
              <span>LOUNGE <span className="text-brand-gold-500">OPERATION</span></span>
            </div>
            <p className="text-gray-500 mt-2 font-light leading-relaxed">
              소수 정예 프리미엄 호텔 1:1 매니지먼트 및 <br />
              경영 가치 향상 전술 파트너십 오퍼레이션.
            </p>
          </div>

          <div className="text-center space-y-1.5 self-center">
            <p className="font-mono text-[11px] text-brand-gold-400 tracking-widest font-semibold uppercase">HOTLINE INFORMATION</p>
            <p className="text-gray-300 font-medium">대표자 직통 상담: loungeinseoul@gmail.com</p>
            <p className="text-gray-300 font-medium">대표자 직통 전화: 010-7592-8075</p>
            <p className="text-gray-500">상권 분석 보고서 수취 기한: 제출일로부터 24시간 이내</p>
          </div>

          <div className="text-center md:text-right space-y-2">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs text-brand-gold-400 hover:text-brand-gold-300 underline font-mono cursor-pointer"
              id="footer-back-to-top"
            >
              ↑ BACK TO MAIN TOP
            </button>
            <div className="block">
              <button
                onClick={onAdminClick}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-brand-navy-900 hover:bg-brand-navy-800 border border-brand-gold-500/20 rounded text-[10px] text-brand-gold-300 font-mono tracking-wider cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300"
                id="footer-admin-btn"
              >
                <ShieldCheck className="w-3 h-3 text-brand-gold-400" />
                <span>ADMINISTRATOR OFFICE</span>
              </button>
            </div>
          </div>
        </div>

        {/* Copyleft / Rights disclaimer (No-larp, pristine labels) */}
        <div className="w-full text-center text-gray-600 text-[10px] sm:text-xs font-mono border-t border-brand-gold-500/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} LOUNGE OPERATION CO. ALL RIGHTS RESERVED.</span>
          <span className="flex items-center gap-1">
            Crafted with uncompromising dedication for loungeinseoul@gmail.com
          </span>
        </div>

      </div>
    </footer>
  );
}
