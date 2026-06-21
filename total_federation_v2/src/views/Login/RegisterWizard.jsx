import React from 'react';

const RegisterWizard = ({ onBackToLogin }) => {
  const [step, setStep] = React.useState(1);
  
  // Step 1: ფედერაციის პროფილი
  const [companyName, setCompanyName] = React.useState('');
  const [legalForm, setLegalForm] = React.useState('ააიპ');
  const [identificationCode, setIdentificationCode] = React.useState('');
  const [sportsDomain, setSportsDomain] = React.useState('');

  // Step 2: ინფრასტრუქტურა და ლოკაცია
  const [country, setCountry] = React.useState('საქართველო');
  const [legalAddress, setLegalAddress] = React.useState('');
  const [branchName, setBranchName] = React.useState('მთავარი ფილიალი');
  const [departmentName, setDepartmentName] = React.useState('ადმინისტრაცია');

  // Step 3: ადმინისტრატორის ანგარიში
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [personalId, setPersonalId] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [position, setPosition] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  // Status
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [registeredData, setRegisteredData] = React.useState(null);

  const validateStep = () => {
    setError('');
    if (step === 1) {
      if (!companyName.trim()) {
        setError('ფედერაციის სახელის შევსება სავალდებულოა.');
        return false;
      }
      if (!legalForm.trim()) {
        setError('სამართლებრივი ფორმის შევსება სავალდებულოა.');
        return false;
      }
      if (!identificationCode.trim()) {
        setError('საიდენტიფიკაციო კოდის შევსება სავალდებულოა.');
        return false;
      }
      if (!sportsDomain.trim()) {
        setError('სპორტული საქმიანობის სფეროს შევსება სავალდებულოა.');
        return false;
      }
    } else if (step === 2) {
      if (!country.trim()) {
        setError('ქვეყნის შევსება სავალდებულოა.');
        return false;
      }
      if (!legalAddress.trim()) {
        setError('იურიდიული მისამართის შევსება სავალდებულოა.');
        return false;
      }
      if (!branchName.trim()) {
        setError('ფილიალის დასახელების შევსება სავალდებულოა.');
        return false;
      }
      if (!departmentName.trim()) {
        setError('დეპარტამენტის დასახელების შევსება სავალდებულოა.');
        return false;
      }
    } else if (step === 3) {
      if (!firstName.trim() || !lastName.trim()) {
        setError('სახელისა და გვარის შევსება სავალდებულოა.');
        return false;
      }
      if (!personalId.trim()) {
        setError('პირადი ნომრის შევსება სავალდებულოა.');
        return false;
      }
      if (!/^\d{11}$/.test(personalId.trim())) {
        setError('პირადი ნომერი უნდა შედგებოდეს ზუსტად 11 ციფრისგან.');
        return false;
      }
      if (!phone.trim()) {
        setError('ტელეფონის ნომრის შევსება სავალდებულოა.');
        return false;
      }
      if (!position.trim()) {
        setError('თანამდებობის შევსება სავალდებულოა.');
        return false;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('გთხოვთ მიუთითოთ ვალიდური ელ-ფოსტა.');
        return false;
      }
      if (!password || password.length < 6) {
        setError('პაროლი უნდა შედგებოდეს მინიმუმ 6 სიმბოლოსგან.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    setError('');

    const payload = {
      companyName,
      legalForm,
      identificationCode,
      sportsDomain,
      country,
      legalAddress,
      branchName,
      departmentName,
      firstName,
      lastName,
      personalId,
      phone,
      position,
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:5005/companies/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'რეგისტრაცია ვერ განხორციელდა. გთხოვთ შეამოწმოთ მონაცემები ან ელ-ფოსტის უნიკალურობა.');
      }

      setSuccess(true);
      setRegisteredData(data);
    } catch (err) {
      console.error('Registration API error:', err);
      setError(err.message || 'სერვერთან კავშირი ვერ დამყარდა.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        position: 'relative',
        backgroundColor: 'var(--iron-1)',
        border: '1px solid var(--iron-line)',
        borderRadius: '6px',
        padding: '36px 40px 32px',
        width: '460px',
        boxShadow: '0 20px 60px rgba(0,0,0,.6), 0 0 30px rgba(8,133,237,.06)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'loginFadeIn .5s cubic-bezier(0.16,1,0.3,1) both',
      }}>
        {/* Card accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, var(--emerald) 0%, transparent 100%)',
        }} />

        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'var(--emerald)',
          marginBottom: '20px',
        }}>
          რეგისტრაცია · წარმატებით დასრულდა
        </div>

        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0,230,118,.08)',
          border: '1px solid rgba(0,230,118,.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: 'var(--emerald)',
          fontSize: '24px',
        }}>
          ✓
        </div>

        <h2 style={{
          color: 'var(--bone)',
          fontSize: '18px',
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          textAlign: 'center',
          margin: '0 0 8px 0',
        }}>
          ფედერაცია შეიქმნა
        </h2>

        <p style={{
          color: 'var(--bone-60)',
          fontSize: '13px',
          textAlign: 'center',
          lineHeight: '1.5',
          margin: '0 0 24px 0',
        }}>
          ახალი ორგანიზაციული გარემო წარმატებით შეიქმნა. შეგიძლიათ შეხვიდეთ სისტემაში ადმინისტრატორის ანგარიშით.
        </p>

        {registeredData && (
          <div style={{
            backgroundColor: 'var(--iron)',
            border: '1px solid var(--iron-line)',
            borderRadius: '4px',
            padding: '16px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--bone-60)',
            marginBottom: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <div><strong style={{ color: 'var(--fed-blue)' }}>ფედერაცია:</strong> {registeredData.company?.name}</div>
            <div><strong style={{ color: 'var(--fed-blue)' }}>ადმინისტრატორი:</strong> {registeredData.user?.email}</div>
            <div><strong style={{ color: 'var(--fed-blue)' }}>მთავარი ფილიალი:</strong> {registeredData.branch?.name}</div>
            <div><strong style={{ color: 'var(--fed-blue)' }}>ადმინისტრაციული დეპარტამენტი:</strong> {registeredData.department?.name}</div>
            <div><strong style={{ color: 'var(--fed-blue)' }}>ადმინისტრატორის როლი:</strong> წარმატებული სინქრონიზაცია ({registeredData.role?.name})</div>
          </div>
        )}

        <button
          onClick={onBackToLogin}
          className="login-btn"
          style={{ background: 'var(--emerald)', color: 'var(--iron)' }}
        >
          შესვლაზე დაბრუნება
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .wizard-step-indicator {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          position: relative;
        }
        .wizard-step-indicator::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background-color: var(--iron-line);
          z-index: 1;
        }
        .wizard-step {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: var(--iron-2);
          border: 1px solid var(--iron-line);
          color: var(--bone-30);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 13px;
          z-index: 2;
          transition: all 0.3s ease;
        }
        .wizard-step.active {
          background-color: var(--fed-blue);
          border-color: var(--fed-blue);
          color: var(--iron);
          font-weight: 700;
          box-shadow: 0 0 10px rgba(8,133,237,.5);
        }
        .wizard-step.completed {
          background-color: var(--iron-line);
          border-color: var(--fed-blue);
          color: var(--fed-blue);
        }
        .wizard-nav-container {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }
        .wizard-back-btn {
          flex: 1;
          background-color: transparent;
          color: var(--bone-60);
          border: 1px solid var(--iron-line);
          padding: 13px;
          border-radius: 4px;
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .wizard-back-btn:hover {
          border-color: var(--bone-30);
          color: var(--bone);
        }
      `}</style>

      <div style={{
        position: 'relative',
        backgroundColor: 'var(--iron-1)',
        border: '1px solid var(--iron-line)',
        borderRadius: '6px',
        padding: '36px 40px 32px',
        width: '460px',
        boxShadow: '0 20px 60px rgba(0,0,0,.6), 0 0 30px rgba(8,133,237,.06)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'loginFadeIn .5s cubic-bezier(0.16,1,0.3,1) both',
      }}>
        {/* Card accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, var(--fed-blue) 0%, transparent 100%)',
        }} />

        {/* Eyebrow tag */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'var(--fed-blue)',
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>ფედერაციის რეგისტრაციის პანელი</span>
          <span>ნაბიჯი {step} 3-დან</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '22px',
          fontWeight: '900',
          letterSpacing: '2px',
          color: 'var(--bone)',
          margin: '0 0 20px 0',
          textTransform: 'uppercase',
        }}>
          {step === 1 && 'ფედერაციის პროფილი'}
          {step === 2 && 'ინფრასტრუქტურა და ლოკაცია'}
          {step === 3 && 'ადმინისტრატორის ანგარიში'}
        </h1>

        {/* Step Indicator */}
        <div className="wizard-step-indicator">
          <div className={`wizard-step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>1</div>
          <div className={`wizard-step ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>2</div>
          <div className={`wizard-step ${step === 3 ? 'active' : ''}`}>3</div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            color: 'var(--crisis-from)',
            textAlign: 'center',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            backgroundColor: 'rgba(180,3,7,.08)',
            border: '1px solid rgba(180,3,7,.25)',
            borderRadius: '4px',
            padding: '10px 12px',
            marginBottom: '16px',
            lineHeight: '1.4',
          }}>
            {error}
          </div>
        )}

        {/* Wizard Form Screens */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* SCREEN 1: Federation Profile */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 2 }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bone-30)' }}>
                    ფედერაციის სახელი
                  </label>
                  <input
                    type="text"
                    className="login-input"
                    placeholder="მაგ. მთამსვლელობის ფედერაცია"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bone-30)' }}>
                    სამართლებრივი ფორმა
                  </label>
                  <select
                    className="login-input"
                    value={legalForm}
                    onChange={e => setLegalForm(e.target.value)}
                    style={{
                      backgroundColor: 'var(--iron)',
                      color: 'var(--bone)',
                      height: '40.8px', // match input height precisely
                    }}
                  >
                    <option value="ააიპ">ააიპ</option>
                    <option value="შპს">შპს</option>
                    <option value="სხვა">სხვა</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bone-30)' }}>
                  საიდენტიფიკაციო კოდი
                </label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="მაგ. 204XXXXXX"
                  value={identificationCode}
                  onChange={e => setIdentificationCode(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bone-30)' }}>
                  სპორტული საქმიანობის სფერო
                </label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="მაგ. ალპინიზმი, მეკლდეურობა"
                  value={sportsDomain}
                  onChange={e => setSportsDomain(e.target.value)}
                />
              </div>

              <div className="spec-box" style={{ marginTop: '8px' }}>
                <div className="spec-label">ნაბიჯი 1-ის მიმოხილვა</div>
                <div className="spec-text">
                  მიუთითეთ სპორტული ფედერაციის ოფიციალური სახელი, საიდენტიფიკაციო კოდი და საქმიანობის სფერო. ეს წარმოადგენს ცენტრალურ ორგანიზაციულ ერთეულს.
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: Infrastructure & Location */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bone-30)' }}>
                  ქვეყანა
                </label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="მაგ. საქართველო"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  autoFocus
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bone-30)' }}>
                  იურიდიული მისამართი
                </label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="მაგ. ჭავჭავაძის გამზირი 15, თბილისი"
                  value={legalAddress}
                  onChange={e => setLegalAddress(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bone-30)' }}>
                  ფილიალის დასახელება
                </label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="მაგ. მთავარი ფილიალი"
                  value={branchName}
                  onChange={e => setBranchName(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bone-30)' }}>
                  დეპარტამენტის დასახელება
                </label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="მაგ. ადმინისტრაცია"
                  value={departmentName}
                  onChange={e => setDepartmentName(e.target.value)}
                />
              </div>

              <div className="spec-box" style={{ marginTop: '8px' }}>
                <div className="spec-label">ნაბიჯი 2-ის მიმოხილვა</div>
                <div className="spec-text">
                  განსაზღვრეთ პირველადი ფილიალი და მმართველი დეპარტამენტი. ეს ერთეულები კოორდინაციას გაუწევენ წევრობასა და ოპერაციებს.
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 3: Superuser Account */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bone-30)' }}>
                    სახელი
                  </label>
                  <input
                    type="text"
                    className="login-input"
                    placeholder="სახელი"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bone-30)' }}>
                    გვარი
                  </label>
                  <input
                    type="text"
                    className="login-input"
                    placeholder="გვარი"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bone-30)' }}>
                    პირადი ნომერი (11 ნიშნა)
                  </label>
                  <input
                    type="text"
                    className="login-input"
                    placeholder="11 ციფრი"
                    value={personalId}
                    onChange={e => setPersonalId(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bone-30)' }}>
                    ტელეფონის ნომერი
                  </label>
                  <input
                    type="tel"
                    className="login-input"
                    placeholder="მაგ. +995555123456"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bone-30)' }}>
                  თანამდებობა
                </label>
                <input
                  type="text"
                  className="login-input"
                  placeholder="მაგ. პრეზიდენტი"
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bone-30)' }}>
                  ელ-ფოსტა
                </label>
                <input
                  type="email"
                  className="login-input"
                  placeholder="admin@federation.ge"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bone-30)' }}>
                  პაროლი
                </label>
                <input
                  type="password"
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <div className="spec-box" style={{ marginTop: '8px' }}>
                <div className="spec-label">ნაბიჯი 3-ის მიმოხილვა</div>
                <div className="spec-text">
                  შექმენით ადმინისტრატორის ანგარიში. ამ მომხმარებელს ექნება სრული ადმინისტრაციული (company_admin) უფლებები ამ ფედერაციის ფარგლებში.
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="wizard-nav-container">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="wizard-back-btn"
                disabled={loading}
              >
                უკან
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="login-btn"
                style={{ flex: 2 }}
              >
                შემდეგი
              </button>
            ) : (
              <button
                type="submit"
                className="login-btn"
                style={{ flex: 2 }}
                disabled={loading}
              >
                {loading ? 'მიმდინარეობს რეგისტრაცია...' : 'რეგისტრაციის დასრულება'}
              </button>
            )}
          </div>
        </form>

        {/* Back to login shortcut */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={onBackToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--fed-blue)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              textDecoration: 'underline',
              padding: '4px',
            }}
          >
            გაუქმება და შესვლაზე დაბრუნება
          </button>
        </div>
      </div>
    </>
  );
};

export default RegisterWizard;
