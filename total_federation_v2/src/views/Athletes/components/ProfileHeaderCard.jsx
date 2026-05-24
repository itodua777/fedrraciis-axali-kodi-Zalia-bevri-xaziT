import React from 'react';
import AthleteAvatarWrapper from './AthleteAvatarWrapper.jsx';
import { calculateAge, getFlagEmoji, getCountryName } from '../../../utils/helpers.js';

const ProfileHeaderCard = ({ athlete, isEditing, editForm, onClose, onEdit, onExpand }) => {
  const age = calculateAge(athlete.birthDate);
  const flag = getFlagEmoji(athlete.nationality);
  const countryName = getCountryName(athlete.nationality);
  const ageText = age !== '' ? `, ${age} წლის` : '';

  const isAsthmaActive = isEditing && editForm
    ? (editForm.asthma === true || editForm.asthma === 'true' || editForm.asthma === 'კი' || editForm.asthma === 'yes')
    : (athlete.asthma === true || athlete.asthma === 'true' || athlete.asthma === 'კი' || athlete.asthma === 'yes');
  const isDiabetesActive = isEditing && editForm
    ? (editForm.diabetes === true || editForm.diabetes === 'true' || editForm.diabetes === 'კი' || editForm.diabetes === 'yes')
    : (athlete.diabetes === true || athlete.diabetes === 'true' || athlete.diabetes === 'კი' || athlete.diabetes === 'yes');

  const bloodTypeVal = isEditing && editForm ? (editForm.bloodType || '-') : (athlete.bloodType || '-');
  
  const heightVal = isEditing && editForm ? editForm.height : athlete.height;
  const weightVal = isEditing && editForm ? editForm.weight : athlete.weight;
  const heightWeightText = `${heightVal ? `${heightVal} სმ` : '-'} / ${weightVal ? `${weightVal} კგ` : '-'}`;

  const phoneVal = isEditing && editForm ? editForm.phone : athlete.phone;
  const emailVal = isEditing && editForm ? editForm.email : athlete.email;
  const allergiesVal = isEditing && editForm ? editForm.allergies : athlete.allergies;

  return (
    <div style={{
      position: "relative",
      display: "grid",
      gridTemplateColumns: "repeat(12, 1fr)",
      gap: "16px",
      padding: "20px",
      backgroundColor: "#121418",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      borderRadius: "12px",
      alignItems: "center",
      boxSizing: "border-box",
      width: "100%"
    }}>
      {/* 1. Bio Core Section (Left, Col-Span 6) */}
      <div style={{
        gridColumn: "span 6",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        minWidth: 0
      }}>
        <AthleteAvatarWrapper athlete={athlete} size={56} />

        <div style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }}>
          <h2 style={{
            margin: 0,
            color: "#e2e8f0",
            fontSize: "16px",
            fontWeight: "600",
            lineHeight: "1.2",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {athlete.firstName} {athlete.lastName}
            {athlete.membershipStatus === 'Deceased' && <span title="ლეგენდარული სპორტსმენები">🕯️</span>}
          </h2>
          
          <div style={{
            color: "#94a3b8",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            {flag && <span>{flag}</span>}
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {countryName || 'საქართველო'}{ageText}
            </span>
          </div>

          <span style={{
            width: "fit-content",
            fontSize: "11px",
            fontWeight: "500",
            color: athlete.isFederationMember ? "#22d3ee" : "#64748b",
            backgroundColor: athlete.isFederationMember ? "rgba(34, 211, 238, 0.1)" : "rgba(100, 116, 139, 0.1)",
            padding: "2px 8px",
            borderRadius: "4px",
            marginTop: "2px"
          }}>
            {athlete.isFederationMember ? "მოქმედი წევრი" : "არაწევრი"}
          </span>

          {/* Contact details */}
          {(phoneVal || emailVal) && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
              {phoneVal && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <i className="fa-solid fa-phone" style={{ color: "#22d3ee", fontSize: "10px", width: "12px", textAlign: "center" }}></i>
                  <span>{phoneVal}</span>
                </div>
              )}
              {emailVal && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <i className="fa-solid fa-envelope" style={{ color: "#22d3ee", fontSize: "10px", width: "12px", textAlign: "center" }}></i>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{emailVal}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Vertical Separator Line (Col-Span 1) */}
      <div style={{
        gridColumn: "span 1",
        height: "48px",
        borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
        justifySelf: "center"
      }} />

      {/* 2. Consolidated Medical Grid (Right, Col-Span 5) */}
      <div style={{
        gridColumn: "span 5",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        justifyContent: "center",
        fontSize: "12px",
        borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
        paddingLeft: "16px",
        boxSizing: "border-box"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#e2e8f0" }}>
          <span>🩸 სისხლი:</span>
          <span style={{
            fontWeight: "bold",
            backgroundColor: "#ef4444",
            padding: "1px 5px",
            borderRadius: "3px",
            fontSize: "11px",
            color: "#fff"
          }}>
            {bloodTypeVal}
          </span>
        </div>
        <div style={{ color: "#94a3b8" }}>
          📏 {heightWeightText}
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "2px" }}>
          <span style={{
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "10px",
            fontWeight: "500",
            backgroundColor: isAsthmaActive ? "rgba(245, 158, 11, 0.15)" : "rgba(30, 41, 59, 0.5)",
            color: isAsthmaActive ? "#f59e0b" : "#94a3b8",
            border: isAsthmaActive ? "1px solid rgba(245, 158, 11, 0.3)" : "1px solid rgba(255, 255, 255, 0.05)"
          }}>
            ასთმა: {isAsthmaActive ? "კი" : "არა"}
          </span>
          <span style={{
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "10px",
            fontWeight: "500",
            backgroundColor: isDiabetesActive ? "rgba(239, 68, 68, 0.15)" : "rgba(30, 41, 59, 0.5)",
            color: isDiabetesActive ? "#ef4444" : "#94a3b8",
            border: isDiabetesActive ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(255, 255, 255, 0.05)"
          }}>
            დიაბეტი: {isDiabetesActive ? "კი" : "არა"}
          </span>
        </div>
        {allergiesVal && (
          <div style={{ fontSize: "11px", color: "#f59e0b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={`ალერგია: ${allergiesVal}`}>
            ⚠️ {allergiesVal}
          </div>
        )}
      </div>

      {/* Absolute Close Button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          backgroundColor: "transparent",
          border: "none",
          color: "#64748b",
          cursor: "pointer",
          transition: "color 0.2s",
          padding: "4px"
        }}
        onMouseEnter={e => e.currentTarget.style.color = "#e2e8f0"}
        onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
      >
        <i className="fa-solid fa-xmark" style={{ fontSize: "14px" }}></i>
      </button>
    </div>
  );
};

export default ProfileHeaderCard;
