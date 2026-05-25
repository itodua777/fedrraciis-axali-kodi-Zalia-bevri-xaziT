import React from 'react';
import ToggleSwitch from '../../../components/ui/ToggleSwitch.jsx';

const AddAthleteStep3 = ({ formData, updateData, federation }) => {
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
    border: "1px solid color-mix(in oklab, var(--color-emerald-core) 30%, transparent)",
    borderRadius: "8px",
    padding: "12px",
    color: "#fff",
    outline: "none",
    transition: "all 0.3s"
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h3 style={{ margin: "0 0 15px 0", color: "var(--color-emerald-core)", fontSize: "15px", borderBottom: "1px solid color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", paddingBottom: "8px" }}>
          <i className="fa-solid fa-ruler-combined"></i> ფიზიკური პარამეტრები
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 20px" }}>
          <div style={{ ...inputGroupStyle, minWidth: "200px", marginBottom: "0" }}>
            <label style={labelStyle}>სიმაღლე (სმ)</label>
            <input type="number" style={inputStyle} value={formData.height} onChange={e => updateData('height', e.target.value)} placeholder="მაგ: 180" />
          </div>
          <div style={{ ...inputGroupStyle, minWidth: "200px", marginBottom: "0" }}>
            <label style={labelStyle}>წონა (კგ)</label>
            <input type="number" style={inputStyle} value={formData.weight} onChange={e => updateData('weight', e.target.value)} placeholder="მაგ: 75" />
          </div>
          <div style={{ ...inputGroupStyle, minWidth: "200px", marginBottom: "0" }}>
            <label style={labelStyle}>სისხლის ჯგუფი და რეზუსი <span style={{color: '#ef4444'}}>*</span></label>
            <select style={inputStyle} value={formData.bloodType} onChange={e => updateData('bloodType', e.target.value)}>
              <option value="">აირჩიეთ ჯგუფი და რეზუსი</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ margin: "0 0 15px 0", color: "var(--color-emerald-core)", fontSize: "15px", borderBottom: "1px solid color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", paddingBottom: "8px" }}>
          <i className="fa-solid fa-house-medical"></i> სამედიცინო პროფილი
        </h3>
        <div style={{ display: "flex", gap: "30px", marginBottom: "15px" }}>
          <ToggleSwitch 
            checked={formData.diabetes} 
            onChange={val => updateData('diabetes', val)} 
            label="დიაბეტი" 
          />
          <ToggleSwitch 
            checked={formData.asthma} 
            onChange={val => updateData('asthma', val)} 
            label="ასთმა" 
          />
        </div>
        <div style={{ ...inputGroupStyle, width: "100%", marginBottom: "0" }}>
          <label style={labelStyle}>ალერგიები / უკუჩვენებები (ასეთის არსებობის შემთხვევაში)</label>
          <textarea 
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical", fontFamily: "sans-serif" }} 
            value={formData.allergies} 
            onChange={e => updateData('allergies', e.target.value)} 
            placeholder="ჩაწერეთ ალერგიები, საკვები ან მედიკამენტოზური უკუჩვენებები..."
          />
        </div>
      </div>

      {(federation === 'judo' || federation === 'rugby') && (
        <div>
          <h3 style={{ margin: "0 0 15px 0", color: "var(--color-emerald-core)", fontSize: "15px", borderBottom: "1px solid color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", paddingBottom: "8px" }}>
            <i className="fa-solid fa-trophy"></i> ფედერაციის სპეციფიკური მონაცემები
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 20px" }}>
            {federation === 'judo' && (
              <>
                <div style={{ ...inputGroupStyle, minWidth: "200px", marginBottom: "0" }}>
                  <label style={labelStyle}>წონითი კატეგორია (კგ)</label>
                  <input style={inputStyle} value={formData.judoWeight} onChange={e => updateData('judoWeight', e.target.value)} placeholder="მაგ: 73" />
                </div>
                <div style={{ ...inputGroupStyle, minWidth: "200px", marginBottom: "0" }}>
                  <label style={labelStyle}>ქამარი</label>
                  <select style={inputStyle} value={formData.judoBelt} onChange={e => updateData('judoBelt', e.target.value)}>
                    <option value="">აირჩიეთ ქამარი</option>
                    <option value="white">თეთრი</option>
                    <option value="yellow">ყვითელი</option>
                    <option value="black">შავი</option>
                  </select>
                </div>
              </>
            )}
            
            {federation === 'rugby' && (
              <div style={{ ...inputGroupStyle, minWidth: "200px", marginBottom: "0" }}>
                <label style={labelStyle}>პოზიცია მოედანზე</label>
                <input style={inputStyle} value={formData.rugbyPosition} onChange={e => updateData('rugbyPosition', e.target.value)} placeholder="მაგ: 9 ნომერი" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAthleteStep3;
