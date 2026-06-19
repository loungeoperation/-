import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Award, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';

export default function ProofSection() {
  return (
    <section id="proof" className="py-24 bg-brand-navy-900 border-b border-brand-gold-500/10 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-radial from-brand-navy-950/20 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono tracking-[0.2em] text-brand-gold-400 font-bold uppercase block mb-3">
            02 / Hard Proven Metrics
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-white tracking-tight" id="proof-title">
            이론만 말하지 않습니다. <span id="text-highlight-gold" className="text-brand-gold-400 font-bold font-sans">숫자</span>로 증명하는 압도적 성과
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-gray-400">
            실전 운영 데이터를 투명하게 공개하며, 모든 지표는 100% 실사 가능합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="proof-cards-container">
          {/* CASE 01 CARD */}
          <div className="bg-brand-navy-950 p-6 sm:p-8 rounded border border-brand-gold-500/20 flex flex-col justify-between hover:border-brand-gold-500/40 transition-all group" id="proof-card-1">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-brand-gold-500/10 border border-brand-gold-500/20 text-brand-gold-400 text-[10px] font-mono rounded tracking-widest uppercase">
                  CASE 01. RECOVERY CHIEF
                </span>
                <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-brand-gold-400" />
                  현재 직영 운영 및 매도 진행 중
                </span>
              </div>
              
              <h3 className="text-lg sm:text-xl font-display font-medium text-white tracking-tight leading-snug group-hover:text-brand-gold-300 transition-colors">
                지역 꼴등에서 1등으로 반전
              </h3>
              
              <p className="text-xs sm:text-sm text-gray-300 mt-2 mb-6 font-normal leading-relaxed">
                무리한 인하 경쟁과 관리 소홀로 망해가던 중소형 호텔을 인수하여,<br />
                라운지오퍼레이션 상주 전담 시스템으로 구조조정한<br />
                대표 이정표적 사례입니다.
              </p>

              {/* Metrics block */}
              <div className="space-y-4 bg-brand-navy-900/60 p-4 sm:p-5 rounded border border-brand-gold-500/10">
                {/* Metric 1 */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-gray-300 font-medium">📊 월 매출 성장세</span>
                    <span className="text-brand-gold-300 font-mono font-bold text-sm">400% 폭풍 성장</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-gray-500 text-xs line-through">1,500만 원</span>
                    <span className="text-brand-gold-400 text-lg font-bold">➡️</span>
                    <span className="text-white text-xl font-display font-extrabold text-brand-gold-400">
                      6,000만 원 <span className="text-xs font-normal text-gray-400">/ 월</span>
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-brand-gold-500/10"></div>

                {/* Metric 2 */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-gray-300 font-medium">⭐ OTA & 리뷰 평점</span>
                    <span className="text-brand-gold-400 font-mono text-sm font-semibold">셀프리모델링 및 리브랜딩</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs line-through">3.0점</span>
                      <span className="text-brand-gold-400 text-xs">➡️</span>
                      <span className="text-white text-lg font-display font-bold flex items-center gap-1">
                        5.0점 만점 <span className="text-xs text-brand-gold-500 font-mono">(100%)</span>
                      </span>
                    </div>
                    <span className="text-[10px] text-brand-gold-400 bg-brand-gold-500/15 border border-brand-gold-500/30 px-2 py-0.5 rounded font-medium">
                      현재 직영 운영 및 매도 진행 중
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-brand-gold-500/5 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-brand-gold-400" />
                현장 상주 총괄 담당자 밀착 케어 완료
              </span>
            </div>
          </div>

          {/* CASE 02 CARD */}
          <div className="bg-brand-navy-950 p-6 sm:p-8 rounded border border-brand-gold-500/20 flex flex-col justify-between hover:border-brand-gold-500/40 transition-all group" id="proof-card-2">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-brand-gold-500/10 border border-brand-gold-500/20 text-brand-gold-400 text-[10px] font-mono rounded tracking-widest uppercase">
                  CASE 02. UPPER REVENUE LOGIC
                </span>
                <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-brand-gold-400" />
                  성공적인 엑시트 완료
                </span>
              </div>
              
              <h3 className="text-lg sm:text-xl font-display font-medium text-white tracking-tight leading-snug group-hover:text-brand-gold-300 transition-colors">
                악조건의 상권 극복 및 자산 Exit
              </h3>
              
              <p className="text-xs sm:text-sm text-gray-300 mt-2 mb-6 font-normal leading-relaxed">
                과밀 경쟁 구도와 쇠퇴하는 상권 속에서 폐업 직전에 몰려있던<br />
                업장의 비효율을 걷어내고 최정예 마케팅 시스템을 도입하여<br />
                단숨에 가치를 복원하였습니다.
              </p>

              {/* Metrics block */}
              <div className="space-y-4 bg-brand-navy-900/60 p-4 sm:p-5 rounded border border-brand-gold-500/10">
                {/* Metric 1 */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-gray-300 font-medium">📈 월 매출 성장율</span>
                    <span className="text-brand-gold-300 font-mono font-bold text-sm">300% 매출 상승</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-gray-500 text-xs line-through">1,500만 원</span>
                    <span className="text-brand-gold-400 text-lg font-bold">➡️</span>
                    <span className="text-white text-xl font-display font-extrabold text-brand-gold-400">
                      4,500만 원 <span className="text-xs font-normal text-gray-400">/ 월</span>
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-brand-gold-500/10"></div>

                {/* Metric 2 */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-gray-300 font-medium">💰 최종 성과</span>
                    <span className="text-brand-gold-400 font-mono text-sm font-semibold">최적가 매각 성공 완료</span>
                  </div>
                  <p className="text-gray-200 text-sm mt-1 leading-relaxed font-medium">
                    죽은 상권의 애물단지 업장을 심폐소생하여 <span className="text-brand-gold-300 underline underline-offset-4 font-semibold">성공적인 자산 매각(Exit)</span> 완료
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-brand-gold-500/5 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-brand-gold-400" />
                부동산 자산 가치 재설계 및 고수익 엑시트 완료
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
