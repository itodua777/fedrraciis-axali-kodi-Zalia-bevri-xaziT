import React from 'react';
import { COUNTRIES } from '../../utils/countries.js';

const InternationalPhoneInput = ({ value, onChange, placeholder, style, defaultCountry = 'GE' }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFlag = (code) => {
    if (!code) return '🏳️';
    return String.fromCodePoint(...code.toUpperCase().split('').map(c => 127397 + c.charCodeAt(0)));
  };

  const countryDialMap = React.useMemo(() => ({
    "BD": "880", "BE": "32", "BF": "226", "BG": "359", "BA": "387", "BB": "1246", "WF": "681", "BL": "590", "BM": "1441", "BN": "673", "BO": "591", "BH": "973", "BI": "257", "BJ": "229", "BT": "975", "JM": "1876", "BW": "267", "WS": "685", "BQ": "599", "BR": "55", "BS": "1242", "JE": "441534", "BY": "375", "BZ": "501", "RU": "7", "RW": "250", "RS": "381", "TL": "670", "RE": "262", "TM": "993", "TJ": "992", "RO": "40", "TK": "690", "GW": "245", "GU": "1671", "GT": "502", "GR": "30", "GQ": "240", "GP": "590", "JP": "81", "GY": "592", "GG": "441481", "GF": "594", "GE": "995", "GD": "1473", "GB": "44", "GA": "241", "SV": "503", "GN": "224", "GM": "220", "GL": "299", "GI": "350", "GH": "233", "OM": "968", "TN": "216", "JO": "962", "HR": "385", "HT": "509", "HU": "36", "HK": "852", "HN": "504", "VE": "58", "PR": "1787", "PS": "970", "PW": "680", "PT": "351", "SJ": "47", "PY": "595", "IQ": "964", "PA": "507", "PF": "689", "PG": "675", "PE": "51", "PK": "92", "PH": "63", "PN": "870", "PL": "48", "PM": "508", "ZM": "260", "EH": "212", "EE": "372", "EG": "20", "ZA": "27", "EC": "593", "IT": "39", "VN": "84", "SB": "677", "ET": "251", "SO": "252", "ZW": "263", "SA": "966", "ES": "34", "ER": "291", "ME": "382", "MD": "373", "MG": "261", "MF": "590", "MA": "212", "MC": "377", "UZ": "998", "MM": "95", "ML": "223", "MO": "853", "MN": "976", "MH": "692", "MK": "389", "MU": "230", "MT": "356", "MW": "265", "MV": "960", "MQ": "596", "MP": "1670", "MS": "1664", "MR": "222", "IM": "441624", "UG": "256", "TZ": "255", "MY": "60", "MX": "52", "IL": "972", "FR": "33", "IO": "246", "SH": "290", "FI": "358", "FJ": "679", "FK": "500", "FM": "691", "FO": "298", "NI": "505", "NL": "31", "NO": "47", "NA": "264", "VU": "678", "NC": "687", "NE": "227", "NF": "672", "NG": "234", "NZ": "64", "NP": "977", "NR": "674", "NU": "683", "CK": "682", "CI": "225", "CH": "41", "CO": "57", "CN": "86", "CM": "237", "CL": "56", "CC": "61", "CA": "1", "CG": "242", "CF": "236", "CD": "243", "CZ": "420", "CY": "357", "CX": "61", "CR": "506", "CW": "599", "CV": "238", "CU": "53", "SZ": "268", "SY": "963", "SX": "599", "KG": "996", "KE": "254", "SS": "211", "SR": "597", "KI": "686", "KH": "855", "KN": "1869", "KM": "269", "ST": "239", "SK": "421", "KR": "82", "SI": "386", "KP": "850", "KW": "965", "SN": "221", "SM": "378", "SL": "232", "SC": "248", "KZ": "7", "KY": "1345", "SG": "65", "SE": "46", "SD": "249", "DO": "1809", "DM": "1767", "DJ": "253", "DK": "45", "VG": "1284", "DE": "49", "YE": "967", "DZ": "213", "US": "1", "UY": "598", "YT": "262", "UM": "1", "LB": "961", "LC": "1758", "LA": "856", "TV": "688", "TW": "886", "TT": "1868", "TR": "90", "LK": "94", "LI": "423", "LV": "371", "TO": "676", "LT": "370", "LU": "352", "LR": "231", "LS": "266", "TH": "66", "TG": "228", "TD": "235", "TC": "1649", "LY": "218", "VA": "379", "VC": "1784", "AE": "971", "AD": "376", "AG": "1268", "AF": "93", "AI": "1264", "VI": "1340", "IS": "354", "IR": "98", "AM": "374", "AL": "355", "AO": "244", "AS": "1684", "AR": "54", "AU": "61", "AT": "43", "AW": "297", "IN": "91", "AX": "35818", "AZ": "994", "IE": "353", "ID": "62", "UA": "380", "QA": "974", "MZ": "258"
  }), []);

  const MASKS = React.useMemo(() => ({
    "GE": "(999) 99-99-99",
    "US": "(999) 999-9999",
    "CA": "(999) 999-9999",
    "DE": "999 99999999",
    "GB": "99999 999999",
    "FR": "9 99 99 99 99",
    "UA": "99 999 9999",
    "TR": "(999) 999-9999"
  }), []);

  const parseValue = React.useCallback((val) => {
    if (!val || !val.startsWith('+')) {
      return { countryCode: defaultCountry, localNumber: '' };
    }
    const cleanVal = val.slice(1).replace(/\D/g, '');
    const sortedMap = Object.entries(countryDialMap).sort((a, b) => b[1].length - a[1].length);
    for (const [code, dial] of sortedMap) {
      if (cleanVal.startsWith(dial)) {
        return {
          countryCode: code,
          localNumber: cleanVal.slice(dial.length)
        };
      }
    }
    return { countryCode: defaultCountry, localNumber: cleanVal };
  }, [defaultCountry, countryDialMap]);

  const { countryCode, localNumber } = React.useMemo(() => {
    return parseValue(value);
  }, [value, parseValue]);

  const dialCode = countryDialMap[countryCode] || '995';

  const formatWithMask = React.useCallback((digits, template) => {
    let formatted = '';
    let digitIdx = 0;
    for (let i = 0; i < template.length; i++) {
      if (digitIdx >= digits.length) break;
      const char = template[i];
      if (char === '9') {
        formatted += digits[digitIdx++];
      } else {
        formatted += char;
      }
    }
    return formatted;
  }, []);

  const template = MASKS[countryCode] || "999999999999999";
  const formattedValue = React.useMemo(() => {
    return formatWithMask(localNumber, template);
  }, [localNumber, template, formatWithMask]);

  const optionsList = React.useMemo(() => {
    const countriesList = typeof COUNTRIES !== 'undefined' ? COUNTRIES : [];
    return countriesList.map(c => ({
      code: c.code,
      name: c.name,
      dial: countryDialMap[c.code] || ''
    })).filter(c => c.dial);
  }, [countryDialMap]);

  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return optionsList;
    const s = search.toLowerCase();
    return optionsList.filter(opt =>
      opt.name.toLowerCase().includes(s) ||
      opt.code.toLowerCase().includes(s) ||
      opt.dial.includes(s)
    );
  }, [search, optionsList]);

  const handleCountrySelect = (code) => {
    const newDial = countryDialMap[code];
    onChange('+' + newDial + localNumber);
    setIsOpen(false);
    setSearch('');
  };

  const handleInputChange = (e) => {
    const input = e.target;
    const selectionStart = input.selectionStart;
    const valueBeforeCursor = input.value.slice(0, selectionStart);
    const digitsBeforeCursor = valueBeforeCursor.replace(/\D/g, '');
    
    const digits = input.value.replace(/\D/g, '');
    
    onChange('+' + dialCode + digits);
    
    const targetCursorPos = formatWithMask(digitsBeforeCursor, template).length;
    setTimeout(() => {
      if (input) {
        input.setSelectionRange(targetCursorPos, targetCursorPos);
      }
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      const input = e.target;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      if (start === end && start > 0) {
        const charToDelete = input.value[start - 1];
        if (/\D/.test(charToDelete)) {
          const valBeforeCursor = input.value.slice(0, start);
          const digitsBeforeCursor = valBeforeCursor.replace(/\D/g, '');
          if (digitsBeforeCursor.length > 0) {
            e.preventDefault();
            const newDigitsBefore = digitsBeforeCursor.slice(0, -1);
            const digitsAfter = input.value.slice(start).replace(/\D/g, '');
            const newDigits = newDigitsBefore + digitsAfter;
            
            onChange('+' + dialCode + newDigits);
            
            const newCursorPos = formatWithMask(newDigitsBefore, template).length;
            setTimeout(() => {
              if (input) {
                input.setSelectionRange(newCursorPos, newCursorPos);
              }
            }, 0);
          }
        }
      }
    }
  };

  const wrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: isFocused ? '1px solid #22d3ee' : '1px solid rgba(34, 211, 238, 0.3)',
    borderRadius: '8px',
    padding: '2px',
    boxSizing: 'border-box',
    transition: 'all 0.3s',
    boxShadow: isFocused ? '0 0 8px rgba(34, 211, 238, 0.2)' : 'none'
  };

  const selectorStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 12px',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    cursor: 'pointer',
    userSelect: 'none',
    color: '#fff',
    fontSize: '14px',
    minWidth: '75px',
    justifyContent: 'center'
  };

  const inputElStyle = {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    padding: '10px 12px',
    color: '#fff',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '260px',
    zIndex: 1100,
    backgroundColor: '#1b1f24',
    border: '1px solid rgba(34, 211, 238, 0.4)',
    borderRadius: '8px',
    marginTop: '6px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
    maxHeight: '220px',
    overflowY: 'auto'
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div style={wrapperStyle}>
        <div onClick={() => setIsOpen(!isOpen)} style={selectorStyle}>
          <span>{getFlag(countryCode)}</span>
          <span style={{ fontSize: '13px', opacity: 0.9 }}>+{dialCode}</span>
          <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ fontSize: '10px', opacity: 0.6, marginLeft: '2px' }}></i>
        </div>
        <input
          type="text"
          value={formattedValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          style={inputElStyle}
        />
      </div>

      {isOpen && (
        <div style={dropdownStyle}>
          <div style={{ padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, backgroundColor: '#1b1f24', zIndex: 1 }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ძებნა..."
              style={{
                width: '100%',
                padding: '8px 10px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(34, 211, 238, 0.2)',
                borderRadius: '6px',
                color: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
                fontSize: '12px'
              }}
              onClick={e => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div style={{ padding: '4px 0' }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <div
                  key={opt.code}
                  onClick={() => handleCountrySelect(opt.code)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: countryCode === opt.code ? '#22d3ee' : '#e2e8f0',
                    backgroundColor: countryCode === opt.code ? 'rgba(34, 211, 238, 0.08)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = countryCode === opt.code ? 'rgba(34, 211, 238, 0.08)' : 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{getFlag(opt.code)}</span>
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px' }}>{opt.name}</span>
                  </div>
                  <span style={{ fontSize: '12px', opacity: 0.6 }}>+{opt.dial}</span>
                </div>
              ))
            ) : (
              <div style={{ padding: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                ქვეყანა ვერ მოიძებნა
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InternationalPhoneInput;
