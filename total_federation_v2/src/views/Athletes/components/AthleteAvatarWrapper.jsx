import React from 'react';
import { useRanksStore } from '../../../context/ranksStore.js';

export const getAthleteBadgeConfig = (athlete, ranks = []) => {
  const isSnowLeopard = athlete?.achievements?.some(ach => 
    ach.type === 'title' && 
    (ach.title?.toLowerCase().includes('snow leopard') || 
     ach.title?.toLowerCase().includes('თოვლის ჯიქი'))
  ) || false;

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

const AthleteAvatarWrapper = ({ athlete, size = 56 }) => {
  const ranksStore = useRanksStore();
  const ranks = ranksStore.ranks || [];
  const badgeConfig = getAthleteBadgeConfig(athlete, ranks);

  const borderSize = size >= 88 ? 3 : 2;
  const badgeSize = size >= 88 ? 24 : 18;
  const badgeFontSize = size >= 88 ? '12px' : '9px';
  const badgeOffset = size >= 88 ? '-2px' : '-2px';

  const borderColor = badgeConfig ? badgeConfig.borderColor : "#22d3ee";
  const glowColor = badgeConfig ? badgeConfig.glowColor : "rgba(34, 211, 238, 0.3)";

  return (
    <div style={{ position: "relative", flexShrink: 0, width: `${size}px`, height: `${size}px` }}>
      <div style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        border: `${borderSize}px solid ${borderColor}`,
        boxShadow: `0 0 10px ${glowColor}`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <img src={athlete.photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Profile" />
      </div>
      {badgeConfig && (
        <div 
          title={badgeConfig.label}
          style={{
            position: "absolute",
            bottom: badgeOffset,
            right: badgeOffset,
            width: `${badgeSize}px`,
            height: `${badgeSize}px`,
            borderRadius: "50%",
            backgroundColor: "#1e293b",
            border: `2px solid ${badgeConfig.borderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
            zIndex: 10
          }}
        >
          <i className={badgeConfig.icon} style={{ color: badgeConfig.color, fontSize: badgeFontSize }} />
        </div>
      )}
    </div>
  );
};

if (typeof window !== 'undefined') {
  window.AthleteAvatarWrapper = AthleteAvatarWrapper;
}

export default AthleteAvatarWrapper;
