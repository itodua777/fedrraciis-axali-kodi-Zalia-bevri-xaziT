import React from 'react';
import AddAthleteStep1 from './components/AddAthleteStep1.jsx';
import AddAthleteStep2 from './components/AddAthleteStep2.jsx';
import AddAthleteStep3 from './components/AddAthleteStep3.jsx';
import AddAthleteStep4 from './components/AddAthleteStep4.jsx';

const AddAthleteForm = ({ onViewChange, federation, onAdd, clubs }) => {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    personalId: '',
    birthDate: '',
    gender: '',
    sportsDiscipline: '',
    isClubMember: false,
    clubId: null,
    phone: '',
    email: '',
    address: '',
    nationality: 'GE',
    height: '',
    weight: '',
    bloodType: '',
    photoPreview: null,
    mountaineeringHeight: '',
    mountaineeringCategory: '',
    judoWeight: '',
    judoBelt: '',
    rugbyPosition: '',
    representativeType: 'parent',
    representativeName: '',
    representativePersonalId: '',
    representativePhone: '',
    representativeDoc: null,
    idCardDoc: null,
    healthDoc: null,
    insuranceDoc: null,
    dopingDoc: null
  });
  const [error, setError] = React.useState('');

  const isMinor = React.useMemo(() => {
    if (!formData.birthDate) return false;
    const today = new Date();
    const birth = new Date(formData.birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age < 18;
  }, [formData.birthDate]);

  const updateData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!formData.firstName || !formData.firstName.trim()) {
        setError("გთხოვთ მიუთითოთ სახელი");
        return;
      }
      if (!formData.lastName || !formData.lastName.trim()) {
        setError("გთხოვთ მიუთითოთ გვარი");
        return;
      }
      if (!formData.personalId || !formData.personalId.trim()) {
        setError("გთხოვთ მიუთითოთ პირადი ნომერი");
        return;
      }
      if (formData.personalId.trim().length !== 11) {
        setError("პირადი ნომერი უნდა შედგებოდეს 11 ციფრისგან");
        return;
      }
      if (!formData.birthDate) {
        setError("გთხოვთ მიუთითოთ დაბადების თარიღი");
        return;
      }
      if (!formData.gender) {
        setError("გთხოვთ აირჩიოთ სქესი");
        return;
      }
      if (formData.isClubMember && !formData.clubId) {
        setError("გთხოვთ აირჩიოთ კლუბი რეესტრიდან");
        return;
      }
      if (isMinor) {
        if (!formData.representativeName || !formData.representativeName.trim()) {
          setError("გთხოვთ მიუთითოთ წარმომადგენლის სახელი და გვარი");
          return;
        }
        if (!formData.representativePersonalId || !formData.representativePersonalId.trim()) {
          setError("გთხოვთ მიუთითოთ წარმომადგენლის პირადი ნომერი");
          return;
        }
        if (formData.representativePersonalId.trim().length !== 11) {
          setError("წარმომადგენლის პირადი ნომერი უნდა შედგებოდეს 11 ციფრისგან");
          return;
        }
        if (!formData.representativePhone || !formData.representativePhone.trim()) {
          setError("გთხოვთ მიუთითოთ წარმომადგენლის ტელეფონის ნომერი");
          return;
        }
        if (!formData.representativeDoc) {
          setError("სავალდებულოა წარმომადგენლობის დამადასტურებელი დოკუმენტის ატვირთვა");
          return;
        }
      }
    }
    if (step === 3) {
      if (!formData.bloodType) {
        setError("გთხოვთ აირჩიოთ სისხლის ჯგუფი და რეზუსი");
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const containerStyle = {
    flex: 1,
    padding: "30px",
    backgroundColor: "#121418",
    color: "#e2e8f0",
    fontFamily: "sans-serif",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  };

  const formCardStyle = {
    width: "100%",
    maxWidth: "800px",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(34, 211, 238, 0.2)",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(34, 211, 238, 0.05)"
  };

  const stepIndicatorStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "30px",
    color: "#22d3ee",
    fontSize: "14px"
  };

  const footerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)"
  };

  const btnStyle = (primary) => ({
    padding: "10px 20px",
    borderRadius: "8px",
    border: primary ? "none" : "1px solid rgba(255,255,255,0.2)",
    backgroundColor: primary ? "#3b82f6" : "transparent",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s"
  });

  return (
    <div style={containerStyle}>
      <div style={{ width: "100%", maxWidth: "800px", display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, color: "#fff", fontSize: "20px" }}>ახალი მომხმარებელი</h2>
        <button style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }} onClick={() => onViewChange('athletes')}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div style={formCardStyle}>
        <div style={stepIndicatorStyle}>
          ეტაპი {step} / 4 <span style={{ marginLeft: "10px", opacity: 0.7 }}>
            {step === 1 ? 'პირადი ინფორმაცია' : step === 2 ? 'საკონტაქტო ინფორმაცია' : step === 3 ? 'ფიზიკური მონაცემები' : 'სავალდებულო დოკუმენტაცია'}
          </span>
        </div>

        {error && <div style={{ color: "#ef4444", marginBottom: "15px", fontSize: "14px" }}>{error}</div>}

        <div style={{ display: "flex", gap: "30px" }}>
          {step === 1 && (
            <AddAthleteStep1 
              formData={formData} 
              updateData={updateData} 
              clubs={clubs} 
              isMinor={isMinor} 
            />
          )}

          {step === 2 && (
            <AddAthleteStep2 
              formData={formData} 
              updateData={updateData} 
            />
          )}

          {step === 3 && (
            <AddAthleteStep3 
              formData={formData} 
              updateData={updateData} 
              federation={federation} 
            />
          )}

          {step === 4 && (
            <AddAthleteStep4 
              formData={formData} 
              updateData={updateData} 
            />
          )}
        </div>

        <div style={footerStyle}>
          <div style={{ color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "14px" }} onClick={() => onViewChange('athletes')}>გაუქმება</div>
          <div style={{ display: "flex", gap: "15px" }}>
            {step > 1 && (
              <button style={btnStyle(false)} onClick={prevStep}>
                <i className="fa-solid fa-arrow-left"></i> უკან
              </button>
            )}
            {step < 4 ? (
              <button style={btnStyle(true)} onClick={nextStep}>
                შემდეგი ეტაპი <i className="fa-solid fa-arrow-right"></i>
              </button>
            ) : (
              <button 
                style={{ ...btnStyle(true), backgroundColor: "#10b981" }} 
                onClick={() => {
                  setError("");
                  if (isMinor) {
                    if (!formData.representativeName || !formData.representativeName.trim() ||
                        !formData.representativePersonalId || !formData.representativePersonalId.trim() ||
                        formData.representativePersonalId.trim().length !== 11 ||
                        !formData.representativePhone || !formData.representativePhone.trim() ||
                        !formData.representativeDoc) {
                      setError("გთხოვთ შეავსოთ კანონიერი წარმომადგენლის ყველა ველი და ატვირთოთ დოკუმენტი პირველ ეტაპზე");
                      setStep(1);
                      return;
                    }
                  }
                  
                  if (!formData.idCardDoc) {
                    setError("გთხოვთ ატვირთოთ ID ბარათი / პასპორტი");
                    return;
                  }
                  if (!formData.healthDoc) {
                    setError("გთხოვთ ატვირთოთ ჯანმრთელობის ცნობა");
                    return;
                  }

                  const today = new Date();
                  const memberSince = String(today.getDate()).padStart(2, '0') + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + today.getFullYear();
                  
                  const newAthlete = {
                    id: String(Math.floor(100000 + Math.random() * 900000)),
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    personalId: formData.personalId.trim(),
                    birthDate: formData.birthDate,
                    gender: formData.gender,
                    phone: formData.phone,
                    email: formData.email,
                    address: formData.address,
                    nationality: formData.nationality,
                    height: formData.height,
                    weight: formData.weight,
                    bloodType: formData.bloodType,
                    diabetes: formData.diabetes,
                    asthma: formData.asthma,
                    allergies: formData.allergies,
                    emergencyContactName: formData.emergencyContactName,
                    emergencyContactRelation: formData.emergencyContactRelation,
                    emergencyContactPhone: formData.emergencyContactPhone,
                    photo: formData.photoPreview || "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70),
                    status: "აქტიური",
                    memberSince: memberSince,
                    level: 3,
                    referral: Math.floor(50 + Math.random() * 100),
                    federation: federation,
                    mountaineeringHeight: formData.mountaineeringHeight,
                    mountaineeringCategory: formData.mountaineeringCategory,
                    judoWeight: formData.judoWeight,
                    judoBelt: formData.judoBelt,
                    rugbyPosition: formData.rugbyPosition,
                    isMinor: isMinor,
                    representativeType: isMinor ? formData.representativeType : null,
                    representativeName: isMinor ? formData.representativeName : null,
                    representativePersonalId: isMinor ? formData.representativePersonalId : null,
                    representativePhone: isMinor ? formData.representativePhone : null,
                    representativeDoc: isMinor ? formData.representativeDoc : null,
                    idCardDoc: formData.idCardDoc,
                    healthDoc: formData.healthDoc,
                    insuranceDoc: formData.insuranceDoc,
                    dopingDoc: formData.dopingDoc,
                    sportsDiscipline: formData.sportsDiscipline,
                    isClubMember: formData.isClubMember,
                    clubId: formData.clubId,
                    isFederationMember: true,
                    membershipStatus: "Active",
                    membershipFeePaid: true,
                    isFounder: false,
                    hasVotingRight: !isMinor,
                    isNationalTeamMember: false,
                    isVeteran: false,
                    isMentor: false,
                    achievements: [],
                    biography: ""
                  };
                  
                  onAdd(newAthlete);
                  onViewChange('athletes');
                }}
              >
                დასრულება <i className="fa-solid fa-check"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAthleteForm;
