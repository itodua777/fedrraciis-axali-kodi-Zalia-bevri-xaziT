import React from 'react';

const NewsPublicationForm = ({ newsData, setNewsData, tagInput, setTagInput, handleTagKeyDown, removeTag, handleThumbnailChange, handleSubmitNews }) => {
  const panelStyle = {
    backgroundColor: "rgba(15, 23, 42, 0.6)", border: "1px solid color-mix(in oklab, var(--color-emerald-core) 10%, transparent)",
    borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
    overflowY: "auto"
  };

  const inputStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "8px", padding: "12px", color: "#fff", outline: "none", width: "100%", boxSizing: "border-box",
    transition: "all 0.3s"
  };

  const focusStyle = (e) => {
    e.target.style.borderColor = "var(--color-emerald-core)";
    e.target.style.boxShadow = "0 0 8px color-mix(in oklab, var(--color-emerald-core) 30%, transparent)";
  };

  const blurStyle = (e) => {
    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
    e.target.style.boxShadow = "none";
  };

  const primaryBtnStyle = {
    backgroundColor: "var(--color-emerald-core)", color: "#121418", border: "none", padding: "12px 20px",
    borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.3s"
  };

  return (
    <div style={{ ...panelStyle, flex: 1, minWidth: "350px", gap: "25px" }}>
      <div>
        <h2 style={{ color: "var(--color-emerald-core)", margin: "0 0 20px 0" }}>სიახლეების პუბლიკაცია</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>სათაური</label>
            <input type="text" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} placeholder="სიახლის სათაური..." value={newsData.title} onChange={e => setNewsData({...newsData, title: e.target.value})} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>კატეგორია</label>
            <select style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} value={newsData.category} onChange={e => setNewsData({...newsData, category: e.target.value})}>
              <option value="სიახლე">სიახლე</option>
              <option value="ექსპედიცია">ექსპედიცია</option>
              <option value="განცხადება">განცხადება</option>
              <option value="ღონისძიება">ღონისძიება</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>თეგები (Enter დასამატებლად)</label>
            <input
              type="text"
              style={inputStyle}
              onFocus={focusStyle}
              onBlur={blurStyle}
              placeholder="მაგ: #ყაზბეგი, #საალპინისტო..."
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
            {newsData.tags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                {newsData.tags.map((tag, idx) => (
                  <span key={idx} style={{
                    backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)",
                    border: "1px solid color-mix(in oklab, var(--color-emerald-core) 30%, transparent)",
                    borderRadius: "16px",
                    padding: "2px 8px",
                    fontSize: "12px",
                    color: "var(--color-emerald-core)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    {tag}
                    <i className="fa-solid fa-xmark" style={{ cursor: "pointer", fontSize: "10px", color: "color-mix(in oklab, var(--color-emerald-core) 70%, transparent)" }} onClick={() => removeTag(tag)}></i>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>ტექსტი</label>
            <textarea style={{ ...inputStyle, height: "120px", resize: "vertical" }} onFocus={focusStyle} onBlur={blurStyle} placeholder="ვრცელი ტექსტი..." value={newsData.content} onChange={e => setNewsData({...newsData, content: e.target.value})}></textarea>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>მთავარი ფოტო (Thumbnail)</label>
            <input type="file" accept="image/*" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} onChange={handleThumbnailChange} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>სტატუსი</label>
            <select style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} value={newsData.status} onChange={e => setNewsData({...newsData, status: e.target.value})}>
              <option value="Draft">Draft (დრაფტი)</option>
              <option value="Scheduled">Scheduled (დაგეგმილი)</option>
              <option value="Published">Published (გამოქვეყნებული)</option>
            </select>
          </div>
          {newsData.status === 'Scheduled' && (
            <div style={{
              backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 5%, transparent)",
              border: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)",
              borderRadius: "8px",
              padding: "12px",
              marginTop: "5px"
            }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", color: "var(--color-emerald-core)", fontWeight: "bold" }}>
                <i className="fa-regular fa-clock" style={{ marginRight: "6px" }}></i> პუბლიკაციის დრო
              </label>
              <input
                type="datetime-local"
                style={{
                  ...inputStyle,
                  borderColor: "color-mix(in oklab, var(--color-emerald-core) 40%, transparent)",
                  backgroundColor: "rgba(18, 20, 24, 0.8)",
                  color: "#fff"
                }}
                onFocus={focusStyle}
                onBlur={blurStyle}
                value={newsData.publish_at}
                onChange={e => setNewsData({...newsData, publish_at: e.target.value})}
              />
            </div>
          )}
          <button onClick={handleSubmitNews} style={{ ...primaryBtnStyle, marginTop: "10px" }} onMouseOver={e => e.target.style.boxShadow = "0 0 15px color-mix(in oklab, var(--color-emerald-core) 50%, transparent)"} onMouseOut={e => e.target.style.boxShadow = "none"}>
            <i className="fa-solid fa-paper-plane"></i> ინფორმაციის განთავსება
          </button>
        </div>
      </div>

      {/* Live Preview Block */}
      <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h3 style={{ color: "var(--color-emerald-core)", margin: 0, fontSize: "15px", textTransform: "uppercase", letterSpacing: "1px" }}>
            <i className="fa-solid fa-eye" style={{ marginRight: "6px" }}></i> Live Preview (წინასწარი გადახედვა)
          </h3>
          <span style={{ fontSize: "11px", backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", color: "var(--color-emerald-core)", padding: "2px 8px", borderRadius: "10px" }}>აქტიურია</span>
        </div>

        <div style={{
          backgroundColor: "rgba(10, 15, 30, 0.8)",
          border: "1px solid color-mix(in oklab, var(--color-emerald-core) 20%, transparent)",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7), inset 0 0 15px color-mix(in oklab, var(--color-emerald-core) 5%, transparent)",
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ height: "160px", position: "relative", backgroundColor: "rgba(255, 255, 255, 0.02)", overflow: "hidden" }}>
            {newsData.thumbnailUrl ? (
              <img src={newsData.thumbnailUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Thumbnail Preview" />
            ) : (
              <div style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, color-mix(in oklab, var(--color-emerald-core) 10%, transparent) 0%, rgba(18, 20, 24, 0.8) 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.2)"
              }}>
                <i className="fa-solid fa-mountain" style={{ fontSize: "36px", marginBottom: "8px", color: "color-mix(in oklab, var(--color-emerald-core) 30%, transparent)" }}></i>
                <span style={{ fontSize: "11px" }}>ფოტო არ არის</span>
              </div>
            )}

            <span style={{
              position: "absolute",
              top: "12px",
              left: "12px",
              backgroundColor: newsData.category === 'სიახლე' ? "var(--color-emerald-core)" :
                               newsData.category === 'ექსპედიცია' ? "#f59e0b" :
                               newsData.category === 'განცხადება' ? "#ef4444" : "#a855f7",
              color: newsData.category === 'განცხადება' || newsData.category === 'ექსპედიცია' ? "#fff" : "#121418",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "10px",
              fontWeight: "bold",
              textTransform: "uppercase",
              boxShadow: "0 4px 10px rgba(0,0,0,0.5)"
            }}>
              {newsData.category}
            </span>

            <span style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              backgroundColor: "rgba(18, 20, 24, 0.8)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              padding: "2px 8px",
              borderRadius: "6px",
              fontSize: "10px"
            }}>
              {newsData.status === 'Draft' ? 'დრაფტი' :
               newsData.status === 'Scheduled' ? 'დაგეგმილი' : 'გამოქვეყნებული'}
            </span>
          </div>

          <div style={{ padding: "15px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
              <i className="fa-regular fa-calendar"></i>
              <span>
                {newsData.status === 'Scheduled' && newsData.publish_at ? (
                  <span>გამოქვეყნება: {newsData.publish_at.replace('T', ' ')}</span>
                ) : (
                  <span>დღეს (2026-05-24)</span>
                )}
              </span>
            </div>

            <h4 style={{
              margin: 0,
              fontSize: "16px",
              color: "#fff",
              fontWeight: "bold",
              lineHeight: "1.3",
              wordBreak: "break-word"
            }}>
              {newsData.title || "საჩვენებელი სათაური"}
            </h4>

            <p style={{
              margin: 0,
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.6)",
              lineHeight: "1.5",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-word"
            }}>
              {newsData.content || "აქ გამოჩნდება სიახლის ძირითადი ტექსტი..."}
            </p>

            {newsData.tags.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "5px" }}>
                {newsData.tags.map((tag, idx) => (
                  <span key={idx} style={{
                    fontSize: "11px",
                    color: "color-mix(in oklab, var(--color-emerald-core) 80%, transparent)",
                    marginRight: "4px"
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "5px" }}>თეგები არ არის</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPublicationForm;
