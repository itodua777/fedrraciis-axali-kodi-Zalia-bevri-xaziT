import React from 'react';

const defaultSettings = {
  uiaaDictionary: { "UIAA I": 1, "UIAA II": 2, "UIAA V": 5, "UIAA VI": 10 },
  uiaaStyleMultipliers: { "On-sight": 1.5, "Flash": 1.2, "Solo": 2.0 },
  heightDivisor: 1000,
  ranksEnabled: true,
  ratingCalculationEnabled: true,
  honoraryTitlesEnabled: true,
  awardsEnabled: true
};

const getPersistedSettings = () => {
  const saved = localStorage.getItem('ratingSettings');
  if (saved) {
    try { return JSON.parse(saved); } catch(e){}
  }
  return defaultSettings;
};

export const ratingStoreData = {
  state: getPersistedSettings(),
  listeners: new Set(),
  getState: function() { return this.state; },
  setState: function(newState) {
    this.state = { ...this.state, ...newState };
    localStorage.setItem('ratingSettings', JSON.stringify(this.state));
    this.listeners.forEach(l => l(this.state));
  },
  subscribe: function(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
};

export const useRatingSettingsStore = () => {
  const [state, setState] = React.useState(ratingStoreData.getState());
  React.useEffect(() => {
    return ratingStoreData.subscribe(setState);
  }, []);
  return {
    ...state,
    updateUiaaPoint: (level, point) => {
      ratingStoreData.setState({ uiaaDictionary: { ...ratingStoreData.state.uiaaDictionary, [level]: point } });
    },
    updateStyleMultiplier: (style, multiplier) => {
      ratingStoreData.setState({ uiaaStyleMultipliers: { ...ratingStoreData.state.uiaaStyleMultipliers, [style]: multiplier } });
    },
    updateHeightDivisor: (divisor) => {
      ratingStoreData.setState({ heightDivisor: divisor });
    },
    addUiaaCategory: (level) => {
      ratingStoreData.setState({ uiaaDictionary: { ...ratingStoreData.state.uiaaDictionary, [level]: 0 } });
    },
    addStyle: (style) => {
      ratingStoreData.setState({ uiaaStyleMultipliers: { ...ratingStoreData.state.uiaaStyleMultipliers, [style]: 1.0 } });
    },
    toggleRanksEnabled: () => {
      const newVal = ratingStoreData.state.ranksEnabled !== false ? false : true;
      ratingStoreData.setState({ ranksEnabled: newVal });
      fetch('/api/v1/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ratingStoreData.getState(), ranksEnabled: newVal })
      }).catch(err => console.error(err));
    },
    toggleRatingCalculationEnabled: () => {
      const newVal = ratingStoreData.state.ratingCalculationEnabled !== false ? false : true;
      ratingStoreData.setState({ ratingCalculationEnabled: newVal });
      fetch('/api/v1/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ratingStoreData.getState(), ratingCalculationEnabled: newVal })
      }).catch(err => console.error(err));
    },
    toggleHonoraryTitlesEnabled: () => {
      const newVal = ratingStoreData.state.honoraryTitlesEnabled !== false ? false : true;
      ratingStoreData.setState({ 
        honoraryTitlesEnabled: newVal,
        honorary_titles_enabled: newVal 
      });
      fetch('/api/v1/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...ratingStoreData.getState(), 
          honoraryTitlesEnabled: newVal,
          honorary_titles_enabled: newVal 
        })
      }).catch(err => console.error(err));
    },
    toggleAwardsEnabled: () => {
      const newVal = ratingStoreData.state.awardsEnabled !== false ? false : true;
      ratingStoreData.setState({ 
        awardsEnabled: newVal,
        awards_enabled: newVal 
      });
      fetch('/api/v1/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...ratingStoreData.getState(), 
          awardsEnabled: newVal,
          awards_enabled: newVal 
        })
      }).catch(err => console.error(err));
    }
  };
};

useRatingSettingsStore.getState = () => ratingStoreData.getState();
if (typeof window !== 'undefined') {
  window.useRatingSettingsStore = useRatingSettingsStore;
  window.ratingStoreData = ratingStoreData;
}

export const calculateRating = (peakHeight, uiaaLevel, style) => {
  const { uiaaDictionary, uiaaStyleMultipliers, heightDivisor, ratingCalculationEnabled } = useRatingSettingsStore.getState();
  if (ratingCalculationEnabled === false) return 0;
  const basePoint = uiaaDictionary[uiaaLevel] ?? 0;
  const styleMultiplier = uiaaStyleMultipliers[style] ?? 1.0;
  const heightMultiplier = peakHeight / heightDivisor;
  const finalScore = basePoint * heightMultiplier * styleMultiplier;
  return Math.round(finalScore);
};
