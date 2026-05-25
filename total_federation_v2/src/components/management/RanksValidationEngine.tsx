import React from 'react';

export interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  personalId: string;
  photo?: string;
  isFederationMember?: boolean;
  membershipStatus?: string;
  isNationalTeamMember?: boolean;
  nationalTeamStatus?: string;
  mountaineerRank?: string;
  achievements?: any[];
}

interface RanksValidationEngineProps {
  athletes: Athlete[];
  onUpdateAthlete: (updated: Athlete) => void;
}

const RanksValidationEngine: React.FC<RanksValidationEngineProps> = ({ athletes, onUpdateAthlete }) => {
  const ratingStore = (window as any).useRatingSettingsStore();
  const ranksEnabled = ratingStore.ranksEnabled !== false;

  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterRank, setFilterRank] = React.useState('all');
  const [filterReview, setFilterReview] = React.useState('all'); // all, active, needs_review

  // Downgrade comment modal state
  const [downgradeTarget, setDowngradeTarget] = React.useState<Athlete | null>(null);
  const [downgradeComment, setDowngradeComment] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const rankOrder = ['NONE', 'BADGE', 'RANK_3', 'RANK_2', 'RANK_1', 'CANDIDATE', 'MASTER', 'INT_MASTER'];
  
  const rankNames: Record<string, string> = {
    NONE: 'რანგის გარეშე',
    BADGE: 'მთამსვლელის ნიშანი (ნიშნოსანი)',
    RANK_3: 'III თანრიგი',
    RANK_2: 'II თანრიგი',
    RANK_1: 'I თანრიგი',
    CANDIDATE: 'ოსტატობის კანდიდატი',
    MASTER: 'სპორტის ოსტატი',
    INT_MASTER: 'საერთაშორისო ოსტატი'
  };

  const getRankBadge = (rank: string) => {
    switch (rank) {
      case 'BADGE': return { emoji: '🏅', color: '#b45309', label: 'მთამსვლელის ნიშანი' };
      case 'RANK_3': return { emoji: '🥉', color: '#cd7f32', label: 'III თანრიგი' };
      case 'RANK_2': return { emoji: '🥈', color: '#cbd5e1', label: 'II თანრიგი' };
      case 'RANK_1': return { emoji: '🥇', color: '#fbbf24', label: 'I თანრიგი' };
      case 'CANDIDATE': return { emoji: '🔷', color: 'var(--color-emerald-core)', label: 'ოსტატობის კანდიდატი' };
      case 'MASTER': return { emoji: '👑', color: '#f59e0b', label: 'სპორტის ოსტატი' };
      case 'INT_MASTER': return { emoji: '🌟', color: '#c084fc', label: 'საერთაშორისო ოსტატი' };
      default: return null;
    }
  };

  // Helper: check if climber is inactive for 2 years
  const checkInactivity = (athlete: Athlete) => {
    const currentYear = new Date().getFullYear();
    const expeditions = (athlete.achievements || []).filter(a => a.type === 'expedition');
    const lastYear = expeditions.length > 0 ? Math.max(...expeditions.map(e => Number(e.year))) : null;
    
    const hasRank = athlete.mountaineerRank && athlete.mountaineerRank !== 'NONE';
    const isInactive = hasRank && (!lastYear || lastYear < currentYear - 2);

    return {
      isInactive,
      lastYearText: lastYear ? `${lastYear} წ.` : 'არ ფიქსირდება'
    };
  };

  // Helper: analyze climbs to recommend a rank
  const analyzeClimbsForRanks = (athlete: Athlete): string => {
    const expeditions = (athlete.achievements || []).filter(ach => ach.type === 'expedition');
    if (expeditions.length === 0) return 'არ ფიქსირდება დადასტურებული ასვლები.';

    // Count climbs of each category
    const diffOrder = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'];
    
    const parseDifficulty = (climb: any) => {
      if (climb.routeDifficulty) return climb.routeDifficulty.toUpperCase();
      if (climb.difficulty) return climb.difficulty.toUpperCase();
      if (climb.category) return climb.category.toUpperCase();
      const match = climb.achievement && climb.achievement.match(/([1-6][A-B])\s*კატეგორია/i);
      if (match) return match[1].toUpperCase();
      const matchRaw = climb.achievement && climb.achievement.match(/\b([1-6][A-B])\b/i);
      if (matchRaw) return matchRaw[1].toUpperCase();
      return '1A';
    };

    const parsedDiffs = expeditions.map(c => parseDifficulty(c));

    const countClimbsOfMinDiff = (minDiff: string) => {
      const minIdx = diffOrder.indexOf(minDiff);
      return parsedDiffs.filter(d => {
        const idx = diffOrder.indexOf(d);
        return idx >= minIdx;
      }).length;
    };

    if (countClimbsOfMinDiff('6A') >= 1 || countClimbsOfMinDiff('5B') >= 3) {
      return 'აკმაყოფილებს საერთაშორისო ოსტატის კრიტერიუმებს';
    }
    if (countClimbsOfMinDiff('5B') >= 1 || countClimbsOfMinDiff('5A') >= 3) {
      return 'აკმაყოფილებს ოსტატი მთამსვლელის კრიტერიუმებს';
    }
    if (countClimbsOfMinDiff('4B') >= 2 || countClimbsOfMinDiff('4A') >= 4) {
      return 'აკმაყოფილებს ოსტატობის კანდიდატის კრიტერიუმებს';
    }
    if (countClimbsOfMinDiff('3B') >= 2 || countClimbsOfMinDiff('3A') >= 4) {
      return 'აკმაყოფილებს პირველი თანრიგის კრიტერიუმებს';
    }
    if (countClimbsOfMinDiff('2B') >= 2 || countClimbsOfMinDiff('2A') >= 3) {
      return 'აკმაყოფილებს მეორე თანრიგის კრიტერიუმებს';
    }
    if (countClimbsOfMinDiff('1B') >= 2 || countClimbsOfMinDiff('1A') >= 3) {
      return 'აკმაყოფილებს მესამე თანრიგის კრიტერიუმებს';
    }
    if (countClimbsOfMinDiff('1A') >= 1) {
      return 'აკმაყოფილებს მთამსვლელის ნიშნის კრიტერიუმებს';
    }

    return 'ასვლები არასაკმარისია თანრიგის მისაღებად.';
  };

  // Helper: validate linear prerequisites sequence
  const validateLinearPrerequisite = (athlete: Athlete, targetRank: string): boolean => {
    const targetIdx = rankOrder.indexOf(targetRank);
    if (targetIdx <= 1) return true; // NONE or BADGE doesn't need previous ranks

    const prevRank = rankOrder[targetIdx - 1];
    
    // Check if previous rank is their current rank
    if (athlete.mountaineerRank === prevRank) return true;

    // Check if previous rank is in achievements history
    const hasInHistory = (athlete.achievements || []).some(ach => 
      ach.type === 'rank_up' && 
      (ach.peak?.includes(rankNames[prevRank]) || ach.achievement?.includes(rankNames[prevRank]))
    );

    return hasInHistory;
  };

  // Elevation Handler
  const handleElevate = (athlete: Athlete, targetRank: string) => {
    setErrorMsg(null);
    const historyStore = (window as any).rankHistoryStoreData;

    if (targetRank === 'NONE') {
      // Direct reset
      if (historyStore) {
        historyStore.setState({
          history: [{
            athlete_id: athlete.id,
            assigned_rank: 'NONE',
            assignment_date: new Date().toLocaleDateString('en-CA'),
            approved_by: "ალექსანდრე (Ad)",
            legal_basis: "თანრიგის მოხსნა"
          }, ...historyStore.getState().history]
        });
      }

      const updatedAthlete = {
        ...athlete,
        mountaineerRank: 'NONE',
        isNationalTeamMember: false,
        nationalTeamStatus: undefined,
        achievements: (athlete.achievements || []).filter(ach => ach.type !== 'rank_up')
      };
      onUpdateAthlete(updatedAthlete);
      return;
    }

    // Determine national team auto-binding
    let isNational = athlete.isNationalTeamMember ?? false;
    let nationalStatus = athlete.nationalTeamStatus;

    if (targetRank === 'CANDIDATE') {
      isNational = true;
      nationalStatus = 'CANDIDATE';
    } else if (targetRank === 'MASTER') {
      isNational = true;
      nationalStatus = 'MASTER';
    } else if (targetRank === 'INT_MASTER') {
      isNational = true;
      nationalStatus = 'INT_MASTER';
    } else {
      // If downgraded or moved to rank below Candidate, clear auto national team tags
      isNational = false;
      nationalStatus = undefined;
    }

    const rankNameStr = rankNames[targetRank];
    const newAchievement = {
      id: Math.random().toString(36).substr(2, 9),
      year: new Date().getFullYear(),
      date: new Date().toLocaleDateString('ka-GE'),
      title: `მექანიკური მინიჭება: ${rankNameStr}`,
      peak: `მიენიჭა "${rankNameStr}"`,
      route: '',
      achievement: `სტატუსი: მექანიკურად მიენიჭა "${rankNameStr}"-ის წოდება.`,
      result: `სტატუსი: მექანიკურად მიენიჭა "${rankNameStr}"-ის წოდება.`,
      type: 'rank_up'
    };

    // Log manual override to history
    if (historyStore) {
      historyStore.setState({
        history: [{
          athlete_id: athlete.id,
          assigned_rank: targetRank,
          assignment_date: new Date().toLocaleDateString('en-CA'),
          approved_by: "ალექსანდრე (Ad)",
          legal_basis: "თანრიგების მართვის ცენტრი (მოდიფიკაცია)"
        }, ...historyStore.getState().history]
      });
    }

    const updatedAthlete = {
      ...athlete,
      mountaineerRank: targetRank,
      isNationalTeamMember: isNational,
      nationalTeamStatus: nationalStatus,
      achievements: [...(athlete.achievements || []), newAchievement]
    };

    onUpdateAthlete(updatedAthlete);
  };

  // Downgrade triggers comment modal
  const triggerDowngrade = (athlete: Athlete) => {
    setDowngradeTarget(athlete);
    setDowngradeComment('');
  };

  // Downgrade submit
  const submitDowngrade = () => {
    if (!downgradeTarget) return;
    if (!downgradeComment.trim()) {
      alert('მიზეზის მითითება სავალდებულოა!');
      return;
    }

    const currentRank = downgradeTarget.mountaineerRank || 'NONE';
    const currentIdx = rankOrder.indexOf(currentRank);
    if (currentIdx <= 0) return; // Cannot downgrade from NONE

    const targetRank = rankOrder[currentIdx - 1];

    // Determine national team auto-binding
    let isNational = downgradeTarget.isNationalTeamMember ?? false;
    let nationalStatus = downgradeTarget.nationalTeamStatus;

    if (targetRank === 'CANDIDATE') {
      isNational = true;
      nationalStatus = 'CANDIDATE';
    } else if (targetRank === 'MASTER') {
      isNational = true;
      nationalStatus = 'MASTER';
    } else if (targetRank === 'INT_MASTER') {
      isNational = true;
      nationalStatus = 'INT_MASTER';
    } else {
      isNational = false;
      nationalStatus = undefined;
    }

    const oldRankStr = rankNames[currentRank];
    const newRankStr = rankNames[targetRank];

    const downgradeAchievement = {
      id: Math.random().toString(36).substr(2, 9),
      year: new Date().getFullYear(),
      date: new Date().toLocaleDateString('ka-GE'),
      title: `რანგის შემცირება: ${oldRankStr} -> ${newRankStr}`,
      peak: `რანგის შემცირება`,
      route: '',
      achievement: `მიზეზი: ${downgradeComment.trim()}`,
      result: `მიზეზი: ${downgradeComment.trim()}`,
      type: 'manual_downgrade'
    };

    // Log downgrade to history
    const historyStore = (window as any).rankHistoryStoreData;
    if (historyStore) {
      historyStore.setState({
        history: [{
          athlete_id: downgradeTarget.id,
          assigned_rank: targetRank,
          assignment_date: new Date().toLocaleDateString('en-CA'),
          approved_by: "ალექსანდრე (Ad)",
          legal_basis: downgradeComment.trim()
        }, ...historyStore.getState().history]
      });
    }

    const updatedAthlete = {
      ...downgradeTarget,
      mountaineerRank: targetRank,
      isNationalTeamMember: isNational,
      nationalTeamStatus: nationalStatus,
      achievements: [...(downgradeTarget.achievements || []), downgradeAchievement]
    };

    onUpdateAthlete(updatedAthlete);
    setDowngradeTarget(null);
    setDowngradeComment('');
  };

  // Filter list of athletes
  const filteredAthletes = React.useMemo(() => {
    return athletes.filter(a => {
      const matchesSearch = `${a.firstName} ${a.lastName} ${a.personalId}`.toLowerCase().includes(searchQuery.toLowerCase());
      
      const currentRank = a.mountaineerRank || 'NONE';
      const matchesRank = filterRank === 'all' || currentRank === filterRank;

      const { isInactive } = checkInactivity(a);
      const matchesReview = 
        filterReview === 'all' || 
        (filterReview === 'needs_review' && isInactive) ||
        (filterReview === 'active' && !isInactive);

      return matchesSearch && matchesRank && matchesReview;
    });
  }, [athletes, searchQuery, filterRank, filterReview]);

  // Expose global avatar helper if available
  const AthleteAvatar = (window as any).AthleteAvatarWrapper;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Top Switch Controls */}
      <div style={{
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4), inset 0 0 10px color-mix(in oklab, var(--color-emerald-core) 5%, transparent)',
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🥇 თანრიგთა სისტემა
            </h2>
            <p style={{ margin: '5px 0 0 0', color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }}>
              მთამსვლელთა სპორტული თანრიგების მექანიკური მინიჭება და მართვის ცენტრი.
            </p>
          </div>
        </div>

        {/* Global Module status indicator */}
        <div style={{
          backgroundColor: ranksEnabled ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
          borderLeft: `4px solid ${ranksEnabled ? '#10b981' : '#64748b'}`,
          borderRadius: '4px',
          padding: '12px 16px',
          color: '#e2e8f0',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {ranksEnabled ? (
            <>
              <span style={{ fontSize: '16px' }}>🟢</span>
              <span><strong>მოდული აქტიურია:</strong> თანრიგები აისახება პროფილებზე, საწყობსა და რეესტრებში. მექანიკური მინიჭება აქტიურია.</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: '16px' }}>🔴</span>
              <span><strong>მოდული გაყინულია:</strong> თანრიგების აღრიცხვა შეჩერებულია. ყველა სპორტსმენის პროფილიდან და რეესტრიდან მოხსნილია რანგის ბეჯები.</span>
            </>
          )}
        </div>
      </div>

      {ranksEnabled && (
        <>
          {/* Alert Message */}
          {errorMsg && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              padding: '14px 20px',
              color: '#f87171',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.1)'
            }}>
              <span>{errorMsg}</span>
              <button 
                onClick={() => setErrorMsg(null)}
                style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase' }}>სულ სპორტსმენი</span>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginTop: '5px' }}>{athletes.length}</div>
            </div>
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)', borderRadius: '10px', padding: '16px' }}>
              <span style={{ color: 'var(--color-emerald-core)', fontSize: '11px', textTransform: 'uppercase' }}>რანგირებული მთამსვლელი</span>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-emerald-core)', marginTop: '5px' }}>
                {athletes.filter(a => a.mountaineerRank && a.mountaineerRank !== 'NONE').length}
              </div>
            </div>
            <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', padding: '16px' }}>
              <span style={{ color: '#f59e0b', fontSize: '11px', textTransform: 'uppercase' }}>საჭიროებს გადახედვას</span>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', marginTop: '5px' }}>
                {athletes.filter(a => checkInactivity(a).isInactive).length}
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
              <input 
                type="text" 
                placeholder="სწრაფი ძებნა სახელით, გვარით, პირადი ნომრით..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '13px'
                }}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <select 
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
                value={filterRank}
                onChange={e => setFilterRank(e.target.value)}
              >
                <option value="all">ყველა რანგი</option>
                {Object.entries(rankNames).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>

              <select 
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
                value={filterReview}
                onChange={e => setFilterReview(e.target.value)}
              >
                <option value="all">აქტივობის ფილტრი (ყველა)</option>
                <option value="active">აქტიური (ბოლო 2 წელი)</option>
                <option value="needs_review">⚠️ საჭიროებს გადახედვას</option>
              </select>
            </div>
          </div>

          {/* Athletes List Registry */}
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>სპორტსმენი</th>
                  <th style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>მიმდინარე რანგი</th>
                  <th style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>ბოლო ასვლა</th>
                  <th style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>სტატუსის ანალიზი</th>
                  <th style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', textAlign: 'right' }}>მექანიკური რანგის მართვა</th>
                </tr>
              </thead>
              <tbody>
                {filteredAthletes.map(a => {
                  const currentRank = a.mountaineerRank || 'NONE';
                  const badge = getRankBadge(currentRank);
                  const { isInactive, lastYearText } = checkInactivity(a);
                  const climbRecommendation = analyzeClimbsForRanks(a);

                  return (
                    <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      {/* Name & Avatar */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {AthleteAvatar ? (
                            <AthleteAvatar athlete={a} size={36} />
                          ) : (
                            <img src={a.photo || 'https://via.placeholder.com/36'} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} alt="Avatar" />
                          )}
                          <div>
                            <div style={{ color: '#fff', fontWeight: 'bold' }}>{a.firstName} {a.lastName}</div>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '2px' }}>ID: {a.personalId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Rank badge */}
                      <td style={{ padding: '12px 16px' }}>
                        {badge ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '16px' }}>{badge.emoji}</span>
                            <span style={{ color: badge.color, fontWeight: 'bold' }}>{badge.label}</span>
                          </div>
                        ) : (
                          <span style={{ color: 'rgba(255,255,255,0.3)' }}>რანგის გარეშე</span>
                        )}
                      </td>

                      {/* Last Expedition Year */}
                      <td style={{ padding: '12px 16px', color: '#e2e8f0' }}>
                        {lastYearText}
                      </td>

                      {/* Recommendation & Alerts */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>💡 {climbRecommendation}</span>
                          {isInactive && (
                            <span style={{
                              alignSelf: 'flex-start',
                              backgroundColor: 'rgba(245, 158, 11, 0.1)',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              color: '#f59e0b',
                              fontSize: '11px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              animation: 'pulse 2s infinite'
                            }}>
                              ⚠️ საჭიროებს გადახედვას / 2 წელი აქტივობის გარეშე
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Admin Quick Action */}
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <select
                            style={{
                              backgroundColor: 'rgba(0, 0, 0, 0.3)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '4px',
                              padding: '5px 10px',
                              color: '#fff',
                              outline: 'none',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                            value={currentRank}
                            onChange={e => handleElevate(a, e.target.value)}
                          >
                            <option value="NONE">რანგის მოხსნა</option>
                            <option value="BADGE">🏅 მთამსვლელის ნიშანი</option>
                            <option value="RANK_3">🥉 III თანრიგი</option>
                            <option value="RANK_2">🥈 II თანრიგი</option>
                            <option value="RANK_1">🥇 I თანრიგი</option>
                            <option value="CANDIDATE">🔷 ოსტატობის კანდიდატი</option>
                            <option value="MASTER">👑 სპორტის ოსტატი</option>
                            <option value="INT_MASTER">🌟 საერთაშორისო ოსტატი</option>
                          </select>

                          {currentRank !== 'NONE' && (
                            <button
                              onClick={() => triggerDowngrade(a)}
                              title="📉 რანგის შემცირება (1 საფეხურით)"
                              style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#f87171',
                                borderRadius: '4px',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.25)'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                            >
                              📉 ჩამოქვეითება
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredAthletes.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '30px 0', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                      მონაცემები ვერ მოიძებნა მითითებული კრიტერიუმებით.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Downgrade Comment Confirmation Modal */}
      {downgradeTarget && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#121418',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '460px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 15px rgba(239, 68, 68, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#f87171', fontSize: '16px', fontWeight: 'bold' }}>
              📉 სპორტული რანგის ჩამოქვეითება
            </h3>
            
            <p style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6' }}>
              სპორტსმენს <strong>{downgradeTarget.firstName} {downgradeTarget.lastName}</strong> რანგი შეუმცირდება ერთი საფეხურით:
              <br />
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
                {rankNames[downgradeTarget.mountaineerRank || 'NONE']} ➔ {rankNames[rankOrder[rankOrder.indexOf(downgradeTarget.mountaineerRank || 'NONE') - 1]]}
              </span>
            </p>

            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '5px' }}>
                * ჩამოქვეითების საფუძველი (სავალდებულო კომენტარი):
              </label>
              <textarea
                value={downgradeComment}
                onChange={e => setDowngradeComment(e.target.value)}
                placeholder="მაგ: ორწლიანი სპორტული პასიურობა, კომისიის გადაწყვეტილება..."
                style={{
                  width: '100%',
                  height: '80px',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  padding: '8px 10px',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => setDowngradeTarget(null)}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#cbd5e1',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                გაუქმება
              </button>
              <button
                onClick={submitDowngrade}
                style={{
                  backgroundColor: '#ef4444',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '8px 20px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(239, 68, 68, 0.3)'
                }}
              >
                დადასტურება
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RanksValidationEngine;
