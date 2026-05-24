import React from 'react';

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const defaultRanksStore = {
  ranks: [
    { id: '1', name: 'III თანრიგი', requiredPoints: 100, status: 'აქტიური' },
    { id: '2', name: 'II თანრიგი', requiredPoints: 300, status: 'აქტიური' },
    { id: '3', name: 'I თანრიგი', requiredPoints: 600, status: 'აქტიური' },
    { id: '4', name: 'სოკ', requiredPoints: 1000, status: 'აქტიური' },
    { id: '5', name: 'სპორტის ოსტატი', requiredPoints: 2000, status: 'აქტიური' }
  ],
  honoraryTitles: [
    { id: '1', name: 'თოვლის ჯიქი (Snow Leopard)', description: '5 შვიდიათასიანის დალაშქვრისთვის', status: 'აქტიური' }
  ]
};

const getPersistedRanks = () => {
  const saved = localStorage.getItem('ranksStore');
  if (saved) {
    try { return JSON.parse(saved); } catch(e){}
  }
  return defaultRanksStore;
};

export const ranksStoreData = {
  state: getPersistedRanks(),
  listeners: new Set(),
  getState: function() { return this.state; },
  setState: function(newState) {
    this.state = { ...this.state, ...newState };
    localStorage.setItem('ranksStore', JSON.stringify(this.state));
    this.listeners.forEach(l => l(this.state));
  },
  subscribe: function(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
};

export const useRanksStore = () => {
  const [state, setState] = React.useState(ranksStoreData.getState());
  React.useEffect(() => {
    return ranksStoreData.subscribe(setState);
  }, []);
  return {
    ...state,
    addRank: () => ranksStoreData.setState({ ranks: [...ranksStoreData.state.ranks, { id: generateUUID(), name: '', requiredPoints: 0, status: 'აქტიური' }] }),
    updateRank: (id, field, value) => ranksStoreData.setState({ ranks: ranksStoreData.state.ranks.map(r => r.id === id ? { ...r, [field]: value } : r) }),
    removeRank: (id) => ranksStoreData.setState({ ranks: ranksStoreData.state.ranks.filter(r => r.id !== id) }),
    addHonoraryTitle: () => ranksStoreData.setState({ honoraryTitles: [...ranksStoreData.state.honoraryTitles, { id: generateUUID(), name: '', description: '', status: 'აქტიური' }] }),
    updateHonoraryTitle: (id, field, value) => ranksStoreData.setState({ honoraryTitles: ranksStoreData.state.honoraryTitles.map(t => t.id === id ? { ...t, [field]: value } : t) }),
    removeHonoraryTitle: (id) => ranksStoreData.setState({ honoraryTitles: ranksStoreData.state.honoraryTitles.filter(t => t.id !== id) })
  };
};
useRanksStore.getState = () => ranksStoreData.getState();
