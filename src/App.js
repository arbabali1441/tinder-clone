import React, { useState, useEffect, useCallback, useRef } from 'react';

const INITIAL_PROFILES = [
  { 
    id: 1, 
    name: 'Jessica', 
    age: 25, 
    gender: 'female',
    distance: 3, 
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
    distance: 8, 
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
    distance: 2, 
    verified: true,
    status: 'Online now ✨',
    bio: 'Sunset chaser 🌅 and fitness enthusiast. Looking for someone to explore new hiking trails with.', 
    interests: ['Hiking 🥾', 'Fitness 💪', 'Sunsets 🌅', 'Yoga 🧘‍♀️', 'Nature 🌲'], 
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
    ] 
  },
  { 
    id: 4, 
    name: 'David', 
    age: 29, 
    gender: 'male',
    distance: 12, 
    verified: false,
    status: 'Active yesterday',
    bio: 'Architect and photography enthusiast 📸. Let us grab a drink and talk about city designs.', 
    interests: ['Architecture 🏛️', 'Design ✨', 'Wine 🍷', 'Running 🏃‍♂️', 'Art 🎨'], 
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80'
    ] 
  }
];

const ICEBREAKERS = [
  "Coffee or tea? This is the ultimate test ☕",
  "If you could travel anywhere right now, where are we going? ✈️",
  "What is your go-to weekend adventure? 🌄",
  "Pineapple on pizza: absolute crime or underrated genius? 🍕"
];

const AUTO_REPLIES = [
  "That sounds super interesting! Tell me more 😊",
  "Haha totally agree with you on that! 🙌",
  "Oh nice! I would love to check that out sometime.",
  "You have got great taste! What else do you enjoy doing? ✨"
];

