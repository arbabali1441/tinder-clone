import React, { useState, useEffect, useCallback, useRef } from 'react';

// Pro SVG Icons for a clean UI
const Icons = {
  Sparkle: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/></svg>,
  Heart: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  XMark: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  Star: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Message: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>,
  Video: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  Mic: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v1a7 7 0 01-14 0v-1"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  Attachment: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>,
  Location: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
};

const INITIAL_PROFILES = [
  { 
    id: 1, 
    name: 'Jessica', 
    age: 25, 
    gender: 'female',
    zodiac: 'Scorpio ♏',
    intent: 'Long-term partner 💍',
    lat: 25.2048, lng: 55.2708,
    verified: true,
    status: 'Active recently',
    matchScore: '94%',
    mutualFriends: 2,
    lounge: 'Coffee Dates ☕',
    bio: 'Coffee addict ☕, art lover, and weekend traveler.', 
    interests: ['Coffee ☕', 'Art 🎨', 'Travel ✈️'], 
    spotify: 'Taylor Swift - Cruel Summer',
    poll: { question: "Guess my favorite travel destination?", options: ["Paris", "Tokyo", "Bali"], answer: 1 },
    prompts: { q: "My simple pleasures...", a: "Fresh morning coffee and sunset drives 🌅" },
    storyVideo: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-lights-41642-large.mp4',
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
    zodiac: 'Leo ♌',
    intent: 'Casual dating 🥂',
    lat: 40.7128, lng: -74.0060,
    verified: false,
    status: 'Active 2h ago',
    matchScore: '88%',
    mutualFriends: 0,
    lounge: 'Thrill Seekers 🚀',
    bio: 'Software developer by day, guitarist by night 🎸.', 
    interests: ['Coding 💻', 'Guitar 🎸', 'Tech 🚀'], 
    spotify: 'The Weeknd - Starboy',
    poll: { question: "Cats or Dogs?", options: ["Cats", "Dogs", "Both"], answer: 1 },
    prompts: { q: "I'm looking for...", a: "Someone to jam with and try new burgers 🍔" },
    storyVideo: 'https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-in-a-cafe-43085-large.mp4',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
    ] 
  }
];

const GIF_LIST = [
  "https://media.giphy.com/media/3o7TKSjRrfIPjeiOkM/giphy.gif",
  "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif",
  "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif",
  "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif"
];

