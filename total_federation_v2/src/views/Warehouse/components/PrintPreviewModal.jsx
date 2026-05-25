import React from 'react';

const PrintPreviewModal = ({ isOpen, onClose, transaction, onPrintTrigger }) => {
  React.useEffect(() => {
    // Disable background scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !transaction) return null;

  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return dateStr;
  };

  const parseComponents = (componentsStr, transactionQty) => {
    if (!componentsStr) return [];
    return componentsStr.split(',').map((part) => {
      const trimmed = part.trim();
      const match = trimmed.match(/^(\d+)x\s+(.+)$/);
      if (match) {
        return {
          name: match[2],
          qty: parseInt(match[1]) * transactionQty
        };
      }
      return { name: trimmed, qty: transactionQty };
    });
  };

  // Compute items list and total count
  let itemsList = [];
  let totalItemsCount = 0;

  if (transaction.type === 'bundle') {
    itemsList = parseComponents(transaction.components, transaction.qty || 1);
    totalItemsCount = itemsList.reduce((sum, i) => sum + i.qty, 0);
  } else {
    itemsList = [{
      name: transaction.itemName,
      qty: transaction.qty || 1
    }];
    totalItemsCount = transaction.qty || 1;
  }

  // Format protocol ID matching 'WH-2026-0525' format
  const getProtocolNumber = () => {
    const dateStr = transaction.issueDate || '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `WH-${parts[0]}-${parts[1]}${parts[2]}`;
    }
    return `WH-${transaction.id}`;
  };

  const modalOverlayStyle = {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(10, 15, 30, 0.85)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: "20px",
    backdropFilter: "blur(8px)"
  };

  const modalWrapperStyle = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "800px",
    maxHeight: "90vh",
    backgroundColor: "#1e293b",
    border: "1px solid color-mix(in oklab, var(--color-emerald-core) 30%, transparent)",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(0,230,118,0.1)",
    overflow: "hidden"
  };

  const modalHeaderStyle = {
    padding: "16px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.4)"
  };

  const previewAreaStyle = {
    padding: "30px",
    overflowY: "auto",
    flex: 1,
    backgroundColor: "#0f172a"
  };

  const paperSheetStyle = {
    backgroundColor: "#fff",
    color: "#000",
    padding: "40px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    borderRadius: "4px",
    width: "100%",
    maxWidth: "680px",
    margin: "0 auto",
    boxSizing: "border-box",
    fontFamily: "Sylfaen, 'DejaVu Sans', sans-serif"
  };

  const modalFooterStyle = {
    padding: "16px 24px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    backgroundColor: "rgba(15, 23, 42, 0.4)"
  };

  const printBtnStyle = {
    backgroundColor: "var(--color-emerald-core)",
    color: "#0f172a",
    border: "none",
    padding: "10px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s"
  };

  const closeBtnStyle = {
    backgroundColor: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "rgba(255,255,255,0.8)",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s"
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalWrapperStyle}>
        <div style={modalHeaderStyle}>
          <h3 style={{ margin: 0, color: "#fff", display: "flex", alignItems: "center", gap: "10px", fontSize: "16px" }}>
            <i className="fa-solid fa-file-invoice" style={{ color: "var(--color-emerald-core)" }}></i>
            ოქმის ბეჭდვის წინასწარი ნახვა
          </h3>
          <button 
            onClick={onClose} 
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "20px" }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div style={previewAreaStyle}>
          <div style={paperSheetStyle}>
            {/* Header section */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px", borderBottom: "2px solid #000", paddingBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img 
                  src="/logo.jpg" 
                  alt="Federation Logo" 
                  style={{ width: "65px", height: "65px", filter: "grayscale(100%)", objectFit: "contain" }} 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>ანტიგრავიტის ექსტრემალური</span>
                  <span style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>სპორტის ფედერაცია</span>
                </div>
              </div>
              <div style={{ textAlign: "right", fontSize: "12px" }}>
                <div style={{ fontWeight: "bold" }}>ოქმი #{getProtocolNumber()}</div>
                <div style={{ color: "#555", marginTop: "4px" }}>თარიღი: {formatDateDDMMYYYY(transaction.issueDate)}</div>
              </div>
            </div>

            {/* Central Block */}
            <div style={{ textAlign: "center", marginBottom: "25px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: "0 0 15px 0", letterSpacing: "0.5px" }}>ინვენტარის მიღება-ჩაბარების აქტი</h2>
              <p style={{ fontSize: "13px", lineHeight: "1.6", textAlign: "justify", margin: 0, textIndent: "15px" }}>
                წინამდებარე აქტით დასტურდება, რომ ფედერაციის მატერიალური საწყობიდან სპორტსმენმა/წევრმა: <strong>{transaction.athleteName}</strong> (ID: {transaction.athleteId}) ჩაიბარა {totalItemsCount} ნივთი კონკრეტული დასახელებებით (ქვემოთ ჩამოთვლილი ამუნიცია და აღჭურვილობა).
              </p>
            </div>

            {/* Items Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginTop: "20px", marginBottom: "30px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #000" }}>
                  <th style={{ border: "1px solid #000", padding: "8px", width: "40px", textAlign: "center" }}>№</th>
                  <th style={{ border: "1px solid #000", padding: "8px", textAlign: "left" }}>ნივთის დასახელება</th>
                  <th style={{ border: "1px solid #000", padding: "8px", width: "80px", textAlign: "center" }}>რაოდენობა</th>
                  <th style={{ border: "1px solid #000", padding: "8px", width: "140px", textAlign: "left" }}>სერიული ნომერი / ID</th>
                  <th style={{ border: "1px solid #000", padding: "8px", width: "120px", textAlign: "left" }}>დაბრუნების მაქსიმალური ვადა</th>
                </tr>
              </thead>
              <tbody>
                {itemsList.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #ccc" }}>
                    <td style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>{idx + 1}</td>
                    <td style={{ border: "1px solid #000", padding: "8px", fontWeight: "bold" }}>{item.name}</td>
                    <td style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>{item.qty}</td>
                    <td style={{ border: "1px solid #000", padding: "8px" }}>{transaction.itemCode || transaction.item_code || '—'}</td>
                    <td style={{ border: "1px solid #000", padding: "8px" }}>{formatDateDDMMYYYY(transaction.expectedReturnDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Signatures block */}
            <div style={{ marginTop: "60px", display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
              <div style={{ width: "240px" }}>
                <div style={{ marginBottom: "6px" }}>ჩამბარებელი (მენეჯერი):</div>
                <div style={{ borderBottom: "1px solid #000", height: "24px" }}></div>
              </div>
              <div style={{ width: "240px" }}>
                <div style={{ marginBottom: "6px" }}>მიმღები (სპორტსმენი):</div>
                <div style={{ borderBottom: "1px solid #000", height: "24px" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div style={modalFooterStyle}>
          <button 
            type="button" 
            onClick={onClose} 
            style={closeBtnStyle}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            დახურვა
          </button>
          <button 
            type="button" 
            onClick={() => onPrintTrigger(transaction)} 
            style={printBtnStyle}
            onMouseOver={(e) => e.currentTarget.style.filter = "brightness(1.1)"}
            onMouseOut={(e) => e.currentTarget.style.filter = "none"}
          >
            <i className="fa-solid fa-print"></i>
            ბეჭდვა
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintPreviewModal;
