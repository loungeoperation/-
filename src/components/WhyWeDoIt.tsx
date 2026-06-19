import React from 'react';
import { motion } from 'motion/react';
import { Target, Award, Star, Gem, UserCheck } from 'lucide-react';

export default function WhyWeDoIt() {
  return (
    <section id="why-we-do-it" className="py-24 bg-brand-navy-950 border-b border-brand-gold-500/10 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute right-0 top-1/3 w-96 h-96 bg-brand-gold-500/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center md:text-left mb-16">
          <span className="text-[10px] font-mono tracking-[0.2em] text-brand-gold-400 font-bold uppercase block mb-3">
            01 / Philosophy of Concentration
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-white tracking-tight leading-[130%]" id="why-title">
            왜 대형사처럼 문어발 확장을 하지 않고 <br className="hidden sm:inline" />
            <span className="text-brand-gold-400 font-bold font-sans">‘딱 1곳’만</span> 맡을까요?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-stretch" id="why-grid">
          {/* Left Text Column */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div className="text-gray-300 text-sm sm:text-base space-y-10 leading-[1.8] font-normal" id="philosophy-paragraphs-container">
              <p className="leading-[1.8]">
                대형 위탁사의 규격화된 시스템은 대량 확장에 용이하지만, <br />
                한 개 호텔의 고유한 브랜드 가치와 현장의 미세한 디테일까지 돌보기는 어렵습니다. <br /><br />
                우리는 본사에서 숫자로만 원격 관리하는 방식 대신, <br />
                현장에 밀착하는 마이크로 오퍼레이션으로 대형사가 채울 수 없는 완벽함과 지속 가능한 매출 상승을 확실하게 증명합니다.
              </p>
              
              <p className="border-l-4 border-brand-gold-500 pl-5 py-3 bg-brand-navy-900/40 text-gray-250 leading-[1.8]">
                특히 온라인 평판 악화와 매출 부진은 자산의 시장 가치를 직접적으로 떨어뜨려,<br />
                향후 건물의 유리한 매각이나 자산 엑시트(Exit) 계획 전체에<br />
                <strong className="text-brand-gold-400 font-bold">치명적인 손실과 중대한 구도의 차질을 초래</strong>하게 됩니다.
              </p>
 
              <p className="text-gray-400 text-sm sm:text-base leading-[1.8]">
                평점 3.0점짜리 침체된 업장을 5.0점 만점의 지역 랜드마크로 변화시킨 힘은 <br />
                오직 ‘타협 없는 집중력’에서 출발합니다. 
                매각 엑시트 시 자산 가치를 완벽히 수호하기 위해, <br />
                우리는 이번 기수에도 오직 <span className="text-brand-gold-300 font-bold underline">단 한 곳의 프리미엄 파트너십</span>에만 <br />
                우리의 모든 리소스를 던집니다.
              </p>
            </div>

            <div className="mt-4 pt-6 border-t border-brand-gold-500/10 flex items-center space-x-3 text-brand-gold-300 text-sm font-sans" id="why-declaration">
              <UserCheck className="w-5 h-5 text-brand-gold-400 flex-shrink-0" />
              <span>우리는 수많은 호텔 중 하나가 아닌, 지역의 무조건적인 랜드마크를 설계합니다.</span>
            </div>
          </div>

          {/* Right Highlight Stats Card Column */}
          <div className="md:col-span-5 flex" id="why-highlight-stats">
            <div className="w-full bg-linear-to-b from-brand-navy-900 to-brand-navy-950 p-8 rounded border border-brand-gold-500/20 text-center flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-brand-gold-500/5 rotate-45 translate-x-8 -translate-y-8"></div>
              
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-brand-gold-500/10 border border-brand-gold-500/30 flex items-center justify-center text-brand-gold-400">
                  <Target className="w-6 h-6" />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono tracking-widest text-brand-gold-400 uppercase">Lounge Operation Record</p>
                <h3 className="text-5xl lg:text-6xl font-display font-black text-white mt-2 tracking-tight">
                  5.0 <span className="text-lg text-brand-gold-500 font-light">/ 5.0</span>
                </h3>
                <div className="flex justify-center space-x-1 text-brand-gold-500 my-3">
                  <Star className="w-4 h-4 fill-brand-gold-500" />
                  <Star className="w-4 h-4 fill-brand-gold-500" />
                  <Star className="w-4 h-4 fill-brand-gold-500" />
                  <Star className="w-4 h-4 fill-brand-gold-500" />
                  <Star className="w-4 h-4 fill-brand-gold-500" />
                </div>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-2 leading-relaxed">
                  포털 및 국내외 메이저 OTA(아고다, 야놀자 등) <b className="text-gray-200">실제 누적 리뷰 평점 만점</b> 달성
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-brand-gold-500/10 text-xs italic text-brand-gold-300 font-mono">
                "Only One Partnered Hotel"
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
