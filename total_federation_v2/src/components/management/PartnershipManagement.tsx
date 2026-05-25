import React from 'react';

export interface Partnership {
  partnership_id: string;
  type: 'SPONSOR' | 'PARTNER';
  name: string;
  valid_from: string;
  valid_to: string;
  description: string;
  contract_file_url: string | null;
  partnership_form: string | null; // Only for PARTNER
}

const PartnershipManagement: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'SPONSOR' | 'PARTNER'>('SPONSOR');
  const [partnerships, setPartnerships] = React.useState<Partnership[]>(() => {
    const saved = localStorage.getItem('federation_partnerships');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default initial data converted to simplified format
    return [
      {
            "partnership_id": "PTN-2026-01",
            "type": "SPONSOR",
            "name": "Red Bull Georgia",
            "valid_from": "2026-01-01",
            "valid_to": "2026-07-04",
            "description": "ზამთრის ჩემპიონატის გენერალური სპონსორი.",
            "contract_file_url": "/storage/contracts/redbull_2026.pdf",
            "partnership_form": null
      },
      {
            "partnership_id": "PTN-2026-02",
            "type": "PARTNER",
            "name": "Alta",
            "valid_from": "2026-01-01",
            "valid_to": "2026-12-31",
            "description": "ტექნიკური მხარდაჭერა და ეკიპირების უზრუნველყოფა.",
            "contract_file_url": null,
            "partnership_form": "ეკიპირების პარტნიორი"
      },
      {
            "partnership_id": "PTN-2026-03",
            "type": "PARTNER",
            "name": "Aversi",
            "valid_from": "2026-01-01",
            "valid_to": "2026-12-31",
            "description": "სამედიცინო მხარდაჭერა და უფასო დაზღვევა სპორტსმენებისთვის.",
            "contract_file_url": null,
            "partnership_form": "სამედიცინო მხარდაჭერა"
      },
      {
            "partnership_id": "PTN-2026-04",
            "type": "PARTNER",
            "name": "Silknet",
            "valid_from": "2026-01-01",
            "valid_to": "2026-12-31",
            "description": "საკომუნიკაციო მხარდაჭერა და ინტერნეტი ბაზებზე.",
            "contract_file_url": null,
            "partnership_form": "კავშირგაბმულობის პარტნიორი"
      },
      {
            "partnership_id": "PTN-2026-05",
            "type": "PARTNER",
            "name": "Guda",
            "valid_from": "2026-02-01",
            "valid_to": "2026-12-31",
            "description": "ლოჯისტიკა და ტრანსპორტირება ექსპედიციებისთვის.",
            "contract_file_url": null,
            "partnership_form": "ლოჯისტიკის პარტნიორი"
      },
      {
            "partnership_id": "PTN-2026-06",
            "type": "PARTNER",
            "name": "Lilo Mall",
            "valid_from": "2026-01-10",
            "valid_to": "2026-12-31",
            "description": "ინვენტარის პარტნიორი და ფასდაკლებები საწყობისთვის.",
            "contract_file_url": null,
            "partnership_form": "ინვენტარის პარტნიორი"
      },
      {
            "partnership_id": "PTN-2026-07",
            "type": "PARTNER",
            "name": "Water Co",
            "valid_from": "2026-03-01",
            "valid_to": "2026-12-31",
            "description": "სასმელი წყლის მიწოდება მთაში მყოფი წევრებისთვის.",
            "contract_file_url": null,
            "partnership_form": "წყლის მიწოდება"
      },
      {
            "partnership_id": "PTN-2026-08",
            "type": "PARTNER",
            "name": "Active Life",
            "valid_from": "2026-01-01",
            "valid_to": "2026-12-31",
            "description": "ფიტნეს პარტნიორი და საწვრთნელი დარბაზი.",
            "contract_file_url": null,
            "partnership_form": "საწვრთნელი პარტნიორი"
      },
      {
            "partnership_id": "PTN-2026-09",
            "type": "PARTNER",
            "name": "Mountain Rescue",
            "valid_from": "2026-01-01",
            "valid_to": "2026-12-31",
            "description": "სამაშველო კავშირი და უსაფრთხოების მემორანდუმი.",
            "contract_file_url": null,
            "partnership_form": "სამაშველო პარტნიორი"
      }
];
  });

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedItem, setSelectedItem] = React.useState<Partnership | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState<{ name: string; data?: string } | null>(null);
  const [editingItem, setEditingItem] = React.useState<Partnership | null>(null);
  const [hoveredItemId, setHoveredItemId] = React.useState<string | null>(null);

  // Form State
  const [formData, setFormData] = React.useState({
    name: '',
    valid_from: '',
    valid_to: '',
    description: '',
    partnership_form: '',
    contract_file_url: '' as string | null
  });

  const startEdit = (item: Partnership, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setIsCreating(false);
    setSelectedItem(null);
    setFormData({
      name: item.name,
      valid_from: item.valid_from,
      valid_to: item.valid_to,
      description: item.description,
      partnership_form: item.partnership_form || '',
      contract_file_url: item.contract_file_url
    });
    if (item.contract_file_url) {
      setUploadedFile({ name: item.contract_file_url.split('/').pop() || 'ხელშეკრულება.pdf' });
    } else {
      setUploadedFile(null);
    }
  };

  React.useEffect(() => {
    localStorage.setItem('federation_partnerships', JSON.stringify(partnerships));
  }, [partnerships]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim()) {
      setErrorMsg("დასახელების მითითება სავალდებულოა!");
      return;
    }
    if (!formData.valid_from || !formData.valid_to) {
      setErrorMsg("აქტივობის პერიოდის მითითება სავალდებულოა!");
      return;
    }
    if (new Date(formData.valid_from) > new Date(formData.valid_to)) {
      setErrorMsg("დაწყების თარიღი არ შეიძლება აღემატებოდეს დასრულების თარიღს!");
      return;
    }

    if (editingItem) {
      const updatedPartnership: Partnership = {
        ...editingItem,
        name: formData.name.trim(),
        valid_from: formData.valid_from,
        valid_to: formData.valid_to,
        description: formData.description.trim(),
        contract_file_url: activeTab === 'SPONSOR' ? (formData.contract_file_url || null) : null,
        partnership_form: activeTab === 'PARTNER' ? (formData.partnership_form.trim() || 'სხვა') : null
      };

      try {
        const response = await fetch(`/api/partnerships?id=${editingItem.partnership_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedPartnership)
        });

        if (!response.ok) {
          throw new Error("სერვერზე მონაცემების განახლება ვერ მოხერხდა.");
        }

        const resData = await response.json();
        if (resData.success) {
          setPartnerships(prev => prev.map(p => p.partnership_id === editingItem.partnership_id ? updatedPartnership : p));
          setEditingItem(null);
          resetForm();
        } else {
          throw new Error(resData.error || "შეცდომა განახლებისას");
        }
      } catch (err: any) {
        console.error("ხელშეკრულება ვერ განახლდა სერვერზე:", err);
        setErrorMsg(err.message || "კავშირის შეცდომა სერვერთან.");
      }
    } else {
      const newPartnership: Partnership = {
        partnership_id: `PTN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        type: activeTab,
        name: formData.name.trim(),
        valid_from: formData.valid_from,
        valid_to: formData.valid_to,
        description: formData.description.trim(),
        contract_file_url: activeTab === 'SPONSOR' ? (formData.contract_file_url || null) : null,
        partnership_form: activeTab === 'PARTNER' ? (formData.partnership_form.trim() || 'სხვა') : null
      };

      setPartnerships(prev => [newPartnership, ...prev]);
      setIsCreating(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      valid_from: '',
      valid_to: '',
      description: '',
      partnership_form: '',
      contract_file_url: null
    });
    setUploadedFile(null);
    setErrorMsg(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("ნამდვილად გსურთ ხელშეკრულების წაშლა რეესტრიდან?")) {
      setPartnerships(prev => prev.filter(p => p.partnership_id !== id));
      if (selectedItem?.partnership_id === id) {
        setSelectedItem(null);
      }
      if (editingItem?.partnership_id === id) {
        setEditingItem(null);
        resetForm();
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg(null);

    try {
      // Send file to Node server /api/upload
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.file_url) {
          setFormData(prev => ({ ...prev, contract_file_url: data.file_url }));
          setUploadedFile({ name: file.name });
        } else {
          throw new Error("სერვერმა ვერ დააბრუნა ფაილის ლინკი");
        }
      } else {
        throw new Error("HTTP კავშირის შეცდომა");
      }
    } catch (err) {
      console.warn("ხელშეკრულება ვერ აიტვირთა სერვერზე. გამოიყენება ლოკალური სიმულაცია.", err);
      // Fallback: Read locally as Data URL and mock file path
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          contract_file_url: `/storage/contracts/${file.name}`
        }));
        setUploadedFile({
          name: file.name,
          data: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadSimulatedFile = (item: Partnership) => {
    if (!item.contract_file_url) return;
    
    // Check if we have matching local uploaded file data (for simulated uploads in memory)
    if (uploadedFile && uploadedFile.name === item.contract_file_url.split('/').pop() && uploadedFile.data) {
      const link = document.createElement('a');
      link.href = uploadedFile.data;
      link.download = uploadedFile.name;
      link.click();
    } else {
      // Direct file download/open link
      window.open(item.contract_file_url, '_blank');
    }
  };

  const isContractActive = (from: string, to: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(from);
    const endDate = new Date(to);
    return today >= startDate && today <= endDate;
  };

  // Filtered List
  const filteredItems = React.useMemo(() => {
    return partnerships.filter(item => {
      if (item.type !== activeTab) return false;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.partnership_form && item.partnership_form.toLowerCase().includes(query))
      );
    });
  }, [partnerships, activeTab, searchQuery]);

  // Brutalist Custom styles
  const containerStyle = {
    flex: 1,
    padding: "30px",
    backgroundColor: "#121418",
    color: "#e2e8f0",
    fontFamily: "sans-serif",
    display: "flex",
    gap: "25px",
    height: "100%",
    boxSizing: "border-box" as const,
    overflow: "hidden"
  };

  const mainPanelStyle = {
    flex: selectedItem || isCreating ? 2 : 3,
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
    height: "100%",
    overflowY: "auto" as const
  };

  const sidebarStyle = {
    flex: 1,
    minWidth: "320px",
    maxWidth: "450px",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    border: "2px solid color-mix(in oklab, var(--color-emerald-core) 15%, transparent)",
    borderRadius: "0px", // Sharp brutalist borders
    padding: "24px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
    overflowY: "auto" as const,
    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
    animation: "slideIn 0.3s ease"
  };

  const cardStyle = (isSelected: boolean) => ({
    backgroundColor: "rgba(30, 41, 59, 0.35)",
    border: isSelected ? "2px solid var(--color-emerald-core)" : "1px solid rgba(255,255,255,0.08)",
    padding: "16px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    position: "relative" as const,
    boxShadow: isSelected ? "0 0 15px color-mix(in oklab, var(--color-emerald-core) 20%, transparent)" : "none"
  });

  const tabStyle = (tab: 'SPONSOR' | 'PARTNER') => ({
    flex: 1,
    padding: "12px",
    backgroundColor: activeTab === tab ? "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)" : "transparent",
    color: activeTab === tab ? "var(--color-emerald-core)" : "rgba(255,255,255,0.4)",
    border: activeTab === tab ? "2px solid var(--color-emerald-core)" : "1px solid rgba(255,255,255,0.1)",
    fontSize: "14px",
    fontWeight: "bold" as const,
    cursor: "pointer",
    transition: "all 0.3s ease",
    textAlign: "center" as const
  });

  const inputStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    outline: "none",
    fontSize: "13px",
    boxSizing: "border-box" as const,
    transition: "border-color 0.3s"
  };

  const labelStyle = {
    fontSize: "11px",
    color: "rgba(255,255,255,0.45)",
    textTransform: "uppercase" as const,
    fontWeight: "bold" as const,
    marginBottom: "5px",
    display: "block"
  };

  const buttonStyle = {
    backgroundColor: "var(--color-emerald-core)",
    color: "#121418",
    border: "none",
    padding: "12px 20px",
    fontWeight: "bold" as const,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.3s ease"
  };

  return (
    <div style={containerStyle}>
      <div style={mainPanelStyle}>
        
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, color: "#fff", fontSize: "22px", fontWeight: "bold" }}>
              🤝 პარტნიორობა & ხელშეკრულებები
            </h2>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
              სპონსორების, მემორანდუმებისა და იურიდიული პარტნიორობის რეესტრი
            </span>
          </div>
          <button 
            style={buttonStyle} 
            onClick={() => { resetForm(); setIsCreating(true); setEditingItem(null); setSelectedItem(null); }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 15px color-mix(in oklab, var(--color-emerald-core) 50%, transparent)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            <i className="fa-solid fa-plus"></i> 
            {activeTab === 'SPONSOR' ? "სპონსორის დამატება" : "პარტნიორის დამატება"}
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button style={tabStyle('SPONSOR')} onClick={() => { setActiveTab('SPONSOR'); setSelectedItem(null); setIsCreating(false); setEditingItem(null); }}>
            🏆 სპონსორები
          </button>
          <button style={tabStyle('PARTNER')} onClick={() => { setActiveTab('PARTNER'); setSelectedItem(null); setIsCreating(false); setEditingItem(null); }}>
            🤝 პარტნიორები
          </button>
        </div>

        {/* Search Input */}
        <div style={{ position: "relative" }}>
          <input 
            type="text" 
            placeholder={activeTab === 'SPONSOR' ? "ძიება სპონსორის სახელით ან აღწერით..." : "ძიება პარტნიორის სახელით, აღწერით ან ფორმით..."}
            style={inputStyle}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <i className="fa-solid fa-magnifying-glass" style={{ position: "absolute", right: "12px", top: "12px", color: "rgba(255,255,255,0.3)" }}></i>
        </div>

        {/* Partnerships list */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px", contentAlign: "start" }}>
          {filteredItems.map(item => {
            const isActive = isContractActive(item.valid_from, item.valid_to);
            const isSelected = selectedItem?.partnership_id === item.partnership_id;

            return (
              <div 
                key={item.partnership_id} 
                style={cardStyle(isSelected)}
                onClick={() => { setSelectedItem(item); setIsCreating(false); setEditingItem(null); }}
                onMouseEnter={e => {
                  setHoveredItemId(item.partnership_id);
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "color-mix(in oklab, var(--color-emerald-core) 40%, transparent)";
                    e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.5)";
                  }
                }}
                onMouseLeave={e => {
                  setHoveredItemId(null);
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.backgroundColor = "rgba(30, 41, 59, 0.35)";
                  }
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "15px", fontWeight: "bold", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", flex: 1 }}>
                    {item.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      padding: "3px 8px",
                      fontSize: "10px",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      backgroundColor: isActive ? "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)" : "rgba(239, 68, 68, 0.1)",
                      border: `1.5px solid ${isActive ? 'var(--color-emerald-core)' : '#ef4444'}`,
                      color: isActive ? 'var(--color-emerald-core)' : '#f87171'
                    }}>
                      {isActive ? "Active" : "Expired"}
                    </div>
                    <button
                      onClick={(e) => startEdit(item, e)}
                      style={{
                        background: hoveredItemId === item.partnership_id ? "color-mix(in oklab, var(--color-emerald-core) 20%, transparent)" : "rgba(255, 255, 255, 0.05)",
                        border: hoveredItemId === item.partnership_id ? "1px solid var(--color-emerald-core)" : "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "0px",
                        color: hoveredItemId === item.partnership_id ? "var(--color-emerald-core)" : "rgba(255, 255, 255, 0.3)",
                        cursor: "pointer",
                        padding: "3px 6px",
                        fontSize: "11px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        transition: "all 0.25s ease",
                        opacity: hoveredItemId === item.partnership_id ? 1 : 0.4
                      }}
                      title="რედაქტირება"
                    >
                      <i className="fa-solid fa-pen" style={{ fontSize: "10px" }}></i>
                    </button>
                  </div>
                </div>

                {item.partnership_form && (
                  <div style={{ fontSize: "11px", color: "var(--color-emerald-core)", display: "inline-flex", alignItems: "center", gap: "5px", fontWeight: "bold" }}>
                    <i className="fa-solid fa-tag"></i> {item.partnership_form}
                  </div>
                )}

                <p style={{ margin: "5px 0 10px 0", color: "rgba(255,255,255,0.5)", fontSize: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", lineHeight: "1.4" }}>
                  {item.description}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "10px", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                  <span>
                    <i className="fa-solid fa-calendar-days"></i> {item.valid_from} — {item.valid_to}
                  </span>
                  {item.contract_file_url && (
                    <span style={{ color: "var(--color-emerald-core)" }} title="ხელშეკრულება მიბმულია">
                      <i className="fa-solid fa-file-pdf"></i> PDF
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div style={{ gridColumn: "1 / -1", padding: "40px 20px", textAlign: "center", color: "rgba(255,255,255,0.3)", border: "1px dashed rgba(255,255,255,0.1)" }}>
              მონაცემები არ არის
            </div>
          )}
        </div>
      </div>

      {/* Right Side Panel: Details or Create */}
      {selectedItem && !isCreating && !editingItem && (
        <div style={sidebarStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px" }}>
            <h3 style={{ margin: 0, color: "var(--color-emerald-core)", fontSize: "16px", fontWeight: "bold" }}>დეტალები</h3>
            <button 
              onClick={() => setSelectedItem(null)}
              style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: "16px" }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ padding: "20px", backgroundColor: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", borderRadius: "0px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 15px auto", border: "1.5px solid var(--color-emerald-core)" }}>
                <i className={selectedItem.type === 'SPONSOR' ? "fa-solid fa-trophy" : "fa-solid fa-handshake"} style={{ fontSize: "20px", color: "var(--color-emerald-core)" }}></i>
              </div>
              <h3 style={{ margin: "0 0 5px 0", color: "#fff", fontSize: "16px" }}>{selectedItem.name}</h3>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>
                {selectedItem.type === 'SPONSOR' ? "სპონსორი" : "პარტნიორი"}
              </span>
            </div>

            {selectedItem.partnership_form && (
              <div>
                <span style={labelStyle}>პარტნიორობის ფორმა</span>
                <div style={{ fontSize: "13px", color: "#fff", fontWeight: "bold" }}>{selectedItem.partnership_form}</div>
              </div>
            )}

            <div>
              <span style={labelStyle}>აქტივობის პერიოდი</span>
              <div style={{ fontSize: "13px", color: "#fff" }}>
                <i className="fa-solid fa-calendar-check" style={{ marginRight: "6px", color: "var(--color-emerald-core)" }}></i>
                {selectedItem.valid_from} — {selectedItem.valid_to}
              </div>
            </div>

            <div>
              <span style={labelStyle}>იდენტიფიკატორი</span>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontFamily: "monospace" }}>{selectedItem.partnership_id}</div>
            </div>

            <div>
              <span style={labelStyle}>ხელშეკრულების აღწერა</span>
              <div style={{ fontSize: "13px", color: "#e2e8f0", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
                {selectedItem.description}
              </div>
            </div>

            {selectedItem.type === 'SPONSOR' && (
              <div>
                <span style={labelStyle}>დოკუმენტაცია</span>
                {selectedItem.contract_file_url ? (
                  <button 
                    onClick={() => handleDownloadSimulatedFile(selectedItem)}
                    style={{
                      ...buttonStyle,
                      width: "100%",
                      backgroundColor: "transparent",
                      border: "1.5px solid var(--color-emerald-core)",
                      color: "var(--color-emerald-core)"
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <i className="fa-solid fa-file-pdf"></i> ხელშეკრულების ნახვა
                  </button>
                ) : (
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                    <i className="fa-solid fa-circle-info"></i> ხელშეკრულება არ არის მიბმული
                  </div>
                )}
              </div>
            )}

            <button 
              onClick={() => handleDelete(selectedItem.partnership_id)}
              style={{
                ...buttonStyle,
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1.5px solid #ef4444",
                color: "#f87171",
                marginTop: "10px"
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.2)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)"}
            >
              <i className="fa-solid fa-trash-can"></i> წაშლა
            </button>
          </div>
        </div>
      )}

      {(isCreating || editingItem) && (
        <div style={sidebarStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px" }}>
            <h3 style={{ margin: 0, color: "var(--color-emerald-core)", fontSize: "16px", fontWeight: "bold" }}>
              {editingItem 
                ? (activeTab === 'SPONSOR' ? "✏️ სპონსორის რედაქტირება" : "✏️ პარტნიორის რედაქტირება")
                : (activeTab === 'SPONSOR' ? "➕ ახალი სპონსორის დამატება" : "➕ ახალი პარტნიორის დამატება")}
            </h3>
            <button 
              onClick={() => { setIsCreating(false); setEditingItem(null); resetForm(); }}
              style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: "16px" }}
            >
              ✕
            </button>
          </div>

          {errorMsg && (
            <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", color: "#f87171", padding: "10px", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <i className="fa-solid fa-triangle-exclamation"></i>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={labelStyle}>დასახელება *</label>
              <input 
                type="text" 
                placeholder="ორგანიზაციის ან ფიზიკური პირის დასახელება..."
                style={inputStyle}
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {activeTab === 'PARTNER' && (
              <div>
                <label style={labelStyle}>პარტნიორობის ფორმა *</label>
                <select 
                  style={inputStyle}
                  value={formData.partnership_form}
                  onChange={e => setFormData({ ...formData, partnership_form: e.target.value })}
                >
                  <option value="">აირჩიეთ ფორმა...</option>
                  <option value="მედია პარტნიორი">მედია პარტნიორი</option>
                  <option value="ეკიპირების პარტნიორი">ეკიპირების პარტნიორი</option>
                  <option value="სამედიცინო მხარდაჭერა">სამედიცინო მხარდაჭერა</option>
                  <option value="იურიდიული პარტნიორი">იურიდიული პარტნიორი</option>
                  <option value="სხვა პარტნიორობა">სხვა პარტნიორობა</option>
                </select>
                <input 
                  type="text" 
                  placeholder="ან ჩაწერეთ სხვა ფორმა..."
                  style={{ ...inputStyle, marginTop: "5px" }}
                  value={formData.partnership_form}
                  onChange={e => setFormData({ ...formData, partnership_form: e.target.value })}
                />
              </div>
            )}

            <div>
              <label style={labelStyle}>აქტივობის პერიოდი *</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input 
                  type="date" 
                  style={inputStyle}
                  value={formData.valid_from}
                  onChange={e => setFormData({ ...formData, valid_from: e.target.value })}
                />
                <span style={{ color: "rgba(255,255,255,0.4)" }}>—</span>
                <input 
                  type="date" 
                  style={inputStyle}
                  value={formData.valid_to}
                  onChange={e => setFormData({ ...formData, valid_to: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>აღწერა</label>
              <textarea 
                placeholder="აღწერა ან ხელშეკრულების მოკლე შინაარსი..."
                style={{ 
                  ...inputStyle, 
                  height: "80px", 
                  resize: "vertical", 
                  minHeight: "60px",
                  fontFamily: "sans-serif"
                }}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {activeTab === 'SPONSOR' && (
              <div>
                <label style={labelStyle}>გაფორმებული ხელშეკრულების მიბმა</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{
                    border: "1px dashed color-mix(in oklab, var(--color-emerald-core) 40%, transparent)",
                    padding: "16px",
                    textAlign: "center",
                    cursor: "pointer",
                    color: uploading ? "rgba(255,255,255,0.3)" : "var(--color-emerald-core)",
                    backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 3%, transparent)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px"
                  }}
                  onMouseEnter={e => { if (!uploading) e.currentTarget.style.borderColor = "var(--color-emerald-core)"; }}
                  onMouseLeave={e => { if (!uploading) e.currentTarget.style.borderColor = "color-mix(in oklab, var(--color-emerald-core) 40%, transparent)"; }}
                  >
                    <input 
                      type="file" 
                      accept=".pdf,.docx,.doc,image/*" 
                      style={{ display: "none" }} 
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                    <i className={uploading ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-paperclip"} style={{ fontSize: "18px" }}></i>
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      {uploading ? "იტვირთება..." : "📎 მიაბით გაფორმებული ხელშეკრულება (PDF)"}
                    </span>
                  </label>
                  
                  {uploadedFile && (
                    <div style={{
                      backgroundColor: "rgba(16, 185, 129, 0.08)",
                      border: "1px solid #10b981",
                      padding: "8px 12px",
                      fontSize: "12px",
                      color: "#34d399",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", flex: 1, marginRight: "10px" }}>
                        <i className="fa-solid fa-file-pdf"></i> {uploadedFile.name}
                      </span>
                      <button 
                        type="button"
                        onClick={() => { setUploadedFile(null); setFormData(prev => ({ ...prev, contract_file_url: null })); }}
                        style={{ background: "transparent", border: "none", color: "#f87171", cursor: "pointer" }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button 
                type="button" 
                onClick={() => { setIsCreating(false); setEditingItem(null); resetForm(); }}
                style={{
                  ...buttonStyle,
                  flex: 1,
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff"
                }}
              >
                გაუქმება
              </button>
              <button 
                type="submit"
                style={{
                  ...buttonStyle,
                  flex: 1
                }}
              >
                {editingItem ? "ცვლილებების შენახვა" : "💾 შენახვა"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PartnershipManagement;
