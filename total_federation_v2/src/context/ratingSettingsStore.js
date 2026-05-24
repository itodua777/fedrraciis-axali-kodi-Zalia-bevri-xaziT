import React from 'react';

const defaultSettings = {
  uiaaDictionary: { "UIAA I": 1, "UIAA II": 2, "UIAA V": 5, "UIAA VI": 10 },
  uiaaStyleMultipliers: { "On-sight": 1.5, "Flash": 1.2, "Solo": 2.0 },
  heightDivisor: 1000,
  ranksEnabled: true,
  ratingCalculationEnabled: true
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
      ratingStoreData.setState({ ranksEnabled: ratingStoreData.state.ranksEnabled !== false ? false : true });
    },
    toggleRatingCalculationEnabled: () => {
      ratingStoreData.setState({ ratingCalculationEnabled: ratingStoreData.state.ratingCalculationEnabled !== false ? false : true });
    }
  };
};

useRatingSettingsStore.getState = () => ratingStoreData.getState();
if (typeof window !== 'undefined') {
  window.useRatingSettingsStore = useRatingSettingsStore;
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
