import React from 'react';

const WarehouseTransactions = ({ transactions, openReturn }) => {
  const isExpired = (expiry) => {
    if (!expiry || expiry === "უვადო") return false;
    const expiryDate = new Date(expiry);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);
    return expiryDate < today;
  };

  return (
    <div style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", border: "1px solid color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", borderRadius: "12px", padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ margin: "0 0 15px 0", color: "#fff" }}>გაცემული ინვენტარის მატრიცა & რეესტრი</h3>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              <th style={{ padding: "12px" }}>კოდი</th>
              <th style={{ padding: "12px" }}>დასახელება</th>
              <th style={{ padding: "12px" }}>ტიპი / შემადგენლობა</th>
              <th style={{ padding: "12px" }}>პასუხისმგებელი პირი</th>
              <th style={{ padding: "12px" }}>გაცემა / დაბრუნება</th>
              <th style={{ padding: "12px" }}>რაოდენობა</th>
              <th style={{ padding: "12px" }}>სტატუსი</th>
              <th style={{ padding: "12px", textAlign: "right" }}>მოქმედება</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trans) => {
              const overdue = isExpired(trans.expectedReturnDate) && trans.status === 'issued';

              return (
                <tr 
                  key={trans.id} 
                  style={{ 
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    backgroundColor: overdue ? "rgba(239, 68, 68, 0.04)" : "transparent",
                    boxShadow: overdue ? "inset 0 0 10px rgba(239, 68, 68, 0.1)" : "none",
                    borderLeft: overdue ? "3px solid #ef4444" : "none"
                  }}
                >
                  <td style={{ padding: "12px", fontWeight: "bold", color: "var(--color-emerald-core)" }}>{trans.itemCode}</td>
                  <td style={{ padding: "12px", color: "#fff", fontWeight: "bold" }}>{trans.itemName}</td>
                  <td style={{ padding: "12px", color: "rgba(255,255,255,0.6)", fontSize: "11px" }}>
                    {trans.type === 'bundle' ? (
                      <div>
                        <strong style={{ color: "#f59e0b" }}>კომპლექტი:</strong><br />
                        {trans.components}
                      </div>
                    ) : 'ინდივიდუალური'}
                  </td>
                  <td style={{ padding: "12px", color: "#fff" }}>
                    <i className="fa-solid fa-user-shield" style={{ color: "rgba(255,255,255,0.4)", marginRight: "6px" }}></i>
                    {trans.athleteName}
                  </td>
                  <td style={{ padding: "12px", fontSize: "11px" }}>
                    <div>გაცემული: {trans.issueDate}</div>
                    <div style={{ color: overdue ? "#ef4444" : "rgba(255,255,255,0.5)", fontWeight: overdue ? "bold" : "normal" }}>
                      ვადა: {trans.expectedReturnDate} {overdue && " (გადაცილებული!)"}
                    </div>
                    {trans.returnDate && (
                      <div style={{ color: "#10b981" }}>
                        დაბრუნებული: {trans.returned_at ? trans.returned_at.replace('T', ' ').substring(0, 19) : trans.returnDate}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "12px" }}>{trans.qty || 1} ც</td>
                  <td style={{ padding: "12px" }}>
                    {trans.status === 'issued' ? (
                      <span style={{ backgroundColor: overdue ? "rgba(239, 68, 68, 0.15)" : "rgba(245, 158, 11, 0.15)", border: `1px solid ${overdue ? "#ef4444" : "#f59e0b"}`, color: overdue ? "#ef4444" : "#f59e0b", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>
                        {overdue ? "ვადაგადაცილებული" : "გაცემული"}
                      </span>
                    ) : (
                      <span style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", color: "#10b981", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>
                        დაბრუნებული {trans.isDamaged && "(დაზიანებული)"}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px", textAlign: "right" }}>
                    {trans.status === 'issued' ? (
                      <button 
                        onClick={() => openReturn(trans)}
                        style={{ backgroundColor: "#10b981", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", transition: "all 0.2s" }}
                      >
                        დაბრუნება
                      </button>
                    ) : (
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarehouseTransactions;
