import React from 'react';
import ReactDOM from '../../../utils/react-dom-shim.js';

const WarehousePrintPortals = ({
  activePrintDoc,
  lastIssuedTransaction,
  printTransaction,
  prePrintFilteredInflows,
  prePrintFilteredDisposals,
  prePrintStartDate,
  prePrintEndDate,
  prePrintCategory,
  prePrintAthlete,
  prePrintReason,
  receivedTotalGELForLedger,
  disposalsTotalGELForLedger
}) => {
  if (!activePrintDoc) return null;

  const transaction = printTransaction || lastIssuedTransaction;

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

  const getItemsList = (tx) => {
    if (!tx) return [];
    if (tx.type === 'bundle') {
      return parseComponents(tx.components, tx.qty || 1);
    }
    return [{ name: tx.itemName, qty: tx.qty || 1 }];
  };

  const getTotalItemsCount = (tx) => {
    if (!tx) return 0;
    return getItemsList(tx).reduce((sum, i) => sum + i.qty, 0);
  };

  const getProtocolNumber = (tx) => {
    if (!tx) return '';
    const dateStr = tx.issueDate || tx.issue_date || '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `WH-${parts[0]}-${parts[1]}${parts[2]}`;
    }
    return `WH-${tx.id}`;
  };

  const printableAccountingDoc = (
    <div className="warehouse-print-doc" style={{ padding: "40px", fontFamily: "DejaVu Sans, Sylfaen, sans-serif", color: "#000", backgroundColor: "#fff" }}>
      <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "2px solid #000", paddingBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", margin: "0 0 10px 0", fontWeight: "bold" }}>ანტიგრავიტის ექსტრემალური სპორტის ფედერაცია</h1>
        <h2 style={{ fontSize: "18px", margin: "0 0 10px 0" }}>საწყობის ბუღალტრული მიღებისა და ჩამოწერის უწყისი</h2>
        <div style={{ fontSize: "12px", color: "#444" }}>
          ბეჭდვის თარიღი: {new Date().toLocaleDateString('ka-GE')} {new Date().toLocaleTimeString('ka-GE')}
        </div>
      </div>

      <div style={{ marginBottom: "25px", fontSize: "13px", border: "1px solid #ddd", padding: "12px", borderRadius: "6px", backgroundColor: "#f9f9f9" }}>
        <h3 style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>ფილტრაციის პარამეტრები:</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div><strong>პერიოდი:</strong> {prePrintStartDate || 'დასაწყისი'} — {prePrintEndDate || 'დღემდე'}</div>
          <div><strong>კატეგორია:</strong> {prePrintCategory === 'all' ? 'ყველა' : prePrintCategory}</div>
          <div><strong>პასუხისმგებელი პირი:</strong> {prePrintAthlete ? `${prePrintAthlete.firstName} ${prePrintAthlete.lastName}` : 'ყველა'}</div>
          <div><strong>ჩამოწერის საფუძველი:</strong> {prePrintReason === 'all' ? 'ყველა' : prePrintReason}</div>
        </div>
      </div>

      <div style={{ marginBottom: "35px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "6px", marginBottom: "12px" }}>
          1. მიღებული ინვენტარი (პარტიები)
        </h3>
        {prePrintFilteredInflows.length === 0 ? (
          <p style={{ fontStyle: "italic", fontSize: "13px", color: "#666" }}>მითითებული ფილტრებით მიღებული ინვენტარი არ იძებნება.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2", borderBottom: "1px solid #000" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>თარიღი</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>კოდი (QR/Serial)</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>დასახელება</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>კატეგორია</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>მიმწოდებელი</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>რაოდ.</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>ერთ. ფასი</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>ჯამური ფასი</th>
              </tr>
            </thead>
            <tbody>
              {prePrintFilteredInflows.map((item) => (
                <tr key={item.id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.inflowDate}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.qr}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.name.replace('\n', ' ')}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.category}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.supplier}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{item.qtyTotal}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{item.price} {item.currency}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", fontWeight: "bold" }}>{(item.qtyTotal * item.price).toLocaleString()} {item.currency}</td>
                </tr>
              ))}
              <tr style={{ backgroundColor: "#fafafa", fontWeight: "bold", borderTop: "1px solid #000" }}>
                <td colSpan="5" style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>ჯამური ღირებულება (GEL):</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                  {prePrintFilteredInflows.reduce((sum, item) => sum + item.qtyTotal, 0)}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}></td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", color: "#10b981" }}>
                  {receivedTotalGELForLedger.toLocaleString()} GEL
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "6px", marginBottom: "12px" }}>
          2. ჩამოწერილი და დაზიანებული აქტივები (ფინანსური ზარალი)
        </h3>
        {prePrintFilteredDisposals.length === 0 ? (
          <p style={{ fontStyle: "italic", fontSize: "13px", color: "#666" }}>მითითებულ პერიოდში ჩამოწერილი/დაზიანებული აქტივები არ იძებნება.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2", borderBottom: "1px solid #000" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>თარიღი</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>კოდი</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>დასახელება</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>პასუხისმგებელი</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>რაოდ.</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>ზარალი (GEL)</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>დაზიანების მიზეზი (პროტოკოლი)</th>
              </tr>
            </thead>
            <tbody>
              {prePrintFilteredDisposals.map((item) => (
                <tr key={item.id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.date.substring(0, 10)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.code}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.name.replace('\n', ' ')}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.athleteName || "საწყობი"}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{item.qty}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", fontWeight: "bold" }}>{item.totalPrice.toLocaleString()} GEL</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", color: "#d97706" }}>{item.reason}</td>
                </tr>
              ))}
              <tr style={{ backgroundColor: "#fafafa", fontWeight: "bold", borderTop: "1px solid #000" }}>
                <td colSpan="4" style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>ჯამური ფინანსური ზარალი (GEL):</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                  {prePrintFilteredDisposals.reduce((sum, item) => sum + item.qty, 0)}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", color: "#dc2626" }}>
                  {disposalsTotalGELForLedger.toLocaleString()} GEL
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: "60px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
        <div style={{ width: "200px", textAlign: "center" }}>
          <div style={{ borderBottom: "1px solid #000", paddingBottom: "40px" }}></div>
          <div style={{ marginTop: "8px" }}>საწყობის მენეჯერი</div>
        </div>
        <div style={{ width: "200px", textAlign: "center" }}>
          <div style={{ borderBottom: "1px solid #000", paddingBottom: "40px" }}></div>
          <div style={{ marginTop: "8px" }}>მთავარი ბუღალტერი</div>
        </div>
      </div>
    </div>
  );

  const printableHandoverAct = lastIssuedTransaction ? (
    <div className="warehouse-print-doc" style={{ padding: "40px", fontFamily: "DejaVu Sans, Sylfaen, sans-serif", color: "#000", backgroundColor: "#fff" }}>
      <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "2px solid #000", paddingBottom: "20px" }}>
        <h1 style={{ fontSize: "22px", margin: "0 0 10px 0", fontWeight: "bold" }}>ანტიგრავიტის ექსტრემალური სპორტის ფედერაცია</h1>
        <h2 style={{ fontSize: "16px", margin: "0 0 10px 0" }}>მატერიალური ფასეულობების მიღება-ჩაბარების აქტი</h2>
        <div style={{ fontSize: "12px", color: "#444" }}>
          დოკუმენტის ნომერი: {lastIssuedTransaction.id} | თარიღი: {lastIssuedTransaction.issueDate}
        </div>
      </div>

      <div style={{ marginBottom: "25px", fontSize: "13px", border: "1px solid #ddd", padding: "12px", borderRadius: "6px", backgroundColor: "#f9f9f9" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div><strong>მიმღები (პასუხისმგებელი პირი):</strong> {lastIssuedTransaction.athleteName} (ID: {lastIssuedTransaction.athleteId})</div>
          <div><strong>ღონისძიება/ექსპედიცია:</strong> {lastIssuedTransaction.expeditionName || 'მიუთითებელი'}</div>
          <div><strong>გაცემის თარიღი:</strong> {lastIssuedTransaction.issueDate}</div>
          <div><strong>დაბრუნების სავალდებულო თარიღი:</strong> <span style={{ textDecoration: "underline", fontWeight: "bold" }}>{lastIssuedTransaction.expectedReturnDate}</span></div>
        </div>
      </div>

      <div style={{ marginBottom: "35px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "6px", marginBottom: "12px" }}>
          გაცემული ინვენტარის ჩამონათვალი
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2", borderBottom: "1px solid #000" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>საინვენტარო კოდი (QR/Serial)</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>დასახელება</th>
              <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>რაოდენობა</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>შენიშვნა</th>
            </tr>
          </thead>
          <tbody>
            {lastIssuedTransaction.type === 'item' ? (
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{lastIssuedTransaction.itemCode}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{lastIssuedTransaction.itemName}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{lastIssuedTransaction.qty}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>პირდაპირი გაცემა</td>
              </tr>
            ) : (
              <tr>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{lastIssuedTransaction.itemCode}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <strong>{lastIssuedTransaction.itemName}</strong>
                  <div style={{ fontSize: "10px", color: "#555", marginTop: "4px" }}>
                    შემადგენლობა: {lastIssuedTransaction.components}
                  </div>
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{lastIssuedTransaction.qty}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>კომპლექტის გაცემა</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "80px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
        <div>ჩააბარა (ლოჯისტიკის მენეჯერი): __________________</div>
        <div>მიიღო (პასუხისმგებელი პირი): __________________</div>
      </div>
    </div>
  ) : null;

  const printableDisposalDoc = (
    <div className="warehouse-print-doc" style={{ padding: "40px", fontFamily: "DejaVu Sans, Sylfaen, sans-serif", color: "#000", backgroundColor: "#fff" }}>
      <div style={{ textAlign: "center", marginBottom: "30px", borderBottom: "2px solid #000", paddingBottom: "20px" }}>
        <h1 style={{ fontSize: "22px", margin: "0 0 10px 0", fontWeight: "bold" }}>ანტიგრავიტის ფედერაცია — ჩამოწერილი აქტივების რეესტრი</h1>
        <div style={{ fontSize: "12px", color: "#444" }}>
          ბეჭდვის თარიღი: {new Date().toLocaleDateString('ka-GE')} {new Date().toLocaleTimeString('ka-GE')}
        </div>
      </div>

      <div style={{ marginBottom: "25px", fontSize: "13px", border: "1px solid #ddd", padding: "12px", borderRadius: "6px", backgroundColor: "#f9f9f9" }}>
        <h3 style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>ფილტრაციის პარამეტრები:</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div><strong>პერიოდი:</strong> {prePrintStartDate || 'დასაწყისი'} — {prePrintEndDate || 'დღემდე'}</div>
          <div><strong>კატეგორია:</strong> {prePrintCategory === 'all' ? 'ყველა' : prePrintCategory}</div>
          <div><strong>პასუხისმგებელი პირი:</strong> {prePrintAthlete ? `${prePrintAthlete.firstName} ${prePrintAthlete.lastName}` : 'ყველა'}</div>
          <div><strong>ჩამოწერის საფუძველი:</strong> {prePrintReason === 'all' ? 'ყველა' : prePrintReason}</div>
        </div>
      </div>

      <div style={{ marginBottom: "35px" }}>
        {prePrintFilteredDisposals.length === 0 ? (
          <p style={{ fontStyle: "italic", fontSize: "13px", color: "#666" }}>ჩამოწერილი აქტივები არ იძებნება.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2", borderBottom: "1px solid #000" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>საინვენტარო კოდი</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>ნივთის დასახელება</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>ჩამოწერის მიზეზი</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>ერთეულის ფასი</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>რაოდ.</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>ჯამური ფასი</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>ჩამოწერის ზუსტი თარიღი/დრო</th>
              </tr>
            </thead>
            <tbody>
              {prePrintFilteredDisposals.map((item) => (
                <tr key={item.id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.code}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.name.replace('\n', ' ')}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.reason}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{item.price.toLocaleString()} GEL</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>{item.qty}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", fontWeight: "bold" }}>{item.totalPrice.toLocaleString()} GEL</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.date}</td>
                </tr>
              ))}
              <tr style={{ backgroundColor: "#fafafa", fontWeight: "bold", borderTop: "1px solid #000" }}>
                <td colSpan="3" style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>ჯამური ზარალი:</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}></td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "center" }}>
                  {prePrintFilteredDisposals.reduce((sum, item) => sum + item.qty, 0)}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right", color: "#dc2626" }}>
                  {prePrintFilteredDisposals.reduce((sum, item) => sum + item.totalPrice, 0).toLocaleString()} GEL
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}></td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: "60px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
        <div>საწყობის მენეჯერი: __________</div>
        <div>მთავარი ბუღალტერი: __________</div>
      </div>
    </div>
  );

  const printableInvoiceDoc = transaction ? (
    <div className="warehouse-print-doc" style={{ padding: "40px", fontFamily: "DejaVu Sans, Sylfaen, sans-serif", color: "#000", backgroundColor: "#fff" }}>
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
          <div style={{ fontWeight: "bold" }}>ოქმი #{getProtocolNumber(transaction)}</div>
          <div style={{ color: "#555", marginTop: "4px" }}>თარიღი: {formatDateDDMMYYYY(transaction.issueDate)}</div>
        </div>
      </div>

      {/* Central Block */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: "0 0 15px 0", letterSpacing: "0.5px" }}>ინვენტარის მიღება-ჩაბარების აქტი</h2>
        <p style={{ fontSize: "13px", lineHeight: "1.6", textAlign: "justify", margin: 0, textIndent: "15px" }}>
          წინამდებარე აქტით დასტურდება, რომ ფედერაციის მატერიალური საწყობიდან სპორტსმენმა/წევრმა: <strong>{transaction.athleteName}</strong> (ID: {transaction.athleteId}) ჩაიბარა {getTotalItemsCount(transaction)} ნივთი კონკრეტული დასახელებებით (ქვემოთ ჩამოთვლილი ამუნიცია და აღჭურვილობა).
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
          {getItemsList(transaction).map((item, idx) => (
            <tr key={idx} style={{ borderBottom: "1px solid #000" }}>
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
  ) : null;

  return (
    <>
      {activePrintDoc === 'disposal' && ReactDOM.createPortal(printableDisposalDoc, document.body)}
      {activePrintDoc === 'ledger' && ReactDOM.createPortal(printableAccountingDoc, document.body)}
      {activePrintDoc === 'handover' && ReactDOM.createPortal(printableHandoverAct, document.body)}
      {activePrintDoc === 'invoice' && ReactDOM.createPortal(printableInvoiceDoc, document.body)}
    </>
  );
};

export default WarehousePrintPortals;
