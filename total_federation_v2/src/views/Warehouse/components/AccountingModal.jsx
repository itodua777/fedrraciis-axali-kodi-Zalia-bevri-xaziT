import React from 'react';
import { COUNTRIES } from '../../../utils/countries.js';

const AccountingModal = ({ 
  isOpen, 
  onClose, 
  items, 
  transactions, 
  bundles, 
  athletes, 
  writtenOffItems, 
  getGELValue,
  setActivePrintDoc,
  prePrintStartDate,
  setPrePrintStartDate,
  prePrintEndDate,
  setPrePrintEndDate,
  prePrintCategory,
  setPrePrintCategory,
  prePrintAthlete,
  setPrePrintAthlete,
  prePrintReason,
  setPrePrintReason
}) => {
  const [prePrintAthleteSearch, setPrePrintAthleteSearch] = React.useState('');
  const [prePrintAthleteSearchFocused, setPrePrintAthleteSearchFocused] = React.useState(false);
  const [isDataGenerated, setIsDataGenerated] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setPrePrintAthleteSearch('');
      setPrePrintAthleteSearchFocused(false);
      setIsDataGenerated(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const matchesWriteOffReason = React.useCallback((reasonText, filterValue) => {
    if (!filterValue || filterValue === 'all') return true;
    if (!reasonText) return false;
    const text = reasonText.toLowerCase();
    if (filterValue === 'ცვეთა') {
      return text.includes('ცვეთა') || text.includes('ამორტიზაცია') || text.includes('ვადაგასული');
    }
    if (filterValue === 'დაზიანება/ინციდენტი') {
      return text.includes('დაზიანება') || text.includes('დაზიანდა') || text.includes('ინციდენტი') || text.includes('გატეხილი') || text.includes('გატყდა') || text.includes('დაზიანებული');
    }
    if (filterValue === 'დაკარგვა') {
      return text.includes('დაკარგვა') || text.includes('დაკარგული');
    }
    return false;
  }, []);

  const prePrintFilteredInflows = React.useMemo(() => {
    if (prePrintAthlete || prePrintReason !== 'all') return [];
    return items.filter(item => {
      const matchesStart = !prePrintStartDate || item.inflowDate >= prePrintStartDate;
      const matchesEnd = !prePrintEndDate || item.inflowDate <= prePrintEndDate;
      const matchesCat = prePrintCategory === 'all' || item.category === prePrintCategory;
      return matchesStart && matchesEnd && matchesCat;
    });
  }, [items, prePrintStartDate, prePrintEndDate, prePrintCategory, prePrintAthlete, prePrintReason]);

  const prePrintFilteredDisposals = React.useMemo(() => {
    return writtenOffItems.filter(item => {
      const itemDatePart = item.date ? item.date.substring(0, 10) : '';
      const matchesStart = !prePrintStartDate || itemDatePart >= prePrintStartDate;
      const matchesEnd = !prePrintEndDate || itemDatePart <= prePrintEndDate;
      const matchesCat = prePrintCategory === 'all' || item.category === prePrintCategory;
      const matchesAthlete = !prePrintAthlete || item.athleteId === prePrintAthlete.id;
      const matchesReason = matchesWriteOffReason(item.reason, prePrintReason);
      return matchesStart && matchesEnd && matchesCat && matchesAthlete && matchesReason;
    });
  }, [writtenOffItems, prePrintStartDate, prePrintEndDate, prePrintCategory, prePrintAthlete, prePrintReason, matchesWriteOffReason]);

  const liveGridData = React.useMemo(() => {
    const list = [];
    prePrintFilteredInflows.forEach(item => {
      list.push({
        id: `inflow-${item.id}`,
        code: item.qr,
        name: item.name,
        qty: item.qtyTotal,
        statusOrReason: "მიღებული",
        date: item.inflowDate,
        type: 'inflow'
      });
    });
    prePrintFilteredDisposals.forEach(item => {
      list.push({
        id: item.id,
        code: item.code,
        name: item.name,
        qty: item.qty,
        statusOrReason: item.reason || "ჩამოწერილი",
        date: item.date ? item.date.substring(0, 10) : '',
        type: 'disposal'
      });
    });
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [prePrintFilteredInflows, prePrintFilteredDisposals]);

  const modalOverlayStyle = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.75)", display: "flex", justifyContent: "center",
    alignItems: "center", zIndex: 9999, padding: "20px", backdropFilter: "blur(4px)"
  };

  const modalContentStyle = {
    backgroundColor: "#1e293b", border: "1px solid color-mix(in oklab, var(--color-emerald-core) 30%, transparent)",
    borderRadius: "16px", padding: "30px", width: "100%", maxWidth: "1000px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)", maxHeight: "85vh", overflowY: "auto"
  };

  const inputStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px", padding: "10px 14px", color: "#fff", outline: "none", fontSize: "14px"
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, color: "#fff", display: "flex", alignItems: "center", gap: "10px" }}>
            <i className="fa-solid fa-file-invoice-dollar" style={{ color: "var(--color-emerald-core)" }}></i>
            საწყობის ბუღალტერია & ჩამოწერის მოდული
          </h3>
          <button 
            onClick={() => {
              onClose();
              setIsDataGenerated(false);
            }} 
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "20px" }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style={{ 
          backgroundColor: "rgba(255,255,255,0.02)", 
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px", 
          padding: "16px", 
          marginBottom: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "flex-end"
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 220px" }}>
            <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: "bold" }}>📅 პერიოდი (დაწყება — დასრულება)</label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input 
                type="date" 
                style={{ ...inputStyle, padding: "8px 10px", fontSize: "13px", flex: 1 }}
                value={prePrintStartDate} 
                onChange={(e) => setPrePrintStartDate(e.target.value)}
              />
              <span style={{ color: "rgba(255,255,255,0.3)" }}>—</span>
              <input 
                type="date" 
                style={{ ...inputStyle, padding: "8px 10px", fontSize: "13px", flex: 1 }}
                value={prePrintEndDate} 
                onChange={(e) => setPrePrintEndDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 150px" }}>
            <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: "bold" }}>📦 ინვენტარი</label>
            <select 
              style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px", width: "100%" }}
              value={prePrintCategory} 
              onChange={(e) => setPrePrintCategory(e.target.value)}
            >
              <option value="all">ყველა კატეგორია</option>
              <option value="ექსპედიციური">ექსპედიციური</option>
              <option value="ალპინისტური">ალპინისტური</option>
              <option value="საოფისე">საოფისე</option>
              <option value="სამაშველო">სამაშველო</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 150px" }}>
            <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: "bold" }}>📜 ჩამოწერის საფუძველი</label>
            <select 
              style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px", width: "100%" }}
              value={prePrintReason} 
              onChange={(e) => setPrePrintReason(e.target.value)}
            >
              <option value="all">ყველა საფუძველი</option>
              <option value="ცვეთა">ცვეთა (ამორტიზაცია)</option>
              <option value="დაზიანება/ინციდენტი">დაზიანება / ინციდენტი</option>
              <option value="დაკარგვა">დაკარგვა</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 200px", position: "relative" }}>
            <label style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: "bold" }}>👤 პასუხისმგებელი პირი</label>
            {prePrintAthlete ? (
              <div style={{
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                padding: "8px 12px", 
                backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 6%, transparent)", 
                border: "1px solid color-mix(in oklab, var(--color-emerald-core) 30%, transparent)", 
                borderRadius: "8px",
                height: "37px",
                boxSizing: "border-box"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
                  <img src={prePrintAthlete.photo || "https://i.pravatar.cc/150"} style={{ width: "20px", height: "20px", borderRadius: "50%", objectFit: "cover" }} alt="" />
                  <span style={{ fontSize: "13px", color: "#fff", fontWeight: "500", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                    {prePrintAthlete.firstName} {prePrintAthlete.lastName}
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                    setPrePrintAthlete(null);
                    setPrePrintAthleteSearch('');
                  }} 
                  style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "11px", fontWeight: "bold", padding: 0 }}
                >
                  ცვლილება
                </button>
              </div>
            ) : (
              <>
                <input 
                  type="text" 
                  style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px", width: "100%" }}
                  placeholder="მოძებნეთ სპორტსმენი..." 
                  value={prePrintAthleteSearch} 
                  onChange={(e) => setPrePrintAthleteSearch(e.target.value)}
                  onFocus={() => setPrePrintAthleteSearchFocused(true)}
                  onBlur={() => setTimeout(() => setPrePrintAthleteSearchFocused(false), 200)}
                />
                {prePrintAthleteSearchFocused && prePrintAthleteSearch && (
                  <div style={{ 
                    position: "absolute", 
                    top: "60px", 
                    left: 0, 
                    right: 0, 
                    backgroundColor: "#1e293b", 
                    border: "1px solid rgba(255,255,255,0.15)", 
                    borderRadius: "8px", 
                    boxShadow: "0 8px 16px rgba(0,0,0,0.5)", 
                    zIndex: 9999, 
                    maxHeight: "150px", 
                    overflowY: "auto" 
                  }}>
                    {athletes.filter(ath => {
                      const name = `${ath.firstName} ${ath.lastName}`.toLowerCase();
                      const query = prePrintAthleteSearch.toLowerCase();
                      return name.includes(query) || (ath.personalId && ath.personalId.includes(query));
                    }).map(ath => (
                      <div 
                        key={ath.id} 
                        onClick={() => {
                          setPrePrintAthlete(ath);
                          setPrePrintAthleteSearch('');
                        }}
                        style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <img src={ath.photo || "https://i.pravatar.cc/150"} style={{ width: "20px", height: "20px", borderRadius: "50%" }} alt="" />
                        <div>
                          <div style={{ color: "#fff", fontSize: "12px", fontWeight: "bold" }}>{ath.firstName} {ath.lastName}</div>
                          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}>ID: {ath.id}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <button 
            onClick={() => setIsDataGenerated(true)}
            style={{ 
              backgroundColor: "var(--color-emerald-core)", 
              color: "#0f172a", 
              border: "none", 
              padding: "9px 20px", 
              borderRadius: "8px", 
              fontWeight: "bold", 
              fontSize: "13px", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              gap: "6px", 
              height: "37px", 
              transition: "all 0.3s" 
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#06b6d4"; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "var(--color-emerald-core)"; }}
          >
            <i className="fa-solid fa-magnifying-glass"></i> მოძებნა
          </button>
        </div>

        {isDataGenerated ? (
          <div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "10px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" }}>
              <i className="fa-solid fa-table-list" style={{ color: "var(--color-emerald-core)" }}></i>
              ნაპოვნი მონაცემების ცხრილი (Live Grid View):
            </div>

            <div style={{ 
              backgroundColor: "rgba(0,0,0,0.3)", 
              padding: "15px", 
              borderRadius: "8px", 
              maxHeight: "300px", 
              overflowY: "auto", 
              fontSize: "12px", 
              border: "1px solid rgba(255,255,255,0.06)", 
              marginBottom: "20px" 
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse", color: "#e2e8f0" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", height: "30px" }}>
                    <th style={{ textAlign: "left", padding: "8px" }}>კოდი</th>
                    <th style={{ textAlign: "left", padding: "8px" }}>დასახელება</th>
                    <th style={{ textAlign: "center", padding: "8px" }}>რაოდენობა</th>
                    <th style={{ textAlign: "left", padding: "8px" }}>სტატუსი/მიზეზი</th>
                    <th style={{ textAlign: "left", padding: "8px" }}>თარიღი</th>
                  </tr>
                </thead>
                <tbody>
                  {liveGridData.map(row => (
                    <tr key={row.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", height: "35px" }}>
                      <td style={{ padding: "8px", color: row.type === 'disposal' ? "#f87171" : "var(--color-emerald-core)", fontWeight: "bold" }}>{row.code}</td>
                      <td style={{ padding: "8px" }}>{row.name.replace('\n', ' ')}</td>
                      <td style={{ padding: "8px", textAlign: "center" }}>{row.qty} ცალი</td>
                      <td style={{ padding: "8px", color: row.type === 'disposal' ? "#d97706" : "#10b981" }}>{row.statusOrReason}</td>
                      <td style={{ padding: "8px" }}>{row.date}</td>
                    </tr>
                  ))}
                  {liveGridData.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ padding: "20px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
                        მონაცემები მოცემული ფილტრებით არ იძებნება.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "15px" }}>
              <button 
                onClick={() => {
                  onClose();
                  setIsDataGenerated(false);
                }} 
                style={{ 
                  backgroundColor: "transparent", 
                  border: "1px solid rgba(255,255,255,0.1)", 
                  color: "rgba(255,255,255,0.7)", 
                  padding: "6px 12px", 
                  borderRadius: "6px", 
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "500"
                }}
              >
                დახურვა
              </button>

              <button 
                onClick={() => setActivePrintDoc('ledger')}
                disabled={liveGridData.length === 0}
                style={{ 
                  backgroundColor: "transparent", 
                  border: "1px solid #3f3f46", 
                  color: liveGridData.length === 0 ? "rgba(255,255,255,0.2)" : "#d4d4d8", 
                  padding: "6px 12px", 
                  borderRadius: "6px", 
                  cursor: liveGridData.length === 0 ? "not-allowed" : "pointer",
                  fontSize: "12px",
                  fontWeight: "500",
                  display: "flex", 
                  alignItems: "center", 
                  gap: "6px",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => { 
                  if (liveGridData.length > 0) {
                    e.currentTarget.style.backgroundColor = "#27272a"; 
                  }
                }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <i className="fa-solid fa-print"></i> 🖨️ ბუღალტრული უწყისის ბეჭდვა
              </button>

              <button 
                onClick={() => setActivePrintDoc('disposal')}
                disabled={prePrintFilteredDisposals.length === 0}
                style={{ 
                  backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", 
                  border: "1px solid color-mix(in oklab, var(--color-emerald-core) 30%, transparent)", 
                  color: prePrintFilteredDisposals.length === 0 ? "color-mix(in oklab, var(--color-emerald-core) 20%, transparent)" : "var(--color-emerald-core)", 
                  padding: "6px 12px", 
                  borderRadius: "6px", 
                  cursor: prePrintFilteredDisposals.length === 0 ? "not-allowed" : "pointer",
                  fontSize: "12px",
                  fontWeight: "500",
                  display: "flex", 
                  alignItems: "center", 
                  gap: "6px",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => { 
                  if (prePrintFilteredDisposals.length > 0) {
                    e.currentTarget.style.backgroundColor = "color-mix(in oklab, var(--color-emerald-core) 20%, transparent)"; 
                  }
                }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)"; }}
              >
                <i className="fa-solid fa-print"></i> 🖨️ ჩამოწერის აქტის ბეჭდვა
              </button>
            </div>
          </div>
        ) : (
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            padding: "40px 20px", 
            backgroundColor: "rgba(0,0,0,0.2)", 
            borderRadius: "8px", 
            border: "1px dashed rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.4)",
            fontSize: "13px"
          }}>
            <i className="fa-solid fa-filter" style={{ fontSize: "28px", color: "rgba(255,255,255,0.2)", marginBottom: "12px" }}></i>
            ფილტრების მონიშვნის შემდეგ დააჭირეთ ღილაკს <strong>[🔍 მოძებნა]</strong> ნაპოვნი მონაცემების ცხრილის სანახავად.
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountingModal;
