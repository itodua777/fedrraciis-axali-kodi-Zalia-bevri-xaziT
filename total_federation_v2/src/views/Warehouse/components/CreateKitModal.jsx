import React from 'react';

const CreateKitModal = ({ isOpen, onClose, onCreateKitConfirm, items }) => {
  const [createKitForm, setCreateKitForm] = React.useState({
    name: '',
    qr: '',
    items: [{ itemId: '', qty: 1 }]
  });

  React.useEffect(() => {
    if (isOpen) {
      setCreateKitForm({
        name: '',
        qr: '',
        items: [{ itemId: '', qty: 1 }]
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateKit = (e) => {
    e.preventDefault();
    if (!createKitForm.name || !createKitForm.qr) {
      alert('გთხოვთ შეავსოთ კომპლექტის სახელი და კოდი!');
      return;
    }

    const validItems = createKitForm.items.filter(it => it.itemId && it.qty > 0);
    if (validItems.length === 0) {
      alert('კომპლექტში უნდა იყოს მინიმუმ ერთი ნივთი!');
      return;
    }

    onCreateKitConfirm({
      name: createKitForm.name,
      qr: createKitForm.qr,
      items: validItems.map(it => ({ itemId: it.itemId, qty: Number(it.qty) }))
    });
  };

  const addKitComponentRow = () => {
    setCreateKitForm(prev => ({
      ...prev,
      items: [...prev.items, { itemId: '', qty: 1 }]
    }));
  };

  const removeKitComponentRow = (index) => {
    setCreateKitForm(prev => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index)
    }));
  };

  const updateKitComponent = (index, field, value) => {
    setCreateKitForm(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
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
          <h3 style={{ margin: 0, color: "#fff" }}>
            <i className="fa-solid fa-boxes-packing" style={{ color: "#f59e0b", marginRight: "10px" }}></i>
            კომპლექტის შეკვრის მოდული
          </h3>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "20px" }}><i className="fa-solid fa-xmark"></i></button>
        </div>

        <form onSubmit={handleCreateKit}>
          <div style={formGroupStyle}>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>კომპლექტის დასახელება</label>
            <input 
              type="text" required style={inputStyle} placeholder="მაგ. სამაშველო ნაკრები - ალპური A" 
              value={createKitForm.name} onChange={(e) => setCreateKitForm({ ...createKitForm, name: e.target.value })}
            />
          </div>

          <div style={formGroupStyle}>
            <label style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>საინვენტარო კოდი (Kit QR/Code)</label>
            <input 
              type="text" required style={inputStyle} placeholder="მაგ. KIT-ALPHA-01" 
              value={createKitForm.qr} onChange={(e) => setCreateKitForm({ ...createKitForm, qr: e.target.value })}
            />
          </div>

          <div style={{ ...formGroupStyle, border: "1px solid rgba(255,255,255,0.06)", padding: "15px", borderRadius: "8px", backgroundColor: "rgba(0,0,0,0.15)" }}>
            <label style={{ fontSize: "12px", color: "#22d3ee", fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              შემადგენელი კომპონენტები
              <button 
                type="button" onClick={addKitComponentRow}
                style={{ backgroundColor: "rgba(34, 211, 238, 0.1)", border: "1px solid rgba(34, 211, 238, 0.3)", color: "#22d3ee", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}
              >
                + ნივთის დამატება
              </button>
            </label>

            {createKitForm.items.map((row, idx) => (
              <div key={idx} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                <select 
                  required style={{ ...inputStyle, flex: 2, fontSize: "12px" }}
                  value={row.itemId} onChange={(e) => updateKitComponent(idx, 'itemId', e.target.value)}
                >
                  <option value="">-- აირჩიეთ ნივთი საწყობიდან --</option>
                  {items.map(i => (
                    <option key={i.id} value={i.id}>{i.name.replace('\n', ' ')} (მარაგი: {i.qtyLeft})</option>
                  ))}
                </select>

                <input 
                  type="number" min="1" required style={{ ...inputStyle, width: "70px", fontSize: "12px", textAlign: "center" }}
                  placeholder="რაოდ." value={row.qty} onChange={(e) => updateKitComponent(idx, 'qty', Number(e.target.value))}
                />

                {createKitForm.items.length > 1 && (
                  <button 
                    type="button" onClick={() => removeKitComponentRow(idx)}
                    style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", padding: "8px 12px", borderRadius: "8px", cursor: "pointer" }}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
            <button type="button" onClick={onClose} style={{ backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>გაუქმება</button>
            <button type="submit" style={{ backgroundColor: "#22d3ee", border: "none", color: "#0f172a", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>კომპლექტის შექმნა</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateKitModal;
