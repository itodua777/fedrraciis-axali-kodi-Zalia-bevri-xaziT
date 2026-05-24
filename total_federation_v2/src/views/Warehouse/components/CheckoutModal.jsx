import React from 'react';

const CheckoutModal = ({ isOpen, onClose, onCheckoutConfirm, selectedItemForCheckout, checkoutType, athletes, items }) => {
  const [athleteSearchText, setAthleteSearchText] = React.useState('');
  const [selectedAthlete, setSelectedAthlete] = React.useState(null);
  const [expectedReturnDate, setExpectedReturnDate] = React.useState('');
  const [checkoutQty, setCheckoutQty] = React.useState(1);
  const [expeditionName, setExpeditionName] = React.useState('');
  const [hasPhysicalDocument, setHasPhysicalDocument] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setAthleteSearchText('');
      setSelectedAthlete(null);
      setCheckoutQty(1);
      setExpeditionName('');
      setHasPhysicalDocument(false);
      setExpectedReturnDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    }
  }, [isOpen]);

  if (!isOpen || !selectedItemForCheckout) return null;

  const isHighRiskGear = React.useMemo(() => {
    const checkItemHighRisk = (item) => {
      const cat = (item.category || '');
      const name = (item.name || '').toLowerCase();
      const qr = (item.qr || '').toLowerCase();

      const isAlpine = cat === 'ალპინისტური';
      const hasKeyword = name.includes('სამაშველო') || 
                        name.includes('ზვავის') || 
                        name.includes('დინამიკური') || 
                        name.includes('ჩაფხუტი') || 
                        name.includes('კარაბინი') ||
                        qr.includes('rescue') ||
                        qr.includes('avalanche');
      return isAlpine || hasKeyword;
    };

    if (checkoutType === 'bundle') {
      const bundle = selectedItemForCheckout;
      const bundleName = (bundle.name || '').toLowerCase();
      const isBundleHighRisk = bundleName.includes('სამაშველო') || bundleName.includes('ზვავის') || bundleName.includes('ალპური');
      if (isBundleHighRisk) return true;

      return bundle.items?.some(comp => {
        const whItem = items.find(i => i.id === comp.itemId);
        return whItem && checkItemHighRisk(whItem);
      });
    }

    return checkItemHighRisk(selectedItemForCheckout);
  }, [selectedItemForCheckout, checkoutType, items]);

  const isUnqualified = React.useMemo(() => {
    if (!selectedAthlete) return false;
    const rank = selectedAthlete.mountaineerRank || 'NONE';
    return rank === 'NONE' || rank === 'BADGE';
  }, [selectedAthlete]);

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!selectedAthlete) return;
    onCheckoutConfirm({
      selectedAthlete,
      expectedReturnDate,
      checkoutQty,
      expeditionName,
      hasPhysicalDocument
    });
  };

  const filteredAthletes = athletes.filter(ath => {
    const name = `${ath.firstName} ${ath.lastName}`.toLowerCase();
    const query = athleteSearchText.toLowerCase();
    return name.includes(query) || (ath.personalId && ath.personalId.includes(query));
  });

  const modalOverlayStyle = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.75)", display: "flex", justifyContent: "center",
    alignItems: "center", zIndex: 9999, padding: "20px", backdropFilter: "blur(4px)"
  };

  const modalContentStyle = {
    backgroundColor: "#1e293b", border: "1px solid rgba(34, 211, 238, 0.3)",
    borderRadius: "16px", padding: "30px", width: "100%", maxWidth: "600px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)", maxHeight: "85vh", overflowY: "auto"
  };

  const formGroupStyle = {
    display: "flex", flexDirection: "column", gap: "6px", marginBottom: "15px"
  };

  const inputStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px", padding: "10px 14px", color: "#fff", outline: "none", fontSize: "14px"
  };

  const cannotSubmit = !selectedAthlete || selectedAthlete.warehouseBlocked || (isHighRiskGear && isUnqualified) || !hasPhysicalDocument || !expeditionName;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, color: "#fff" }}>
            <i className="fa-solid fa-paper-plane" style={{ color: "#f59e0b", marginRight: "10px" }}></i>
            ინვენტარის გაცემა: {selectedItemForCheckout?.name.replace('\n', ' ')}
          </h3>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "20px" }}><i className="fa-solid fa-xmark"></i></button>
        </div>

        <form onSubmit={handleConfirm}>
          <div style={{ ...formGroupStyle, position: "relative" }}>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>მიმღები პირი (სპორტსმენი / მენტორი)</label>
            {selectedAthlete ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "rgba(34,211,238,0.06)", border: "1px solid #22d3ee", borderRadius: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img src={selectedAthlete.photo || "https://i.pravatar.cc/150"} style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }} alt="Avatar" />
                  <div>
                    <div style={{ fontWeight: "bold", color: "#fff", fontSize: "13px" }}>{selectedAthlete.firstName} {selectedAthlete.lastName}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>სპორტი: {selectedAthlete.sportsDiscipline || '-'}</div>
                  </div>
                </div>
                <button type="button" onClick={() => setSelectedAthlete(null)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "12px" }}>ცვლილება</button>
              </div>
            ) : (
              <>
                <input 
                  type="text" required style={inputStyle} placeholder="დაიწყეთ სპორტსმენის სახელის წერა..." 
                  value={athleteSearchText} onChange={(e) => setAthleteSearchText(e.target.value)}
                />
                {athleteSearchText && (
                  <div style={{ position: "absolute", top: "68px", left: 0, right: 0, backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", boxShadow: "0 8px 16px rgba(0,0,0,0.5)", zIndex: 10, maxHeight: "200px", overflowY: "auto" }}>
                    {filteredAthletes.map(ath => (
                      <div 
                        key={ath.id} 
                        onClick={() => {
                          setSelectedAthlete(ath);
                          setAthleteSearchText('');
                        }}
                        style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s" }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(34, 211, 238, 0.1)"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <img src={ath.photo || "https://i.pravatar.cc/150"} style={{ width: "24px", height: "24px", borderRadius: "50%" }} alt="Avatar" />
                        <div>
                          <div style={{ color: "#fff", fontSize: "13px", fontWeight: "bold" }}>{ath.firstName} {ath.lastName}</div>
                          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>ID: {ath.id} | {ath.sportsDiscipline}</div>
                        </div>
                      </div>
                    ))}
                    {filteredAthletes.length === 0 && (
                      <div style={{ padding: "12px", color: "rgba(255,255,255,0.4)", fontSize: "12px", fontStyle: "italic" }}>სპორტსმენი ვერ მოიძებნა</div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {selectedAthlete && selectedAthlete.warehouseBlocked && (
            <div style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid #ef4444",
              color: "#ef4444",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "bold",
              marginTop: "15px",
              marginBottom: "15px",
              boxShadow: "0 0 10px rgba(239, 68, 68, 0.1)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>[❌ საწყობის ბლოკი: ნივთების გაცემა აკრძალულია ზარალის ანაზღაურებამდე]</span>
            </div>
          )}

          {selectedAthlete && !selectedAthlete.warehouseBlocked && isHighRiskGear && isUnqualified && (
            <div style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              border: "1px solid #ef4444",
              color: "#ef4444",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "bold",
              marginTop: "15px",
              marginBottom: "15px",
              boxShadow: "0 0 10px rgba(239, 68, 68, 0.1)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>⚠️ ყურადღება: ამ პირს არ აქვს შესაბამისი კვალიფიკაცია/თანრიგი ამ აღჭურვილობის მისაღებად!</span>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
            <div style={formGroupStyle}>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>დაბრუნების ვადა (Expected Return)</label>
              <input 
                type="date" required style={inputStyle}
                value={expectedReturnDate} onChange={(e) => setExpectedReturnDate(e.target.value)}
              />
            </div>

            {checkoutType === 'item' && (
              <div style={formGroupStyle}>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>რაოდენობა (მარაგში: {selectedItemForCheckout?.qtyLeft})</label>
                <input 
                  type="number" min="1" max={selectedItemForCheckout?.qtyLeft} required style={inputStyle}
                  value={checkoutQty} onChange={(e) => setCheckoutQty(Number(e.target.value))}
                />
              </div>
            )}
          </div>

          <div style={{ ...formGroupStyle, marginTop: "15px" }}>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>ექსპედიციის/ღონისძიების დასახელება</label>
            <input 
              type="text" required style={inputStyle} placeholder="მაგ. შხარა 2026"
              value={expeditionName} onChange={(e) => setExpeditionName(e.target.value)}
            />
          </div>

          <div style={{ ...formGroupStyle, flexDirection: "row", alignItems: "center", gap: "10px", marginTop: "15px", marginBottom: "15px" }}>
            <input 
              type="checkbox" id="hasPhysicalDocument" required
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
              checked={hasPhysicalDocument} onChange={(e) => setHasPhysicalDocument(e.target.checked)}
            />
            <label htmlFor="hasPhysicalDocument" style={{ fontSize: "13px", color: "#fff", cursor: "pointer", fontWeight: "bold", userSelect: "none" }}>
              ✓ ვადასტურებ პრეზიდენტის მიერ ხელმოწერილი ფიზიკური დოკუმენტის არსებობას
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
            <button type="button" onClick={onClose} style={{ backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>გაუქმება</button>
            <button 
              type="submit" 
              disabled={cannotSubmit}
              style={{ 
                backgroundColor: cannotSubmit ? "rgba(255,255,255,0.05)" : "#f59e0b", 
                border: "none", 
                color: cannotSubmit ? "rgba(255,255,255,0.3)" : "#fff", 
                padding: "10px 20px", 
                borderRadius: "8px", 
                cursor: cannotSubmit ? "not-allowed" : "pointer", 
                fontWeight: "bold" 
              }}
            >
              გაცემის დადასტურება
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
