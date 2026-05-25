import React from '../../../utils/react-shim.js';
import FullscreenBioMedical from './FullscreenBioMedical.jsx';
import FullscreenFederationHistory from './FullscreenFederationHistory.jsx';
import FullscreenRightCol from './FullscreenRightCol.jsx';
import { calculateAge, getFlagEmoji, getCountryName } from '../../../utils/helpers.js';

const AthleteFullscreen = ({
  athlete,
  editForm,
  setEditForm,
  isEditing,
  setIsEditing,
  isFullscreenOpen,
  setIsFullscreenOpen,
  clubs,
  onClubClick,
  onUpdateAthlete,
  handleMinimize,
  handleSave,
  handleCancel
}) => {
  if (!isFullscreenOpen || !athlete) return null;

  const age = calculateAge(athlete.birthDate);
  const isMinor = typeof age === 'number' && age < 18;
  const isDeceased = editForm?.membershipStatus === 'Deceased';
  const isVotingDisabled = isMinor || editForm?.membershipStatus !== 'Active' || !editForm?.membershipFeePaid;

  const flag = getFlagEmoji(athlete.nationality);
  const countryName = getCountryName(athlete.nationality);
  const ageText = age !== '' ? `, ${age} წლის` : '';
  const isAsthmaActive = (athlete.asthma === true || athlete.asthma === 'true' || athlete.asthma === 'კი' || athlete.asthma === 'yes');
  const isDiabetesActive = (athlete.diabetes === true || athlete.diabetes === 'true' || athlete.diabetes === 'კი' || athlete.diabetes === 'yes');
  const bloodTypeVal = athlete.bloodType || '-';
  const heightWeightText = `${athlete.height ? `${athlete.height} სმ` : '-'} / ${athlete.weight ? `${athlete.weight} კგ` : '-'}`;
  const phoneVal = athlete.phone;
  const emailVal = athlete.email;
  const allergiesVal = athlete.allergies;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      boxSizing: "border-box"
    }}>
      {/* Modal Card */}
      <div style={{
        width: "92vw",
        height: "90vh",
        backgroundColor: "#0d0f12",
        border: "1px solid #1e293b",
        borderRadius: "16px",
        padding: "24px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 1000
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          paddingBottom: "16px"
        }}>
          {/* Left: Close/Minimize actions or spacer */}
          {!isEditing ? (
            <button
              onClick={handleMinimize}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "13px",
                backgroundColor: "rgba(30, 41, 59, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                color: "#cbd5e1",
                padding: "6px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.8)";
                e.currentTarget.style.color = "var(--color-emerald-core)";
                e.currentTarget.style.borderColor = "color-mix(in oklab, var(--color-emerald-core) 40%, transparent)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.5)";
                e.currentTarget.style.color = "#cbd5e1";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
              }}
            >
              <i className="fa-solid fa-compress" style={{ fontSize: "12px" }}></i>
              პატარა ფანჯარაში დაბრუნება
            </button>
          ) : (
            <div style={{ width: "180px" }}></div>
          )}

          {/* Title */}
          <h2 style={{
            margin: 0,
            color: "#e2e8f0",
            fontSize: "20px",
            fontWeight: "700",
            letterSpacing: "0.5px"
          }}>
            {isEditing ? "სპორტსმენის პირადი ბარათი (რედაქტირება)" : "სპორტსმენის პირადი ბარათი (სრული ხედი)"}
          </h2>

          {/* Right: Close or Save/Cancel */}
          {!isEditing ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() => window.print()}
                title="ამობეჭდვა"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(30, 41, 59, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#cbd5e1",
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.8)";
                  e.currentTarget.style.color = "var(--color-emerald-core)";
                  e.currentTarget.style.borderColor = "color-mix(in oklab, var(--color-emerald-core) 40%, transparent)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.5)";
                  e.currentTarget.style.color = "#cbd5e1";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                }}
              >
                <i className="fa-solid fa-print" style={{ fontSize: "14px" }}></i>
              </button>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)",
                  border: "1px solid color-mix(in oklab, var(--color-emerald-core) 30%, transparent)",
                  color: "var(--color-emerald-core)",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = "color-mix(in oklab, var(--color-emerald-core) 20%, transparent)";
                  e.currentTarget.style.boxShadow = "0 0 10px color-mix(in oklab, var(--color-emerald-core) 30%, transparent)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <i className="fa-regular fa-pen-to-square" style={{ fontSize: "13px" }}></i>
                რედაქტირება
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.6)",
                  padding: "6px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  transition: "all 0.3s"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              >
                გაუქმება
              </button>
              <button
                type="button"
                onClick={handleSave}
                style={{
                  backgroundColor: "var(--color-emerald-core)",
                  border: "none",
                  color: "#121418",
                  padding: "6px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "bold",
                  transition: "all 0.3s",
                  boxShadow: "0 0 10px color-mix(in oklab, var(--color-emerald-core) 30%, transparent)"
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 15px color-mix(in oklab, var(--color-emerald-core) 60%, transparent)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 10px color-mix(in oklab, var(--color-emerald-core) 30%, transparent)"; }}
              >
                <i className="fa-regular fa-floppy-disk"></i> ცვლილების შენახვა
              </button>
            </div>
          )}
        </div>

        {/* Dashboard Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: "24px",
          flex: 1
        }}>
          <FullscreenBioMedical
            athlete={athlete}
            editForm={editForm}
            setEditForm={setEditForm}
            isEditing={isEditing}
            isDeceased={isDeceased}
            flag={flag}
            countryName={countryName}
            ageText={ageText}
            phoneVal={phoneVal}
            emailVal={emailVal}
            bloodTypeVal={bloodTypeVal}
            heightWeightText={heightWeightText}
            isAsthmaActive={isAsthmaActive}
            isDiabetesActive={isDiabetesActive}
            allergiesVal={allergiesVal}
          />

          <FullscreenFederationHistory
            athlete={athlete}
            editForm={editForm}
            setEditForm={setEditForm}
            isEditing={isEditing}
            isDeceased={isDeceased}
            isVotingDisabled={isVotingDisabled}
            isMinor={isMinor}
            clubs={clubs}
            onClubClick={onClubClick}
            setIsFullscreenOpen={setIsFullscreenOpen}
            onUpdateAthlete={onUpdateAthlete}
          />

          <FullscreenRightCol
            athlete={athlete}
            editForm={editForm}
            setEditForm={setEditForm}
            isEditing={isEditing}
            isDeceased={isDeceased}
          />
        </div>
      </div>
    </div>
  );
};

export default AthleteFullscreen;
