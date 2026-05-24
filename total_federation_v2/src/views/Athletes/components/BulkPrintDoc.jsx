import React from '../../../utils/react-shim.js';
import ReactDOM from '../../../utils/react-dom-shim.js';
import { calculateAge } from '../../../utils/helpers.js';

const BulkPrintDoc = ({
  filteredAthletes,
  clubs,
  isPrintingBulk
}) => {
  if (!isPrintingBulk) return null;

  return ReactDOM.createPortal(
    <div className="bulk-print-doc print-only">
      <div className="bulk-print-header">
        <h1>ანტიგრავიტის ფედერაცია — სპორტსმენთა რეესტრი (გაფილტრული სია)</h1>
        <p>ბეჭდვის თარიღი: {new Date().toLocaleDateString('ka-GE')} | სულ: {filteredAthletes.length} ჩანაწერი</p>
      </div>
      <table className="bulk-print-table">
        <thead>
          <tr>
            <th>№</th>
            <th>სახელი / გვარი</th>
            <th>სპორტის სახეობა</th>
            <th>კლუბი</th>
            <th>სტატუსი</th>
            <th>ასაკი</th>
            <th>სისხლის ჯგუფი</th>
            <th>ასთმა</th>
            <th>დიაბეტი</th>
            <th>ალერგია</th>
          </tr>
        </thead>
        <tbody>
          {filteredAthletes.map((athlete, index) => {
            const clubName = athlete.clubName || (athlete.clubId ? (clubs?.find(c => String(c.id) === String(athlete.clubId))?.name || `კლუბი ID: #${athlete.clubId}`) : "");
            const hasClub = athlete.isClubMember && clubName;
            const age = calculateAge(athlete.birthDate);
            return (
              <tr key={athlete.id}>
                <td>{index + 1}</td>
                <td>{athlete.firstName} {athlete.lastName}</td>
                <td>{athlete.sportsDiscipline || "—"}</td>
                <td>{hasClub ? clubName : "—"}</td>
                <td>
                  {athlete.isFederationMember ? (
                    athlete.membershipStatus === 'Active' ? 'მოქმედი' :
                    athlete.membershipStatus === 'Suspended' ? 'შეჩერებული' :
                    athlete.membershipStatus === 'Terminated' ? 'შეწყვეტილი' :
                    athlete.membershipStatus === 'Deceased' ? 'გარდაცვლილი' : '—'
                  ) : 'არა-წევრი'}
                </td>
                <td>{age || "—"}</td>
                <td>{athlete.bloodType || "—"}</td>
                <td>{athlete.asthma ? "კი" : "არა"}</td>
                <td>{athlete.diabetes ? "კი" : "არა"}</td>
                <td>{athlete.allergies || "არ აქვს"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>,
    document.body
  );
};

export default BulkPrintDoc;
