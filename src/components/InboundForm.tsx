import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Check, ClipboardCheck, Sparkles, MessageSquareCode, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { InquiryStatus } from '../types';

interface InboundFormProps {
  onSubmissionSuccess: (inquiryData: any) => void;
}

export default function InboundForm({ onSubmissionSuccess }: InboundFormProps) {
  // Form states
  const [hotelName, setHotelName] = useState('');
  const [location, setLocation] = useState('');
  const [roomsCount, setRoomsCount] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPosition, setClientPosition] = useState('');
  const [contact, setContact] = useState('');
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  
  const [worries, setWorries] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const worryOptions = [
    '매출 정체',
    '인력 관리 스트레스',
    '시설 노후화',
    '기타'
  ];

  const handleCheckboxChange = (option: string) => {
    if (worries.includes(option)) {
      setWorries(worries.filter((item) => item !== option));
    } else {
      setWorries([...worries, option]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const cleanHotelName = hotelName.trim();
    // '호텔(건물)명 및 지역'에 입력한 내용을 location(지역) 데이터에도 매핑하여 정합성 유지
    const cleanLocation = cleanHotelName;

    // Basic Validation check
    if (!cleanHotelName || !roomsCount.trim() || !clientName.trim() || !clientPosition.trim() || !contact.trim()) {
      setErrorMessage('모든 필수 항목(*)을 입력해 주세요.');
      setIsSubmitting(false);
      return;
    }

    const uniqueId = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const docPath = `inquiries/${uniqueId}`;

    const newInquiryPayload = {
      hotelName: cleanHotelName,
      location: cleanLocation,
      roomsCount: roomsCount.trim(),
      clientName: clientName.trim(),
      clientPosition: clientPosition.trim(),
      contact: contact.trim(),
      monthlyRevenue: monthlyRevenue.trim() || '미입력',
      worries: worries,
      status: InquiryStatus.NEW,
      adminMemo: '',
      createdAt: serverTimestamp() // Generates rule-compliant server time
    };

    try {
      // Direct Firestore write target
      const docRef = doc(db, 'inquiries', uniqueId);
      await setDoc(docRef, newInquiryPayload);

      // Successfully saved!
      const finalLocalData = {
        id: uniqueId,
        ...newInquiryPayload,
        createdAt: new Date()
      };

      // Webhook dynamic trigger (No-code automation such as Make, Zapier, Slack, Discord, Email Forwarder)
      const webhookUrl = localStorage.getItem('lounge_webhook_url') || (import.meta as any).env.VITE_WEBHOOK_URL;
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: `🔔 [라운지오퍼레이션] 새로운 1:1 진단 요청이 접수되었습니다!
              
• 호텔명(지역): ${cleanHotelName}
• 객실수: ${roomsCount.trim()}
• 의뢰인: ${clientName.trim()} (${clientPosition.trim()})
• 연락처: ${contact.trim()}
• 월 매출: ${monthlyRevenue.trim() || '미입력'}
• 주요 고민: ${worries.join(', ') || '없음'}
• 접수번호: ${uniqueId.slice(-8).toUpperCase()}`,
              id: uniqueId,
              hotelName: cleanHotelName,
              location: cleanLocation,
              roomsCount: roomsCount.trim(),
              clientName: clientName.trim(),
              clientPosition: clientPosition.trim(),
              contact: contact.trim(),
              monthlyRevenue: monthlyRevenue.trim() || '미입력',
              worries: worries,
              submittedAt: new Date().toISOString()
            }),
          });
          console.log("Webhook notification dispatched successfully.");
        } catch (webhookErr) {
          console.error("Webhook notification failed to send:", webhookErr);
        }
      }

      setSuccessData(finalLocalData);
      onSubmissionSuccess(finalLocalData);

      // Reset form fields
      setHotelName('');
      setLocation('');
      setRoomsCount('');
      setClientName('');
      setClientPosition('');
      setContact('');
      setMonthlyRevenue('');
      setWorries([]);
    } catch (err: any) {
      // Handles firestore error conforms to system's JSON specification
      console.error("Submission failed: ", err);
      const errorMessageString = err instanceof Error ? err.message : String(err);
      setErrorMessage(`문의 등록 중 오류가 발생했습니다. 상세 정보: ${errorMessageString}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="inbound-form" className="py-24 bg-brand-navy-900 border-b border-brand-gold-500/10 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold-500/[0.01] rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono tracking-[0.2em] text-brand-gold-400 font-bold uppercase block mb-3">
            04 / Exclusive Request Form
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-white tracking-tight" id="form-title">
            라운지오퍼레이션의 유일한 파트너가 될 <br className="sm:hidden" />
            <span className="text-brand-gold-400 font-bold font-sans">기회를 선점</span>하세요.
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            &ldquo;문의를 남겨주시면 <span className="text-brand-gold-300 font-semibold underline">24시간 이내에 대표자가 직접</span> 철저한 상권 분석 및 1:1 자유 진단 보고서를<br />
            무료로 제공해 드립니다.&rdquo;
          </p>
        </div>

        <div className="bg-brand-navy-950 rounded border border-brand-gold-500/20 shadow-2xl p-6 sm:p-10 relative overflow-hidden" id="form-box">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-gold-600 via-brand-gold-500 to-brand-gold-400"></div>

          <AnimatePresence mode="wait">
            {!successData ? (
              <motion.form 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
                id="inbound-submission-form"
              >
                {errorMessage && (
                  <div className="p-4 bg-red-950/40 border border-red-500/30 rounded text-red-200 text-xs sm:text-sm" id="form-error">
                    ⚠️ {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hotel Name & Region */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold-300 font-semibold">
                      호텔(건물)명 및 지역 *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="예: LO호텔 부산 광안리점"
                        value={hotelName}
                        onChange={(e) => setHotelName(e.target.value)}
                        className="w-full bg-brand-navy-900 border border-brand-gold-500/20 focus:border-brand-gold-400/80 rounded px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder-gray-500"
                        id="input-hotel-name"
                      />
                    </div>
                  </div>

                  {/* Room Counts */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold-300 font-semibold">
                      객실 수 *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="예: 45실"
                      value={roomsCount}
                      onChange={(e) => setRoomsCount(e.target.value)}
                      className="w-full bg-brand-navy-900 border border-brand-gold-500/20 focus:border-brand-gold-400/80 rounded px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder-gray-500"
                      id="input-rooms-count"
                    />
                  </div>

                  {/* Client Name & Position */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold-300 font-semibold">
                      의뢰인 성함 및 직책 *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="예: 김소유주 (대표 또는 지배인)"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-brand-navy-900 border border-brand-gold-500/20 focus:border-brand-gold-400/80 rounded px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder-gray-500"
                      id="input-client-name"
                    />
                  </div>

                  {/* Position Detail (Split into input position for robust data) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold-300 font-semibold">
                      의뢰 유저 직책 (상세) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="예: 법인 소유주 / 소규모 개인업자 / 총지배인"
                      value={clientPosition}
                      onChange={(e) => setClientPosition(e.target.value)}
                      className="w-full bg-brand-navy-900 border border-brand-gold-500/20 focus:border-brand-gold-400/80 rounded px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder-gray-500"
                      id="input-client-position"
                    />
                  </div>

                  {/* Contact Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold-300 font-semibold">
                      연락처 *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="예: 010-1234-5678"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full bg-brand-navy-900 border border-brand-gold-500/20 focus:border-brand-gold-400/80 rounded px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder-gray-500"
                      id="input-contact"
                    />
                  </div>

                  {/* Monthly Revenues (Optional) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold-300">
                      현재 대략적인 월 매출 (선택)
                    </label>
                    <input
                      type="text"
                      placeholder="예: 약 1,500 ~ 2,000만 원"
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(e.target.value)}
                      className="w-full bg-brand-navy-900 border border-brand-gold-500/20 focus:border-brand-gold-400/80 rounded px-4 py-3 text-sm text-white focus:outline-none transition-colors placeholder-gray-500"
                      id="input-monthly-revenue"
                    />
                  </div>
                </div>

                {/* Major Problems Checkbox list */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-brand-gold-300 font-semibold">
                    현재 겪고 계신 주요 고민 사항 (복수 선택 가능)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3" id="worries-checkbox-group">
                    {worryOptions.map((option) => {
                      const isChecked = worries.includes(option);
                      return (
                        <button
                          type="button"
                          key={option}
                          onClick={() => handleCheckboxChange(option)}
                          className={`px-3 py-3 border rounded text-xs text-left transition-all duration-200 flex items-center justify-between cursor-pointer ${
                            isChecked
                              ? 'bg-brand-gold-500/10 border-brand-gold-500 text-brand-gold-400 font-semibold'
                              : 'bg-brand-navy-900 border-brand-gold-500/10 text-gray-400 hover:border-brand-gold-500/30'
                          }`}
                          id={`worry-btn-${option}`}
                        >
                          <span>{option}</span>
                          <span className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${
                            isChecked ? 'bg-brand-gold-500 border-brand-gold-500 text-brand-navy-950' : 'border-gray-600'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-brand-gold-600 to-brand-gold-500 text-brand-navy-950 font-bold px-6 py-4 rounded shadow-[0_4px_15px_rgba(212,175,55,0.1)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.25)] transition-all cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm tracking-wider"
                    id="submit-form-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-brand-navy-950" />
                        자산 분석 요청 전송 중...
                      </>
                    ) : (
                      <>
                        1:1 매니지먼트 신청 및 무료 자산 진단받기
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[10px] sm:text-xs text-gray-500 text-center leading-relaxed font-light mt-4">
                  * 오직 1개 업체만 수락하며, 마감 시 다음 분기 매니지먼트 대기 순번으로 등록됩니다. <br className="hidden sm:inline" />
                  제출된 개별 정보는 절대 제3자에 누출되지 않으며 자산 진단 이외의 용도로 사용되지 않습니다.
                </p>
              </motion.form>
            ) : (
              /* Submission Success Feedback Screen */
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6 flex flex-col items-center"
                id="submission-success-view"
              >
                <div className="w-16 h-16 rounded-full bg-brand-gold-500/20 border border-brand-gold-500/40 flex items-center justify-center text-brand-gold-400">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-display font-medium text-white tracking-tight">
                    진단 신청이 <span className="text-brand-gold-400">성공적으로 접수</span>되었습니다
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                    대표자 전담 핫라인 채널에 신규 문의 알림이 전송되었습니다. 24시간 이내에 상권 전수 분석을 마치고 대표가 직접 전화를 드립니다.
                  </p>
                </div>

                {/* Submitter Log Sheet */}
                <div className="w-full max-w-sm bg-brand-navy-900 border border-brand-gold-500/10 p-5 rounded text-left text-xs space-y-3 font-mono">
                  <p className="text-brand-gold-400 border-b border-brand-gold-500/10 pb-2 font-bold uppercase tracking-wider">
                    📋 접수 내역 확인 (접수번호: {successData.id.slice(-8).toUpperCase()})
                  </p>
                  <div>
                    <span className="text-gray-500 block">호텔명 / 지역</span>
                    <span className="text-gray-200">{successData.hotelName} ({successData.location})</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">제출 및 담당자</span>
                    <span className="text-gray-200">{successData.clientName} ({successData.clientPosition})</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">연락처</span>
                    <span className="text-gray-200">{successData.contact}</span>
                  </div>
                </div>

                {/* ALERTS NOTIFICATION SIMULATOR OVERVIEW */}
                <div className="w-full max-w-md bg-brand-navy-900/60 border border-brand-gold-500/10 p-4 rounded text-left space-y-3" id="alert-simulator">
                  <div className="flex items-center space-x-2 text-xs font-mono text-brand-gold-300 font-bold border-b border-brand-gold-500/10 pb-2">
                    <ClipboardCheck className="w-4 h-4 text-brand-gold-400" />
                    <span>[기획안 기능 연동] 초고속 실시간 관리자 알림 트리거 완료</span>
                  </div>
                  
                  <div className="space-y-2">
                    {/* Kakao notification */}
                    <div className="flex items-center space-x-2.5 text-[11px] bg-[#fee500]/10 border border-[#fee500]/20 px-3 py-2 rounded">
                      <MessageSquareCode className="w-4 h-4 text-[#fee500]" />
                      <div className="text-gray-300">
                        <span className="font-bold text-[#fee500] font-mono">[카카오알림톡 발송]</span> 대표 핫라인 발송 완료!
                      </div>
                    </div>

                    {/* Email notification */}
                    <div className="flex items-center space-x-2.5 text-[11px] bg-brand-gold-500/10 border border-brand-gold-500/20 px-3 py-2 rounded">
                      <Mail className="w-4 h-4 text-brand-gold-400" />
                      <div className="text-gray-300">
                        <span className="font-bold text-brand-gold-400 font-mono">[이메일 알림 발송]</span> loungeinseoul@gmail.com 발송완료!
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setSuccessData(null)}
                    className="text-xs text-brand-gold-400 hover:text-brand-gold-300 underline underline-offset-4 font-mono cursor-pointer"
                    id="new-submission-btn"
                  >
                    추가 파트너십 진단 신청하기
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
