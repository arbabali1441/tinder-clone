import React, { useState } from 'react';

const INITIAL_PROFILES = [
  { id: 1, name: 'Jessica', age: 25, distance: 3, bio: 'Coffee addict ☕, art lover, and weekend traveler. Let us find the best dessert spot in town!', interests: ['Coffee ☕', 'Art 🎨', 'Travel ✈️', 'Photography 📸'], image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Michael', age: 27, distance: 8, bio: 'Software developer by day, guitarist by night 🎸. Always down for live music or a food adventure.', interests: ['Coding 💻', 'Guitar 🎸', 'Live Music 🎶', 'Burgers 🍔'], image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Sophia', age: 24, distance: 2, bio: 'Sunset chaser 🌅 and fitness enthusiast. Looking for someone to explore new hiking trails with.', interests: ['Hiking 🥾', 'Fitness 💪', 'Sunsets 🌅', 'Yoga 🧘‍♀️'], image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'David', age: 29, distance: 12, bio: 'Architect and photography enthusiast 📸. Let us grab a drink and talk about city designs.', interests: ['Architecture 🏛️', 'Design ✨', 'Wine 🍷', 'Running 🏃‍♂️'], image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80' }
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
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

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
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
  });
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempAge, setTempAge] = useState(userProfile.age);
  
  const filteredProfiles = INITIAL_PROFILES.filter(p => p.distance <= maxDistance);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeMatch, setActiveMatch] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);

  const handleSwipe = (direction) => {
    const profile = filteredProfiles[currentIndex];
    setHistory(prev => [...prev, { index: currentIndex, profile }]);
    
    if (direction === 'right' || direction === 'super') {
      setMatches((prev) => [...prev, profile]);
      setMatchedProfile(profile);
      setShowMatchModal(true);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRewind = () => {
    if (history.length === 0) return;
    const lastAction = history[history.length - 1];
    setHistory(prev => prev.slice(0, prev.length - 1));
    setCurrentIndex(lastAction.index);
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

  const generateAIIcebreaker = () => {
    const randomLine = ICEBREAKERS[Math.floor(Math.random() * ICEBREAKERS.length)];
    setInputText(randomLine);
  };

  const saveProfile = () => {
    setUserProfile(prev => ({ ...prev, name: tempName, age: Number(tempAge) }));
    setShowEditProfileModal(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: colors.bg, fontFamily: 'system-ui, sans-serif', color: colors.text, margin: 0, transition: 'all 0.3s ease' }}>
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
              {currentIndex < filteredProfiles.length ? (
                <>
                  <div style={{ width: '100%', height: '440px', borderRadius: '20px', overflowY: 'auto', position: 'relative', backgroundColor: colors.pillBg, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                    <img src={filteredProfiles[currentIndex].image} alt={filteredProfiles[currentIndex].name} style={{ width: '100%', height: '280px', objectFit: 'cover' }} />
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', backgroundColor: colors.cardBg }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: colors.text }}>{filteredProfiles[currentIndex].name},</h2>
                        <span style={{ fontSize: '18px', fontWeight: '300', color: colors.subText }}>{filteredProfiles[currentIndex].age}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: colors.subText, margin: '4px 0 8px 0' }}>📍 {filteredProfiles[currentIndex].distance} km away</p>
                      <p style={{ fontSize: '12px', color: colors.text, margin: '0 0 10px 0', lineHeight: '1.4' }}>{filteredProfiles[currentIndex].bio}</p>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {filteredProfiles[currentIndex].interests.map((tag, i) => (
                          <span key={i} style={{ fontSize: '11px', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, padding: '4px 10px', borderRadius: '20px', color: colors.text }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', paddingBottom: '6px' }}>
                    <button onClick={handleRewind} disabled={history.length === 0} style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, cursor: history.length === 0 ? 'not-allowed' : 'pointer', fontSize: '16px', opacity: history.length === 0 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Rewind">⏪</button>
                    <button onClick={() => handleSwipe('left')} style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>❌</button>
                    <button onClick={() => handleSwipe('super')} style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: colors.headerBg, border: `1px solid ${colors.border}`, cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Super Like">⭐</button>
                    <button onClick={() => handleSwipe('right')} style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #f43f5e, #ec4899)', border: 'none', cursor: 'pointer', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(244,63,94,0.4)' }}>❤️</button>
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
                  <span style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</span>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px 0', color: colors.text }}>No more profiles in this range!</h3>
                  <p style={{ fontSize: '14px', color: colors.subText, margin: '0 0 24px 0' }}>Try increasing your distance filter or reset deck.</p>
                  <button onClick={() => { setCurrentIndex(0); setHistory([]); }} style={{ padding: '12px 24px', borderRadius: '30px', background: 'linear-gradient(to right, #f43f5e, #ec4899)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Reset Deck</button>
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
                        <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
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
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: colors.bg }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: colors.headerBg, borderBottom: `1px solid ${colors.border}` }}>
                <button onClick={() => setCurrentTab('matches')} style={{ background: 'none', border: 'none', color: '#f43f5e', fontWeight: 'bold', cursor: 'pointer', marginRight: '12px', fontSize: '14px' }}>← Back</button>
                <img src={activeMatch.image} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px' }} />
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, color: colors.text }}>{activeMatch.name}</h4>
                  <span style={{ fontSize: '11px', color: '#34d399' }}>● Online</span>
                </div>
              </div>
              <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
              <p style={{ fontSize: '13px', color: colors.subText, margin: '0 0 16px 0' }}>{userProfile.location}</p>
              
              <button onClick={() => { setTempName(userProfile.name); setTempAge(userProfile.age); setShowEditProfileModal(true); }} style={{ padding: '8px 20px', borderRadius: '20px', backgroundColor: colors.pillBg, color: '#f43f5e', border: `1px solid ${colors.border}`, fontWeight: '600', cursor: 'pointer', fontSize: '13px', marginBottom: '24px' }}>Edit Profile</button>

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

        {/* EDIT PROFILE MODAL */}
        {showEditProfileModal && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ backgroundColor: colors.headerBg, borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', borderTop: `1px solid ${colors.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: colors.text }}>Edit Profile</h3>
                <button onClick={() => setShowEditProfileModal(false)} style={{ background: 'none', border: 'none', color: colors.subText, fontSize: '18px', cursor: 'pointer' }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: colors.subText, display: 'block', marginBottom: '6px' }}>Name</label>
                  <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} style={{ width: '100%', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '12px', color: colors.text, fontSize: '14px', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: colors.subText, display: 'block', marginBottom: '6px' }}>Age</label>
                  <input type="number" value={tempAge} onChange={(e) => setTempAge(e.target.value)} style={{ width: '100%', backgroundColor: colors.pillBg, border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '12px', color: colors.text, fontSize: '14px', outline: 'none' }} />
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
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #ec4899', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', marginLeft: '-24px' }}><img src={matchedProfile.image} alt={matchedProfile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
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
