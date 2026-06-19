import React from 'react';
import { motion } from 'motion/react';
import { Home, Share2, Wrench, FileText, BarChart3, Star, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function CoreValue() {
  const weapons = [
    {
      num: "01",
      title: "대표·지배인·담당자 전원 업장 상주 시스템",
      desc: `담당자가 수시로 바뀌며 본사 지시만 기다리는 대형 위탁사와 근본적으로 다릅니다.
      현장 관리의 퀄리티를 유지하기 위해 의사결정 권한이 있는 최고 책임자 전원이 상주하여
      1:1 마이크로 매니지먼트를 강도 높게 실행합니다.`,
      icon: Home,
      tag: "현장 밀착"
    },
    {
      num: "02",
      title: "최상위 정보력 및 마케팅 인프라 보유",
      desc: `단순히 예약 대행사에 기댔던 과거를 탈피합니다.
      바이럴 마케팅 실행사, 미디어 전문 콘텐츠 제작사, 국내외 대형 OTA사, 대형 프랜차이즈 위탁사 등
      긴밀하고도 강력한 실무 협업 네트워크를 통해 시장 공략 트렌드를 완벽하게 선점합니다.`,
      icon: Share2,
      tag: "독보적 마케팅"
    },
    {
      num: "03",
      title: "공사 직종 출신 관리자의 직접 보수 시스템",
      desc: `문이 삐걱대거나 전구가 나갈 때마다 청구되는 외주 수리 비용의 거품을 100% 제거합니다.
      엔지니어링 및 공사 직종 실무 경력의 관리자가 직접 시설의 하자와 마이너 보수를 그날 즉시 처리하여
      운영 고정비를 혁신적으로 낮추고 자산 가치를 유지시킵니다.`,
      icon: Wrench,
      tag: "고정비 절감"
    },
    {
      num: "04",
      title: "1:1 투명한 정산 및 즉각적인 업무 보고",
      desc: `수탁자와 위탁자 간의 고질적인 정산 불투명 장벽을 깨고 허물어버립니다.
      모든 수입과 자금 집행, 데일리 운영 현황, 주요 VOC 및 고객 피드백은 실시간으로 조율 및 정밀 공유되며,
      오너의 피드백은 그 즉시 적용됩니다.`,
      icon: FileText,
      tag: "실시간 투명성"
    },
    {
      num: "05",
      title: "데이터 기반의 철저한 상권·업장 상세 분석",
      desc: `어렴풋한 감이나 막연한 경험에 의존하는 구식 운영은 실패의 지름길입니다.
      OTA 검색량 동향, 주변 상권의 요일별/연령대별 결제 데이터, 시즌별 키워드 트렌드 등
      철저한 데이터 수집과 정밀 필터링 분석을 바탕으로 객실가동률은 높이고 객단가를 점진적으로 극대화합니다.`,
      icon: BarChart3,
      tag: "데이터 예측"
    }
  ];

  return (
    <section id="core-weapons" className="py-24 bg-brand-navy-950 border-b border-brand-gold-500/10 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute left-1/4 bottom-10 w-80 h-80 bg-brand-gold-500/[0.01] rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono tracking-[0.2em] text-brand-gold-400 font-bold uppercase block mb-3">
            03 / Our Core Strategic Arsenals
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-white tracking-tight" id="core-title">
            대형 위탁사에는 없고, <br className="sm:hidden" />
            <span className="text-brand-gold-400 font-bold font-sans">라운지오퍼레이션</span>에만 있는 것
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
            왜 오직 한 곳의 호텔 파트너만 독점 매니지먼트하는가에 대한 전술적 증명입니다.<br />
            저희에게는 위탁 수수료만 챙기는 대리인이 아닌,<br />
            자산 가치를 상생(Win-Win)으로 설계하는 파트너입니다.
          </p>
        </div>

        {/* Weapons layout - modular staggered lists */}
        <div className="space-y-6" id="weapons-list-container">
          {weapons.map((w, index) => {
            const Icon = w.icon;
            return (
              <div 
                key={w.num}
                className="bg-brand-navy-900/40 hover:bg-brand-navy-900 border border-brand-gold-500/10 hover:border-brand-gold-500/30 p-6 sm:p-8 rounded transition-all duration-300 flex flex-col md:flex-row gap-6 items-start group relative overflow-hidden"
                id={`core-weapon-${w.num}`}
              >
                {/* Visual Number background glow */}
                <div className="absolute -right-4 -bottom-4 text-8xl font-display font-black text-brand-gold-500/[0.02] select-none pointer-events-none group-hover:text-brand-gold-500/[0.04] transition-colors">
                  {w.num}
                </div>

                {/* Left Side: Badge and Icon */}
                <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-3 shrink-0">
                  <div className="w-12 h-12 rounded bg-brand-gold-500/10 border border-brand-gold-500/20 flex items-center justify-center text-brand-gold-400 group-hover:bg-brand-gold-500 group-hover:text-brand-navy-950 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-brand-gold-400 block px-2 py-0.5 rounded bg-brand-gold-500/5 border border-brand-gold-500/15">
                      {w.tag}
                    </span>
                  </div>
                </div>

                {/* Right Side: Text details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-gold-400 font-mono font-bold text-xs">{w.num}.</span>
                    <h3 className="text-base sm:text-lg font-display font-bold text-white group-hover:text-brand-gold-300 transition-colors">
                      {w.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-normal group-hover:text-gray-300 transition-colors whitespace-pre-line">
                    {w.desc}
                  </p>
                </div>

                {/* Small indicator right */}
                <div className="hidden md:flex align-middle justify-end opacity-0 group-hover:opacity-100 transition-opacity text-brand-gold-400 pl-4">
                  <ArrowUpRight className="w-5 h-5 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
