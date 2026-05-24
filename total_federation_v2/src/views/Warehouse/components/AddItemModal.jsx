import React from 'react';

const AddItemModal = ({ isOpen, onClose, onAdd }) => {
  const [addItemForm, setAddItemForm] = React.useState({
    name: '',
    category: 'ალპინისტური',
    qr: '',
    qtyTotal: 1,
    price: 0,
    currency: 'GEL',
    expiry: 'უვადო',
    expiryDate: '',
    condition: 'NEW',
    minStockThreshold: 1,
    supplier: ''
  });

  if (!isOpen) return null;

  const handleAddItem = (e) => {
    e.preventDefault();
    const expiryVal = addItemForm.expiry === 'უვადო' ? 'უვადო' : addItemForm.expiryDate;
    const isCurrentlyExpired = expiryVal !== 'უვადო' && new Date(expiryVal) < new Date();

    const newItem = {
      id: String(Date.now()),
      name: addItemForm.name,
      category: addItemForm.category,
      qr: addItemForm.qr || `QR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      qtyTotal: Number(addItemForm.qtyTotal),
      qtyLeft: Number(addItemForm.qtyTotal),
      price: Number(addItemForm.price),
      currency: addItemForm.currency,
      expiry: expiryVal,
      condition: addItemForm.condition,
      status: isCurrentlyExpired ? 'ვადაგასული' : 'ვარგისი',
      minStockThreshold: Number(addItemForm.minStockThreshold),
      supplier: addItemForm.supplier || 'უცნობი მიმწოდებელი',
      inflowDate: new Date().toISOString().split('T')[0]
    };

    onAdd(newItem);
    onClose();
  };

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

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, color: "#fff" }}><i className="fa-solid fa-cube"></i> ახალი პროდუქციის მიღება</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "20px" }}><i className="fa-solid fa-xmark"></i></button>
        </div>

        <form onSubmit={handleAddItem}>
          <div style={formGroupStyle}>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>დასახელება</label>
            <input 
              type="text" required style={inputStyle} placeholder="მაგ. Petzl Harness Evolv" 
              value={addItemForm.name} onChange={(e) => setAddItemForm({...addItemForm, name: e.target.value})}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div style={formGroupStyle}>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>კატეგორია</label>
              <select style={inputStyle} value={addItemForm.category} onChange={(e) => setAddItemForm({...addItemForm, category: e.target.value})}>
                <option value="ალპინისტური">ალპინისტური</option>
                <option value="საბანაკე">საბანაკე</option>
              </select>
            </div>

            <div style={formGroupStyle}>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>სერიული ნომერი / შტრიხკოდი</label>
              <input 
                type="text" style={inputStyle} placeholder="მაგ. QR-PTZ-980" 
                value={addItemForm.qr} onChange={(e) => setAddItemForm({...addItemForm, qr: e.target.value})}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: "15px" }}>
            <div style={formGroupStyle}>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>მიმწოდებელი</label>
              <input 
                type="text" style={inputStyle} placeholder="მაგ. PSP, Petzl EU" 
                value={addItemForm.supplier} onChange={(e) => setAddItemForm({...addItemForm, supplier: e.target.value})}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>შესყიდვის ფასი</label>
              <input 
                type="number" min="0" required style={inputStyle} placeholder="0" 
                value={addItemForm.price} onChange={(e) => setAddItemForm({...addItemForm, price: e.target.value})}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>ვალუტა</label>
              <select style={inputStyle} value={addItemForm.currency} onChange={(e) => setAddItemForm({...addItemForm, currency: e.target.value})}>
                <option value="GEL">GEL</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <div style={formGroupStyle}>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>რაოდენობა (Qty)</label>
              <input 
                type="number" min="1" required style={inputStyle} placeholder="1" 
                value={addItemForm.qtyTotal} onChange={(e) => setAddItemForm({...addItemForm, qtyTotal: e.target.value})}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>ჯამური ღირებულება (ავტომატური)</label>
              <input 
                type="text" disabled style={{ ...inputStyle, opacity: 0.7 }} 
                value={`${(Number(addItemForm.price || 0) * Number(addItemForm.qtyTotal || 1)).toLocaleString()} ${addItemForm.currency}`} 
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "15px" }}>
            <div style={formGroupStyle}>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>მდგომარეობა</label>
              <select style={inputStyle} value={addItemForm.condition} onChange={(e) => setAddItemForm({...addItemForm, condition: e.target.value})}>
                <option value="NEW">NEW (ახალი)</option>
                <option value="GOOD">GOOD (კარგი)</option>
                <option value="FAIR">FAIR (საშუალო)</option>
                <option value="POOR">POOR (ცუდი)</option>
              </select>
            </div>

            <div style={formGroupStyle}>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>მინიმალური ნაშთის ზღვარი</label>
              <input 
                type="number" min="1" required style={inputStyle}
                value={addItemForm.minStockThreshold} onChange={(e) => setAddItemForm({...addItemForm, minStockThreshold: e.target.value})}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "15px" }}>
            <div style={formGroupStyle}>
              <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>ექსპლუატაციის ტიპი</label>
              <select style={inputStyle} value={addItemForm.expiry} onChange={(e) => setAddItemForm({...addItemForm, expiry: e.target.value})}>
                <option value="უვადო">უვადო</option>
                <option value="ვადით">ექსპლუატაციის ვადით</option>
              </select>
            </div>

            {addItemForm.expiry === 'ვადით' && (
              <div style={formGroupStyle}>
                <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>ექსპლუატაციის ვადა (Expiry Date)</label>
                <input 
                  type="date" required style={inputStyle}
                  value={addItemForm.expiryDate} onChange={(e) => setAddItemForm({...addItemForm, expiryDate: e.target.value})}
                />
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
            <button type="button" onClick={onClose} style={{ backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>გაუქმება</button>
            <button type="submit" style={{ backgroundColor: "#22d3ee", border: "none", color: "#0f172a", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>ბაზაში შეტანა</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
