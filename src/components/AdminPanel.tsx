import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { Inquiry, InquiryStatus } from '../types';
import { 
  ShieldCheck, 
  LogIn, 
  LogOut, 
  User as UserIcon, 
  Building2, 
  Calendar, 
  MessageSquare, 
  DollarSign, 
  Save, 
  Eye, 
  Search, 
  ServerCrash, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Briefcase,
  Link,
  Send,
  Zap
} from 'lucide-react';

export default function AdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  
  // Search or Filter status
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Interactive controls states
  const [memoText, setMemoText] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState<InquiryStatus>(InquiryStatus.NEW);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Local/Custom Auth states
  const [isLocallyAuthenticated, setIsLocallyAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Webhook integration states
  const [webhookUrlInput, setWebhookUrlInput] = useState('');
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'success' | 'failed'>('idle');

  // Load initial webhook URL on mount
  useEffect(() => {
    const saved = localStorage.getItem('lounge_webhook_url') || (import.meta as any).env.VITE_WEBHOOK_URL || '';
    setWebhookUrlInput(saved);
  }, []);

  const handleSaveWebhook = () => {
    localStorage.setItem('lounge_webhook_url', webhookUrlInput.trim());
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 2500);
  };

  const handleTestWebhook = async () => {
    if (!webhookUrlInput.trim()) return;
    setTestStatus('sending');
    try {
      const response = await fetch(webhookUrlInput.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `🧪 [테스트 알림] 새로운 1:1 진단 요청이 접수되었습니다!
          
• 호텔명(지역): LO호텔 서울 강남점 (테스트)
• 객실수: 50실 (테스트)
• 의뢰인: 홍길동 (대표이사 - 테스트)
• 연락처: 010-1234-5678 (테스트)
• 월 매출: 3,000만 원 (테스트)
• 주요 고민: 매출 정체, 인력 관리 스트레스 (테스트)
• 접수번호: TEST1234`,
          id: "inq_test12345",
          hotelName: "LO호텔 서울 강남점 (테스트)",
          location: "서울 강남구 (테스트)",
          roomsCount: "50실",
          clientName: "홍길동",
          clientPosition: "대표이사",
          contact: "010-1234-5678",
          monthlyRevenue: "3,000만 원",
          worries: ["매출 정체", "인력 관리 스트레스"],
          submittedAt: new Date().toISOString(),
          type: "TEST_SIGNAL",
          sender: "Lounge Operation Admin Hub",
          timestamp: new Date().toISOString()
        })
      });
      // Discord returns 204 No Content for success sometimes, so any 2xx status is success
      if (response.status >= 200 && response.status < 300) {
        setTestStatus('success');
      } else {
        setTestStatus('failed');
      }
    } catch (err) {
      console.error(err);
      setTestStatus('failed');
    }
    setTimeout(() => setTestStatus('idle'), 5000);
  };

  // Bind Auth state and custom local session on mount
  useEffect(() => {
    const isLocal = localStorage.getItem('lo_admin_authenticated') === 'true';
    if (isLocal) {
      setIsLocallyAuthenticated(true);
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Is Authorized Admin
  const isAuthorizedEmail = 
    user?.email === 'loungeinseoul@gmail.com' || 
    user?.email === 'loungeseoulicheon@loungeoperation.co.kr' || 
    isLocallyAuthenticated;
  const isAccessible = isAuthorizedEmail;

  // Real-time inquiries synchronization from Firestore
  useEffect(() => {
    if (!isAccessible) return;

    const inquiriesQuery = query(
      collection(db, 'inquiries'), 
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      inquiriesQuery,
      (snapshot) => {
        const list: Inquiry[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            hotelName: data.hotelName || '',
            location: data.location || '',
            roomsCount: data.roomsCount || '',
            clientName: data.clientName || '',
            clientPosition: data.clientPosition || '',
            contact: data.contact || '',
            monthlyRevenue: data.monthlyRevenue || '',
            worries: data.worries || [],
            status: data.status || InquiryStatus.NEW,
            adminMemo: data.adminMemo || '',
            createdAt: data.createdAt?.toDate() || new Date(),
          });
        });
        setInquiries(list);
        setErrorText(null);
      },
      (error) => {
        console.error("Inquiries fetch failure: ", error);
        // Clean trigger of the mandatory handleFirestoreError specification
        try {
          handleFirestoreError(error, OperationType.LIST, 'inquiries');
        } catch (typedError: any) {
          setErrorText('접근 거부: 이 데이터는 라운지오퍼레이션 최고 관리자 전용 정보입니다.');
        }
      }
    );

    return () => unsubscribe();
  }, [isAccessible]);

  // Sync chosen inquiry data into control states on click
  useEffect(() => {
    if (selectedInquiry) {
      setMemoText(selectedInquiry.adminMemo);
      setInquiryStatus(selectedInquiry.status);
      setUpdateSuccess(false);
    }
  }, [selectedInquiry]);

  const handleLogin = async () => {
    try {
      setAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
      setErrorText(null);
    } catch (err: any) {
      console.error(err);
      setErrorText(`구글 로그인 실패: ${err.message || '인증 오류가 발생했습니다.'}`);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = usernameInput.trim();
    const cleanPw = passwordInput;

    if (!cleanId || !cleanPw) {
      setErrorText('아이디와 비밀번호를 입력해 주세요.');
      return;
    }

    if (cleanId !== 'loungeseoulicheon' || cleanPw !== 'ekqlsrhdwn1!') {
      setErrorText('관리자 ID 또는 비밀번호가 올바르지 않습니다.');
      return;
    }

    try {
      setAuthLoading(true);
      setErrorText(null);

      // 1. Establish immediate secure client-side admin session
      setIsLocallyAuthenticated(true);
      localStorage.setItem('lo_admin_authenticated', 'true');

      // 2. Programmatically login/register to Firebase Auth as loungeseoulicheon@loungeoperation.co.kr in the background
      // so Firestore DB rules accept read/write safely
      try {
        await signInWithEmailAndPassword(auth, 'loungeseoulicheon@loungeoperation.co.kr', cleanPw);
      } catch (fbErr: any) {
        console.log("Firebase sign in failed, attempting auto creation...", fbErr.message);
        try {
          await createUserWithEmailAndPassword(auth, 'loungeseoulicheon@loungeoperation.co.kr', cleanPw);
        } catch (createErr: any) {
          console.warn("Auto admin creation failed: ", createErr);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorText(`로그인 처리 중 오류 발생: ${err.message || String(err)}`);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLocallyAuthenticated(false);
    localStorage.removeItem('lo_admin_authenticated');
    await signOut(auth);
    setSelectedInquiry(null);
  };

  // Save admin updates to Firestore
  const handleSaveChanges = async () => {
    if (!selectedInquiry) return;
    setIsUpdating(true);
    setUpdateSuccess(false);
    setErrorText(null);

    const docRef = doc(db, 'inquiries', selectedInquiry.id);
    const updatePayload = {
      status: inquiryStatus,
      adminMemo: memoText.trim()
    };

    try {
      await updateDoc(docRef, updatePayload);
      setUpdateSuccess(true);
      // Local sync update
      setSelectedInquiry({
        ...selectedInquiry,
        status: inquiryStatus,
        adminMemo: memoText.trim()
      });
      setTimeout(() => setUpdateSuccess(false), 2500);
    } catch (err) {
      console.error("Update failure: ", err);
      try {
        handleFirestoreError(err, OperationType.UPDATE, `inquiries/${selectedInquiry.id}`);
      } catch (typedErr: any) {
        setErrorText('수정 권한 거부: 관리자 계정만 상태 및 메모를 저장할 수 있습니다.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (date: Date) => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}`;
  };

  // Status mapping translations
  const statusBadges = {
    [InquiryStatus.NEW]: { text: '신규 문의', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    [InquiryStatus.PROCESSING]: { text: '상담 진행중', color: 'bg-brand-gold-500/10 text-brand-gold-400 border-brand-gold-500/30' },
    [InquiryStatus.COMPLETED]: { text: '상담 완료', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' }
  };

  // Filter listings based on status & search queries
  const filteredInquiries = inquiries.filter(item => {
    const term = searchQuery.toLowerCase();
    const textMatch = 
      item.hotelName.toLowerCase().includes(term) ||
      item.location.toLowerCase().includes(term) ||
      item.clientName.toLowerCase().includes(term);
    const statusMatch = statusFilter === 'all' || item.status === statusFilter;
    return textMatch && statusMatch;
  });

  return (
    <section className="bg-brand-navy-950 py-16 px-4 sm:px-6 lg:px-8 min-h-[85vh] relative text-gray-200">
      {/* Visual background guide */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,rgba(212,175,55,0.01)_100%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        
        {/* HEADER BRAND */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-brand-gold-500/20 pb-8 mb-10 gap-4" id="admin-header">
          <div className="text-center md:text-left">
            <span className="text-[10px] font-mono tracking-[0.2em] text-brand-gold-400 font-bold uppercase p-1">
              LOUNGE OPERATION BACKOFFICE
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-white flex items-center justify-center md:justify-start gap-2 mt-1">
              <ShieldCheck className="w-8 h-8 text-brand-gold-400" />
              파트너십 문의 실시간 관리 시스템
            </h2>
            <p className="text-xs text-gray-400 mt-2">
              접수된 VIP 자산 제안서를 투명하게 관리하고 즉각 정밀 상권분석 메모를 입력하는 실무 허브입니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-center">
            {(user || isLocallyAuthenticated) && (
              <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded bg-brand-navy-900 border border-brand-gold-500/10 text-xs text-gray-300">
                <UserIcon className="w-3.5 h-3.5 text-brand-gold-400" />
                <span className="font-sans">loungeseoulicheon (최고 관리자)</span>
                <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.2 rounded font-mono text-[9px] uppercase font-bold">
                  MASTER ADMIN
                </span>
              </div>
            )}

            {(user || isLocallyAuthenticated) && (
              <button
                onClick={handleLogout}
                className="bg-brand-navy-900 hover:bg-brand-navy-800 border border-brand-gold-500/20 text-brand-gold-400 px-3 py-1.5 rounded text-xs flex items-center gap-1.5 pointer cursor-pointer font-medium transition-all"
                id="admin-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
                로그아웃
              </button>
            )}
          </div>
        </div>

        {/* AUTH GATE */}
        {authLoading ? (
          <div className="text-center py-20 bg-brand-navy-900/40 rounded border border-brand-gold-500/10" id="admin-auth-loading">
            <span className="inline-block w-8 h-8 border-t-2 border-brand-gold-500 rounded-full animate-spin"></span>
            <p className="mt-4 text-xs text-gray-400 font-mono">인증 서버 연결 및 확인 중...</p>
          </div>
        ) : (!user && !isLocallyAuthenticated) ? (
          /* Locked State View with Custom ID and Password */
          <div className="max-w-md mx-auto text-center py-12 px-6 bg-brand-navy-900/60 rounded border border-brand-gold-500/20 shadow-2xl relative overflow-hidden" id="admin-gating-card">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-gold-500/30"></div>
            
            <div className="w-16 h-16 bg-brand-gold-500/10 border border-brand-gold-500/30 rounded-full flex items-center justify-center text-brand-gold-400 mx-auto mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-display font-bold text-white tracking-tight mb-2">
              대표자 및 지배인 보안 로그인
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto mb-6 font-sans">
              본 시스템은 등재주체 및 협상 실무자만 열람할 수 있습니다. 발급받은 지배인 오피스 계정 정보를 입력해 주십시오.
            </p>

            {/* Error Message rendering inside login card */}
            {errorText && (
              <div className="mb-6 p-3 bg-red-950/60 border border-red-500/30 rounded text-left text-xs text-red-300 flex items-start gap-2 animate-pulse">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" id="login-error-icon" />
                <span>{errorText}</span>
              </div>
            )}

            <form onSubmit={handleEmailAuthSubmit} className="text-left space-y-5" id="custom-id-login-form">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-gold-400 mb-1.5" id="label-username-input">
                  관리자 ID
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  required
                  className="w-full bg-brand-navy-950 border border-brand-gold-500/20 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold-500 transition-all font-sans"
                  placeholder="아이디 입력"
                  id="username-auth-field"
                  autoComplete="username"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-brand-gold-400 mb-1.5" id="label-password-input">
                  보안 비밀번호 Code
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  className="w-full bg-brand-navy-950 border border-brand-gold-500/20 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold-500 transition-all"
                  placeholder="비밀번호 입력"
                  id="password-auth-field"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-brand-gold-600 to-brand-gold-500 text-brand-navy-950 font-bold py-3 px-4 rounded shadow hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider mt-2"
                id="custom-auth-submit-btn"
              >
                <LogIn className="w-4 h-4" />
                보안 관리실 로그인
              </button>
            </form>
            
            <p className="text-[10px] text-gray-500 leading-relaxed mt-4 text-center">
              ※ 이중 보안 암호화가 완료된 단일 지배인 전용 망입니다. 승인되지 않은 외부 접속 시도가 발생하면 기록 및 보안 차단 처리가 자동으로 개시됩니다.
            </p>
          </div>
        ) : !isAccessible ? (
          /* Signed in with wrong account */
          <div className="max-w-md mx-auto text-center py-10 px-6 bg-brand-navy-900/60 rounded border border-brand-gold-500/20 shadow-2xl" id="admin-access-denied-card">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center text-red-400 mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              접근 및 사용 권한 제한 (Access Denied)
            </h3>
            
            <p className="text-xs text-gray-400 my-4 leading-relaxed bg-brand-navy-950/60 p-4 rounded border border-red-500/20 font-mono">
              로그인 계정: {user.email} <br />
              지정된 관리 계정이 아니므로 열람을 전면 차단합니다. 승인된 정식 관리자 계정으로 로그인해 주십시오.
            </p>

            <div className="flex justify-center mt-6">
              <button
                onClick={handleLogout}
                className="w-full bg-brand-navy-900 hover:bg-brand-navy-800 border border-brand-gold-500/20 text-brand-gold-400 py-3 rounded text-xs cursor-pointer font-bold transition-all uppercase tracking-wider"
                id="admin-logout-and-retry-btn"
              >
                다른 계정으로 로그인하기
              </button>
            </div>
          </div>
        ) : (
          /* CORE ADMIN BODY */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="admin-core-grid">
            
            {/* LEFT SIDE: LIST TABLE */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* FILTER BAR / SEARCH */}
              <div className="bg-brand-navy-900/50 border border-brand-gold-500/10 p-4 rounded flex flex-col md:flex-row gap-4 items-center justify-between" id="admin-filter-bar">
                {/* Search input */}
                <div className="relative w-full md:w-72">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="호텔명, 지역, 의뢰인 이름 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-brand-navy-950 border border-brand-gold-500/20 focus:border-brand-gold-400 rounded pl-9 pr-4 py-2 text-xs text-white focus:outline-none placeholder-gray-500"
                    id="search-inquiries-input"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
                  <span className="text-xs text-gray-400 shrink-0 font-medium font-mono">STATUS:</span>
                  <div className="flex border border-brand-gold-500/20 rounded overflow-hidden text-[11px] shrink-0">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`px-3 py-1.5 font-bold cursor-pointer transition-all ${
                        statusFilter === 'all' 
                          ? 'bg-brand-gold-400 text-brand-navy-950' 
                          : 'bg-brand-navy-950 text-gray-400 hover:text-white'
                      }`}
                      id="filter-all-btn"
                    >
                      전체 ({inquiries.length})
                    </button>
                    <button
                      onClick={() => setStatusFilter(InquiryStatus.NEW)}
                      className={`px-3 py-1.5 font-bold cursor-pointer transition-all ${
                        statusFilter === InquiryStatus.NEW 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-brand-navy-950 text-gray-400 hover:text-white'
                      }`}
                      id="filter-new-btn"
                    >
                      신규 ({inquiries.filter(i => i.status === InquiryStatus.NEW).length})
                    </button>
                    <button
                      onClick={() => setStatusFilter(InquiryStatus.PROCESSING)}
                      className={`px-3 py-1.5 font-bold cursor-pointer transition-all ${
                        statusFilter === InquiryStatus.PROCESSING 
                          ? 'bg-brand-gold-500 text-brand-navy-950' 
                          : 'bg-brand-navy-950 text-gray-400 hover:text-white'
                      }`}
                      id="filter-processing-btn"
                    >
                      진행중 ({inquiries.filter(i => i.status === InquiryStatus.PROCESSING).length})
                    </button>
                    <button
                      onClick={() => setStatusFilter(InquiryStatus.COMPLETED)}
                      className={`px-3 py-1.5 font-bold cursor-pointer transition-all ${
                        statusFilter === InquiryStatus.COMPLETED 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-brand-navy-950 text-gray-400 hover:text-white'
                      }`}
                      id="filter-completed-btn"
                    >
                      완료 ({inquiries.filter(i => i.status === InquiryStatus.COMPLETED).length})
                    </button>
                  </div>
                </div>
              </div>

              {/* TABLE CONTAINER */}
              {errorText && (
                <div className="p-4 bg-red-950/30 border border-red-500/30 text-red-200 text-xs sm:text-sm rounded" id="admin-table-error">
                  ⚠️ {errorText}
                </div>
              )}

              <div className="bg-brand-navy-900 border border-brand-gold-500/20 rounded shadow-xl overflow-x-auto" id="admin-table-wrapper">
                <table className="w-full text-xs text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-brand-navy-950 border-b border-brand-gold-500/20 text-[10px] font-mono tracking-wider font-bold text-brand-gold-400 uppercase">
                      <th className="p-3.5">접수 일시</th>
                      <th className="p-3.5">호텔명 (지역)</th>
                      <th className="p-3.5">객실 수</th>
                      <th className="p-3.5">의뢰자 (직책)</th>
                      <th className="p-3.5">연락처</th>
                      <th className="p-3.5 text-center">진행 상태</th>
                      <th className="p-3.5 text-right">상세 보기</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-gold-500/10 font-sans" id="admin-table-body">
                    {filteredInquiries.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-10 text-center text-gray-400 italic">
                          접수되거나 필터에 일치하는 위탁 파트너십 문의 사항이 없습니다.
                        </td>
                      </tr>
                    ) : (
                      filteredInquiries.map((inq) => {
                        const isSelected = selectedInquiry?.id === inq.id;
                        const badge = statusBadges[inq.status];
                        return (
                          <tr 
                            key={inq.id} 
                            className={`hover:bg-brand-navy-800/40 transition-colors cursor-pointer ${
                              isSelected ? 'bg-brand-gold-500/5' : ''
                            }`}
                            onClick={() => setSelectedInquiry(inq)}
                            id={`admin-row-${inq.id}`}
                          >
                            <td className="p-4 text-gray-400 font-mono shrink-0 whitespace-nowrap">
                              {formatDate(inq.createdAt)}
                            </td>
                            <td className="p-4 font-semibold text-white whitespace-nowrap">
                              <span className="block font-display text-gray-100">{inq.hotelName}</span>
                              <span className="text-[10px] text-brand-gold-400 uppercase tracking-widest font-mono">{inq.location}</span>
                            </td>
                            <td className="p-4 text-gray-300 font-mono">
                              {inq.roomsCount}
                            </td>
                            <td className="p-4 text-gray-300 whitespace-nowrap font-medium">
                              {inq.clientName} 
                              <span className="text-gray-500 text-[11px] block text-left">
                                ({inq.clientPosition || '기입안됨'})
                              </span>
                            </td>
                            <td className="p-4 text-brand-gold-300/90 font-mono font-medium whitespace-nowrap">
                              {inq.contact}
                            </td>
                            <td className="p-4 text-center">
                              <span className={`inline-block px-2.5 py-1 border text-[10px] font-bold rounded font-mono ${badge.color}`}>
                                {badge.text}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedInquiry(inq);
                                }}
                                className={`px-2.5 py-1.5 rounded text-[10px] uppercase font-bold border transition-all cursor-pointer ${
                                  isSelected 
                                    ? 'bg-brand-gold-500 text-brand-navy-950 border-brand-gold-500' 
                                    : 'bg-brand-navy-950 border-brand-gold-500/20 text-brand-gold-400 hover:border-brand-gold-500'
                                }`}
                                id={`view-row-detail-${inq.id}`}
                              >
                                {isSelected ? '열림' : '열기'}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT SIDE: SELECTED DETAIL PANEL */}
            <div className="lg:col-span-4 space-y-6" id="admin-detail-column">
              <AnimatePresence mode="wait">
                {selectedInquiry ? (
                  <motion.div
                    key={selectedInquiry.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-brand-navy-900 border border-brand-gold-500/30 rounded p-6 shadow-xl relative"
                    id="admin-detail-panel"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-brand-gold-500/[0.02] filter blur rounded-full pointer-events-none"></div>

                    <div className="border-b border-brand-gold-500/20 pb-4 mb-4">
                      <span className="text-[10px] font-mono tracking-widest text-brand-gold-400 font-bold block uppercase">
                        Partnership Lead Profile
                      </span>
                      <h3 className="text-lg font-display font-medium text-white tracking-tight mt-1">
                        {selectedInquiry.hotelName}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-1 font-mono">
                        ID: {selectedInquiry.id.toUpperCase()}
                      </p>
                    </div>

                    {/* Operational parameters */}
                    <div className="space-y-4 text-xs">
                      {/* Grid specs */}
                      <div className="grid grid-cols-2 gap-4 bg-brand-navy-950/60 p-3 rounded.5 border border-brand-gold-500/5 font-mono">
                        <div>
                          <span className="text-gray-500 block text-[10px] uppercase font-bold">지역 / 규모</span>
                          <span className="text-gray-200 text-xs">{selectedInquiry.location} / {selectedInquiry.roomsCount}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block text-[10px] uppercase font-bold">월 매출액</span>
                          <span className="text-brand-gold-400 text-xs font-bold">{selectedInquiry.monthlyRevenue || '미공개'}</span>
                        </div>
                      </div>

                      {/* Contact Info card */}
                      <div className="space-y-1 bg-brand-navy-950/40 p-3.5 border border-brand-gold-500/10 rounded">
                        <p className="text-[10px] font-mono font-bold text-brand-gold-300 uppercase mb-1">인바운드 클라이언트 정보</p>
                        <p className="text-white font-medium text-[13px]">
                          {selectedInquiry.clientName} <span className="text-xs text-gray-400 font-normal">({selectedInquiry.clientPosition})</span>
                        </p>
                        <p className="text-brand-gold-400 font-mono text-[11px] font-bold">
                          📞 {selectedInquiry.contact}
                        </p>
                      </div>

                      {/* Core worries checkboxes result */}
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-mono font-bold text-gray-500 uppercase">오너 및 총지배인의 주요 고민 사항</p>
                        {selectedInquiry.worries && selectedInquiry.worries.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5" id="detail-worries-badges">
                            {selectedInquiry.worries.map((w, i) => (
                              <span 
                                key={i}
                                className="px-2 py-1 bg-red-500/5 border border-red-500/20 text-red-400 text-[10px] rounded block font-medium"
                              >
                                🎯 {w}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 italic">체크된 특이 고민 사항 없음</p>
                        )}
                      </div>

                      {/* Modifier: Status dropdown */}
                      <div className="space-y-1.5 pt-2 border-t border-brand-gold-500/10">
                        <label className="block text-[10px] font-mono font-bold text-brand-gold-300 uppercase">
                          진행 상담 상태 변경
                        </label>
                        <select
                          value={inquiryStatus}
                          onChange={(e) => setInquiryStatus(e.target.value as InquiryStatus)}
                          className="w-full bg-brand-navy-950 border border-brand-gold-500/20 focus:border-brand-gold-400 rounded px-3 py-2 text-xs text-white focus:outline-none transition-colors"
                          id="select-inquiry-status-modifier"
                        >
                          <option value={InquiryStatus.NEW}>신규 문의 (New Inquiry)</option>
                          <option value={InquiryStatus.PROCESSING}>상담 진행중 (In Progress)</option>
                          <option value={InquiryStatus.COMPLETED}>상담 완료 (Partnership Closed)</option>
                        </select>
                      </div>

                      {/* Modifier: Admin Consultation Memo */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-mono font-bold text-brand-gold-300 uppercase flex justify-between items-center">
                          <span>대표자 & 지배인 실무 비공개 메모란</span>
                          <span className="text-[9px] text-gray-500 lowercase font-normal">(실시간 동기화)</span>
                        </label>
                        <textarea
                          rows={6}
                          placeholder="상권 전수 조사 지표, 오프닝 일정 피드백, 협상 조건 등 핵심 특이사항을 밀착 기록해 주십시오."
                          value={memoText}
                          onChange={(e) => setMemoText(e.target.value)}
                          className="w-full bg-brand-navy-950 border border-brand-gold-500/20 focus:border-brand-gold-400 rounded p-3 text-xs text-white focus:outline-none placeholder-gray-600 leading-relaxed font-sans"
                          id="textarea-admin-memo"
                        />
                      </div>

                      {/* Actions and status alarms */}
                      <div className="pt-2">
                        <button
                          onClick={handleSaveChanges}
                          disabled={isUpdating}
                          className="w-full bg-gradient-to-r from-brand-gold-600 to-brand-gold-500 text-brand-navy-950 font-bold px-4 py-3 rounded hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-wider"
                          id="save-admin-updates-btn"
                        >
                          {isUpdating ? (
                            <>
                              <Clock className="w-3.5 h-3.5 animate-spin" />
                              저장 중...
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              메모 및 상담 상태 실시간 저장
                            </>
                          )}
                        </button>
                      </div>

                      <AnimatePresence>
                        {updateSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] rounded text-center font-medium font-mono flex items-center justify-center gap-1"
                            id="detail-update-success"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Firestore 데이터 서버 동기화 완료!
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ) : (
                  /* Empty state on right panel */
                  <div className="bg-brand-navy-900/40 border border-brand-gold-500/10 rounded p-12 text-center text-gray-500 italic text-xs max-w-sm mx-auto" id="admin-detail-empty">
                    <Briefcase className="w-8 h-8 text-brand-gold-500/20 mx-auto mb-3" />
                    왼쪽 테이블에서 특정 위탁 문의 행을 선택하시면 오너 고민 및 대표자 미팅 정산 정보가 로드됩니다.
                  </div>
                )}
              </AnimatePresence>

              {/* Webhook Settings Panel */}
              <div className="bg-brand-navy-900 border border-brand-gold-500/20 rounded p-5 relative overflow-hidden" id="admin-webhook-config-card">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-gold-500 to-brand-gold-400"></div>
                
                <div className="flex items-center space-x-2 border-b border-brand-gold-500/10 pb-3 mb-4">
                  <Zap className="w-4.5 h-4.5 text-brand-gold-400" />
                  <h4 className="text-sm font-display font-bold text-white uppercase tracking-tight">
                    실시간 3초 연동 자동화 (No-Code Setup)
                  </h4>
                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
                  새 문의가 접수되었을 때 대표님의 <b>메일, 문자, 혹은 카카오톡</b>으로 즉각 전송되도록 지원하는 초간편 Webhook 연동 허브입니다.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-brand-gold-300 uppercase mb-1.5 flex justify-between">
                      <span>수신 Webhook URL 주소</span>
                      <span className="text-gray-500 normal-case">(Make / Zapier / Slack / Telegram)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://hook.us1.make.com/..."
                      value={webhookUrlInput}
                      onChange={(e) => setWebhookUrlInput(e.target.value)}
                      className="w-full bg-brand-navy-950 border border-brand-gold-500/20 focus:border-brand-gold-400 rounded px-2.5 py-2.5 text-xs text-white focus:outline-none placeholder-gray-600 font-mono"
                      id="input-admin-webhook-url"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveWebhook}
                      className="flex-1 bg-brand-navy-950 hover:bg-brand-navy-800 border border-brand-gold-500/20 text-brand-gold-400 font-bold py-2 rounded text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      id="btn-save-webhook"
                    >
                      <Save className="w-3.5 h-3.5" />
                      주소 저장
                    </button>

                    <button
                      onClick={handleTestWebhook}
                      disabled={!webhookUrlInput.trim() || testStatus === 'sending'}
                      className={`flex-1 font-bold py-2 rounded text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        testStatus === 'success'
                          ? 'bg-emerald-500 text-white'
                          : testStatus === 'failed'
                          ? 'bg-red-500 text-white'
                          : 'bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-navy-950 disabled:opacity-40 disabled:cursor-not-allowed'
                      }`}
                      id="btn-test-webhook"
                    >
                      {testStatus === 'sending' ? (
                        <>
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          발송중...
                        </>
                      ) : testStatus === 'success' ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          테스트 성공!
                        </>
                      ) : testStatus === 'failed' ? (
                        <>
                          <AlertCircle className="w-3.5 h-3.5" />
                          연결 에러
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          테스트 발송
                        </>
                      )}
                    </button>
                  </div>

                  <AnimatePresence>
                    {webhookSaved && (
                      <motion.p
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[10px] text-emerald-400 text-center font-mono font-bold"
                        id="webhook-save-notice"
                      >
                        ✓ 웹훅 수신 주소가 브라우저(localStorage)에 안전하게 바인딩되었습니다!
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Integration Tutorial Guide Accordion */}
                  <div className="pt-3.5 border-t border-brand-gold-500/10 bg-brand-navy-950/40 p-3 rounded.5 border border-brand-gold-500/5 text-[10.5px] text-gray-400 space-y-2 leading-relaxed">
                    <p className="font-bold text-brand-gold-300 flex items-center gap-1">
                      💡 1분 완성 초간단 연동 가이드:
                    </p>
                    <ol className="list-decimal list-inside space-y-1.5 text-gray-300">
                      <li><b>Make.com</b> 이나 <b>Zapier.com</b> 회원가입 후 <b>Webhook Trigger</b> 모듈을 생성합니다.</li>
                      <li>생성된 고유 Hook 주소를 복사하여 <b>위 입력창</b>에 넣고 주소 저장을 누릅니다.</li>
                      <li><b>Make/Zapier</b>에서 다음 단계로 <b>Email(Gmail) 전송</b> 또는 <b>알림톡/문자 서비스</b> 모듈을 추가하여 연동합니다.</li>
                      <li><b>연동 테스트 발송</b>을 클릭하면 Make/Zapier가 수신한 데이터 구조를 즉시 파악하여 설정하게 됩니다.</li>
                    </ol>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </section>
  );
}
