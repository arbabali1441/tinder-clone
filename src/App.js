import React, { useState, useEffect, useCallback } from 'react';

const INITIAL_PROFILES = [
  { 
    id: 1, 
    name: 'Jessica', 
    age: 25, 
    distance: 3, 
    verified: true,
    status: 'Active recently',
    bio: 'Coffee addict ☕, art lover, and weekend traveler. Let us find the best dessert spot in town!', 
    interests: ['Coffee ☕', 'Art 🎨', 'Travel ✈️', 'Photography 📸', 'Desserts 🍰'], 
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80'
    ] 
  },
  { 
    id: 2, 
    name: 'Michael', 
    age: 27, 
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
  const [theme, setTheme] = useState('dark');
  const [currentTab, setCurrentTab] = useState('swipe');
  const [maxDistance, setMaxDistance] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [superLikesLeft, setSuperLikesLeft] = useState(3);
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

  // Dynamic Theme Palette
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

  const [userProfile, setUserProfile] = useState({
    name: 'Alex',
    age: 25,
    location: 'New York, USA 🇺🇸',
    bio: 'Exploring new places, tech enthusiast, and coffee lover ☕',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
  });
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempAge, setTempAge] = useState(userProfile.age);
  const [tempBio, setTempBio] = useState(userProfile.bio);
  const [tempImage, setTempImage] = useState(userProfile.image);
  
  const filteredProfiles = INITIAL_PROFILES.filter(p => {
    const matchesDistance = p.distance <= maxDistance;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.interests.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDistance && matchesSearch;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeMatch, setActiveMatch] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const triggerBadge = (type) => {
    setSwipeBadge(type);
    setTimeout(() => {
      setSwipeBadge(null);
    }, 600);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCall = () => {
    setActiveCall(true);
    setCallStatus('Calling...');
    setCallTimer(0);
    setIsMuted(false);
    setIsSpeaker(false);

    setTimeout(() => {
      setCallStatus('Connected');
    }, 2500);
  };

  const endCall = () => {
    setCallStatus('Ended');
    setTimeout(() => {
      setActiveCall(false);
    }, 800);
  };

  useEffect(() => {
    let interval;
    if (activeCall && callStatus === 'Connected') {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
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
      showToast(`⭐ You sent a Super Like to ${profile.name}! (${superLikesLeft - 1} left)`);
      setHistory(prev => [...prev, { index: currentIndex, photoIndex: currentPhotoIndex, profile }]);
      setMatches((prev) => [...prev, profile]);
      setMatchedProfile(profile);
      setShowMatchModal(true);
    } else {
      setHistory(prev => [...prev, { index: currentIndex, photoIndex: currentPhotoIndex, profile }]);
      if (direction === 'right') {
        triggerBadge('LIKE');
        setMatches((prev) => [...prev, profile]);
        setMatchedProfile(profile);
        setShowMatchModal(true);
      } else {
        triggerBadge('NOPE');
      }
    }
    
    setCurrentIndex((prev) => prev + 1);
    setCurrentPhotoIndex(0);
  }, [currentIndex, filteredProfiles, currentPhotoIndex, superLikesLeft]);

  const handleRewind = useCallback(() => {
    if (history.length === 0) return;
    const lastAction = history[history.length - 1];
    setHistory(prev => prev.slice(0, prev.length - 1));
    setCurrentIndex(lastAction.index);
    setCurrentPhotoIndex(lastAction.photoIndex);
  }, [history]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentTab !== 'swipe' || showEditProfileModal || showFilterModal || showMatchModal || showFullProfileModal || activeCall) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') {
        handleSwipe('left');
      } else if (e.key === 'ArrowRight') {
        handleSwipe('right');
      } else if (e.key === 'ArrowUp') {
        handleSwipe('super');
      } else if (e.key === 'ArrowDown') {
        handleRewind();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTab, showEditProfileModal, showFilterModal, showMatchModal, showFullProfileModal, activeCall, handleSwipe, handleRewind]);

  const nextPhoto = (e) => {
    e.stopPropagation();
    const currentProfile = filteredProfiles[currentIndex];
    if (currentPhotoIndex < currentProfile.images.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
    }
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
    }
  };

  const sendMessage = () => {
    if (!inputText.trim() || !activeMatch) return;
    const matchId = activeMatch.id;
    const newMsg = { sender: 'me', text: inputText };
    
    setMessages((prev) => ({ ...prev, [matchId]: [...(prev[matchId] || []), newMsg] }));
    setInputText('');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const randomReply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      const replyMsg = { sender: 'match', text: randomReply };
      setMessages((prev) => ({ ...prev, [matchId]: [...(prev[matchId] || []), replyMsg] }));
    }, 2000);
  };

  const clearChat = () => {
    if (!activeMatch) return;
    setMessages(prev => ({ ...prev, [activeMatch.id]: [] }));
    setShowChatMenu(false);
  };

  const unmatchUser = () => {
    if (!activeMatch) return;
    setMatches(prev => prev.filter(m => m.id !== activeMatch.id));
    setActiveMatch(null);
    setShowChatMenu(false);
    setCurrentTab('matches');
  };

  const generateAIIcebreaker = () => {
    const randomLine = ICEBREAKERS[Math.floor(Math.random() * ICEBREAKERS.length)];
    setInputText(randomLine);
  };

  const saveProfile = () => {
    setUserProfile(prev => ({ ...prev, name: tempName, age: Number(tempAge), bio: tempBio, image: tempImage }));
    setShowEditProfileModal(false);
    showToast("✅ Profile updated successfully!");
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: colors.bg, fontFamily: 'system-ui, sans-serif', color: colors.text, margin: 0, transition: 'all 0.3s ease' }}>
      <style>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
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
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'absolute', top: '24px', zIndex: 200, backgroundColor: '#f43f5e', color: '#fff', padding: '10px 20px', borderRadius: '30px', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', animation: 'fadeInOut 2.5s ease forwards' }}>
          {toastMessage}
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '420px', height: '100%', maxHeight: '850px', backgroundColor: colors.cardBg, borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', border: `1px solid ${colors.border}`, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.headerBg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🔥</span>
            <span style={{ fontSize: '22px', fontWeight: '800', background: 'linear-gradient(to right, #f43f5e, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.5px' }}>tinder</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {currentTab === 'swipe' && (
              <button onClick={() => setShowFilterModal(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }} title="Filter Distance">⚙️</button>
            )}
            <button onClick={() => setCurrentTab('swipe')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', opacity: currentTab === 'swipe' ? 1 : 0.4 }}>✨</button>
            <button onClick={() => setCurrentTab('matches')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', opacity: currentTab === 'matches' ? 1 : 0.4 }}>💬</button>
            <button onClick={() => setCurrentTab('profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', opacity: currentTab === 'profile' ? 1 : 0.4 }}>👤</button>
          </div>
        </div>

        {/* Content Area */}
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
                      <div style={{ position: 'absolute', top: '40px', left: '20px', border: '4px solid #22c55e', color: '#22c55e', padding: '4px 16px', borderRadius: '12px', fontSize: '32px', fontWeight: '900', letterSpacing: '2px', zIndex: 100, animation: 'popBadge 0.6s ease forwards' }}>LIKE</div>
                    )}
                    {swipeBadge === 'NOPE' && (
                      <div style={{ position: 'absolute', top: '40px', right: '20px', border: '4px solid #ef4444', color: '#ef4444', padding: '4px 16px', borderRadius: '12px', fontSize: '32px', fontWeight: '900', letterSpacing: '2px', zIndex: 100, animation: 'popBadge 0.6s ease forwards' }}>NOPE</div>
                    )}
                    {swipeBadge === 'SUPER' && (
                      <div style={{ position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)', border: '4px solid #3b82f6', color: '#3b82f6', padding: '4px 16px', borderRadius: '12px', fontSize: '32px', fontWeight: '900', letterSpacing: '2px', zIndex: 100, animation: 'popBadge 0.6s ease forwards' }}>SUPER LIKE</div>
                    )}

                    <div style={{ position: 'relative', width: '100%', height: '230px', cursor: 'pointer' }} onClick={() => setShowFullProfileModal(true)}>
                      <img src={filteredProfiles[currentIndex].images[currentPhotoIndex]} alt={filteredProfiles[currentIndex].name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      
                      <div style={{ position: 'absolute', top: '20px', left: '12px', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 10 }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: filteredProfiles[currentIndex].status.includes('Online') ? '#34d399' : '#facc15' }}></span>
                        <span style={{ fontSize: '11px', color: '#fff', fontWeight: '500' }}>{filteredProfiles[currentIndex].status}</span>
                      </div>

                      <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', gap: '4px', zIndex: 10, marginTop: '28px' }}>
                        {filteredProfiles[currentIndex].images.map((_, idx) => (
                          <div key={idx} style={{ flex: 1, height: '3px', backgroundColor: idx === currentPhotoIndex ? '#fff' : 'rgba(255,255,255,0.4)', borderRadius: '2px', transition: 'background 0.3s' }} />
                        ))}
                      </div>

                      {currentPhotoIndex > 0 && (
                        <button onClick={prevPhoto} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                      )}
                      {currentPhotoIndex < filteredProfiles[currentIndex].images.length - 1 && (
                        <button onClick={nextPhoto} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
                      )}
                    </div>

                    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', backgroundColor: colors.cardBg, cursor: 'pointer' }} onClick={() => setShowFullProfileModal(true)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0, color: colors.text }}>{filteredProfiles[currentIndex].name},</h2>
                        <span style={{ fontSize: '16px', fontWeight: '300', color: colors.subText }}>{filteredProfiles[currentIndex].age}</span>
                        {filteredProfiles[currentIndex].verified && (
                          <span style={{ backgroundColor: '#3b82f6', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px' }}>✓ Verified</span>
                        )}
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
                    <button onClick={handleRewind} disabled={history.length === 0} style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, cursor: history.length === 0 ? 'not-allowed' : 'pointer', fontSize: '15px', opacity: history.length === 0 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Rewind (↓ Key)">⏪</button>
                    <button onClick={() => handleSwipe('left')} style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Dislike (← Key)">❌</button>
                    <button onClick={() => handleSwipe('super')} style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Super Like (↑ Key)">⭐</button>
                    <button onClick={() => handleSwipe('right')} style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #f43f5e, #ec4899)', border: 'none', cursor: 'pointer', fontSize: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(244,63,94,0.4)' }} title="Like (→ Key)">❤️</button>
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
                  <span style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</span>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px 0', color: colors.text }}>No profiles found!</h3>
                  <p style={{ fontSize: '14px', color: colors.subText, margin: '0 0 24px 0' }}>Try clearing your search query or expanding distance filter.</p>
                  <button onClick={() => { setSearchQuery(''); setCurrentIndex(0); setHistory([]); setSuperLikesLeft(3); }} style={{ padding: '12px 24px', borderRadius: '30px', background: 'linear-gradient(to right, #f43f5e, #ec4899)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Reset Search & Deck</button>
                </div>
              )}
            </div>
          )}

          {/* MATCHES TAB */}
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
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', padding: '2px', background: 'linear-gradient(135deg, #f43f5e, #ec4899)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                        <img src={m.images[0]} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      </div>
                      <span style={{ fontSize: '12px', marginTop: '6px', textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: colors.text }}>{m.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CHAT TAB */}
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
                  <button onClick={startCall} style={{ background: 'none', border: 'none', color: '#34d399', fontSize: '18px', cursor: 'pointer', padding: '4px' }} title="Voice Call">📞</button>
                  <button onClick={() => setShowChatMenu(!showChatMenu)} style={{ background: 'none', border: 'none', color: colors.text, fontSize: '20px', cursor: 'pointer', padding: '4px' }}>⋮</button>
                </div>
              </div>

              {showChatMenu && (
                <div style={{ position: 'absolute', right: '16px', top: '60px', backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', zIndex: 50, width: '160px', overflow: 'hidden' }}>
                  <button onClick={clearChat} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', color: colors.text, fontSize: '13px', textAlign: 'left', cursor: 'pointer', borderBottom: `1px solid ${colors.border}` }}>🧹 Clear Chat</button>
                  <button onClick={unmatchUser} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', color: '#f43f5e', fontSize: '13px', textAlign: 'left', cursor: 'pointer', fontWeight: 'bold' }}>🚫 Unmatch</button>
                </div>
              )}

              <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }} onClick={() => setShowChatMenu(false)}>
                <div style={{ backgroundColor: colors.pillBg, padding: '10px 14px', borderRadius: '16px', maxWidth: '80%', fontSize: '13px', color: colors.text }}>You matched with {activeMatch.name}! Say something nice. ✨</div>
                {(messages[activeMatch.id] || []).map((msg, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ padding: '10px 14px', borderRadius: '16px', maxWidth: '80%', fontSize: '13px', backgroundColor: msg.sender === 'me' ? '#f43f5e' : colors.pillBg, color: '#fff' }}>{msg.text}</div>
                  </div>
                ))}
                {isTyping && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ padding: '8px 12px', borderRadius: '16px', backgroundColor: colors.pillBg, color: colors.subText, fontSize: '12px', fontStyle: 'italic' }}>{activeMatch.name} is typing...</div>
                  </div>
                )}
              </div>
              
              <div style={{ padding: '8px 16px', backgroundColor: colors.cardBg, borderTop: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button onClick={generateAIIcebreaker} style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ✨ Generate AI Icebreaker
                </button>
              </div>

              <div style={{ padding: '12px', backgroundColor: colors.headerBg, borderTop: `1px solid ${colors.border}`, display: 'flex', gap: '8px' }}>
                <input type="text" placeholder="Type a message..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} style={{ flex: 1, backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '20px', padding: '10px 16px', fontSize: '13px', color: colors.text, outline: 'none' }} />
                <button onClick={sendMessage} style={{ padding: '10px 20px', borderRadius: '20px', backgroundColor: '#f43f5e', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Send</button>
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
                    {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
                  </button>
                </div>
                <div style={{ backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, padding: '14px 16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '14px', color: colors.text }}>Subscription</span><span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f43f5e', backgroundColor: 'rgba(244,63,94,0.1)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(244,63,94,0.2)' }}>Tinder Gold ✨</span></div>
                <div style={{ backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, padding: '14px 16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '14px', color: colors.text }}>Global Discovery</span><span style={{ fontSize: '12px', fontWeight: 'bold', color: '#34d399' }}>Active</span></div>
              </div>
            </div>
          )}

        </div>

        {/* VOICE CALL MODAL */}
        {activeCall && activeMatch && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: '#09090b', zIndex: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '48px 24px' }}>
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
              <button onClick={() => setIsMuted(!isMuted)} style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: isMuted ? '#ef4444' : '#27272a', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isMuted ? '🔇' : '🎙️'}
              </button>
              <button onClick={endCall} style={{ width: '68px', height: '68px', borderRadius: '50%', backgroundColor: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 25px rgba(239,68,68,0.5)' }}>
                📞
              </button>
              <button onClick={() => setIsSpeaker(!isSpeaker)} style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: isSpeaker ? '#3b82f6' : '#27272a', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                🔊
              </button>
            </div>
          </div>
        )}

        {/* FULL PROFILE MODAL (Expanded Bio) */}
        {showFullProfileModal && currentIndex < filteredProfiles.length && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: colors.cardBg, zIndex: 120, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ position: 'relative', width: '100%', height: '360px' }}>
              <img src={filteredProfiles[currentIndex].images[currentPhotoIndex]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => setShowFullProfileModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: colors.text }}>{filteredProfiles[currentIndex].name},</h2>
                <span style={{ fontSize: '22px', fontWeight: '300', color: colors.subText }}>{filteredProfiles[currentIndex].age}</span>
                {filteredProfiles[currentIndex].verified && (
                  <span style={{ backgroundColor: '#3b82f6', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px' }}>✓ Verified</span>
                )}
              </div>
              <p style={{ fontSize: '14px', color: colors.subText, margin: 0 }}>📍 {filteredProfiles[currentIndex].distance} km away • {filteredProfiles[currentIndex].status}</p>
              <hr style={{ borderColor: colors.border, margin: '4px 0' }} />
              <div>
                <h4 style={{ fontSize: '14px', color: '#f43f5e', marginBottom: '6px' }}>About Me</h4>
                <p style={{ fontSize: '14px', color: colors.text, lineHeight: '1.5', margin: 0 }}>{filteredProfiles[currentIndex].bio}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', color: '#f43f5e', marginBottom: '8px' }}>Interests</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {filteredProfiles[currentIndex].interests.map((tag, i) => (
                    <span key={i} style={{ fontSize: '12px', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, padding: '6px 12px', borderRadius: '20px', color: colors.text }}>{tag}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowFullProfileModal(false)} style={{ width: '100%', padding: '14px', borderRadius: '30px', background: 'linear-gradient(to right, #f43f5e, #ec4899)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', marginTop: '16px' }}>Back to Swiping</button>
            </div>
          </div>
        )}

        {/* EDIT PROFILE MODAL */}
        {showEditProfileModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ backgroundColor: colors.headerBg, borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', borderTop: `1px solid ${colors.border}`, maxHeight: '90%', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: colors.text }}>Edit Profile</h3>
                <button onClick={() => setShowEditProfileModal(false)} style={{ background: 'none', border: 'none', color: colors.subText, fontSize: '18px', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #f43f5e' }}>
                    <img src={tempImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <label htmlFor="photo-upload" style={{ fontSize: '12px', color: '#f43f5e', fontWeight: 'bold', cursor: 'pointer', backgroundColor: 'rgba(244,63,94,0.1)', padding: '6px 14px', borderRadius: '16px', border: '1px solid rgba(244,63,94,0.3)' }}>
                    📷 Upload New Photo
                  </label>
                  <input id="photo-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color colors.subText, display: 'block', marginBottom: '6px' }}>Name</label>
                  <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} style={{ width: '100%', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '12px', color: colors.text, fontSize: '14px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: colors.subText, display: 'block', marginBottom: '6px' }}>Age</label>
                  <input type="number" value={tempAge} onChange={(e) => setTempAge(e.target.value)} style={{ width: '100%', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '12px', color: colors.text, fontSize: '14px', outline: 'none' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', color: colors.subText }}>Bio</label>
                    <span style={{ fontSize: '11px', color: tempBio.length > 150 ? '#f43f5e' : colors.subText }}>{tempBio.length}/150</span>
                  </div>
                  <textarea rows="3" maxLength="150" value={tempBio} onChange={(e) => setTempBio(e.target.value)} style={{ width: '100%', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '12px', color: colors.text, fontSize: '14px', outline: 'none', resize: 'none' }} />
                </div>
              </div>
              <button onClick={saveProfile} style={{ width: '100%', padding: '14px', borderRadius: '30px', background: 'linear-gradient(to right, #f43f5e, #ec4899)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Save Changes</button>
            </div>
          </div>
        )}

        {/* DISTANCE FILTER MODAL */}
        {showFilterModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ backgroundColor: colors.headerBg, borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', borderTop: `1px solid ${colors.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: colors.text }}>Maximum Distance</h3>
                <button onClick={() => setShowFilterModal(false)} style={{ background: 'none', border: 'none', color: colors.subText, fontSize: '18px', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: colors.subText, marginBottom: '8px' }}>
                  <span>Up to</span>
                  <span style={{ fontWeight: 'bold', color: '#f43f5e' }}>{maxDistance} km</span>
                </div>
                <input type="range" min="1" max="20" value={maxDistance} onChange={(e) => { setMaxDistance(Number(e.target.value)); setCurrentIndex(0); }} style={{ width: '100%', accentColor: '#f43f5e', cursor: 'pointer' }} />
              </div>
              <button onClick={() => setShowFilterModal(false)} style={{ width: '100%', padding: '14px', borderRadius: '30px', background: 'linear-gradient(to right, #f43f5e, #ec4899)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Apply Filter</button>
            </div>
          </div>
        )}

        {/* MATCH MODAL */}
        {showMatchModal && matchedProfile && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '36px', fontStyle: 'italic', fontWeight: '900', color: '#f43f5e', margin: '0 0 8px 0', letterSpacing: '1px' }}>IT'S A MATCH!</h2>
            <p style={{ fontSize: '14px', color: '#d4d4d8', margin: '0 0 32px 0' }}>You and {matchedProfile.name} have liked each other.</p>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #f43f5e', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}><img src={userProfile.image} alt="Me" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #ec4899', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', marginLeft: '-24px' }}><img src={matchedProfile.images[0]} alt={matchedProfile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => { setShowMatchModal(false); setActiveMatch(matchedProfile); setCurrentTab('chat'); }} style={{ width: '100%', padding: '14px', borderRadius: '30px', background: 'linear-gradient(to right, #f43f5e, #ec4899)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Send Message</button>
              <button onClick={() => setShowMatchModal(false)} style={{ width: '100%', padding: '14px', borderRadius: '30px', backgroundColor: '#27272a', color: '#d4d4d8', border: '1px solid #3f3f46', fontWeight: '600', cursor: 'pointer', fontSize: '15px' }}>Keep Swiping</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
