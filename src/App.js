import React, { useState, useEffect, useCallback, useRef } from 'react';

const INITIAL_PROFILES = [
  { 
    id: 1, 
    name: 'Jessica', 
    age: 25, 
    gender: 'female',
    lat: 25.2048, lng: 55.2708, // Dubai coords
    verified: true,
    status: 'Active recently',
    bio: 'Coffee addict ☕, art lover, and weekend traveler. Let us find the best dessert spot in town!', 
    interests: ['Coffee ☕', 'Art 🎨', 'Travel ✈️', 'Photography 📸', 'Desserts 🍰'], 
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
    ] 
  },
  { 
    id: 2, 
    name: 'Michael', 
    age: 27, 
    gender: 'male',
    lat: 40.7128, lng: -74.0060, // New York coords
    verified: false,
    status: 'Active 2h ago',
    bio: 'Software developer by day, guitarist by night 🎸. Always down for live music or a food adventure.', 
    interests: ['Coding 💻', 'Guitar 🎸', 'Live Music 🎶', 'Burgers 🍔', 'Tech 🚀'], 
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
    ] 
  },
  { 
    id: 3, 
    name: 'Sophia', 
    age: 24, 
    gender: 'female',
    lat: 51.5074, lng: -0.1278, // London coords
    verified: true,
    status: 'Online now ✨',
    bio: 'Sunset chaser 🌅 and fitness enthusiast. Looking for someone to explore new hiking trails with.', 
    interests: ['Hiking 🥾', 'Fitness 💪', 'Sunsets 🌅', 'Yoga 🧘‍♀️', 'Nature 🌲'], 
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
    ] 
  }
];

const ICEBREAKERS = [
  "Coffee or tea? This is the ultimate test ☕",
  "If you could travel anywhere right now, where are we going? ✈️",
  "What is your go-to weekend adventure? 🌄",
  "Pineapple on pizza: absolute crime or underrated genius? 🍕"
];