const AI_ICEBREAKERS = [
  "If you could only eat one meal for the rest of your life, what is it? 🍕",
  "What's your absolute favorite spot in the city? 🏙️",
  "Quick! Cats or dogs? Choose wisely 🐶🐱"
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('tinder_auth') === 'true');
  const [authMode, setAuthMode] = useState('welcome');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [theme, setTheme] = useState(() => localStorage.getItem('tinder_theme') || 'dark');
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('tinder_accent') || '#f43f5e');
  const [currentTab, setCurrentTab] = useState('swipe');
  
  const [maxDistance, setMaxDistance] = useState(10000);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);
  const [genderFilter, setGenderFilter] = useState('all');
  const [zodiacFilter, setZodiacFilter] = useState('All');
  const [intentFilter, setIntentFilter] = useState('All');
  const [currentCity, setCurrentCity] = useState({ name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 });

  const [swipesLeft, setSwipesLeft] = useState(45);
  const [resetTimer, setResetTimer] = useState(43200);

  const [activeStory, setActiveStory] = useState(null);
  const [activeVideoCall, setActiveVideoCall] = useState(false);
  const [arFilter, setArFilter] = useState('none');
  const [blockedUsers, setBlockedUsers] = useState(() => JSON.parse(localStorage.getItem('tinder_blocked') || '[]'));
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [selectedLounge, setSelectedLounge] = useState('All');
  const [pollAnswers, setPollAnswers] = useState({});

  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [isBlindDateMode, setIsBlindDateMode] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [swipeBadge, setSwipeBadge] = useState(null);

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('tinder_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Alex Ali',
      age: 26,
      verified: false,
      zodiac: 'Scorpio ♏',
      intent: 'Long-term partner 💍',
      location: 'Dubai, UAE',
      bio: 'Building full-stack web applications and exploring Dubai 🚀',
      spotify: 'The Weeknd - Blinding Lights',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
    };
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [likesYouList] = useState([INITIAL_PROFILES[0]]);
  const [matches, setMatches] = useState(() => JSON.parse(localStorage.getItem('tinder_matches') || '[]'));
  const [activeMatch, setActiveMatch] = useState(null);
  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem('tinder_messages') || '{}'));
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);

  useEffect(() => { localStorage.setItem('tinder_auth', isAuthenticated); }, [isAuthenticated]);
  useEffect(() => { localStorage.setItem('tinder_theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('tinder_accent', accentColor); }, [accentColor]);
  useEffect(() => { localStorage.setItem('tinder_profile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('tinder_matches', JSON.stringify(matches)); }, [matches]);
  useEffect(() => { localStorage.setItem('tinder_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('tinder_blocked', JSON.stringify(blockedUsers)); }, [blockedUsers]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const triggerBadge = (type) => {
    setSwipeBadge(type);
    setTimeout(() => setSwipeBadge(null), 500);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return Math.round(R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))));
  };

  const filteredProfiles = INITIAL_PROFILES.filter(p => {
    if (blockedUsers.includes(p.id)) return false;
    if (selectedLounge !== 'All' && p.lounge !== selectedLounge) return false;
    if (zodiacFilter !== 'All' && !p.zodiac.includes(zodiacFilter)) return false;
    if (intentFilter !== 'All' && !p.intent.includes(intentFilter)) return false;
    const dist = calculateDistance(currentCity.lat, currentCity.lng, p.lat, p.lng);
    const matchesDistance = dist <= maxDistance;
    const matchesAge = p.age >= minAge && p.age <= maxAge;
    const matchesGender = genderFilter === 'all' || p.gender === genderFilter;
    return matchesDistance && matchesAge && matchesGender;
  });

  const handleAuthSubmit = () => {
    if (!emailOrPhone || !password) {
      showToast("⚠️ Please fill in all fields");
      return;
    }
    setIsAuthenticated(true);
    showToast("🎉 Successfully signed in!");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && activeMatch) {
      const reader = new FileReader();
      reader.onloadend = () => {
        sendMsgObj({ image: reader.result, fileName: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = e => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        sendMsgObj({ isVoice: true, audioUrl: url, duration: `${recordTime || 3}s` });
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
      sendMsgObj({ isVoice: true, duration: '3s' });
    }
    setIsRecording(false);
  };

  const sendMsgObj = (msgData) => {
    if (!activeMatch) return;
    const matchId = activeMatch.id;
    const newMsg = { id: Date.now(), sender: 'me', readTime: 'Just now', reaction: null, ...msgData };
    setMessages(prev => ({ ...prev, [matchId]: [...(prev[matchId] || []), newMsg] }));

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMsg = { id: Date.now() + 1, sender: 'match', readTime: 'Just now', reaction: null, text: "Received! Let's chat more 😊" };
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
    sendMsgObj({ image: url, fileName: 'GIF' });
    setShowGifPicker(false);
  };

  const generateAIIcebreaker = () => {
    const randomIce = AI_ICEBREAKERS[Math.floor(Math.random() * AI_ICEBREAKERS.length)];
    setInputText(randomIce);
    showToast("🤖 AI suggested an icebreaker!");
  };

  const handleMessageReaction = (msgId, emoji) => {
    if (!activeMatch) return;
    const matchId = activeMatch.id;
    setMessages(prev => ({
      ...prev,
      [matchId]: (prev[matchId] || []).map(m => m.id === msgId ? { ...m, reaction: emoji } : m)
    }));
  };

  const handleSwipe = useCallback((direction) => {
    if (swipesLeft <= 0) {
      showToast("⚠️ Daily limit reached!");
      return;
    }
    if (currentIndex >= filteredProfiles.length) return;
    const profile = filteredProfiles[currentIndex];
    setSwipesLeft(prev => prev - 1);

    if (direction === 'super') {
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
  }, [currentIndex, filteredProfiles, currentPhotoIndex, swipesLeft]);

  const isDark = theme === 'dark';
  const colors = {
    bg: isDark ? '#09090b' : '#f4f4f5',
    cardBg: isDark ? '#121214' : '#ffffff',
    headerBg: isDark ? '#18181b' : '#f4f4f5',
    border: isDark ? '#27272a' : '#e4e4e7',
    text: isDark ? '#ffffff' : '#09090b',
    subText: isDark ? '#a1a1aa' : '#71717a',
    pillBg: isDark ? '#27272a' : '#e4e4e7',
    accent: accentColor
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: colors.bg, fontFamily: 'system-ui, sans-serif', color: colors.text, margin: 0 }}>
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; box-sizing: border-box; }
        @keyframes fadeInOut { 0% { opacity: 0; transform: translateY(-20px); } 15% { opacity: 1; transform: translateY(0); } 85% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-20px); } }
        @keyframes popBadge { 0% { transform: scale(0.5) rotate(-15deg); opacity: 0; } 50% { transform: scale(1.1) rotate(-15deg); opacity: 1; } 100% { transform: scale(1) rotate(-15deg); opacity: 0; } }
        @keyframes pulseDot { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
        @keyframes waveAnim { 0% { height: 4px; } 50% { height: 18px; } 100% { height: 4px; } }
      `}</style>
      
      {toastMessage && (
        <div style={{ position: 'absolute', top: '24px', zIndex: 700, backgroundColor: colors.accent, color: '#fff', padding: '10px 20px', borderRadius: '30px', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', animation: 'fadeInOut 2.2s ease forwards' }}>
          {toastMessage}
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '420px', height: '100%', maxHeight: '850px', backgroundColor: colors.cardBg, borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', border: `1px solid ${colors.border}`, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}>
        
        {!isAuthenticated ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '36px 24px', backgroundColor: colors.cardBg, textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px' }}>
              <span style={{ fontSize: '48px', marginBottom: '8px' }}>🔥</span>
              <h1 style={{ fontSize: '28px', fontWeight: '900', color: colors.accent, margin: '0 0 6px 0' }}>tinder</h1>
              <p style={{ fontSize: '13px', color: colors.subText, margin: 0 }}>Pro Professional Dating Experience</p>
            </div>

            {authMode === 'welcome' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                <button onClick={() => setAuthMode('signup')} style={{ width: '100%', padding: '14px', borderRadius: '30px', backgroundColor: colors.accent, color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Create Account (Sign Up)</button>
                <button onClick={() => setAuthMode('signin')} style={{ width: '100%', padding: '14px', borderRadius: '30px', backgroundColor: colors.pillBg, color: colors.text, border: `1px solid ${colors.border}`, fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>Sign In (Log In)</button>
              </div>
            )}

            {(authMode === 'signin' || authMode === 'signup') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', textAlign: 'left' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0', textAlign: 'center', color: colors.text }}>
                  {authMode === 'signup' ? 'Create New Account' : 'Welcome Back'}
                </h3>
                {authMode === 'signup' && (
                  <div>
                    <label style={{ fontSize: '11px', color: colors.subText, display: 'block', marginBottom: '4px' }}>Full Name</label>
                    <input type="text" placeholder="Alex Ali" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '10px', padding: '10px', color: colors.text, fontSize: '13px' }} />
                  </div>
                )}
                <div>
                  <label style={{ fontSize: '11px', color: colors.subText, display: 'block', marginBottom: '4px' }}>Email or Phone</label>
                  <input type="text" placeholder="user@tinder.com" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} style={{ width: '100%', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '10px', padding: '10px', color: colors.text, fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: colors.subText, display: 'block', marginBottom: '4px' }}>Password</label>
                  <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '10px', padding: '10px', color: colors.text, fontSize: '13px' }} />
                </div>
                <button onClick={handleAuthSubmit} style={{ width: '100%', padding: '13px', borderRadius: '30px', backgroundColor: colors.accent, color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '6px' }}>
                  {authMode === 'signup' ? 'Sign Up' : 'Log In'}
                </button>
                <button onClick={() => setAuthMode('welcome')} style={{ background: 'none', border: 'none', color: colors.subText, fontSize: '12px', cursor: 'pointer', textAlign: 'center' }}>← Back</button>
              </div>
            )}
            <div style={{ fontSize: '11px', color: colors.subText }}>Secure Pro Session</div>
          </div>
        ) : (
          <>
            {/* Redesigned Pro Header with Clean Spacing */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.headerBg }}>
              {/* Left Side: Brand Logo & Optional Context Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '22px' }}>🔥</span>
                <span style={{ fontSize: '20px', fontWeight: '900', color: colors.accent, letterSpacing: '-0.5px' }}>tinder</span>
                {currentTab === 'swipe' && (
                  <button onClick={() => setIsBlindDateMode(!isBlindDateMode)} style={{ marginLeft: '6px', background: isBlindDateMode ? colors.accent : colors.pillBg, border: `1px solid ${colors.border}`, padding: '4px 8px', borderRadius: '12px', fontSize: '10px', color: isBlindDateMode ? '#fff' : colors.text, cursor: 'pointer', fontWeight: 'bold' }}>
                    {isBlindDateMode ? '🕶️ Blind ON' : '🕶️ Blind'}
                  </button>
                )}
              </div>

              {/* Right Side: Navigation & Actions */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                {currentTab === 'swipe' && (
                  <button onClick={() => setShowPassportModal(true)} style={{ background: colors.pillBg, border: `1px solid ${colors.border}`, padding: '5px 10px', borderRadius: '14px', fontSize: '11px', color: colors.text, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                    <Icons.Location /> {currentCity.name.split(',')[0]}
                  </button>
                )}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: '4px' }}>
                  <button onClick={() => setCurrentTab('swipe')} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: currentTab === 'swipe' ? 1 : 0.4, color: colors.text, padding: 0 }} title="Discover"><Icons.Sparkle /></button>
                  <button onClick={() => setCurrentTab('likes')} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: currentTab === 'likes' ? 1 : 0.4, color: colors.text, padding: 0 }} title="Likes You"><Icons.Star /></button>
                  <button onClick={() => setCurrentTab('matches')} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: currentTab === 'matches' ? 1 : 0.4, color: colors.text, padding: 0 }} title="Matches"><Icons.Message /></button>
                  <button onClick={() => setCurrentTab('profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: currentTab === 'profile' ? 1 : 0.4, color: colors.text, padding: 0 }} title="Profile"><Icons.User /></button>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative' }}>
              
              {/* SWIPE TAB */}
              {currentTab === 'swipe' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '12px' }}>
                  
                  {/* Stories Tray */}
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {INITIAL_PROFILES.map(p => (
                      <div key={p.id} onClick={() => setActiveStory(p)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', padding: '2px', background: colors.accent }}>
                          <img src={p.images[0]} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontSize: '10px', marginTop: '2px', color: colors.text }}>{p.name}</span>
                      </div>
                    ))}
                  </div>

                  {currentIndex < filteredProfiles.length ? (
                    <>
                      <div style={{ width: '100%', height: '350px', borderRadius: '20px', overflowY: 'auto', position: 'relative', backgroundColor: colors.pillBg, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        {swipeBadge === 'LIKE' && <div style={{ position: 'absolute', top: '30px', left: '20px', border: '4px solid #22c55e', color: '#22c55e', padding: '4px 16px', borderRadius: '12px', fontSize: '28px', fontWeight: '900', zIndex: 100, animation: 'popBadge 0.5s ease forwards' }}>LIKE</div>}
                        {swipeBadge === 'NOPE' && <div style={{ position: 'absolute', top: '30px', right: '20px', border: '4px solid #ef4444', color: '#ef4444', padding: '4px 16px', borderRadius: '12px', fontSize: '28px', fontWeight: '900', zIndex: 100, animation: 'popBadge 0.5s ease forwards' }}>NOPE</div>}

                        <div style={{ position: 'relative', width: '100%', height: '190px', filter: isBlindDateMode ? 'blur(16px)' : 'none', transition: 'filter 0.3s' }}>
                          <img src={filteredProfiles[currentIndex].images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {isBlindDateMode && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', background: 'rgba(0,0,0,0.4)', fontSize: '13px' }}>🔒 Blind Date Active</div>}
                        </div>

                        <div style={{ padding: '10px 12px', backgroundColor: colors.cardBg }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{filteredProfiles[currentIndex].name}, {filteredProfiles[currentIndex].age}</h2>
                            <span style={{ fontSize: '10px', backgroundColor: colors.pillBg, padding: '2px 6px', borderRadius: '8px' }}>{filteredProfiles[currentIndex].zodiac}</span>
                          </div>
                          <p style={{ fontSize: '11px', color: colors.subText, margin: '2px 0 4px 0' }}>🎯 {filteredProfiles[currentIndex].intent} • 🎵 {filteredProfiles[currentIndex].spotify}</p>
                          
                          {/* Interactive Poll */}
                          <div style={{ backgroundColor: colors.pillBg, padding: '6px 8px', borderRadius: '8px', fontSize: '11px', margin: '4px 0' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>📊 {filteredProfiles[currentIndex].poll.question}</div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              {filteredProfiles[currentIndex].poll.options.map((opt, i) => (
                                <button key={i} onClick={() => setPollAnswers(prev => ({ ...prev, [filteredProfiles[currentIndex].id]: i }))} style={{ flex: 1, padding: '4px', borderRadius: '6px', backgroundColor: pollAnswers[filteredProfiles[currentIndex].id] === i ? colors.accent : colors.cardBg, color: pollAnswers[filteredProfiles[currentIndex].id] === i ? '#fff' : colors.text, border: `1px solid ${colors.border}`, fontSize: '10px', cursor: 'pointer' }}>{opt}</button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                        <button onClick={() => handleSwipe('left')} style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}><Icons.XMark /></button>
                        <button onClick={() => handleSwipe('right')} style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: colors.accent, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 6px 20px rgba(0,0,0,0.3)' }}><Icons.Heart /></button>
                      </div>
                    </>
                  ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
                      <span style={{ fontSize: '44px', marginBottom: '8px' }}>🎉</span>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>No more profiles!</h3>
                      <button onClick={() => setCurrentIndex(0)} style={{ marginTop: '16px', padding: '10px 20px', borderRadius: '20px', backgroundColor: colors.accent, color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Reset Deck</button>
                    </div>
                  )}
                </div>
              )}

              {/* LIKES YOU TAB */}
              {currentTab === 'likes' && (
                <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: colors.accent, marginBottom: '12px' }}>Profiles Who Liked You ({likesYouList.length})</h3>
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
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: colors.accent, marginBottom: '12px' }}>Your Matches ({matches.length})</h3>
                  {matches.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.subText }}>No matches yet!</div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                      {matches.map(m => (
                        <div key={m.id} onClick={() => { setActiveMatch(m); setCurrentTab('chat'); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                          <img src={m.images[0]} alt="" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${colors.accent}` }} />
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
                      <button onClick={() => setCurrentTab('matches')} style={{ background: 'none', border: 'none', color: colors.accent, fontWeight: 'bold', cursor: 'pointer', marginRight: '10px' }}>←</button>
                      <img src={activeMatch.images[0]} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', marginRight: '8px' }} />
                      <h4 style={{ fontSize: '13px', margin: 0 }}>{activeMatch.name}</h4>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <button onClick={() => setActiveVideoCall(true)} style={{ background: 'none', border: 'none', color: '#34d399', cursor: 'pointer' }} title="Video Call"><Icons.Video /></button>
                      <button onClick={() => setShowReportModal(true)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}>⚠️</button>
                    </div>
                  </div>

                  <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(messages[activeMatch.id] || []).map(msg => (
                      <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ padding: '8px 12px', borderRadius: '14px', maxWidth: '80%', fontSize: '12px', backgroundColor: msg.sender === 'me' ? colors.accent : colors.pillBg, color: '#fff', position: 'relative' }}>
                          {msg.image ? (
                            <div>
                              <img src={msg.image} alt="" style={{ width: '150px', borderRadius: '8px', display: 'block', marginBottom: msg.fileName ? '4px' : 0 }} />
                              {msg.fileName && <span style={{ fontSize: '9px', opacity: 0.8 }}>📎 {msg.fileName}</span>}
                            </div>
                          ) : msg.isVoice ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' }}>
                              <span>▶️</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '20px' }}>
                                {[4, 12, 18, 8, 14, 20, 10, 16, 6].map((h, i) => (
                                  <div key={i} style={{ width: '3px', height: `${h}px`, backgroundColor: '#fff', borderRadius: '2px', animation: 'waveAnim 1.2s infinite ease-in-out' }} />
                                ))}
                              </div>
                              <span style={{ fontSize: '10px' }}>{msg.duration}</span>
                            </div>
                          ) : (
                            msg.text
                          )}
                          {msg.reaction && <span style={{ position: 'absolute', bottom: '-10px', right: msg.sender === 'me' ? '0' : 'auto', left: msg.sender === 'me' ? 'auto' : '0', backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '10px', padding: '1px 4px', fontSize: '10px' }}>{msg.reaction}</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                          <span style={{ fontSize: '9px', color: colors.subText }}>{msg.readTime}</span>
                          {msg.sender === 'me' && (
                            <div style={{ display: 'flex', gap: '4px', fontSize: '10px' }}>
                              <span onClick={() => handleMessageReaction(msg.id, '❤️')} style={{ cursor: 'pointer' }}>❤️</span>
                              <span onClick={() => handleMessageReaction(msg.id, '😂')} style={{ cursor: 'pointer' }}>😂</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div style={{ display: 'flex', gap: '4px', padding: '6px 12px', backgroundColor: colors.pillBg, borderRadius: '12px', width: 'fit-content', alignItems: 'center' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: colors.subText, animation: 'pulseDot 1s infinite ease-in-out' }}></span>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: colors.subText, animation: 'pulseDot 1s infinite 0.2s ease-in-out' }}></span>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: colors.subText, animation: 'pulseDot 1s infinite 0.4s ease-in-out' }}></span>
                      </div>
                    )}
                  </div>

                  {showGifPicker && (
                    <div style={{ padding: '8px', backgroundColor: colors.cardBg, borderTop: `1px solid ${colors.border}`, display: 'flex', gap: '6px', overflowX: 'auto' }}>
                      {GIF_LIST.map((g, i) => (
                        <img key={i} src={g} alt="" onClick={() => sendGif(g)} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }} />
                      ))}
                    </div>
                  )}

                  <div style={{ padding: '8px 12px', backgroundColor: colors.cardBg, borderTop: `1px solid ${colors.border}`, display: 'flex', gap: '6px', overflowX: 'auto' }}>
                    <button onClick={generateAIIcebreaker} style={{ whiteSpace: 'nowrap', background: colors.pillBg, border: `1px solid ${colors.border}`, color: colors.text, padding: '4px 10px', borderRadius: '14px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>✨ AI Icebreaker</button>
                    <button onClick={() => setShowGifPicker(!showGifPicker)} style={{ whiteSpace: 'nowrap', background: colors.pillBg, border: `1px solid ${colors.border}`, color: colors.text, padding: '4px 10px', borderRadius: '14px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>🎨 GIFs</button>
                  </div>

                  <div style={{ padding: '10px', backgroundColor: colors.headerBg, borderTop: `1px solid ${colors.border}`, display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {isRecording ? (
                      <div style={{ flex: '1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold' }}>Recording {recordTime}s...</span>
                        <button onClick={stopRecording} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', padding: '4px 10px', fontSize: '11px' }}>Send</button>
                      </div>
                    ) : (
                      <>
                        <label htmlFor="file-upload" style={{ cursor: 'pointer', color: colors.subText }} title="Attach Picture or File">
                          <Icons.Attachment />
                        </label>
                        <input id="file-upload" type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
                        <input type="text" placeholder="Type a message..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputText)} style={{ flex: 1, backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '18px', padding: '8px 14px', fontSize: '12px', color: colors.text, outline: 'none' }} />
                        <button onClick={startRecording} style={{ background: 'none', border: 'none', color: colors.subText, cursor: 'pointer' }} title="Voice Note"><Icons.Mic /></button>
                        <button onClick={() => sendMessage(inputText)} style={{ background: colors.accent, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '18px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Send</button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* PROFILE TAB */}
              {currentTab === 'profile' && (
                <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto' }}>
                  <img src={userProfile.image} alt="" style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${colors.accent}`, marginBottom: '8px' }} />

                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{userProfile.name}, {userProfile.age}</h2>
                  <p style={{ fontSize: '12px', color: colors.subText, margin: '0 0 12px 0' }}>{userProfile.location}</p>

                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, padding: '12px 14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold' }}>App Theme</span>
                      <button onClick={() => setTheme(isDark ? 'light' : 'dark')} style={{ padding: '6px 12px', borderRadius: '14px', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', color: colors.text }}>
                        {isDark ? '🌙 Dark' : '☀️ Light'}
                      </button>
                    </div>

                    <div style={{ backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, padding: '12px 14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Accent Palette</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[
                          { name: 'Tinder', color: '#f43f5e' },
                          { name: 'Bumble', color: '#eab308' },
                          { name: 'Hinge', color: '#8b5cf6' }
                        ].map(acc => (
                          <button key={acc.name} onClick={() => setAccentColor(acc.color)} style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: acc.color, border: accentColor === acc.color ? '2px solid #fff' : 'none', cursor: 'pointer' }} />
                        ))}
                      </div>
                    </div>

                    {!userProfile.verified ? (
                      <button onClick={() => setShowVerificationModal(true)} style={{ width: '100%', padding: '12px', borderRadius: '20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>✓ Verify Profile (Blue Tick)</button>
                    ) : (
                      <div style={{ padding: '10px', backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>✓ Verified Profile Active</div>
                    )}

                    <button onClick={() => { setIsAuthenticated(false); showToast("Logged out successfully"); }} style={{ width: '100%', padding: '12px', borderRadius: '20px', backgroundColor: colors.pillBg, color: '#ef4444', border: `1px solid ${colors.border}`, fontWeight: 'bold', cursor: 'pointer' }}>🚪 Log Out</button>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

        {/* VERIFICATION MODAL */}
        {showVerificationModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>Photo Verification</h3>
            <p style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '20px' }}>Copy the gesture shown below to get your blue tick instantly.</p>
            <div style={{ width: '140px', height: '140px', borderRadius: '50%', border: '4px dashed #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', marginBottom: '20px', backgroundColor: '#18181b' }}>✌️</div>
            <button onClick={() => { setUserProfile(prev => ({ ...prev, verified: true })); setShowVerificationModal(false); showToast("✅ Verified successfully with Blue Tick!"); }} style={{ width: '100%', padding: '14px', borderRadius: '30px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>Take Selfie & Verify</button>
            <button onClick={() => setShowVerificationModal(false)} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
          </div>
        )}

        {/* VIDEO STORIES MODAL */}
        {activeStory && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000', zIndex: 800, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={activeStory.images[0]} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '13px' }}>{activeStory.name}'s Story</span>
              </div>
              <button onClick={() => setActiveStory(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0' }}>
              <video src={activeStory.storyVideo} autoPlay loop muted style={{ width: '100%', maxHeight: '480px', objectFit: 'cover', borderRadius: '16px' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setActiveStory(null); setMatches(prev => [...prev, activeStory]); setActiveMatch(activeStory); setCurrentTab('chat'); }} style={{ flex: 1, padding: '12px', borderRadius: '20px', backgroundColor: colors.accent, color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Reply to Story</button>
            </div>
          </div>
        )}

        {/* IN-APP VIDEO CALL MODAL WITH AR FILTERS */}
        {activeVideoCall && activeMatch && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#09090b', zIndex: 800, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '36px 20px' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#fff', margin: 0, fontSize: '20px' }}>Video Call with {activeMatch.name}</h3>
              <span style={{ fontSize: '12px', color: '#34d399' }}>Connected (HD)</span>
            </div>
            
            <div style={{ width: '100%', height: '340px', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#18181b', position: 'relative' }}>
              <img src={activeMatch.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {arFilter === 'sunglasses' && <div style={{ position: 'absolute', top: '35%', left: '32%', fontSize: '48px' }}>🕶️</div>}
              {arFilter === 'hearts' && <div style={{ position: 'absolute', top: '25%', left: '40%', fontSize: '48px' }}>💖</div>}

              <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '90px', height: '120px', borderRadius: '12px', backgroundColor: '#27272a', border: '2px solid #fff', overflow: 'hidden' }}>
                <img src={userProfile.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button onClick={() => setArFilter(arFilter === 'sunglasses' ? 'none' : 'sunglasses')} style={{ padding: '8px 12px', borderRadius: '14px', backgroundColor: arFilter === 'sunglasses' ? colors.accent : '#27272a', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px' }}>🕶️ Glasses</button>
              <button onClick={() => setArFilter(arFilter === 'hearts' ? 'none' : 'hearts')} style={{ padding: '8px 12px', borderRadius: '14px', backgroundColor: arFilter === 'hearts' ? colors.accent : '#27272a', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px' }}>💖 Hearts</button>
              <button onClick={() => setActiveVideoCall(false)} style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#ef4444', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icons.Phone /></button>
            </div>
          </div>
        )}

        {/* REPORT MODAL */}
        {showReportModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 600, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ backgroundColor: colors.headerBg, borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0' }}>Report or Block User</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {['Inappropriate messages', 'Fake profile', 'Block permanently'].map((reason, i) => (
                  <button key={i} onClick={() => { setBlockedUsers(prev => [...prev, activeMatch.id]); setMatches(prev => prev.filter(m => m.id !== activeMatch.id)); setActiveMatch(null); setShowReportModal(false); setCurrentTab('matches'); showToast("🚫 User blocked and reported"); }} style={{ padding: '12px', borderRadius: '12px', backgroundColor: colors.pillBg, color: colors.text, border: 'none', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>{reason}</button>
                ))}
              </div>
              <button onClick={() => setShowReportModal(false)} style={{ width: '100%', padding: '12px', borderRadius: '20px', backgroundColor: colors.pillBg, border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        {/* PASSPORT MODAL */}
        {showPassportModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 600, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ backgroundColor: colors.headerBg, borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0' }}>Change Location</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {[
                  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
                  { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
                  { name: 'London, UK', lat: 51.5074, lng: -0.1278 }
                ].map((c, i) => (
                  <button key={i} onClick={() => { setCurrentCity(c); setShowPassportModal(false); showToast(`📍 Location set to ${c.name}`); }} style={{ padding: '12px', borderRadius: '12px', backgroundColor: currentCity.name === c.name ? colors.accent : colors.pillBg, color: currentCity.name === c.name ? '#fff' : colors.text, border: 'none', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>{c.name}</button>
                ))}
              </div>
              <button onClick={() => setShowPassportModal(false)} style={{ width: '100%', padding: '12px', borderRadius: '20px', backgroundColor: colors.pillBg, border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
