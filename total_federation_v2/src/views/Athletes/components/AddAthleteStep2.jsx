import React from 'react';
import InternationalPhoneInput from '../../../components/ui/InternationalPhoneInput.jsx';

const AddAthleteStep2 = ({ formData, updateData }) => {
  const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "20px",
    flex: 1
  };

  const labelStyle = {
    fontSize: "13px",
    color: "rgba(226, 232, 240, 0.7)"
  };

  const inputStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(34, 211, 238, 0.3)",
    borderRadius: "8px",
    padding: "12px",
    color: "#fff",
    outline: "none",
    transition: "all 0.3s"
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h3 style={{ margin: "0 0 15px 0", color: "#22d3ee", fontSize: "15px", borderBottom: "1px solid rgba(34, 211, 238, 0.1)", paddingBottom: "8px" }}>
          <i className="fa-solid fa-address-book"></i> საკონტაქტო ინფორმაცია
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 20px" }}>
          <div style={{ ...inputGroupStyle, minWidth: "200px", marginBottom: "0" }}>
            <label style={labelStyle}>იმეილი</label>
            <input type="email" style={inputStyle} value={formData.email} onChange={e => updateData('email', e.target.value)} placeholder="mail@example.com" />
          </div>
          <div style={{ ...inputGroupStyle, minWidth: "200px", marginBottom: "0" }}>
            <label style={labelStyle}>მისამართი</label>
            <input style={inputStyle} value={formData.address} onChange={e => updateData('address', e.target.value)} placeholder="ქუჩა, ბინა, ა.შ." />
          </div>
          <div style={{ ...inputGroupStyle, minWidth: "200px", marginBottom: "0" }}>
            <label style={labelStyle}>მობილურის ნომერი</label>
            <InternationalPhoneInput
              value={formData.phone}
              onChange={val => updateData('phone', val)}
              placeholder="(599) 12-34-56"
              defaultCountry={formData.nationality || 'GE'}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ margin: "0 0 15px 0", color: "#22d3ee", fontSize: "15px", borderBottom: "1px solid rgba(34, 211, 238, 0.1)", paddingBottom: "8px" }}>
          <i className="fa-solid fa-phone-volume"></i> საკონტაქტო პირი საგანგებო სიტუაციაში (ICE)
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 20px" }}>
          <div style={{ ...inputGroupStyle, minWidth: "200px", marginBottom: "0" }}>
            <label style={labelStyle}>სახელი და გვარი</label>
            <input style={inputStyle} value={formData.emergencyContactName} onChange={e => updateData('emergencyContactName', e.target.value)} placeholder="სახელი, გვარი" />
          </div>
          <div style={{ ...inputGroupStyle, minWidth: "200px", marginBottom: "0" }}>
            <label style={labelStyle}>კავშირი (მაგ: მშობელი, მეუღლე)</label>
            <input style={inputStyle} value={formData.emergencyContactRelation} onChange={e => updateData('emergencyContactRelation', e.target.value)} placeholder="ნათესაური კავშირი" />
          </div>
          <div style={{ ...inputGroupStyle, minWidth: "200px", marginBottom: "0" }}>
            <label style={labelStyle}>საგანგებო კონტაქტის ტელეფონი</label>
            <InternationalPhoneInput
              value={formData.emergencyContactPhone}
              onChange={val => updateData('emergencyContactPhone', val)}
              placeholder="(599) 12-34-56"
              defaultCountry={formData.nationality || 'GE'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAthleteStep2;
