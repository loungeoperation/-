import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, AlertCircle, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onCtaClick: () => void;
}

export default function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden py-24 px-4 bg-radial from-brand-navy-900 via-brand-navy-950 to-brand-navy-950 border-b border-brand-gold-500/10">
      {/* Background Decorative Gold Grid Lines & Ellipse */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-gold-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Main Title Headings */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-medium text-white tracking-tight leading-[115%] max-w-5xl"
          id="hero-main-title"
        >
          수십 개 업장 중 하나가 되겠습니까, <br className="hidden md:inline" />
          라운지오퍼레이션의 <br />
          <span className="relative inline-block text-brand-gold-400">
            ‘유일한 하나’가 되겠습니까?
            <span className="absolute bottom-2 left-0 w-full h-[3px] bg-brand-gold-500/40"></span>
          </span>
        </motion.h1>

        {/* Subtitles & Descriptions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-10 max-w-3xl text-center font-sans space-y-4"
          id="hero-subtitle-box"
        >
          <p className="text-gray-200 text-sm sm:text-base font-normal tracking-wide leading-relaxed">
            라운지오퍼레이션은 딱 <span className="text-brand-gold-400 font-medium">‘1개 업체’만</span> 선착순 모집하여 1:1 마이크로 매니지먼트합니다.
          </p>
          <p className="text-lg sm:text-xl md:text-2xl font-display font-medium text-gray-250 tracking-tight leading-[145%]">
            우리의 모든 리소스와 정보력은 <br className="sm:hidden" />
            <span className="text-brand-gold-400 font-bold">오직 1개 업체에만 집중</span>됩니다.
          </p>
        </motion.div>

        {/* Action Button & Vacancies Monitor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-12 flex flex-col items-center gap-4 w-full px-4 sm:w-auto"
          id="hero-actions"
        >
          <button
            onClick={onCtaClick}
            className="w-full sm:w-auto bg-gradient-to-r from-brand-gold-600 via-brand-gold-500 to-brand-gold-400 text-brand-navy-950 font-semibold px-8 py-4 rounded shadow-[0_4px_20px_rgba(212,175,55,0.15)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.3)] transition-all transform hover:-translate-y-0.5 cursor-pointer uppercase text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2"
            id="hero-cta-btn"
          >
            현재 단 1곳 모집 중 - 즉시 무료 진단 신청하기
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>
          
          <div className="flex items-center space-x-2 text-xs text-brand-gold-300/80 font-mono">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>2026년 하반기 파트너십 가입 대기 가능</span>
          </div>
        </motion.div>

        {/* Simple features row for context depth */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-brand-gold-500/10 pt-10 w-full"
          id="hero-mini-specs"
        >
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-brand-gold-400">1:1</p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1 uppercase tracking-wider">독점 마이크로 매니디먼트</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-brand-gold-400">5.0</p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1 uppercase tracking-wider">포털/OTA 최고 리뷰 평점</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-brand-gold-400">365</p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1 uppercase tracking-wider">대표 및 총지배인 현장 상주</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-display font-bold text-brand-gold-400">400%</p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1 uppercase tracking-wider">최고 매출 증명 사례</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
