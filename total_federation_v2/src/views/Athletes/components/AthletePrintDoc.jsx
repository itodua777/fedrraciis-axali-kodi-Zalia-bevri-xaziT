import React from 'react';
import ReactDOM from '../../../utils/react-dom-shim.js';
import { calculateAge, getCountryName } from '../../../utils/helpers.js';

const AthletePrintDoc = ({ athlete, clubs }) => {
  if (!athlete) return null;

  const age = calculateAge(athlete.birthDate);
  const ageText = age !== '' ? `, ${age} წლის` : '';
  const countryName = getCountryName(athlete.nationality);
  const isAsthmaActive = (athlete.asthma === true || athlete.asthma === 'true' || athlete.asthma === 'კი' || athlete.asthma === 'yes');
  const isDiabetesActive = (athlete.diabetes === true || athlete.diabetes === 'true' || athlete.diabetes === 'კი' || athlete.diabetes === 'yes');
  const heightWeightText = `${athlete.height ? `${athlete.height} სმ` : '-'} / ${athlete.weight ? `${athlete.weight} კგ` : '-'}`;

  const printableHandoverAct = (
    <div className="athlete-print-doc print-only">
      <div className="print-header">
        <h1>სპორტსმენის ოფიციალური ბარათი</h1>
        <p>საქართველოს ალპინიზმის ეროვნული ფედერაცია</p>
      </div>

      <div className="print-section">
        <div className="print-section-title">ბიოგრაფიული მონაცემები</div>
        <div className="print-bio-row">
          {athlete.photo && (
            <img src={athlete.photo} className="print-avatar" alt="Profile" />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>
              {athlete.firstName} {athlete.lastName}
            </div>
            <div className="print-grid">
              <div className="print-field"><strong>მოქალაქეობა:</strong> {countryName || 'საქართველო'}</div>
              <div className="print-field"><strong>დაბადების თარიღი:</strong> {athlete.birthDate || '-'} {ageText}</div>
              <div className="print-field"><strong>ტელეფონი:</strong> {athlete.phone || '-'}</div>
              <div className="print-field"><strong>ელ-ფოსტა:</strong> {athlete.email || '-'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="print-section">
        <div className="print-section-title">ფედერაციული სტატუსი & კლუბი</div>
        <div className="print-grid">
          <div className="print-field"><strong>სპორტის სახეობა:</strong> {athlete.sportsDiscipline || "მიუთითებელი"}</div>
          <div className="print-field"><strong>კლუბის წევრი:</strong> {athlete.isClubMember ? "კი" : "არა"}</div>
          {athlete.isClubMember && athlete.clubId && (
            <div className="print-field">
              <strong>კლუბი:</strong> {clubs?.find(c => String(c.id) === String(athlete.clubId))?.name || `ID: #${athlete.clubId}`}
            </div>
          )}
          <div className="print-field"><strong>ფედერაციის წევრი:</strong> {athlete.isFederationMember ? "კი" : "არა"}</div>
          {athlete.isFederationMember && (
            <>
              <div className="print-field">
                <strong>წევრობის სტატუსი:</strong> {
                  athlete.membershipStatus === 'Active' ? 'მოქმედი' :
                  athlete.membershipStatus === 'Suspended' ? 'შეჩერებული' :
                  athlete.membershipStatus === 'Terminated' ? 'შეწყვეტილი' :
                  athlete.membershipStatus === 'Deceased' ? `გარდაცვალება ${athlete.deathYear ? `(${athlete.deathYear})` : ''}` : '-'
                }
              </div>
              <div className="print-field"><strong>საწევრო გადასახადი:</strong> {athlete.membershipFeePaid ? "გადახდილი" : "გადაუხდელი"}</div>
              <div className="print-field"><strong>რეიტინგის ქულა:</strong> {athlete.referral ?? 0}</div>
              <div className="print-field">
                <strong>სტატუსები/როლები:</strong> {[
                  athlete.isFounder ? 'დამფუძნებელი' : null,
                  athlete.hasVotingRight ? 'ხმის უფლებით' : 'ხმის უფლების გარეშე',
                  athlete.isNationalTeamMember ? 'ეროვნული ნაკრები' : null,
                  athlete.isVeteran ? 'ვეტერანი' : null,
                  athlete.isMentor ? 'მენტორი' : null
                ].filter(Boolean).join(', ')}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="print-section">
        <div className="print-section-title">ფიზიკური და სამედიცინო მონაცემები</div>
        <div className="print-grid">
          <div className="print-field"><strong>სისხლის ჯგუფი:</strong> {athlete.bloodType || '-'}</div>
          <div className="print-field"><strong>სიმაღლე / წონა:</strong> {heightWeightText}</div>
          <div className="print-field"><strong>ასთმა:</strong> {isAsthmaActive ? "კი" : "არა"}</div>
          <div className="print-field"><strong>დიაბეტი:</strong> {isDiabetesActive ? "კი" : "არა"}</div>
          <div className="print-field" style={{ gridColumn: "span 2" }}><strong>ალერგია:</strong> {athlete.allergies || "არ ფიქსირდება"}</div>
        </div>
      </div>

      {athlete.emergencyContactName && (
        <div className="print-section">
          <div className="print-section-title">საგანგებო კონტაქტი (ICE)</div>
          <div className="print-grid">
            <div className="print-field"><strong>კონტაქტი:</strong> {athlete.emergencyContactName} {athlete.emergencyContactRelation ? `(${athlete.emergencyContactRelation})` : ''}</div>
            <div className="print-field"><strong>ტელეფონი:</strong> {athlete.emergencyContactPhone || '-'}</div>
          </div>
        </div>
      )}

      {athlete.issuedItems && athlete.issuedItems.filter(item => item.status === 'issued').length > 0 && (
        <div className="print-section" style={{ pageBreakInside: "avoid" }}>
          <div className="print-section-title">📦 გაცემული ინვენტარი & აღჭურვილობა</div>
          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: "15%" }}>კოდი</th>
                <th style={{ width: "40%" }}>დასახელება</th>
                <th style={{ width: "20%" }}>ტიპი</th>
                <th style={{ width: "25%" }}>დაბრუნების ვადა</th>
              </tr>
            </thead>
            <tbody>
              {athlete.issuedItems.filter(item => item.status === 'issued').map((item, idx) => {
                const isOverdue = item.expectedReturnDate && new Date(item.expectedReturnDate) < new Date();
                return (
                  <tr key={item.id || idx}>
                    <td>{item.itemCode}</td>
                    <td>
                      <strong>{item.itemName}</strong>
                      {item.components && <div style={{ fontSize: "10px", fontStyle: "italic", marginTop: "2px" }}>შემადგენლობა: {item.components}</div>}
                    </td>
                    <td>{item.type === 'bundle' ? 'კომპლექტი' : 'ინდივიდუალური'}</td>
                    <td style={{ color: isOverdue ? "red" : "black", fontWeight: isOverdue ? "bold" : "normal" }}>
                      {item.expectedReturnDate || 'უვადო'} {isOverdue ? '(ვადაგადაცილებული)' : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {athlete.biography && (
        <div className="print-section">
          <div className="print-section-title">ბიოგრაფია & TIMELINE ნარატივი</div>
          <div className="print-field" style={{ whiteSpace: "pre-wrap" }}>
            {athlete.biography}
          </div>
        </div>
      )}

      <div className="print-section" style={{ pageBreakInside: "avoid" }}>
        <div className="print-section-title">სპორტული აქტივობის ქრონოლოგია & მიღწევები</div>
        {athlete.achievements && athlete.achievements.length > 0 ? (
          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: "10%" }}>წელი</th>
                <th style={{ width: "30%" }}>აქტივობა / მწვერვალი</th>
                <th style={{ width: "30%" }}>მარშრუტი</th>
                <th style={{ width: "30%" }}>შედეგი / სტატუსი</th>
              </tr>
            </thead>
            <tbody>
              {[...athlete.achievements].sort((a, b) => Number(b.year) - Number(a.year)).map((act, idx) => (
                <tr key={act.id || idx}>
                  <td>{act.year}</td>
                  <td>{act.title || act.peak}</td>
                  <td>{act.route || '-'}</td>
                  <td>{act.achievement || act.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ fontSize: "12px", fontStyle: "italic", color: "#555" }}>მიღწევები არ არის რეგისტრირებული</div>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(printableHandoverAct, document.body);
};

export default AthletePrintDoc;