export default function App() {
  // LocalStorage Persisted States
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('tinder_auth') === 'true');
  const [authMode, setAuthMode] = useState('welcome');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [theme, setTheme] = useState(() => localStorage.getItem('tinder_theme') || 'dark');
  const [currentTab, setCurrentTab] = useState('swipe');
  
  // Filters
  const [maxDistance, setMaxDistance] = useState(15);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);
  const [genderFilter, setGenderFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [superLikesLeft, setSuperLikesLeft] = useState(3);

  // Modals
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showFullProfileModal, setShowFullProfileModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [swipeBadge, setSwipeBadge] = useState(null);

  // Call States
  const [activeCall, setActiveCall] = useState(false);
  const [callStatus, setCallStatus] = useState('Ringing...');
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  // Real MediaRecorder Voice Notes
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Profile & Data States
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('tinder_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Alex',
      age: 25,
      gender: 'male',
      location: 'Dubai, UAE 🇦🇪',
      bio: 'Exploring new places, tech enthusiast, and coffee lover ☕',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
    };
  });
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempAge, setTempAge] = useState(userProfile.age);
  const [tempBio, setTempBio] = useState(userProfile.bio);
  const [tempImage, setTempImage] = useState(userProfile.image);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [history, setHistory] = useState([]);
  
  // Likes You (Gold Feature) & Matches
  const [likesYouList] = useState([INITIAL_PROFILES[0], INITIAL_PROFILES[2]]);
  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('tinder_matches');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeMatch, setActiveMatch] = useState(null);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('tinder_messages');
    return saved ? JSON.parse(saved) : {};
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('tinder_auth', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('tinder_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('tinder_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('tinder_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('tinder_messages', JSON.stringify(messages));
  }, [messages]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const triggerBadge = (type) => {
    setSwipeBadge(type);
    setTimeout(() => setSwipeBadge(null), 500);
  };

  // Filter Profiles based on distance, age range, gender preference, and search
  const filteredProfiles = INITIAL_PROFILES.filter(p => {
    const matchesDistance = p.distance <= maxDistance;
    const matchesAge = p.age >= minAge && p.age <= maxAge;
    const matchesGender = genderFilter === 'all' || p.gender === genderFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.interests.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDistance && matchesAge && matchesGender && matchesSearch;
  });

  const handleLoginSubmit = () => {
    if (authMode === 'phone' && phoneNumber.length < 8) {
      showToast("⚠️ Enter valid phone number");
      return;
    }
    if (authMode === 'phone') {
      setAuthMode('otp');
      showToast("📲 OTP sent (Enter any 4 digits)");
      return;
    }
    if (authMode === 'otp' && otpCode.length < 4) {
      showToast("⚠️ Enter 4-digit OTP code");
      return;
    }
    setIsAuthenticated(true);
    showToast("🎉 Welcome to Tinder!");
  };

  // Real MediaRecorder Audio Implementation
  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        sendVoiceMessageObject(audioUrl);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordTime(0);
    } catch (err) {
      // Fallback simulation if microphone access denied or not supported
      setIsRecording(true);
      setRecordTime(0);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    } else {
      // Fallback manual send
      sendVoiceMessageObject(null);
    }
    setIsRecording(false);
  };

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setRecordTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const sendVoiceMessageObject = (audioUrl) => {
    if (!activeMatch) return;
    const matchId = activeMatch.id;
    const durationSec = recordTime > 0 ? recordTime : 3;
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      isVoice: true,
      audioUrl: audioUrl,
      duration: `${durationSec}s`,
      text: `Voice Note (${durationSec}s)`
    };
    setMessages(prev => ({ ...prev, [matchId]: [...(prev[matchId] || []), newMsg] }));
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const randomReply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      const replyMsg = { id: Date.now() + 1, sender: 'match', text: randomReply };
      setMessages(prev => ({ ...prev, [matchId]: [...(prev[matchId] || []), replyMsg] }));
    }, 1500);
  };

  const playAudioNote = (msg) => {
    if (msg.audioUrl) {
      const audio = new Audio(msg.audioUrl);
      audio.play().catch(() => showToast("▶️ Playing simulated voice note"));
    } else {
      showToast("▶️ Playing voice note audio...");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChatImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && activeMatch) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const matchId = activeMatch.id;
        const newMsg = { id: Date.now(), sender: 'me', image: reader.result };
        setMessages(prev => ({ ...prev, [matchId]: [...(prev[matchId] || []), newMsg] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startCall = () => {
    setActiveCall(true);
    setCallStatus('Ringing...');
    setCallTimer(0);
    setIsMuted(false);
    setIsSpeaker(false);
    setTimeout(() => setCallStatus('Connected'), 2000);
  };

  const endCall = () => {
    setCallStatus('Ended');
    setTimeout(() => setActiveCall(false), 500);
  };

  useEffect(() => {
    let interval;
    if (activeCall && callStatus === 'Connected') {
      interval = setInterval(() => setCallTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall, callStatus]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSwipe = useCallback((direction) => {
    if (currentIndex >= filteredProfiles.length) return;
    const profile = filteredProfiles[currentIndex];

    if (direction === 'super') {
      if (superLikesLeft <= 0) {
        showToast("⚠️ No Super Likes left today!");
        return;
      }
      setSuperLikesLeft(prev => prev - 1);
      triggerBadge('SUPER');
      showToast(`⭐ Super Like sent to ${profile.name}!`);
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
    const lastAction = history[history.length - 1];
    setHistory(prev => prev.slice(0, prev.length - 1));
    setCurrentIndex(lastAction.index);
    setCurrentPhotoIndex(lastAction.photoIndex);
  }, [history]);

  const sendMessage = (textToSend) => {
    const text = typeof textToSend === 'string' ? textToSend : inputText;
    if (!text.trim() || !activeMatch) return;
    const matchId = activeMatch.id;
    const newMsg = { id: Date.now(), sender: 'me', text };
    
    setMessages(prev => ({ ...prev, [matchId]: [...(prev[matchId] || []), newMsg] }));
    setInputText('');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const randomReply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      const replyMsg = { id: Date.now() + 1, sender: 'match', text: randomReply };
      setMessages(prev => ({ ...prev, [matchId]: [...(prev[matchId] || []), replyMsg] }));
    }, 1500);
  };

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
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(-20px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        @keyframes popBadge {
          0% { transform: scale(0.5) rotate(-15deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(-15deg); opacity: 1; }
          100% { transform: scale(1) rotate(-15deg); opacity: 0; }
        }
        @keyframes pulseRing {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 0.4; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
      `}</style>
      
      {toastMessage && (
        <div style={{ position: 'absolute', top: '24px', zIndex: 400, backgroundColor: '#f43f5e', color: '#fff', padding: '10px 20px', borderRadius: '30px', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', animation: 'fadeInOut 2.2s ease forwards' }}>
          {toastMessage}
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '420px', height: '100%', maxHeight: '850px', backgroundColor: colors.cardBg, borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', border: `1px solid ${colors.border}`, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}>
        
        {!isAuthenticated ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '36px 24px', backgroundColor: colors.cardBg, textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px' }}>
              <span style={{ fontSize: '56px', marginBottom: '12px' }}>🔥</span>
              <h1 style={{ fontSize: '32px', fontWeight: '900', background: 'linear-gradient(to right, #f43f5e, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 8px 0' }}>tinder</h1>
              <p style={{ fontSize: '14px', color: colors.subText, margin: 0 }}>Discover, Match & Connect with people nearby.</p>
            </div>

            {authMode === 'welcome' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                <button onClick={() => setAuthMode('phone')} style={{ width: '100%', padding: '14px', borderRadius: '30px', background: 'linear-gradient(to right, #f43f5e, #ec4899)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>📱 Sign in with Phone</button>
                <button onClick={() => setIsAuthenticated(true)} style={{ width: '100%', padding: '14px', borderRadius: '30px', backgroundColor: colors.pillBg, color: colors.text, border: `1px solid ${colors.border}`, fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>⚡ Instant Demo Login</button>
              </div>
            )}

            {authMode === 'phone' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '13px', color: colors.subText, display: 'block', marginBottom: '6px' }}>Phone Number</label>
                  <input type="tel" placeholder="+971 50 123 4567" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={{ width: '100%', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '14px', padding: '14px', color: colors.text, fontSize: '15px', outline: 'none' }} />
                </div>
                <button onClick={handleLoginSubmit} style={{ width: '100%', padding: '14px', borderRadius: '30px', background: 'linear-gradient(to right, #f43f5e, #ec4899)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Send OTP</button>
                <button onClick={() => setAuthMode('welcome')} style={{ background: 'none', border: 'none', color: colors.subText, fontSize: '13px', cursor: 'pointer' }}>Back</button>
              </div>
            )}

            {authMode === 'otp' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
                <div style={{ textAlign: 'left' }}>
                  <label style={{ fontSize: '13px', color: colors.subText, display: 'block', marginBottom: '6px' }}>Enter 4-Digit Code</label>
                  <input type="text" maxLength="4" placeholder="1234" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} style={{ width: '100%', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '14px', padding: '14px', color: colors.text, fontSize: '18px', textAlign: 'center', letterSpacing: '8px', outline: 'none' }} />
                </div>
                <button onClick={handleLoginSubmit} style={{ width: '100%', padding: '14px', borderRadius: '30px', background: 'linear-gradient(to right, #f43f5e, #ec4899)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Verify & Sign In</button>
              </div>
            )}

            <div style={{ fontSize: '12px', color: colors.subText }}>Secure & encrypted authentication</div>
          </div>
        ) : (
          <>
            {/* Header Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.headerBg }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>🔥</span>
                <span style={{ fontSize: '22px', fontWeight: '800', background: 'linear-gradient(to right, #f43f5e, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.5px' }}>tinder</span>
              </div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                {currentTab === 'swipe' && (
                  <button onClick={() => setShowFilterModal(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }} title="Filters">⚙️</button>
                )}
                <button onClick={() => setCurrentTab('swipe')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', opacity: currentTab === 'swipe' ? 1 : 0.4 }} title="Discover">✨</button>
                <button onClick={() => setCurrentTab('likes')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', opacity: currentTab === 'likes' ? 1 : 0.4, position: 'relative' }} title="Likes You">
                  💛
                  <span style={{ position: 'absolute', top: '-4px', right: '-8px', backgroundColor: '#f43f5e', color: '#fff', fontSize: '9px', fontWeight: 'bold', padding: '2px 4px', borderRadius: '50%' }}>2</span>
                </button>
                <button onClick={() => setCurrentTab('matches')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', opacity: currentTab === 'matches' ? 1 : 0.4 }} title="Chats">💬</button>
                <button onClick={() => setCurrentTab('profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', opacity: currentTab === 'profile' ? 1 : 0.4 }} title="Profile">👤</button>
              </div>
            </div>

            {/* Main Content Sections */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative' }}>
              
              {/* SWIPE TAB */}
              {currentTab === 'swipe' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px' }}>
                  
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      placeholder="🔍 Search name or interest..." 
                      value={searchQuery} 
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentIndex(0); }} 
                      style={{ flex: 1, backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '20px', padding: '10px 14px', fontSize: '12px', color: colors.text, outline: 'none' }} 
                    />
                    <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '8px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: '#3b82f6', whiteSpace: 'nowrap' }}>
                      ⭐ {superLikesLeft} left
                    </div>
                  </div>

                  {currentIndex < filteredProfiles.length ? (
                    <>
                      <div style={{ width: '100%', height: '380px', borderRadius: '20px', overflowY: 'auto', position: 'relative', backgroundColor: colors.pillBg, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        
                        {swipeBadge === 'LIKE' && (
                          <div style={{ position: 'absolute', top: '40px', left: '20px', border: '4px solid #22c55e', color: '#22c55e', padding: '4px 16px', borderRadius: '12px', fontSize: '32px', fontWeight: '900', zIndex: 100, animation: 'popBadge 0.5s ease forwards' }}>LIKE</div>
                        )}
                        {swipeBadge === 'NOPE' && (
                          <div style={{ position: 'absolute', top: '40px', right: '20px', border: '4px solid #ef4444', color: '#ef4444', padding: '4px 16px', borderRadius: '12px', fontSize: '32px', fontWeight: '900', zIndex: 100, animation: 'popBadge 0.5s ease forwards' }}>NOPE</div>
                        )}
                        {swipeBadge === 'SUPER' && (
                          <div style={{ position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)', border: '4px solid #3b82f6', color: '#3b82f6', padding: '4px 16px', borderRadius: '12px', fontSize: '32px', fontWeight: '900', zIndex: 100, animation: 'popBadge 0.5s ease forwards' }}>SUPER LIKE</div>
                        )}

                        <div style={{ position: 'relative', width: '100%', height: '230px', cursor: 'pointer' }} onClick={() => setShowFullProfileModal(true)}>
                          <img src={filteredProfiles[currentIndex].images[currentPhotoIndex]} alt={filteredProfiles[currentIndex].name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          
                          <div style={{ position: 'absolute', top: '20px', left: '12px', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 10 }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34d399' }}></span>
                            <span style={{ fontSize: '11px', color: '#fff', fontWeight: '500' }}>{filteredProfiles[currentIndex].status}</span>
                          </div>

                          <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', gap: '4px', zIndex: 10, marginTop: '28px' }}>
                            {filteredProfiles[currentIndex].images.map((_, idx) => (
                              <div key={idx} style={{ flex: 1, height: '3px', backgroundColor: idx === currentPhotoIndex ? '#fff' : 'rgba(255,255,255,0.4)', borderRadius: '2px' }} />
                            ))}
                          </div>

                          {currentPhotoIndex > 0 && (
                            <button onClick={(e) => { e.stopPropagation(); setCurrentPhotoIndex(prev => prev - 1); }} style={{ position: 'absolute', left: '10px', top: '50% - 16px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>‹</button>
                          )}
                          {currentPhotoIndex < filteredProfiles[currentIndex].images.length - 1 && (
                            <button onClick={(e) => { e.stopPropagation(); setCurrentPhotoIndex(prev => prev + 1); }} style={{ position: 'absolute', right: '10px', top: '50% - 16px', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>›</button>
                          )}
                        </div>

                        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', backgroundColor: colors.cardBg, cursor: 'pointer' }} onClick={() => setShowFullProfileModal(true)}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0, color: colors.text }}>{filteredProfiles[currentIndex].name},</h2>
                            <span style={{ fontSize: '16px', fontWeight: '300', color: colors.subText }}>{filteredProfiles[currentIndex].age}</span>
                            {filteredProfiles[currentIndex].verified && <span style={{ backgroundColor: '#3b82f6', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px' }}>✓ Verified</span>}
                          </div>
                          <p style={{ fontSize: '12px', color: colors.subText, margin: '2px 0 6px 0' }}>📍 {filteredProfiles[currentIndex].distance} km away</p>
                          <p style={{ fontSize: '12px', color: colors.text, margin: '0 0 8px 0', lineHeight: '1.3' }}>{filteredProfiles[currentIndex].bio}</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {filteredProfiles[currentIndex].interests.map((tag, i) => (
                              <span key={i} style={{ fontSize: '11px', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, padding: '3px 8px', borderRadius: '20px', color: colors.text }}>{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', paddingBottom: '4px' }}>
                        <button onClick={handleRewind} disabled={history.length === 0} style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, cursor: history.length === 0 ? 'not-allowed' : 'pointer', fontSize: '15px', opacity: history.length === 0 ? 0.4 : 1 }}>⏪</button>
                        <button onClick={() => handleSwipe('left')} style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, cursor: 'pointer', fontSize: '18px' }}>❌</button>
                        <button onClick={() => handleSwipe('super')} style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, cursor: 'pointer', fontSize: '15px' }}>⭐</button>
                        <button onClick={() => handleSwipe('right')} style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #f43f5e, #ec4899)', border: 'none', cursor: 'pointer', fontSize: '22px', boxShadow: '0 6px 20px rgba(244,63,94,0.4)' }}>❤️</button>
                      </div>
                    </>
                  ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
                      <span style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</span>
                      <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px 0', color: colors.text }}>No profiles match filters!</h3>
                      <p style={{ fontSize: '14px', color: colors.subText, margin: '0 0 24px 0' }}>Try adjusting age or distance filters in settings.</p>
                      <button onClick={() => { setSearchQuery(''); setMinAge(18); setMaxAge(35); setGenderFilter('all'); setCurrentIndex(0); }} style={{ padding: '12px 24px', borderRadius: '30px', background: 'linear-gradient(to right, #f43f5e, #ec4899)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Reset Filters</button>
                    </div>
                  )}
                </div>
              )}

              {/* LIKES YOU TAB (Gold Feature) */}
              {currentTab === 'likes' && (
                <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#f43f5e', marginBottom: '12px' }}>Profiles Who Liked You ({likesYouList.length})</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {likesYouList.map((p) => (
                      <div key={p.id} onClick={() => { setMatches(prev => [...prev, p]); setActiveMatch(p); setCurrentTab('chat'); }} style={{ height: '200px', borderRadius: '16px', overflow: 'hidden', position: 'relative', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                        <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: 0, insetX: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '12px 10px', color: '#fff' }}>
                          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{p.name}, {p.age}</h4>
                          <span style={{ fontSize: '11px', color: '#34d399' }}>⚡ Instant Match</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MATCHES & CHAT TABS */}
              {currentTab === 'matches' && (
                <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#f43f5e', marginBottom: '12px' }}>Your Matches ({matches.length})</h3>
                  {matches.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: colors.subText, textAlign: 'center' }}>
                      <span style={{ fontSize: '40px', marginBottom: '8px' }}>💬</span>
                      <p style={{ fontSize: '14px' }}>No matches yet. Keep swiping right!</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                      {matches.map((m) => (
                        <div key={m.id} onClick={() => { setActiveMatch(m); setCurrentTab('chat'); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                          <div style={{ width: '64px', height: '64px', borderRadius: '50%', padding: '2px', background: 'linear-gradient(135deg, #f43f5e, #ec4899)' }}>
                            <img src={m.images[0]} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                          </div>
                          <span style={{ fontSize: '12px', marginTop: '6px', textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: colors.text }}>{m.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentTab === 'chat' && activeMatch && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: colors.bg, position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: colors.headerBg, borderBottom: `1px solid ${colors.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <button onClick={() => setCurrentTab('matches')} style={{ background: 'none', border: 'none', color: '#f43f5e', fontWeight: 'bold', cursor: 'pointer', marginRight: '12px', fontSize: '14px' }}>← Back</button>
                      <img src={activeMatch.images[0]} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px' }} />
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, color: colors.text }}>{activeMatch.name}</h4>
                        <span style={{ fontSize: '11px', color: '#34d399' }}>● Online</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={startCall} style={{ background: 'none', border: 'none', color: '#34d399', fontSize: '18px', cursor: 'pointer' }} title="Voice Call">📞</button>
                      <button onClick={() => setShowChatMenu(!showChatMenu)} style={{ background: 'none', border: 'none', color: colors.text, fontSize: '20px', cursor: 'pointer' }}>⋮</button>
                    </div>
                  </div>

                  {showChatMenu && (
                    <div style={{ position: 'absolute', right: '16px', top: '60px', backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', zIndex: 50, width: '160px', overflow: 'hidden' }}>
                      <button onClick={() => { setMessages(prev => ({ ...prev, [activeMatch.id]: [] })); setShowChatMenu(false); }} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', color: colors.text, fontSize: '13px', textAlign: 'left', cursor: 'pointer', borderBottom: `1px solid ${colors.border}` }}>🧹 Clear Chat</button>
                      <button onClick={() => { setMatches(prev => prev.filter(m => m.id !== activeMatch.id)); setActiveMatch(null); setShowChatMenu(false); setCurrentTab('matches'); }} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', color: '#f43f5e', fontSize: '13px', textAlign: 'left', cursor: 'pointer', fontWeight: 'bold' }}>🚫 Unmatch</button>
                    </div>
                  )}

                  <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }} onClick={() => setShowChatMenu(false)}>
                    <div style={{ backgroundColor: colors.pillBg, padding: '10px 14px', borderRadius: '16px', maxWidth: '80%', fontSize: '13px', color: colors.text }}>You matched with {activeMatch.name}! ✨</div>
                    {(messages[activeMatch.id] || []).map((msg) => (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                        <div 
                          onClick={() => msg.isVoice && playAudioNote(msg)}
                          style={{ 
                            padding: msg.image ? '4px' : '10px 14px', 
                            borderRadius: '16px', 
                            maxWidth: '80%', 
                            fontSize: '13px', 
                            backgroundColor: msg.sender === 'me' ? '#f43f5e' : colors.pillBg, 
                            color: '#fff',
                            cursor: msg.isVoice ? 'pointer' : 'default'
                          }}
                        >
                          {msg.image ? (
                            <img src={msg.image} alt="shared" style={{ width: '180px', borderRadius: '12px', display: 'block' }} />
                          ) : msg.isVoice ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>▶️</span>
                              <span>{msg.text} (Tap to Play)</span>
                            </div>
                          ) : (
                            msg.text
                          )}
                        </div>
                      </div>
                    ))}
                    {isTyping && <div style={{ fontSize: '12px', fontStyle: 'italic', color: colors.subText }}>{activeMatch.name} is typing...</div>}
                  </div>
                  
                  {/* Icebreakers bar */}
                  <div style={{ padding: '8px 12px', backgroundColor: colors.cardBg, borderTop: `1px solid ${colors.border}`, display: 'flex', gap: '8px', overflowX: 'auto' }}>
                    {ICEBREAKERS.map((ice, i) => (
                      <button key={i} onClick={() => sendMessage(ice)} style={{ whiteSpace: 'nowrap', background: colors.pillBg, border: `1px solid ${colors.border}`, color: colors.text, padding: '6px 12px', borderRadius: '16px', fontSize: '11px', cursor: 'pointer' }}>{ice}</button>
                    ))}
                  </div>

                  <div style={{ padding: '12px', backgroundColor: colors.headerBg, borderTop: `1px solid ${colors.border}`, display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {isRecording ? (
                      <div style={{ flex: 1, backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '20px', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#ef4444' }}>Recording... {formatTimer(recordTime)}</span>
                        <button onClick={stopRecording} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', padding: '4px 12px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Send 🚀</button>
                      </div>
                    ) : (
                      <>
                        <label htmlFor="chat-img" style={{ fontSize: '18px', cursor: 'pointer', padding: '0 4px' }} title="Send Photo">📷</label>
                        <input id="chat-img" type="file" accept="image/*" onChange={handleChatImageUpload} style={{ display: 'none' }} />
                        <input type="text" placeholder="Type a message..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputText)} style={{ flex: 1, backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '20px', padding: '10px 16px', fontSize: '13px', color: colors.text, outline: 'none' }} />
                        <button onClick={startRecording} style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, cursor: 'pointer', fontSize: '15px' }} title="Record Voice">🎙️</button>
                        <button onClick={() => sendMessage(inputText)} style={{ padding: '10px 16px', borderRadius: '20px', backgroundColor: '#f43f5e', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Send</button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* PROFILE TAB */}
              {currentTab === 'profile' && (
                <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '100px', height: '100px', borderRadius: '50%', padding: '3px', background: 'linear-gradient(135deg, #f43f5e, #ec4899)', marginBottom: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
                    <img src={userProfile.image} alt="User Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  </div>
                  <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 4px 0', color: colors.text }}>{userProfile.name}, {userProfile.age}</h2>
                  <p style={{ fontSize: '13px', color: colors.subText, margin: '0 0 8px 0' }}>{userProfile.location}</p>
                  <p style={{ fontSize: '12px', color: colors.text, textAlign: 'center', padding: '0 16px', margin: '0 0 16px 0', fontStyle: 'italic' }}>"{userProfile.bio}"</p>
                  
                  <button onClick={() => { setTempName(userProfile.name); setTempAge(userProfile.age); setTempBio(userProfile.bio); setTempImage(userProfile.image); setShowEditProfileModal(true); }} style={{ padding: '8px 20px', borderRadius: '20px', backgroundColor: colors.pillBg, color: '#f43f5e', border: `1px solid ${colors.border}`, fontWeight: '600', cursor: 'pointer', fontSize: '13px', marginBottom: '24px' }}>Edit Profile</button>

                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, padding: '14px 16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: colors.text }}>App Theme</span>
                      <button onClick={() => setTheme(isDark ? 'light' : 'dark')} style={{ padding: '6px 12px', borderRadius: '20px', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, color: colors.text, fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                        {isDark ? '🌙 Dark' : '☀️ Light'}
                      </button>
                    </div>
                    <div style={{ backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, padding: '14px 16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '14px', color: colors.text }}>Subscription</span><span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f43f5e' }}>Tinder Gold ✨</span></div>
                    <div style={{ backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, padding: '14px 16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '14px', color: colors.text }}>Account Status</span><button onClick={() => setIsAuthenticated(false)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Log Out</button></div>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

        {/* VOICE CALL MODAL */}
        {activeCall && activeMatch && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#09090b', zIndex: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '48px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#a1a1aa', letterSpacing: '1px', textTransform: 'uppercase' }}>Tinder Audio Call</span>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{activeMatch.name}</h2>
              <span style={{ fontSize: '14px', color: callStatus === 'Connected' ? '#34d399' : '#f43f5e', fontWeight: '600' }}>
                {callStatus === 'Connected' ? formatTimer(callTimer) : callStatus}
              </span>
            </div>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', width: '160px', height: '160px', borderRadius: '50%', border: '2px solid rgba(244,63,94,0.3)', animation: 'pulseRing 2s infinite ease-in-out' }}></div>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #f43f5e', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
                <img src={activeMatch.images[0]} alt={activeMatch.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <button onClick={() => setIsMuted(!isMuted)} style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: isMuted ? '#ef4444' : '#27272a', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '20px' }}>{isMuted ? '🔇' : '🎙️'}</button>
              <button onClick={endCall} style={{ width: '68px', height: '68px', borderRadius: '50%', backgroundColor: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '24px', boxShadow: '0 8px 25px rgba(239,68,68,0.5)' }}>📞</button>
              <button onClick={() => setIsSpeaker(!isSpeaker)} style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: isSpeaker ? '#3b82f6' : '#27272a', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '20px' }}>🔊</button>
            </div>
          </div>
        )}

        {/* FULL PROFILE MODAL */}
        {showFullProfileModal && currentIndex < filteredProfiles.length && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: colors.cardBg, zIndex: 300, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ position: 'relative', width: '100%', height: '360px' }}>
              <img src={filteredProfiles[currentIndex].images[currentPhotoIndex]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setShowFullProfileModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: colors.text }}>{filteredProfiles[currentIndex].name}, {filteredProfiles[currentIndex].age}</h2>
              <p style={{ fontSize: '14px', color: colors.subText, margin: 0 }}>📍 {filteredProfiles[currentIndex].distance} km away</p>
              <p style={{ fontSize: '14px', color: colors.text, lineHeight: '1.5' }}>{filteredProfiles[currentIndex].bio}</p>
              <button onClick={() => setShowFullProfileModal(false)} style={{ width: '100%', padding: '14px', borderRadius: '30px', background: 'linear-gradient(to right, #f43f5e, #ec4899)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '16px' }}>Back to Swiping</button>
            </div>
          </div>
        )}

        {/* EDIT PROFILE MODAL */}
        {showEditProfileModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ backgroundColor: colors.headerBg, borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', maxHeight: '90%', overflowY: 'auto' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0', color: colors.text }}>Edit Profile</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
                <img src={tempImage} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f43f5e' }} />
                <label htmlFor="photo-up" style={{ fontSize: '12px', color: '#f43f5e', fontWeight: 'bold', cursor: 'pointer', backgroundColor: 'rgba(244,63,94,0.1)', padding: '6px 14px', borderRadius: '16px' }}>Change Photo</label>
                <input id="photo-up" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} style={{ width: '100%', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '12px', color: colors.text }} />
                <textarea rows="3" value={tempBio} onChange={(e) => setTempBio(e.target.value)} style={{ width: '100%', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '12px', color: colors.text, resize: 'none' }} />
              </div>
              <button onClick={() => { setUserProfile(prev => ({ ...prev, name: tempName, age: Number(tempAge), bio: tempBio, image: tempImage })); setShowEditProfileModal(false); showToast("✅ Updated profile!"); }} style={{ width: '100%', padding: '14px', borderRadius: '30px', background: 'linear-gradient(to right, #f43f5e, #ec4899)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Save Changes</button>
            </div>
          </div>
        )}

        {/* FILTERS MODAL */}
        {showFilterModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 300, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ backgroundColor: colors.headerBg, borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: colors.text }}>Discovery Settings</h3>
                <button onClick={() => setShowFilterModal(false)} style={{ background: 'none', border: 'none', color: colors.subText, fontSize: '18px', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', color: colors.subText, display: 'block', marginBottom: '6px' }}>Max Distance: {maxDistance} km</label>
                <input type="range" min="1" max="50" value={maxDistance} onChange={(e) => setMaxDistance(Number(e.target.value))} style={{ width: '100%', accentColor: '#f43f5e' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', color: colors.subText, display: 'block', marginBottom: '6px' }}>Age Range: {minAge} - {maxAge}</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" value={minAge} onChange={(e) => setMinAge(Number(e.target.value))} style={{ width: '50%', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, padding: '8px', borderRadius: '8px', color: colors.text }} />
                  <input type="number" value={maxAge} onChange={(e) => setMaxAge(Number(e.target.value))} style={{ width: '50%', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, padding: '8px', borderRadius: '8px', color: colors.text }} />
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '13px', color: colors.subText, display: 'block', marginBottom: '6px' }}>Show Me</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['all', 'male', 'female'].map(g => (
                    <button key={g} onClick={() => setGenderFilter(g)} style={{ flex: 1, padding: '10px', borderRadius: '12px', backgroundColor: genderFilter === g ? '#f43f5e' : colors.pillBg, color: genderFilter === g ? '#fff' : colors.text, border: 'none', fontWeight: 'bold', textTransform: 'capitalize', cursor: 'pointer' }}>{g}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowFilterModal(false)} style={{ width: '100%', padding: '14px', borderRadius: '30px', background: 'linear-gradient(to right, #f43f5e, #ec4899)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Apply Filters</button>
            </div>
          </div>
        )}

        {/* MATCH MODAL */}
        {showMatchModal && matchedProfile && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '36px', fontStyle: 'italic', fontWeight: '900', color: '#f43f5e', margin: '0 0 8px 0' }}>IT'S A MATCH!</h2>
            <p style={{ fontSize: '14px', color: '#d4d4d8', margin: '0 0 32px 0' }}>You and {matchedProfile.name} liked each other.</p>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #f43f5e', overflow: 'hidden' }}><img src={userProfile.image} alt="Me" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #ec4899', overflow: 'hidden', marginLeft: '-24px' }}><img src={matchedProfile.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => { setShowMatchModal(false); setActiveMatch(matchedProfile); setCurrentTab('chat'); }} style={{ width: '100%', padding: '14px', borderRadius: '30px', background: 'linear-gradient(to right, #f43f5e, #ec4899)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Send Message</button>
              <button onClick={() => setShowMatchModal(false)} style={{ width: '100%', padding: '14px', borderRadius: '30px', backgroundColor: '#27272a', color: '#d4d4d8', border: '1px solid #3f3f46', fontWeight: '600', cursor: 'pointer' }}>Keep Swiping</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
