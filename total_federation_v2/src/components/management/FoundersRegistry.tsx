import React from 'react';

export interface Founder {
  id: string;
  type: 'physical' | 'legal';
  name: string;
  identifier: string; // 11-digit personal ID or 9-digit identification code
  isActiveMember: boolean;
  hasVotingRight: boolean;
  share?: number; // optional, backward compatibility
  leaderName?: string;
  leaderIdentifier?: string;
}

export const FoundersRegistry: React.FC = () => {
  const [founders, setFounders] = React.useState<Founder[]>(() => {
    const saved = localStorage.getItem('management_founders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: "1",
        type: "physical",
        name: "ალექსანდრე ასათიანი",
        identifier: "01012345678",
        isActiveMember: true,
        hasVotingRight: true
      },
      {
        id: "2",
        type: "legal",
        name: "შპს ალპური ალიანსი",
        identifier: "200987654",
        isActiveMember: true,
        hasVotingRight: true,
        leaderName: "გიორგი მელაძე",
        leaderIdentifier: "01024681357"
      },
      {
        id: "3",
        type: "physical",
        name: "ირაკლი კოხრეიძე",
        identifier: "01087654321",
        isActiveMember: false,
        hasVotingRight: false
      }
    ];
  });

  const [formData, setFormData] = React.useState({
    type: 'physical' as 'physical' | 'legal',
    name: '',
    identifier: '',
    isActiveMember: true,
    hasVotingRight: true,
    leaderName: '',
    leaderIdentifier: ''
  });

  const [error, setError] = React.useState('');

  React.useEffect(() => {
    localStorage.setItem('management_founders', JSON.stringify(founders));
  }, [founders]);

  const physicalCount = React.useMemo(() => {
    return founders.filter(f => f.type === 'physical').length;
  }, [founders]);

  const legalCount = React.useMemo(() => {
    return founders.filter(f => f.type === 'legal').length;
  }, [founders]);

  const votingCount = React.useMemo(() => {
    return founders.filter(f => f.hasVotingRight).length;
  }, [founders]);

  const totalFoundersCount = founders.length;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeToggle = (type: 'physical' | 'legal') => {
    setFormData(prev => ({
      ...prev,
      type,
      identifier: '', // Reset identifier as length requirement changes
      leaderName: '',
      leaderIdentifier: ''
    }));
  };

  const handleToggleChange = (field: 'isActiveMember' | 'hasVotingRight') => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      return setError(formData.type === 'physical' ? 'გთხოვთ მიუთითოთ სახელი და გვარი' : 'გთხოვთ მიუთითოთ კომპანიის დასახელება');
    }
    if (!formData.identifier.trim()) {
      return setError(formData.type === 'physical' ? 'გთხოვთ მიუთითოთ პირადი ნომერი' : 'გთხოვთ მიუთითოთ საიდენტიფიკაციო კოდი');
    }
    
    if (formData.type === 'physical') {
      if (formData.identifier.trim().length !== 11) {
        return setError('ფიზიკური პირის პირადი ნომერი უნდა შედგებოდეს 11 ციფრისგან');
      }
    } else {
      if (formData.identifier.trim().length !== 9) {
        return setError('იურიდიული პირის საიდენტიფიკაციო კოდი უნდა შედგებოდეს 9 ციფრისგან');
      }
      if (!formData.leaderName.trim()) {
        return setError('გთხოვთ მიუთითოთ ორგანიზაციის ხელმძღვანელის სახელი და გვარი');
      }
      if (formData.leaderIdentifier.trim().length !== 11) {
        return setError('ორგანიზაციის ხელმძღვანელის პირადი ნომერი უნდა შედგებოდეს 11 ციფრისგან');
      }
    }

    const newFounder: Founder = {
      id: String(Date.now()),
      type: formData.type,
      name: formData.name,
      identifier: formData.identifier,
      isActiveMember: formData.isActiveMember,
      hasVotingRight: formData.hasVotingRight,
      ...(formData.type === 'legal' ? {
        leaderName: formData.leaderName,
        leaderIdentifier: formData.leaderIdentifier
      } : {})
    };

    setFounders(prev => [...prev, newFounder]);
    setFormData({
      type: 'physical',
      name: '',
      identifier: '',
      isActiveMember: true,
      hasVotingRight: true,
      leaderName: '',
      leaderIdentifier: ''
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('ნამდვილად გსურთ ამ დამფუძნებლის წაშლა რეესტრიდან?')) {
      setFounders(prev => prev.filter(f => f.id !== id));
    }
  };

  const inputGroupStyle = { display: "flex", flexDirection: "column" as const, gap: "5px", flex: 1 };
  const labelStyle = { fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", fontWeight: "500" };
  const inputStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "10px",
    color: "#fff",
    outline: "none",
    fontSize: "14px",
    transition: "border-color 0.3s"
  };

  const toggleContainerStyle = {
    display: "flex",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    overflow: "hidden",
    width: "fit-content"
  };

  const toggleButtonStyle = (active: boolean) => ({
    padding: "8px 16px",
    backgroundColor: active ? "rgba(34, 211, 238, 0.15)" : "transparent",
    color: active ? "#22d3ee" : "rgba(255,255,255,0.6)",
    border: "none",
    fontSize: "13px",
    fontWeight: "bold" as const,
    cursor: "pointer",
    transition: "all 0.3s"
  });

  const neonSwitchStyle = (isActive: boolean) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: isActive ? "flex-end" : "flex-start",
    width: "48px",
    height: "24px",
    borderRadius: "12px",
    backgroundColor: isActive ? "rgba(34, 211, 238, 0.2)" : "rgba(255, 255, 255, 0.05)",
    border: `1px solid ${isActive ? '#22d3ee' : 'rgba(255, 255, 255, 0.1)'}`,
    padding: "2px",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: isActive ? "0 0 10px rgba(34, 211, 238, 0.2)" : "none"
  });

  const neonSwitchKnobStyle = (isActive: boolean) => ({
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    backgroundColor: isActive ? "#22d3ee" : "rgba(255, 255, 255, 0.3)",
    transition: "all 0.3s"
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
      {/* Quorum and Founders Structure Statistics */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px"
      }}>
        <div style={{
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          border: "1px solid rgba(34, 211, 238, 0.2)",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
        }}>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "5px" }}>სუბიექტების სტრუქტურა</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span style={{ fontSize: "28px", color: "#fff", fontWeight: "bold" }}>{totalFoundersCount}</span>
            <span style={{ fontSize: "14px", color: "#22d3ee" }}>სუბიექტი</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "12px" }}>
            <span>ფიზიკური პირი: <strong>{physicalCount}</strong></span>
            <span>იურიდიული პირი: <strong>{legalCount}</strong></span>
          </div>
        </div>

        <div style={{
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          border: "1px solid rgba(34, 211, 238, 0.2)",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
        }}>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "5px" }}>ხმის უფლების მქონე წევრები (კვორუმი)</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span style={{ fontSize: "28px", color: "#22d3ee", fontWeight: "bold", textShadow: "0 0 10px rgba(34, 211, 238, 0.3)" }}>
              {votingCount} / {totalFoundersCount}
            </span>
            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>დამფუძნებელი</span>
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "12px" }}>
            ხმების {votingCount > 0 ? Math.round((votingCount / totalFoundersCount) * 100) : 0}% კვორუმისთვის არის აქტიური ყრილობებზე.
          </div>
        </div>
      </div>

      {/* Input panel */}
      <div style={{
        backgroundColor: "rgba(30, 41, 59, 0.4)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "12px",
        padding: "24px"
      }}>
        <h3 style={{ margin: "0 0 20px 0", color: "#22d3ee", fontSize: "16px", textShadow: "0 0 8px rgba(34, 211, 238, 0.2)" }}>
          <i className="fa-solid fa-gavel" style={{ marginRight: "8px" }}></i>
          დამფუძნებლის იურიდიული მონაცემების რეგისტრაცია
        </h3>

        {error && (
          <div style={{ color: "#ef4444", marginBottom: "15px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
            <i className="fa-solid fa-triangle-exclamation"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Toggle Type */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>სუბიექტის ტიპი</label>
            <div style={toggleContainerStyle}>
              <button type="button" style={toggleButtonStyle(formData.type === 'physical')} onClick={() => handleTypeToggle('physical')}>
                <i className="fa-solid fa-user" style={{ marginRight: "6px" }}></i> ფიზიკური პირი
              </button>
              <button type="button" style={toggleButtonStyle(formData.type === 'legal')} onClick={() => handleTypeToggle('legal')}>
                <i className="fa-solid fa-building" style={{ marginRight: "6px" }}></i> იურიდიული ორგანიზაცია
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ ...inputGroupStyle, minWidth: "250px", flex: 2 }}>
              <label style={labelStyle}>
                {formData.type === 'physical' ? 'სახელი და გვარი *' : 'კომპანიის დასახელება *'}
              </label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={inputStyle} placeholder={formData.type === 'physical' ? "მაგ. ალექსანდრე ასათიანი" : "მაგ. სს ექსტრემალური ტურიზმი"} />
            </div>

            <div style={{ ...inputGroupStyle, minWidth: "180px", flex: 1 }}>
              <label style={labelStyle}>
                {formData.type === 'physical' ? 'პირადი ნომერი * (11-ნიშნა)' : 'საიდენტიფიკაციო კოდი * (9-ნიშნა)'}
              </label>
              <input type="text" name="identifier" value={formData.identifier} onChange={handleInputChange} maxLength={formData.type === 'physical' ? 11 : 9} style={inputStyle} placeholder={formData.type === 'physical' ? "01012345678" : "200987654"} />
            </div>
          </div>

          {formData.type === 'legal' && (
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "15px" }}>
              <div style={{ ...inputGroupStyle, minWidth: "250px", flex: 2 }}>
                <label style={labelStyle}>ორგანიზაციის ხელმძღვანელის სახელი და გვარი *</label>
                <input type="text" name="leaderName" value={formData.leaderName} onChange={handleInputChange} style={inputStyle} placeholder="მაგ. გიორგი მელაძე" />
              </div>
              <div style={{ ...inputGroupStyle, minWidth: "180px", flex: 1 }}>
                <label style={labelStyle}>ორგანიზაციის ხელმძღვანელის პირადი ნომერი * (11-ნიშნა)</label>
                <input type="text" name="leaderIdentifier" value={formData.leaderIdentifier} onChange={handleInputChange} maxLength={11} style={inputStyle} placeholder="01024681357" />
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={neonSwitchStyle(formData.isActiveMember)} onClick={() => handleToggleChange('isActiveMember')}>
                <div style={neonSwitchKnobStyle(formData.isActiveMember)}></div>
              </div>
              <div>
                <div style={{ fontSize: "14px", color: "#fff", fontWeight: "bold" }}>არის მოქმედი წევრი</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>მონაწილეობს თუ არა ფედერაციის აქტივობებში</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={neonSwitchStyle(formData.hasVotingRight)} onClick={() => handleToggleChange('hasVotingRight')}>
                <div style={neonSwitchKnobStyle(formData.hasVotingRight)}></div>
              </div>
              <div>
                <div style={{ fontSize: "14px", color: "#fff", fontWeight: "bold" }}>აქვს ყრილობაზე ხმის უფლება</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>გამოიყენება კვორუმისა და გადაწყვეტილებების მისაღებად</div>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" style={{
              backgroundColor: "#22d3ee",
              color: "#121418",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 0 15px rgba(34, 211, 238, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <i className="fa-solid fa-floppy-disk"></i>
              დამფუძნებლის შენახვა
            </button>
          </div>
        </form>
      </div>

      {/* Founders Table */}
      <div style={{
        backgroundColor: "rgba(30, 41, 59, 0.2)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "12px",
        padding: "24px",
        overflowX: "auto"
      }}>
        <h3 style={{ margin: "0 0 15px 0", color: "#fff", fontSize: "16px" }}>
          დამფუძნებელთა და ხმის უფლების რეესტრი
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "750px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left" }}>
              <th style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>ტიპი</th>
              <th style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>დასახელება / სახელი</th>
              <th style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>საიდენტიფიკაციო ნომერი</th>
              <th style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>ხელმძღვანელი</th>
              <th style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>აქტიური წევრი</th>
              <th style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>ხმის უფლება</th>
              <th style={{ padding: "12px 8px", color: "rgba(255,255,255,0.5)", fontSize: "12px", textAlign: "right" }}>მოქმედება</th>
            </tr>
          </thead>
          <tbody>
            {founders.map((founder) => (
              <tr key={founder.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background-color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                <td style={{ padding: "12px 8px" }}>
                  {founder.type === 'physical' ? (
                    <span style={{ fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "5px", color: "rgba(255,255,255,0.7)" }}>
                      <i className="fa-solid fa-user" style={{ color: "#22d3ee" }}></i> ფიზიკური
                    </span>
                  ) : (
                    <span style={{ fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "5px", color: "rgba(255,255,255,0.7)" }}>
                      <i className="fa-solid fa-building" style={{ color: "#38bdf8" }}></i> იურიდიული
                    </span>
                  )}
                </td>
                <td style={{ padding: "12px 8px", color: "#fff", fontWeight: "500", fontSize: "14px" }}>
                  {founder.name}
                </td>
                <td style={{ padding: "12px 8px", color: "rgba(255,255,255,0.6)", fontSize: "13px", fontFamily: "monospace" }}>
                  {founder.identifier}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  {founder.type === 'legal' && founder.leaderName ? (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ color: "#fff", fontSize: "13px", fontWeight: "500" }}>{founder.leaderName}</span>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontFamily: "monospace" }}>{founder.leaderIdentifier}</span>
                    </div>
                  ) : (
                    <span style={{ color: "rgba(255,255,255,0.2)" }}>-</span>
                  )}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  {founder.isActiveMember ? (
                    <span style={{ color: "#22c55e", fontSize: "13px", display: "flex", alignItems: "center", gap: "5px" }}>
                      <i className="fa-solid fa-circle-check"></i> კი
                    </span>
                  ) : (
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", display: "flex", alignItems: "center", gap: "5px" }}>
                      <i className="fa-solid fa-circle-xmark"></i> არა
                    </span>
                  )}
                </td>
                <td style={{ padding: "12px 8px" }}>
                  {founder.hasVotingRight ? (
                    <span style={{ color: "#22c55e", fontSize: "13px", display: "flex", alignItems: "center", gap: "5px" }}>
                      <i className="fa-solid fa-check"></i> კი
                    </span>
                  ) : (
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", display: "flex", alignItems: "center", gap: "5px" }}>
                      <i className="fa-solid fa-minus"></i> არა
                    </span>
                  )}
                </td>
                <td style={{ padding: "12px 8px", textAlign: "right" }}>
                  <button onClick={() => handleDelete(founder.id)} style={{
                    backgroundColor: "transparent",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#ef4444",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)"; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))}
            {founders.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: "20px 0", textAlign: "center", color: "rgba(255,255,255,0.3)" }}>
                  დამფუძნებლები ვერ მოიძებნა.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