const GIF_LIST = [
  "https://media.giphy.com/media/3o7TKSjRrfIPjeiOkM/giphy.gif",
  "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif",
  "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif"
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('tinder_auth') === 'true');
  const [authMode, setAuthMode] = useState('welcome');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [theme, setTheme] = useState(() => localStorage.getItem('tinder_theme') || 'dark');
  const [currentTab, setCurrentTab] = useState('swipe');
  
  // Advanced Filters & GPS
  const [maxDistance, setMaxDistance] = useState(10000);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);
  const [genderFilter, setGenderFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [superLikesLeft, setSuperLikesLeft] = useState(3);
  const [currentCity, setCurrentCity] = useState({ name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 });

  // Monetization & Boost
  const [isBoostActive, setIsBoostActive] = useState(false);
  const [boostTimer, setBoostTimer] = useState(0);
  const [showGoldModal, setShowGoldModal] = useState(false);

  // Modals & UI
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showFullProfileModal, setShowFullProfileModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [swipeBadge, setSwipeBadge] = useState(null);

  // Call States
  const [activeCall, setActiveCall] = useState(false);
  const [callStatus, setCallStatus] = useState('Ringing...');
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  // Audio Recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Profile & Data
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('tinder_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Alex Ali',
      age: 26,
      job: 'Software Engineer',
      location: 'Dubai, UAE',
      bio: 'Building full-stack web applications and exploring Dubai 🚀',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
    };
  });
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempBio, setTempBio] = useState(userProfile.bio);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [likesYouList] = useState([INITIAL_PROFILES[0], INITIAL_PROFILES[2]]);
  const [matches, setMatches] = useState(() => JSON.parse(localStorage.getItem('tinder_matches') || '[]'));
  const [activeMatch, setActiveMatch] = useState(null);
  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem('tinder_messages') || '{}'));
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);

  // Sync LocalStorage
  useEffect(() => { localStorage.setItem('tinder_auth', isAuthenticated); }, [isAuthenticated]);
  useEffect(() => { localStorage.setItem('tinder_theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('tinder_profile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('tinder_matches', JSON.stringify(matches)); }, [matches]);
  useEffect(() => { localStorage.setItem('tinder_messages', JSON.stringify(messages)); }, [messages]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const triggerBadge = (type) => {
    setSwipeBadge(type);
    setTimeout(() => setSwipeBadge(null), 500);
  };

  // Haversine formula for exact GPS Distance Calculation
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // Filter profiles with GPS & Passport coordinates
  const filteredProfiles = INITIAL_PROFILES.filter(p => {
    const dist = calculateDistance(currentCity.lat, currentCity.lng, p.lat, p.lng);
    const matchesDistance = dist <= maxDistance;
    const matchesAge = p.age >= minAge && p.age <= maxAge;
    const matchesGender = genderFilter === 'all' || p.gender === genderFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.interests.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDistance && matchesAge && matchesGender && matchesSearch;
  });

  const handleLoginSubmit = () => {
    if (!emailOrPhone || !password) {
      showToast("⚠️ Enter credentials");
      return;
    }
    setIsAuthenticated(true);
    showToast("🎉 Welcome back to Tinder!");
  };

  // Boost timer
  useEffect(() => {
    let interval;
    if (isBoostActive && boostTimer > 0) {
      interval = setInterval(() => setBoostTimer(prev => prev - 1), 1000);
    } else if (boostTimer === 0) {
      setIsBoostActive(false);
    }
    return () => clearInterval(interval);
  }, [isBoostActive, boostTimer]);

  const triggerBoost = () => {
    setIsBoostActive(true);
    setBoostTimer(1800); // 30 minutes
    showToast("⚡ PROFILE BOOST ACTIVATED!");
  };

  // Real MediaRecorder Voice Notes
  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = e => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        sendMsgObj({ isVoice: true, audioUrl: url, duration: `${recordTime || 3}s`, text: `Voice Note (${recordTime || 3}s)` });
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordTime(0);
    } catch {
      setIsRecording(true);
      setRecordTime(0);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    } else {
      sendMsgObj({ isVoice: true, text: 'Voice Note (3s)' });
    }
    setIsRecording(false);
  };

  useEffect(() => {
    let interval;
    if (isRecording) interval = setInterval(() => setRecordTime(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const sendMsgObj = (msgData) => {
    if (!activeMatch) return;
    const matchId = activeMatch.id;
    const newMsg = { id: Date.now(), sender: 'me', read: false, ...msgData };
    setMessages(prev => ({ ...prev, [matchId]: [...(prev[matchId] || []), newMsg] }));

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMsg = { id: Date.now() + 1, sender: 'match', read: true, text: "Got it! Let's talk more 😊" };
      setMessages(prev => ({ ...prev, [matchId]: [...(prev[matchId] || []), replyMsg] }));
    }, 1500);
  };

  const sendMessage = (txt) => {
    const text = typeof txt === 'string' ? txt : inputText;
    if (!text.trim()) return;
    sendMsgObj({ text });
    setInputText('');
  };

  const sendGif = (url) => {
    sendMsgObj({ image: url });
    setShowGifPicker(false);
  };

  const handleSwipe = useCallback((direction) => {
    if (currentIndex >= filteredProfiles.length) return;
    const profile = filteredProfiles[currentIndex];

    if (direction === 'super') {
      if (superLikesLeft <= 0) {
        showToast("⚠️ No Super Likes left!");
        return;
      }
      setSuperLikesLeft(prev => prev - 1);
      triggerBadge('SUPER');
      setHistory(prev => [...prev, { index: currentIndex, photoIndex: currentPhotoIndex, profile }]);
      setMatches(prev => [...prev, profile]);
      setMatchedProfile(profile);
      setShowMatchModal(true);
    } else {
      setHistory(prev => [...prev, { index: currentIndex, photoIndex: currentPhotoIndex, profile }]);
      if (direction === 'right') {
        triggerBadge('LIKE');
        setMatches(prev => [...prev, profile]);
        setMatchedProfile(profile);
        setShowMatchModal(true);
      } else {
        triggerBadge('NOPE');
      }
    }
    setCurrentIndex(prev => prev + 1);
    setCurrentPhotoIndex(0);
  }, [currentIndex, filteredProfiles, currentPhotoIndex, superLikesLeft]);

  const handleRewind = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, prev.length - 1));
    setCurrentIndex(last.index);
    setCurrentPhotoIndex(last.photoIndex);
  }, [history]);

  const isDark = theme === 'dark';
  const colors = {
    bg: isDark ? '#09090b' : '#f4f4f5',
    cardBg: isDark ? '#121214' : '#ffffff',
    headerBg: isDark ? '#18181b' : '#f4f4f5',
    border: isDark ? '#27272a' : '#e4e4e7',
    text: isDark ? '#ffffff' : '#09090b',
    subText: isDark ? '#a1a1aa' : '#71717a',
    pillBg: isDark ? '#27272a' : '#e4e4e7'
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: colors.bg, fontFamily: 'system-ui, sans-serif', color: colors.text, margin: 0 }}>
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; box-sizing: border-box; }
        @keyframes fadeInOut { 0% { opacity: 0; transform: translateY(-20px); } 15% { opacity: 1; transform: translateY(0); } 85% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-20px); } }
        @keyframes popBadge { 0% { transform: scale(0.5) rotate(-15deg); opacity: 0; } 50% { transform: scale(1.1) rotate(-15deg); opacity: 1; } 100% { transform: scale(1) rotate(-15deg); opacity: 0; } }
        @keyframes pulseRing { 0% { transform: scale(0.95); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 0.4; } 100% { transform: scale(0.95); opacity: 0.8; } }
      `}</style>
      
      {toastMessage && (
        <div style={{ position: 'absolute', top: '24px', zIndex: 600, backgroundColor: '#f43f5e', color: '#fff', padding: '10px 20px', borderRadius: '30px', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', animation: 'fadeInOut 2.2s ease forwards' }}>
          {toastMessage}
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '420px', height: '100%', maxHeight: '850px', backgroundColor: colors.cardBg, borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', border: `1px solid ${colors.border}`, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}>
        
        {!isAuthenticated ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '36px 24px', backgroundColor: colors.cardBg, textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px' }}>
              <span style={{ fontSize: '56px', marginBottom: '12px' }}>🔥</span>
              <h1 style={{ fontSize: '32px', fontWeight: '900', background: 'linear-gradient(to right, #f43f5e, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 8px 0' }}>tinder</h1>
              <p style={{ fontSize: '14px', color: colors.subText, margin: 0 }}>Secure Authentication & Global Discovery</p>
            </div>

            {authMode === 'welcome' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                <button onClick={() => setAuthMode('login')} style={{ width: '100%', padding: '14px', borderRadius: '30px', background: 'linear-gradient(to right, #f43f5e, #ec4899)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>🔐 Sign In / Register</button>
                <button onClick={() => setIsAuthenticated(true)} style={{ width: '100%', padding: '14px', borderRadius: '30px', backgroundColor: colors.pillBg, color: colors.text, border: `1px solid ${colors.border}`, fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>⚡ Quick Demo Login</button>
              </div>
            )}

            {authMode === 'login' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', textAlign: 'left' }}>
                <div>
                  <label style={{ fontSize: '12px', color: colors.subText, display: 'block', marginBottom: '4px' }}>Email or Phone</label>
                  <input type="text" placeholder="user@tinder.com" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} style={{ width: '100%', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '12px', color: colors.text }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: colors.subText, display: 'block', marginBottom: '4px' }}>Password</label>
                  <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '12px', color: colors.text }} />
                </div>
                <button onClick={handleLoginSubmit} style={{ width: '100%', padding: '14px', borderRadius: '30px', background: 'linear-gradient(to right, #f43f5e, #ec4899)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>Continue</button>
                <button onClick={() => setAuthMode('welcome')} style={{ background: 'none', border: 'none', color: colors.subText, fontSize: '13px', cursor: 'pointer', textAlign: 'center' }}>Back</button>
              </div>
            )}
            <div style={{ fontSize: '12px', color: colors.subText }}>JWT Token & Firebase Auth Ready</div>
          </div>
        ) : (
          <>
            {/* Header Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.headerBg }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '22px' }}>🔥</span>
                <span style={{ fontSize: '20px', fontWeight: '800', background: 'linear-gradient(to right, #f43f5e, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>tinder</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {currentTab === 'swipe' && (
                  <>
                    <button onClick={() => setShowPassportModal(true)} style={{ background: 'none', border: `1px solid ${colors.border}`, padding: '4px 8px', borderRadius: '12px', fontSize: '11px', color: colors.text, cursor: 'pointer' }} title="Change Location">📍 {currentCity.name.split(',')[0]}</button>
                    <button onClick={() => setShowFilterModal(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }} title="Filters">⚙️</button>
                  </>
                )}
                <button onClick={() => setCurrentTab('swipe')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', opacity: currentTab === 'swipe' ? 1 : 0.4 }}>✨</button>
                <button onClick={() => setCurrentTab('likes')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', opacity: currentTab === 'likes' ? 1 : 0.4 }}>💛</button>
                <button onClick={() => setCurrentTab('matches')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', opacity: currentTab === 'matches' ? 1 : 0.4 }}>💬</button>
                <button onClick={() => setCurrentTab('profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', opacity: currentTab === 'profile' ? 1 : 0.4 }}>👤</button>
              </div>
            </div>

            {/* Content Body */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative' }}>
              
              {/* SWIPE TAB */}
              {currentTab === 'swipe' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '14px' }}>
                  
                  {isBoostActive && (
                    <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', border: '1px solid #a855f7', padding: '8px', borderRadius: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#a855f7', marginBottom: '8px' }}>
                      ⚡ Boost Active ({Math.floor(boostTimer / 60)}m {boostTimer % 60}s remaining)
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                    <input type="text" placeholder="🔍 Search name or interest..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentIndex(0); }} style={{ flex: 1, backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '20px', padding: '8px 12px', fontSize: '12px', color: colors.text, outline: 'none' }} />
                    <button onClick={() => setShowGoldModal(true)} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', color: '#fff', padding: '6px 10px', borderRadius: '16px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Gold ✨</button>
                  </div>

                  {currentIndex < filteredProfiles.length ? (
                    <>
                      <div style={{ width: '100%', height: '370px', borderRadius: '20px', overflowY: 'auto', position: 'relative', backgroundColor: colors.pillBg, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        {swipeBadge === 'LIKE' && <div style={{ position: 'absolute', top: '40px', left: '20px', border: '4px solid #22c55e', color: '#22c55e', padding: '4px 16px', borderRadius: '12px', fontSize: '30px', fontWeight: '900', zIndex: 100, animation: 'popBadge 0.5s ease forwards' }}>LIKE</div>}
                        {swipeBadge === 'NOPE' && <div style={{ position: 'absolute', top: '40px', right: '20px', border: '4px solid #ef4444', color: '#ef4444', padding: '4px 16px', borderRadius: '12px', fontSize: '30px', fontWeight: '900', zIndex: 100, animation: 'popBadge 0.5s ease forwards' }}>NOPE</div>}
                        {swipeBadge === 'SUPER' && <div style={{ position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)', border: '4px solid #3b82f6', color: '#3b82f6', padding: '4px 16px', borderRadius: '12px', fontSize: '30px', fontWeight: '900', zIndex: 100, animation: 'popBadge 0.5s ease forwards' }}>SUPER</div>}

                        <div style={{ position: 'relative', width: '100%', height: '220px', cursor: 'pointer' }} onClick={() => setShowFullProfileModal(true)}>
                          <img src={filteredProfiles[currentIndex].images[currentPhotoIndex]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', top: '16px', left: '12px', backgroundColor: 'rgba(0,0,0,0.6)', padding: '3px 8px', borderRadius: '12px', fontSize: '10px', color: '#fff' }}>📍 {calculateDistance(currentCity.lat, currentCity.lng, filteredProfiles[currentIndex].lat, filteredProfiles[currentIndex].lng)} km away</div>
                        </div>

                        <div style={{ padding: '12px', backgroundColor: colors.cardBg, cursor: 'pointer' }} onClick={() => setShowFullProfileModal(true)}>
                          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px 0', color: colors.text }}>{filteredProfiles[currentIndex].name}, {filteredProfiles[currentIndex].age}</h2>
                          <p style={{ fontSize: '12px', color: colors.text, margin: '0 0 8px 0' }}>{filteredProfiles[currentIndex].bio}</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {filteredProfiles[currentIndex].interests.map((t, i) => <span key={i} style={{ fontSize: '10px', backgroundColor: colors.pillBg, padding: '2px 6px', borderRadius: '10px' }}>{t}</span>)}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px' }}>
                        <button onClick={handleRewind} disabled={history.length === 0} style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, cursor: history.length === 0 ? 'not-allowed' : 'pointer', opacity: history.length === 0 ? 0.4 : 1 }}>⏪</button>
                        <button onClick={() => handleSwipe('left')} style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, cursor: 'pointer' }}>❌</button>
                        <button onClick={() => handleSwipe('super')} style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, cursor: 'pointer' }}>⭐</button>
                        <button onClick={() => handleSwipe('right')} style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'linear-gradient(135deg, #f43f5e, #ec4899)', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(244,63,94,0.4)' }}>❤️</button>
                      </div>
                    </>
                  ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
                      <span style={{ fontSize: '44px', marginBottom: '8px' }}>🎉</span>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>No more profiles in {currentCity.name.split(',')[0]}!</h3>
                      <button onClick={() => setShowPassportModal(true)} style={{ marginTop: '16px', padding: '10px 20px', borderRadius: '20px', background: 'linear-gradient(to right, #f43f5e, #ec4899)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Change Location (Passport)</button>
                    </div>
                  )}
                </div>
              )}

              {/* LIKES YOU TAB */}
              {currentTab === 'likes' && (
                <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#f43f5e', marginBottom: '12px' }}>Profiles Who Liked You ({likesYouList.length})</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {likesYouList.map(p => (
                      <div key={p.id} onClick={() => { setMatches(prev => [...prev, p]); setActiveMatch(p); setCurrentTab('chat'); }} style={{ height: '180px', borderRadius: '14px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
                        <img src={p.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: 0, insetX: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '10px', color: '#fff' }}>
                          <h4 style={{ margin: 0, fontSize: '14px' }}>{p.name}, {p.age}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MATCHES & CHAT */}
              {currentTab === 'matches' && (
                <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#f43f5e', marginBottom: '12px' }}>Your Matches ({matches.length})</h3>
                  {matches.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.subText }}>No matches yet!</div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                      {matches.map(m => (
                        <div key={m.id} onClick={() => { setActiveMatch(m); setCurrentTab('chat'); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                          <img src={m.images[0]} alt="" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f43f5e' }} />
                          <span style={{ fontSize: '11px', marginTop: '4px' }}>{m.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentTab === 'chat' && activeMatch && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: colors.bg, position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', backgroundColor: colors.headerBg, borderBottom: `1px solid ${colors.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button onClick={() => setCurrentTab('matches')} style={{ background: 'none', border: 'none', color: '#f43f5e', fontWeight: 'bold', cursor: 'pointer', marginRight: '10px' }}>←</button>
                      <img src={activeMatch.images[0]} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', marginRight: '8px' }} />
                      <h4 style={{ fontSize: '13px', margin: 0 }}>{activeMatch.name}</h4>
                    </div>
                    <button onClick={() => { setActiveCall(true); setCallStatus('Ringing...'); }} style={{ background: 'none', border: 'none', color: '#34d399', fontSize: '16px', cursor: 'pointer' }}>📞</button>
                  </div>

                  <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(messages[activeMatch.id] || []).map(msg => (
                      <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ padding: '8px 12px', borderRadius: '14px', maxWidth: '80%', fontSize: '12px', backgroundColor: msg.sender === 'me' ? '#f43f5e' : colors.pillBg, color: '#fff' }}>
                          {msg.image ? <img src={msg.image} alt="" style={{ width: '150px', borderRadius: '8px' }} /> : msg.text}
                        </div>
                        {msg.sender === 'me' && <span style={{ fontSize: '9px', color: colors.subText, marginTop: '2px' }}>{msg.read ? '✓✓ Read' : '✓ Sent'}</span>}
                      </div>
                    ))}
                    {isTyping && <div style={{ fontSize: '11px', fontStyle: 'italic', color: colors.subText }}>{activeMatch.name} is typing...</div>}
                  </div>

                  {showGifPicker && (
                    <div style={{ padding: '8px', backgroundColor: colors.cardBg, borderTop: `1px solid ${colors.border}`, display: 'flex', gap: '6px', overflowX: 'auto' }}>
                      {GIF_LIST.map((g, i) => <img key={i} src={g} alt="" onClick={() => sendGif(g)} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }} />)}
                    </div>
                  )}

                  <div style={{ padding: '10px', backgroundColor: colors.headerBg, borderTop: `1px solid ${colors.border}`, display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {isRecording ? (
                      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: 'bold' }}>Recording {recordTime}s...</span>
                        <button onClick={stopRecording} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', padding: '4px 10px', fontSize: '11px' }}>Send</button>
                      </div>
                    ) : (
                      <>
                        <button onClick={() => setShowGifPicker(!showGifPicker)} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}>🎨</button>
                        <input type="text" placeholder="Type a message..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputText)} style={{ flex: 1, backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '18px', padding: '8px 14px', fontSize: '12px', color: colors.text, outline: 'none' }} />
                        <button onClick={startRecording} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}>🎙️</button>
                        <button onClick={() => sendMessage(inputText)} style={{ background: '#f43f5e', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '18px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Send</button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* PROFILE TAB */}
              {currentTab === 'profile' && (
                <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src={userProfile.image} alt="" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f43f5e', marginBottom: '12px' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{userProfile.name}, {userProfile.age}</h2>
                  <p style={{ fontSize: '12px', color: colors.subText, margin: '0 0 16px 0' }}>{userProfile.location}</p>

                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button onClick={triggerBoost} style={{ width: '100%', padding: '12px', borderRadius: '20px', background: 'linear-gradient(135deg, #a855f7, #6366f1)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>⚡ Boost Profile</button>
                    <button onClick={() => setShowGoldModal(true)} style={{ width: '100%', padding: '12px', borderRadius: '20px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>✨ Tinder Gold (Passports & Rewind)</button>
                    <button onClick={() => { setIsAuthenticated(false); showToast("Logged out successfully"); }} style={{ width: '100%', padding: '12px', borderRadius: '20px', backgroundColor: colors.pillBg, color: '#ef4444', border: `1px solid ${colors.border}`, fontWeight: 'bold', cursor: 'pointer' }}>🚪 Log Out / Delete Account</button>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

        {/* PASSPORT MODAL */}
        {showPassportModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 400, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ backgroundColor: colors.headerBg, borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0' }}>Change Location (Global Passport)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {[
                  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
                  { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
                  { name: 'London, UK', lat: 51.5074, lng: -0.1278 }
                ].map((c, i) => (
                  <button key={i} onClick={() => { setCurrentCity(c); setShowPassportModal(false); showToast(`📍 Location set to ${c.name}`); }} style={{ padding: '12px', borderRadius: '12px', backgroundColor: currentCity.name === c.name ? '#f43f5e' : colors.pillBg, color: currentCity.name === c.name ? '#fff' : colors.text, border: 'none', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>{c.name}</button>
                ))}
              </div>
              <button onClick={() => setShowPassportModal(false)} style={{ width: '100%', padding: '12px', borderRadius: '20px', backgroundColor: colors.pillBg, border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        )}

        {/* GOLD MODAL */}
        {showGoldModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '48px', marginBottom: '12px' }}>✨</span>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#f59e0b', margin: '0 0 8px 0' }}>Get Tinder Gold</h2>
            <p style={{ fontSize: '13px', color: '#d4d4d8', margin: '0 0 24px 0' }}>Unlock Unlimited Rewinds, Global Passports, See Who Liked You & Free Boosts.</p>
            <button onClick={() => { setShowGoldModal(false); showToast("💳 Gold Unlocked Successfully (Simulated Stripe Pay)"); }} style={{ width: '100%', padding: '14px', borderRadius: '30px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>Subscribe Now ($9.99/mo)</button>
            <button onClick={() => setShowGoldModal(false)} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: '12px' }}>No Thanks</button>
          </div>
        )}

        {/* CALL MODAL */}
        {activeCall && activeMatch && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#09090b', zIndex: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '48px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ fontSize: '24px', color: '#fff', margin: 0 }}>{activeMatch.name}</h2>
              <span style={{ fontSize: '13px', color: '#34d399', marginTop: '6px' }}>{callStatus}</span>
            </div>
            <img src={activeMatch.images[0]} alt="" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f43f5e' }} />
            <button onClick={() => setActiveCall(false)} style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#ef4444', color: '#fff', border: 'none', fontSize: '20px', cursor: 'pointer' }}>📞</button>
          </div>
        )}

      </div>
    </div>
  );
}
