import React from 'react';

const WarehouseKits = ({ bundles, items, openCheckout, setIsCreateKitOpen }) => {
  return (
    <div style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", border: "1px solid color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", borderRadius: "12px", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ margin: 0, color: "#fff" }}>საოპერაციო კომპლექტები (Kit Bundles)</h3>
        <button 
          onClick={() => setIsCreateKitOpen(true)}
          style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", color: "#f59e0b", padding: "10px 20px", borderRadius: "20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", transition: "all 0.3s" }}
        >
          <i className="fa-solid fa-boxes-packing"></i> + კომპლექტის შეკვრა
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "25px" }}>
        {bundles.map((bundle) => {
          let componentsLowStock = false;
          bundle.items.forEach(comp => {
            const whItem = items.find(i => i.id === comp.itemId);
            if (!whItem || whItem.qtyLeft < comp.qty) {
              componentsLowStock = true;
            }
          });

          return (
            <div key={bundle.id} style={{ backgroundColor: "rgba(30, 41, 59, 0.4)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "10px", padding: "3px 8px", backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", borderRadius: "4px", fontWeight: "bold" }}>BUNDLE</span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}><i className="fa-solid fa-qrcode"></i> {bundle.qr}</span>
              </div>

              <h4 style={{ margin: 0, color: "#fff", fontSize: "16px" }}>{bundle.name}</h4>

              <div style={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "12px", fontSize: "12px" }}>
                <div style={{ fontWeight: "bold", color: "rgba(255,255,255,0.5)", marginBottom: "8px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "4px" }}>შემადგენლობა:</div>
                <ul style={{ margin: 0, paddingLeft: "15px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {bundle.items.map((comp, cIdx) => {
                    const whItem = items.find(i => i.id === comp.itemId);
                    return (
                      <li key={cIdx} style={{ color: "#fff" }}>
                        {comp.qty}x <span style={{ color: "rgba(255,255,255,0.8)" }}>{whItem ? whItem.name.replace('\n', ' ') : 'უცნობი ნივთი'}</span>
                        <span style={{ color: whItem && whItem.qtyLeft < comp.qty ? "#ef4444" : "#10b981", fontSize: "10px", marginLeft: "8px" }}>
                          (საწყობში: {whItem ? whItem.qtyLeft : 0})
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div style={{ marginTop: "auto", paddingTop: "15px", display: "flex", justifyContent: "flex-end" }}>
                <button 
                  onClick={() => openCheckout(bundle, 'bundle')}
                  disabled={componentsLowStock}
                  style={{ 
                    backgroundColor: componentsLowStock ? "rgba(255,255,255,0.05)" : "var(--color-emerald-core)", 
                    color: componentsLowStock ? "rgba(255,255,255,0.3)" : "#0f172a", 
                    border: "none", 
                    padding: "8px 16px", 
                    borderRadius: "16px", 
                    fontSize: "13px", 
                    fontWeight: "bold", 
                    cursor: componentsLowStock ? "not-allowed" : "pointer" 
                  }}
                >
                  კომპლექტის გაცემა
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WarehouseKits;
