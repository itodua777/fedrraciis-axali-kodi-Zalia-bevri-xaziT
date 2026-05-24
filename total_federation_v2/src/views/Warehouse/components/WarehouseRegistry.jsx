import React from 'react';
import BrandSearchIcon from '../../../components/ui/BrandSearchIcon.jsx';

const WarehouseRegistry = ({
  items,
  unifiedRegistryList,
  filteredItems,
  registryViewType,
  setRegistryViewType,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  setIsAddItemOpen
}) => {
  const [searchFocused, setSearchFocused] = React.useState(false);

  const isExpired = (expiry) => {
    if (!expiry || expiry === "უვადო") return false;
    const expiryDate = new Date(expiry);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);
    return expiryDate < today;
  };

  const inputStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px", padding: "10px 14px", color: "#fff", outline: "none", fontSize: "14px"
  };

  return (
    <div style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(34, 211, 238, 0.1)", borderRadius: "12px", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", gap: "15px", flexWrap: "wrap" }}>
        <div style={{ 
          backgroundColor: "rgba(255,255,255,0.03)", 
          border: searchFocused ? "1px solid #22d3ee" : "1px solid rgba(255,255,255,0.1)", 
          borderRadius: "20px", 
          padding: "8px 20px", 
          display: "flex", 
          alignItems: "center", 
          gap: "10px", 
          width: "320px",
          boxShadow: searchFocused ? "0 0 10px rgba(34, 211, 238, 0.2)" : "none",
          transition: "all 0.3s"
        }}>
          <BrandSearchIcon 
            isFocused={searchFocused || !!searchQuery} 
            size={16}
          />
          <input 
            type="text" 
            placeholder="ძებნა დასახელებით ან QR-ით..."
            style={{ background: "none", border: "none", color: "#fff", outline: "none", fontSize: "14px", width: "100%" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select 
            style={{ ...inputStyle, borderRadius: "20px", padding: "8px 16px" }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">ყველა კატეგორია</option>
            <option value="ალპინისტური">ალპინისტური</option>
            <option value="საბანაკე">საბანაკე</option>
          </select>

          <select 
            style={{ ...inputStyle, borderRadius: "20px", padding: "8px 16px" }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">ყველა სტატუსი</option>
            <option value="ვარგისი">ვარგისი</option>
            <option value="ვადაგასული">ვადაგასული</option>
            <option value="დაზიანებული">დაზიანებული</option>
            <option value="low_stock">📉 შესასყიდია</option>
          </select>

          <button 
            onClick={() => setRegistryViewType(prev => prev === 'card' ? 'table' : 'card')}
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", fontSize: "13px", transition: "all 0.3s", marginRight: "10px" }}
          >
            {registryViewType === 'card' ? <><i className="fa-solid fa-list"></i> ცხრილი</> : <><i className="fa-solid fa-table-cells"></i> ბარათები</>}
          </button>

          <button 
            onClick={() => setIsAddItemOpen(true)}
            style={{ backgroundColor: "#22d3ee", color: "#0f172a", border: "none", padding: "10px 20px", borderRadius: "20px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.3s" }}
          >
            <i className="fa-solid fa-plus"></i> ნივთის დამატება
          </button>
        </div>
      </div>

      {registryViewType === 'card' ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" }}>
          {filteredItems.map((item) => {
            const expired = isExpired(item.expiry);
            const lowStock = item.qtyLeft < item.minStockThreshold;

            return (
              <div key={item.id} style={{ backgroundColor: "rgba(30, 41, 59, 0.4)", border: `1px solid ${expired ? "rgba(239, 68, 68, 0.3)" : lowStock ? "rgba(245, 158, 11, 0.3)" : "rgba(255,255,255,0.05)"}`, borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", position: "relative", transition: "all 0.3s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <span style={{ fontSize: "10px", padding: "3px 8px", backgroundColor: "rgba(34, 211, 238, 0.1)", color: "#22d3ee", borderRadius: "4px", fontWeight: "bold" }}>{item.category}</span>

                  <div style={{ 
                    backgroundColor: expired ? "rgba(239, 68, 68, 0.15)" : item.status === 'დაზიანებული' ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
                    border: `1px solid ${expired ? "#ef4444" : item.status === 'დაზიანებული' ? "#f59e0b" : "#10b981"}`, 
                    color: expired ? "#ef4444" : item.status === 'დაზიანებული' ? "#f59e0b" : "#10b981", 
                    padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" 
                  }}>
                    <i className={expired ? "fa-solid fa-triangle-exclamation" : item.status === 'დაზიანებული' ? "fa-solid fa-heart-crack" : "fa-solid fa-circle-check"}></i>
                    {expired ? "ვადაგასული" : item.status}
                  </div>
                </div>

                <h3 style={{ margin: "0 0 5px 0", color: "#fff", fontSize: "17px", minHeight: "48px", whiteSpace: "pre-wrap", lineHeight: "1.4" }}>
                  {item.name}
                </h3>

                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", display: "flex", alignItems: "center", gap: "5px", marginBottom: "18px" }}>
                  <i className="fa-solid fa-qrcode"></i> {item.qr}
                  {item.supplier && <span style={{ marginLeft: "10px" }}><i className="fa-solid fa-truck"></i> {item.supplier}</span>}
                </div>

                {expired && (
                  <div style={{ padding: "8px 12px", backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "6px", color: "#ef4444", fontSize: "11px", fontWeight: "bold", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <i className="fa-solid fa-radiation animate-spin"></i> ⚠️ ნივთის გამოყენება სიცოცხლისთვის საშიშია!
                  </div>
                )}

                {lowStock && !expired && (
                  <div style={{ padding: "6px 12px", backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "6px", color: "#f59e0b", fontSize: "11px", fontWeight: "bold", marginBottom: "15px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <i className="fa-solid fa-circle-down"></i> 📉 შესასყიდია (ზღვარი: {item.minStockThreshold} ცალი)
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "12px", marginBottom: "15px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>რაოდენობა:</span>
                    <span style={{ backgroundColor: lowStock ? "rgba(245, 158, 11, 0.2)" : "#fff", color: lowStock ? "#f59e0b" : "#0f172a", padding: "2px 10px", borderRadius: "12px", fontWeight: "bold", fontSize: "12px" }}>
                      {item.qtyLeft} / {item.qtyTotal}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>ფასი:</span>
                    <span style={{ color: "#fff", fontWeight: "bold" }}>{item.price} {item.currency}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>ექსპლუატაციის ვადა:</span>
                    <span style={{ color: expired ? "#ef4444" : "#fff", fontWeight: "bold" }}>{item.expiry}</span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                    მდგომარეობა: <strong style={{ color: "#22d3ee" }}>{item.condition}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", height: "40px" }}>
                <th style={{ padding: "12px" }}>საინვენტარო კოდი</th>
                <th style={{ padding: "12px" }}>დასახელება</th>
                <th style={{ padding: "12px" }}>ტიპი / კომპლექტი</th>
                <th style={{ padding: "12px" }}>პასუხისმგებელი პირი</th>
                <th style={{ padding: "12px" }}>სტატუსი</th>
              </tr>
            </thead>
            <tbody>
              {unifiedRegistryList.map((row) => (
                <tr 
                  key={row.id} 
                  style={{ 
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    backgroundColor: row.hasOverdue ? "rgba(239, 68, 68, 0.04)" : "transparent",
                    borderLeft: row.hasOverdue ? "3px solid #ef4444" : "none"
                  }}
                >
                  <td style={{ padding: "12px", fontWeight: "bold", color: "#22d3ee" }}>{row.qr}</td>
                  <td style={{ padding: "12px", color: "#fff", fontWeight: "bold", whiteSpace: "pre-wrap" }}>{row.name}</td>
                  <td style={{ padding: "12px", color: "rgba(255,255,255,0.6)" }}>{row.type}</td>
                  <td style={{ padding: "12px", color: row.hasOverdue ? "#ef4444" : "#fff", fontWeight: row.hasOverdue ? "bold" : "normal" }}>
                    {row.responsiblePerson}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ 
                      backgroundColor: row.statusBg, 
                      border: `1px solid ${row.statusColor}`, 
                      color: row.statusColor, 
                      padding: "3px 10px", 
                      borderRadius: "12px", 
                      fontSize: "11px", 
                      fontWeight: "bold" 
                    }}>
                      {row.statusText}
                    </span>
                  </td>
                </tr>
              ))}
              {unifiedRegistryList.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: "20px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
                    ინვენტარი არ იძებნება
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WarehouseRegistry;
