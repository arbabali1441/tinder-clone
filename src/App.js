import React, { useState } from 'react';

const PROFILES = [
  { id: 1, name: 'Jessica', age: 25, distance: '3 km away', bio: 'Coffee addict ☕, art lover, and weekend traveler. Let us find the best dessert spot in town!', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Michael', age: 27, distance: '5 km away', bio: 'Software developer by day, guitarist by night 🎸. Always down for live music or a food adventure.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Sophia', age: 24, distance: '2 km away', bio: 'Sunset chaser 🌅 and fitness enthusiast. Looking for someone to explore new hiking trails with.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80' },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('swipe');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [activeMatch, setActiveMatch] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputText, setInputText] = useState('');
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);

  const handleSwipe = (direction) => {
    const profile = PROFILES[currentIndex];
    if (direction === 'right') {
      setMatches((prev) => [...prev, profile]);
      setMatchedProfile(profile);
      setShowMatchModal(true);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const sendMessage = () => {
    if (!inputText.trim() || !activeMatch) return;
    const matchId = activeMatch.id;
    const newMsg = { sender: 'me', text: inputText };
    setMessages((prev) => ({ ...prev, [matchId]: [...(prev[matchId] || []), newMsg] }));
    setInputText('');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#09090b', fontFamily: 'system-ui, sans-serif', color: '#fff', margin: 0 }}>
      <div style={{ width: '100%', maxWidth: '420px', height: '100%', maxHeight: '850px', backgroundColor: '#121214', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', border: '1px solid #27272a', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #27272a', backgroundColor: '#18181b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🔥</span>
            <span style={{ fontSize: '22px', fontWeight: '800', background: 'linear-gradient(to right, #f43f5e, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.5px' }}>tinder</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
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
              {currentIndex < PROFILES.length ? (
                <>
                  <div style={{ width: '100%', height: '500px', borderRadius: '20px', overflow: 'hidden', position: 'relative', backgroundColor: '#27272a', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                    <img src={PROFILES[currentIndex].image} alt={PROFILES[currentIndex].name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.2), transparent)', padding: '24px 16px 16px 16px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{PROFILES[currentIndex].name},</h2>
                        <span style={{ fontSize: '22px', fontWeight: '300' }}>{PROFILES[currentIndex].age}</span>
                      </div>
                      <p style={{ fontSize: '14px', color: '#d4d4d8', margin: '4px 0 8px 0' }}>📍 {PROFILES[currentIndex].distance}</p>
                      <p style={{ fontSize: '13px', color: '#e4e4e7', background: 'rgba(0,0,0,0.5)', padding: '10px 12px', borderRadius: '12px', margin: 0, backdropFilter: 'blur(5px)', border: '1px solid rgba(255,255,255,0.1)' }}>{PROFILES[currentIndex].bio}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', paddingBottom: '10px' }}>
                    <button onClick={() => handleSwipe('left')} style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#18181b', border: '1px solid #3f3f46', cursor: 'pointer', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>❌</button>
                    <button onClick={() => handleSwipe('right')} style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, #f43f5e, #ec4899)', border: 'none', cursor: 'pointer', fontSize: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(244,63,94,0.4)' }}>❤️</button>
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
                  <span style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</span>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px 0' }}>That is everyone for now!</h3>
                  <p style={{ fontSize: '14px', color: '#a1a1aa', margin: '0 0 24px 0' }}>Check back later or reset the deck to review profiles again.</p>
                  <button onClick={() => setCurrentIndex(0)} style={{ padding: '12px 24px', borderRadius: '30px', background: 'linear-gradient(to right, #f43f5e, #ec4899)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Reset Deck</button>
                </div>
              )}
            </div>
          )}

          {/* MATCHES TAB */}
          {currentTab === 'matches' && (
            <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#f43f5e', marginBottom: '12px' }}>Your Matches ({matches.length})</h3>
              {matches.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#71717a', textAlign: 'center' }}>
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
                      <span style={{ fontSize: '12px', marginTop: '6px', textAlign: 'center', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CHAT TAB */}
          {currentTab === 'chat' && activeMatch && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#09090b' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', backgroundColor: '#18181b', borderBottom: '1px solid #27272a' }}>
                <button onClick={() => setCurrentTab('matches')} style={{ background: 'none', border: 'none', color: '#f43f5e', fontWeight: 'bold', cursor: 'pointer', marginRight: '12px', fontSize: '14px' }}>← Back</button>
                <img src={activeMatch.image} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px' }} />
                <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>{activeMatch.name}</h4>
              </div>
              <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ backgroundColor: '#27272a', padding: '10px 14px', borderRadius: '16px', maxWidth: '80%', fontSize: '13px', color: '#d4d4d8' }}>You matched with {activeMatch.name}! Say something nice. ✨</div>
                {(messages[activeMatch.id] || []).map((msg, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ padding: '10px 14px', borderRadius: '16px', maxWidth: '80%', fontSize: '13px', backgroundColor: msg.sender === 'me' ? '#f43f5e' : '#27272a', color: '#fff' }}>{msg.text}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px', backgroundColor: '#18181b', borderTop: '1px solid #27272a', display: 'flex', gap: '8px' }}>
                <input type="text" placeholder="Type a message..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} style={{ flex: 1, backgroundColor: '#27272a', border: '1px solid #3f3f46', borderRadius: '20px', padding: '10px 16px', fontSize: '13px', color: '#fff', outline: 'none' }} />
                <button onClick={sendMessage} style={{ padding: '10px 20px', borderRadius: '20px', backgroundColor: '#f43f5e', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Send</button>
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {currentTab === 'profile' && (
            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', padding: '3px', background: 'linear-gradient(135deg, #f43f5e, #ec4899)', marginBottom: '16px', boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80" alt="User Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Alex, 25</h2>
              <p style={{ fontSize: '13px', color: '#a1a1aa', margin: 0 }}>New York, USA 🇺🇸</p>
              <div style={{ width: '100%', marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', padding: '14px 16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '14px' }}>Subscription</span><span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f43f5e', backgroundColor: 'rgba(244,63,94,0.1)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(244,63,94,0.2)' }}>Tinder Gold ✨</span></div>
                <div style={{ backgroundColor: '#18181b', border: '1px solid #27272a', padding: '14px 16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '14px' }}>Global Discovery</span><span style={{ fontSize: '12px', fontWeight: 'bold', color: '#34d399' }}>Active</span></div>
              </div>
            </div>
          )}

        </div>

        {/* MATCH MODAL */}
        {showMatchModal && matchedProfile && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '36px', fontStyle: 'italic', fontWeight: '900', color: '#f43f5e', margin: '0 0 8px 0', letterSpacing: '1px' }}>IT'S A MATCH!</h2>
            <p style={{ fontSize: '14px', color: '#d4d4d8', margin: '0 0 32px 0' }}>You and {matchedProfile.name} have liked each other.</p>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #f43f5e', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}><img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80" alt="Me" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
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
