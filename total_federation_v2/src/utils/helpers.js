import { COUNTRIES } from './countries.js';
import { ranksStoreData } from '../context/ranksStore.js';

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const getFlagEmoji = (countryCode) => {
  if (!countryCode) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return '';
  }
};

export const getCountryName = (countryCode) => {
  if (!countryCode) return '';
  const country = COUNTRIES.find(c => c.code.toUpperCase() === countryCode.toUpperCase());
  if (!country) return countryCode;
  return country.name.split('(')[0].trim();
};

export const calculateAge = (birthDateStr) => {
  if (!birthDateStr) return '';
  const today = new Date();
  const birthDate = new Date(birthDateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  // Adjust age if birthday hasn't occurred yet this year
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const checkAndApplyRankUp = (athlete, oldReferral, newReferral) => {
  const oldVal = Number(oldReferral || 0);
  const newVal = Number(newReferral || 0);
  if (newVal <= oldVal) return athlete.achievements || [];
  
  const ranks = ranksStoreData.getState().ranks || [];
  const activeRanks = ranks
    .filter(r => r.status === 'აქტიური' && r.name && r.requiredPoints !== undefined)
    .sort((a, b) => Number(a.requiredPoints) - Number(b.requiredPoints));
  
  let newAchievements = athlete.achievements ? [...athlete.achievements] : [];
  const geoMonths = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'];
  const now = new Date();
  const currentDateStr = `${now.getDate()} ${geoMonths[now.getMonth()]}`;
  
  activeRanks.forEach(rank => {
    const req = Number(rank.requiredPoints);
    if (oldVal < req && newVal >= req) {
      const alreadyExists = newAchievements.some(ach => 
        ach.type === 'rank_up' && (ach.title?.includes(rank.name) || ach.peak?.includes(rank.name))
      );
      if (!alreadyExists) {
        const rankUpEvent = {
          id: generateUUID(),
          year: now.getFullYear(),
          date: currentDateStr,
          type: 'rank_up',
          title: `მიენიჭა "${rank.name}"`,
          peak: `მიენიჭა "${rank.name}"`,
          achievement: `სტატუსი: მიენიჭა "${rank.name}"-ის წოდება. საფუძველი: დაგროვილი ${newVal} ქულა (მოთხოვნილი: ${req})`,
          result: `სტატუსი: მიენიჭა "${rank.name}"-ის წოდება. საფუძველი: დაგროვილი ${newVal} ქულა (მოთხოვნილი: ${req})`,
          route: ''
        };
        newAchievements.push(rankUpEvent);
      }
    }
  });
  return newAchievements;
};

export const getAthleteBadgeConfig = (athlete, ranks = [], honoraryTitlesEnabled = true) => {
  const isSnowLeopard = honoraryTitlesEnabled && (athlete?.achievements?.some(ach => 
    ach.type === 'title' && 
    (ach.title?.toLowerCase().includes('snow leopard') || 
     ach.title?.toLowerCase().includes('თოვლის ჯიქი'))
  ) || false);

  if (isSnowLeopard) {
    return {
      icon: "fa-solid fa-snowflake",
      color: "#c084fc",
      borderColor: "#a855f7",
      glowColor: "rgba(168, 85, 247, 0.4)",
      label: "თოვლის ჯიქი (Snow Leopard)"
    };
  }

  const referralPoints = Number(athlete?.referral || 0);
  const activeRanks = ranks
    .filter(r => r.status === 'აქტიური' && r.requiredPoints !== undefined)
    .sort((a, b) => Number(b.requiredPoints) - Number(a.requiredPoints));

  const currentRank = activeRanks.find(r => referralPoints >= Number(r.requiredPoints));

  if (currentRank) {
    const rankName = currentRank.name || '';
    if (rankName.includes('სპორტის ოსტატი')) {
      return {
        icon: "fa-solid fa-crown",
        color: "#fbbf24",
        borderColor: "#d97706",
        glowColor: "rgba(251, 191, 36, 0.4)",
        label: rankName
      };
    } else if (rankName.includes('I თანრიგი')) {
      return {
        icon: "fa-solid fa-medal",
        color: "#3b82f6",
        borderColor: "#1d4ed8",
        glowColor: "rgba(59, 130, 246, 0.4)",
        label: rankName
      };
    } else if (rankName.includes('II თანრიგი')) {
      return {
        icon: "fa-solid fa-medal",
        color: "#cbd5e1",
        borderColor: "#64748b",
        glowColor: "rgba(203, 213, 225, 0.3)",
        label: rankName
      };
    } else if (rankName.includes('III თანრიგი')) {
      return {
        icon: "fa-solid fa-medal",
        color: "#b45309",
        borderColor: "#78350f",
        glowColor: "rgba(180, 83, 9, 0.3)",
        label: rankName
      };
    } else if (rankName.toLowerCase().includes('სოკ')) {
      return {
        icon: "fa-solid fa-certificate",
        color: "#14b8a6",
        borderColor: "#0f766e",
        glowColor: "rgba(20, 184, 166, 0.3)",
        label: rankName
      };
    } else {
      return {
        icon: "fa-solid fa-medal",
        color: "#94a3b8",
        borderColor: "#475569",
        glowColor: "rgba(148, 163, 184, 0.3)",
        label: rankName
      };
    }
  }

  return null;
};
