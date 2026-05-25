import React from 'react';
import WarehouseRegistry from './components/WarehouseRegistry.jsx';
import WarehouseTransactions from './components/WarehouseTransactions.jsx';
import WarehouseKits from './components/WarehouseKits.jsx';
import WarehousePrintPortals from './components/WarehousePrintPortals.jsx';
import AddItemModal from './components/AddItemModal.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import ReturnModal from './components/ReturnModal.jsx';
import CreateKitModal from './components/CreateKitModal.jsx';
import AccountingModal from './components/AccountingModal.jsx';

const WarehouseDashboard = ({ athletes = [], onUpdateAthlete }) => {
  // 1. Initial Mock Data
  const defaultItems = [
    { id: '1', name: "დინამიკური თოკი\n(Edelrid Swift 8.9mm)", category: "ალპინისტური", qr: "QR-ER89-001", qtyTotal: 10, qtyLeft: 8, price: 450, currency: 'GEL', expiry: "2028-05-10", condition: "GOOD", status: "ვარგისი", minStockThreshold: 3, supplier: "Petzl Georgia", inflowDate: "2026-05-01" },
    { id: '2', name: "ჩაფხუტი (Petzl\nMeteor)", category: "ალპინისტური", qr: "QR-PM-042", qtyTotal: 5, qtyLeft: 5, price: 280, currency: 'GEL', expiry: "2024-02-15", condition: "FAIR", status: "ვადაგასული", minStockThreshold: 2, supplier: "Extreme Import", inflowDate: "2024-02-10" },
    { id: '3', name: "კარავი 4 კაციანი\n(MSR Papa Hubba)", category: "საბანაკე", qr: "QR-MSR-004", qtyTotal: 2, qtyLeft: 1, price: 1800, currency: 'GEL', expiry: "უვადო", condition: "NEW", status: "ვარგისი", minStockThreshold: 2, supplier: "MSR EU", inflowDate: "2026-04-15" },
    { id: '4', name: "საძილე ტომარა\n(-15C)", category: "საბანაკე", qr: "QR-SB-115", qtyTotal: 15, qtyLeft: 10, price: 420, currency: 'GEL', expiry: "უვადო", condition: "GOOD", status: "ვარგისი", minStockThreshold: 5, supplier: "Sportland", inflowDate: "2026-03-20" },
    { id: '5', name: "კარაბინი Petzl Attache", category: "ალპინისტური", qr: "QR-PA-091", qtyTotal: 50, qtyLeft: 45, price: 45, currency: 'GEL', expiry: "უვადო", condition: "NEW", status: "ვარგისი", minStockThreshold: 10, supplier: "Petzl Georgia", inflowDate: "2026-05-05" },
    { id: '6', name: "პირველადი დახმარების აფთიაქი", category: "საბანაკე", qr: "QR-FA-002", qtyTotal: 4, qtyLeft: 2, price: 120, currency: 'GEL', expiry: "2027-10-12", condition: "NEW", status: "ვარგისი", minStockThreshold: 5, supplier: "PSP Pharma", inflowDate: "2026-05-10" }
  ];

  const defaultBundles = [
    {
      id: 'b1',
      name: "სამაშველო ნაკრები - ალპური A",
      qr: "KIT-ALPHA-01",
      items: [
        { itemId: '1', qty: 3 },
        { itemId: '5', qty: 10 },
        { itemId: '6', qty: 1 }
      ]
    }
  ];

  const defaultTransactions = [
    {
      id: 't1',
      type: 'item',
      itemId: '1',
      itemName: "დინამიკური თოკი (Edelrid Swift 8.9mm)",
      itemCode: "QR-ER89-001",
      athleteId: "860642",
      athleteName: "გიორგი ბერიძე",
      issueDate: "2026-05-10",
      expectedReturnDate: "2026-05-24",
      status: 'issued',
      qty: 1
    },
    {
      id: 't2',
      type: 'bundle',
      itemId: 'b1',
      itemName: "სამაშველო ნაკრები - ალპური A",
      itemCode: "KIT-ALPHA-01",
      athleteId: "860643",
      athleteName: "დავით მაისურაძე",
      issueDate: "2026-05-01",
      expectedReturnDate: "2026-05-15",
      status: 'issued',
      components: "3x დინამიკური თოკი, 10x კარაბინი, 1x პირველადი დახმარების აფთიაქი",
      qty: 1
    }
  ];

  // 2. React state hooks reading from / saving to LocalStorage
  const [items, setItems] = React.useState(() => {
    const stored = localStorage.getItem('warehouse_items');
    return stored ? JSON.parse(stored) : defaultItems;
  });

  const [bundles, setBundles] = React.useState(() => {
    const stored = localStorage.getItem('warehouse_bundles');
    return stored ? JSON.parse(stored) : defaultBundles;
  });

  const [transactions, setTransactions] = React.useState(() => {
    const stored = localStorage.getItem('warehouse_transactions');
    return stored ? JSON.parse(stored) : defaultTransactions;
  });

  const [activeTab, setActiveTab] = React.useState('registry');
  const [registryViewType, setRegistryViewType] = React.useState('card');

  // Filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');

  // Modals
  const [isAddItemOpen, setIsAddItemOpen] = React.useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [isReturnOpen, setIsReturnOpen] = React.useState(false);
  const [isCreateKitOpen, setIsCreateKitOpen] = React.useState(false);
  const [isAccountingOpen, setIsAccountingOpen] = React.useState(false);
  const [activePrintDoc, setActivePrintDoc] = React.useState(null);

  // Pre-Print Filter Suite States
  const [prePrintStartDate, setPrePrintStartDate] = React.useState('');
  const [prePrintEndDate, setPrePrintEndDate] = React.useState('');
  const [prePrintCategory, setPrePrintCategory] = React.useState('all');
  const [prePrintAthlete, setPrePrintAthlete] = React.useState(null);
  const [prePrintReason, setPrePrintReason] = React.useState('all');

  // Current item under checkout/return/etc
  const [selectedItemForCheckout, setSelectedItemForCheckout] = React.useState(null);
  const [checkoutType, setCheckoutType] = React.useState('item'); // 'item' or 'bundle'
  const [selectedTransactionForReturn, setSelectedTransactionForReturn] = React.useState(null);

  // Checkout form inputs
  const [athleteSearchText, setAthleteSearchText] = React.useState('');
  const [selectedAthlete, setSelectedAthlete] = React.useState(null);
  const [expectedReturnDate, setExpectedReturnDate] = React.useState('');
  const [checkoutQty, setCheckoutQty] = React.useState(1);
  const [expeditionName, setExpeditionName] = React.useState('');
  const [hasPhysicalDocument, setHasPhysicalDocument] = React.useState(false);
  const [damageReason, setDamageReason] = React.useState('');
  const [uploadedPhoto, setUploadedPhoto] = React.useState('');
  const [returnReasonType, setReturnReasonType] = React.useState('objective'); // 'objective' or 'subjective'
  const [lastIssuedTransaction, setLastIssuedTransaction] = React.useState(null);

  // Add Item inputs
  const [addItemForm, setAddItemForm] = React.useState({
    name: '',
    category: 'ალპინისტური',
    qr: '',
    qtyTotal: 1,
    price: 0,
    currency: 'GEL',
    expiry: 'უვადო',
    expiryDate: '',
    condition: 'NEW',
    minStockThreshold: 1,
    supplier: ''
  });

  // Create Kit inputs
  const [createKitForm, setCreateKitForm] = React.useState({
    name: '',
    qr: '',
    items: [{ itemId: '', qty: 1 }]
  });

  // Return damage options inputs
  const [returnForm, setReturnForm] = React.useState({
    status: 'good',
    damageReason: ''
  });

  const [showReturnConfirmStep, setShowReturnConfirmStep] = React.useState(false);
  const [returnTimestamp, setReturnTimestamp] = React.useState(null);

  React.useEffect(() => {
    const handleAfterPrint = () => {
      setActivePrintDoc(null);
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  React.useEffect(() => {
    if (activePrintDoc) {
      const timer = setTimeout(() => {
        window.print();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activePrintDoc]);

  React.useEffect(() => {
    let interval;
    if (showReturnConfirmStep) {
      setReturnTimestamp(new Date());
      interval = setInterval(() => {
        setReturnTimestamp(new Date());
      }, 1000);
    } else {
      setReturnTimestamp(null);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showReturnConfirmStep]);

  const formatTimestamp = (date) => {
    if (!date) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  const handleReturnStepSubmit = (e) => {
    e.preventDefault();
    setShowReturnConfirmStep(true);
  };

  // Save database states to localStorage
  React.useEffect(() => {
    localStorage.setItem('warehouse_items', JSON.stringify(items));
  }, [items]);

  React.useEffect(() => {
    localStorage.setItem('warehouse_bundles', JSON.stringify(bundles));
  }, [bundles]);

  React.useEffect(() => {
    localStorage.setItem('warehouse_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Initialize dataset syncing on component mount
  React.useEffect(() => {
    const initialized = localStorage.getItem('warehouse_initialized');
    if (!initialized) {
      localStorage.setItem('warehouse_items', JSON.stringify(defaultItems));
      localStorage.setItem('warehouse_bundles', JSON.stringify(defaultBundles));
      localStorage.setItem('warehouse_transactions', JSON.stringify(defaultTransactions));
      localStorage.setItem('warehouse_initialized', 'true');

      const gBeridze = athletes.find(a => a.id === "860642");
      const dMaisuradze = athletes.find(a => a.id === "860643");

      if (gBeridze && (!gBeridze.issuedItems || gBeridze.issuedItems.length === 0)) {
        onUpdateAthlete({
          ...gBeridze,
          issuedItems: [
            {
              id: 't1',
              type: 'item',
              itemId: '1',
              itemName: "დინამიკური თოკი (Edelrid Swift 8.9mm)",
              itemCode: "QR-ER89-001",
              expectedReturnDate: "2026-05-24",
              issueDate: "2026-05-10",
              status: 'issued',
              qty: 1
            }
          ]
        });
      }

      if (dMaisuradze && (!dMaisuradze.issuedItems || dMaisuradze.issuedItems.length === 0)) {
        setTimeout(() => {
          onUpdateAthlete({
            ...dMaisuradze,
            issuedItems: [
              {
                id: 't2',
                type: 'bundle',
                itemId: 'b1',
                itemName: "სამაშველო ნაკრები - ალპური A",
                itemCode: "KIT-ALPHA-01",
                expectedReturnDate: "2026-05-15",
                issueDate: "2026-05-01",
                status: 'issued',
                components: "3x დინამიკური თოკი, 10x კარაბინი, 1x პირველადი დახმარების აფთიაქი",
                qty: 1
              }
            ]
          });
        }, 100);
      }
    }
  }, []);

  const getGELValue = (price, qty, currency) => {
    const p = Number(price) || 0;
    const q = Number(qty) || 0;
    const rate = currency === 'USD' ? 2.65 : currency === 'EUR' ? 2.85 : 1;
    return p * q * rate;
  };

  const isExpired = (expiry) => {
    if (!expiry || expiry === "უვადო") return false;
    const expiryDate = new Date(expiry);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);
    return expiryDate < today;
  };

  // Math valuation calculations
  const totalWarehouseGEL = items.reduce((sum, item) => sum + getGELValue(item.price, item.qtyTotal, item.currency), 0);

  const writtenOffItems = React.useMemo(() => {
    const list = [];
    transactions.forEach(t => {
      if (t.status === 'returned' && t.isDamaged) {
        const dateStr = t.returned_at ? formatTimestamp(new Date(t.returned_at)) : (t.returnDate || '');
        if (t.type === 'item') {
          const itemObj = items.find(i => i.id === t.itemId);
          const unitPrice = itemObj ? getGELValue(itemObj.price, 1, itemObj.currency) : 0;
          list.push({
            id: `trans-${t.id}`,
            itemId: t.itemId,
            code: t.itemCode || (itemObj ? itemObj.qr : ''),
            name: t.itemName || (itemObj ? itemObj.name : ''),
            reason: t.damageReason || "დაზიანდა სარგებლობისას",
            price: unitPrice,
            qty: t.qty || 1,
            totalPrice: unitPrice * (t.qty || 1),
            date: dateStr,
            category: itemObj ? itemObj.category : '',
            athleteId: t.athleteId || '',
            athleteName: t.athleteName || ''
          });
        } else {
          const bundleObj = bundles.find(b => b.id === t.itemId);
          if (bundleObj) {
            bundleObj.items.forEach(comp => {
              const itemObj = items.find(i => i.id === comp.itemId);
              const unitPrice = itemObj ? getGELValue(itemObj.price, 1, itemObj.currency) : 0;
              const compQty = comp.qty * (t.qty || 1);
              list.push({
                id: `trans-${t.id}-${comp.itemId}`,
                itemId: comp.itemId,
                code: itemObj ? itemObj.qr : '',
                name: itemObj ? itemObj.name : '',
                reason: t.damageReason || "კომპლექტის დაზიანება",
                price: unitPrice,
                qty: compQty,
                totalPrice: unitPrice * compQty,
                date: dateStr,
                category: itemObj ? itemObj.category : '',
                athleteId: t.athleteId || '',
                athleteName: t.athleteName || ''
              });
            });
          }
        }
      }
    });

    items.forEach(item => {
      const isDamagedStatus = item.status === 'დაზიანებული' || item.status === 'დაკარგული' || item.status === 'ჩამოწერილი';
      if (isDamagedStatus) {
        const isAssociated = list.some(entry => entry.itemId === item.id);
        if (!isAssociated) {
          const unitPrice = getGELValue(item.price, 1, item.currency);
          const dateStr = item.inflowDate ? `${item.inflowDate} 00:00:00` : formatTimestamp(new Date());
          list.push({
            id: `item-${item.id}`,
            itemId: item.id,
            code: item.qr,
            name: item.name,
            reason: item.damageReason || (item.status === 'დაკარგული' ? "დაკარგული" : item.status === 'ჩამოწერილი' ? "ჩამოწერილი" : "ამორტიზაცია"),
            price: unitPrice,
            qty: 1,
            totalPrice: unitPrice,
            date: dateStr,
            category: item.category,
            athleteId: '',
            athleteName: ''
          });
        }
      }
    });

    return list;
  }, [items, transactions, bundles]);

  const writtenOffTotalGEL = React.useMemo(() => {
    return writtenOffItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [writtenOffItems]);

  const categoryValuations = React.useMemo(() => {
    const cats = [...new Set(items.map(i => i.category))];
    return cats.map(cat => {
      const val = items.filter(i => i.category === cat).reduce((sum, item) => sum + getGELValue(item.price, item.qtyTotal, item.currency), 0);
      return { category: cat, val };
    });
  }, [items]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.qr.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.supplier?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    let matchesStatus = true;
    if (selectedStatus === 'ვარგისი') {
      matchesStatus = item.status === 'ვარგისი' && !isExpired(item.expiry);
    } else if (selectedStatus === 'ვადაგასული') {
      matchesStatus = item.status === 'ვადაგასული' || isExpired(item.expiry);
    } else if (selectedStatus === 'დაზიანებული') {
      matchesStatus = item.status === 'დაზიანებული';
    } else if (selectedStatus === 'low_stock') {
      matchesStatus = item.qtyLeft < item.minStockThreshold;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const matchesWriteOffReason = React.useCallback((reasonText, filterValue) => {
    if (!filterValue || filterValue === 'all') return true;
    if (!reasonText) return false;
    const text = reasonText.toLowerCase();
    if (filterValue === 'ცვეთა') {
      return text.includes('ცვეთა') || text.includes('ამორტიზაცია') || text.includes('ვადაგასული');
    }
    if (filterValue === 'დაზიანება/ინციდენტი') {
      return text.includes('დაზიანება') || text.includes('დაზიანდა') || text.includes('ინციდენტი') || text.includes('გატეხილი') || text.includes('გატყდა') || text.includes('დაზიანებული');
    }
    if (filterValue === 'დაკარგვა') {
      return text.includes('დაკარგვა') || text.includes('დაკარგული');
    }
    return false;
  }, []);

  const prePrintFilteredInflows = React.useMemo(() => {
    if (prePrintAthlete || prePrintReason !== 'all') return [];
    return items.filter(item => {
      const matchesStart = !prePrintStartDate || item.inflowDate >= prePrintStartDate;
      const matchesEnd = !prePrintEndDate || item.inflowDate <= prePrintEndDate;
      const matchesCat = prePrintCategory === 'all' || item.category === prePrintCategory;
      return matchesStart && matchesEnd && matchesCat;
    });
  }, [items, prePrintStartDate, prePrintEndDate, prePrintCategory, prePrintAthlete, prePrintReason]);

  const prePrintFilteredDisposals = React.useMemo(() => {
    return writtenOffItems.filter(item => {
      const itemDatePart = item.date ? item.date.substring(0, 10) : '';
      const matchesStart = !prePrintStartDate || itemDatePart >= prePrintStartDate;
      const matchesEnd = !prePrintEndDate || itemDatePart <= prePrintEndDate;
      const matchesCat = prePrintCategory === 'all' || item.category === prePrintCategory;
      const matchesAthlete = !prePrintAthlete || item.athleteId === prePrintAthlete.id;
      const matchesReason = matchesWriteOffReason(item.reason, prePrintReason);
      return matchesStart && matchesEnd && matchesCat && matchesAthlete && matchesReason;
    });
  }, [writtenOffItems, prePrintStartDate, prePrintEndDate, prePrintCategory, prePrintAthlete, prePrintReason, matchesWriteOffReason]);

  const receivedTotalGELForLedger = React.useMemo(() => {
    return prePrintFilteredInflows.reduce((sum, item) => sum + getGELValue(item.price, item.qtyTotal, item.currency), 0);
  }, [prePrintFilteredInflows]);

  const disposalsTotalGELForLedger = React.useMemo(() => {
    return prePrintFilteredDisposals.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [prePrintFilteredDisposals]);

  const unifiedRegistryList = React.useMemo(() => {
    const mappedItems = filteredItems.map(item => {
      const activeTrans = transactions.filter(t => t.itemId === item.id && t.status === 'issued');
      let responsiblePerson = "— (საწყობში)";
      let hasOverdue = false;

      if (activeTrans.length > 0) {
        const names = activeTrans.map(t => {
          const isTOverdue = isExpired(t.expectedReturnDate);
          if (isTOverdue) hasOverdue = true;
          return `${t.athleteName} (${t.qty} ცალი)${isTOverdue ? " - ვადაგადაცილებული" : ""}`;
        }).join(', ');
        responsiblePerson = names;
      } else if (item.status === 'დაზიანებული') {
        responsiblePerson = `— (ჩამოწერილი: ${item.damageReason || ''})`;
      }

      const expired = isExpired(item.expiry);
      const lowStock = item.qtyLeft < item.minStockThreshold;

      let statusText = "საწყობში";
      let statusColor = "#10b981";
      let statusBg = "rgba(16, 185, 129, 0.15)";

      if (expired) {
        statusText = "⚠️ ექსპირ";
        statusColor = "#ef4444";
        statusBg = "rgba(239, 68, 68, 0.15)";
      } else if (item.status === 'დაზიანებული') {
        statusText = "დაზიანებული";
        statusColor = "#f59e0b";
        statusBg = "rgba(245, 158, 11, 0.15)";
      } else if (activeTrans.length > 0) {
        statusText = "გაცემული";
        statusColor = "#3b82f6";
        statusBg = "rgba(59, 130, 246, 0.15)";
        if (hasOverdue) {
          statusText = "⚠️ ვადაგადაცილებული";
          statusColor = "#ef4444";
          statusBg = "rgba(239, 68, 68, 0.15)";
        }
      } else if (lowStock) {
        statusText = "📉 შესასყიდია";
        statusColor = "#f59e0b";
        statusBg = "rgba(245, 158, 11, 0.15)";
      }

      return {
        id: item.id,
        qr: item.qr,
        name: item.name,
        type: "ინდივიდუალური",
        responsiblePerson,
        hasOverdue,
        statusText,
        statusColor,
        statusBg,
        itemObj: item,
        isBundle: false,
        actionsAvailable: item.qtyLeft > 0 && !expired && item.status !== 'დაზიანებული'
      };
    });

    const matchesSearch = (b) => {
      return b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             b.qr.toLowerCase().includes(searchQuery.toLowerCase());
    };

    const matchesCategory = (b) => {
      if (selectedCategory === 'all') return true;
      return b.items.some(comp => {
        const whItem = items.find(i => i.id === comp.itemId);
        return whItem && whItem.category === selectedCategory;
      });
    };

    const matchesStatus = (b) => {
      if (selectedStatus === 'all') return true;
      const activeTrans = transactions.filter(t => t.itemId === b.id && t.status === 'issued');
      if (selectedStatus === 'ვარგისი') return true;
      if (selectedStatus === 'ვადაგასული') return false;
      if (selectedStatus === 'დაზიანებული') return false;
      if (selectedStatus === 'low_stock') {
        return b.items.some(comp => {
          const whItem = items.find(i => i.id === comp.itemId);
          return whItem && whItem.qtyLeft < comp.qty;
        });
      }
      return true;
    };

    const filteredBundles = (selectedStatus === 'low_stock' || selectedStatus === 'all' || selectedStatus === 'ვარგისი') 
      ? bundles.filter(b => matchesSearch(b) && matchesCategory(b) && matchesStatus(b))
      : [];

    const mappedBundles = filteredBundles.map(bundle => {
      const activeTrans = transactions.filter(t => t.itemId === bundle.id && t.status === 'issued');
      let responsiblePerson = "— (საწყობში)";
      let hasOverdue = false;

      if (activeTrans.length > 0) {
        const names = activeTrans.map(t => {
          const isTOverdue = isExpired(t.expectedReturnDate);
          if (isTOverdue) hasOverdue = true;
          return `${t.athleteName} (${t.qty} ცალი)${isTOverdue ? " - ვადაგადაცილებული" : ""}`;
        }).join(', ');
        responsiblePerson = names;
      }

      let statusText = "საწყობში";
      let statusColor = "#10b981";
      let statusBg = "rgba(16, 185, 129, 0.15)";

      if (activeTrans.length > 0) {
        statusText = "გაცემული";
        statusColor = "#3b82f6";
        statusBg = "rgba(59, 130, 246, 0.15)";
        if (hasOverdue) {
          statusText = "⚠️ ვადაგადაცილებული";
          statusColor = "#ef4444";
          statusBg = "rgba(239, 68, 68, 0.15)";
        }
      }

      let componentsLowStock = false;
      bundle.items.forEach(comp => {
        const whItem = items.find(i => i.id === comp.itemId);
        if (!whItem || whItem.qtyLeft < comp.qty) {
          componentsLowStock = true;
        }
      });

      if (componentsLowStock && activeTrans.length === 0) {
        statusText = "📉 კომპონენტების ნაკლებობა";
        statusColor = "#f59e0b";
        statusBg = "rgba(245, 158, 11, 0.15)";
      }

      return {
        id: bundle.id,
        qr: bundle.qr,
        name: bundle.name,
        type: "Bundle (კომპლექტი)",
        responsiblePerson,
        hasOverdue,
        statusText,
        statusColor,
        statusBg,
        itemObj: bundle,
        isBundle: true,
        actionsAvailable: !componentsLowStock
      };
    });

    return [...mappedItems, ...mappedBundles];
  }, [filteredItems, bundles, transactions, items, searchQuery, selectedCategory, selectedStatus]);

  // Handlers
  const handleAddItem = (e) => {
    e.preventDefault();
    const expiryVal = addItemForm.expiry === 'უვადო' ? 'უვადო' : addItemForm.expiryDate;
    const isCurrentlyExpired = expiryVal !== 'უვადო' && new Date(expiryVal) < new Date();

    const newItem = {
      id: String(Date.now()),
      name: addItemForm.name,
      category: addItemForm.category,
      qr: addItemForm.qr || `QR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      qtyTotal: Number(addItemForm.qtyTotal),
      qtyLeft: Number(addItemForm.qtyTotal),
      price: Number(addItemForm.price),
      currency: addItemForm.currency,
      expiry: expiryVal,
      condition: addItemForm.condition,
      status: isCurrentlyExpired ? 'ვადაგასული' : 'ვარგისი',
      minStockThreshold: Number(addItemForm.minStockThreshold),
      supplier: addItemForm.supplier || 'უცნობი მიმწოდებელი',
      inflowDate: new Date().toISOString().split('T')[0]
    };

    setItems(prev => [...prev, newItem]);
    setIsAddItemOpen(false);
    setAddItemForm({
      name: '',
      category: 'ალპინისტური',
      qr: '',
      qtyTotal: 1,
      price: 0,
      currency: 'GEL',
      expiry: 'უვადო',
      expiryDate: '',
      condition: 'NEW',
      minStockThreshold: 1,
      supplier: ''
    });
  };

  const openCheckout = (target, type) => {
    setSelectedItemForCheckout(target);
    setCheckoutType(type);
    setCheckoutQty(1);
    setExpectedReturnDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setExpeditionName('');
    setHasPhysicalDocument(false);
    setIsCheckoutOpen(true);
  };

  const isHighRiskGear = React.useMemo(() => {
    if (!selectedItemForCheckout) return false;

    const checkItemHighRisk = (item) => {
      const cat = (item.category || '');
      const name = (item.name || '').toLowerCase();
      const qr = (item.qr || '').toLowerCase();

      const isAlpine = cat === 'ალპინისტური';
      const hasKeyword = name.includes('სამაშველო') || 
                        name.includes('ზვავის') || 
                        name.includes('დინამიკური') || 
                        name.includes('ჩაფხუტი') || 
                        name.includes('კარაბინი') ||
                        qr.includes('rescue') ||
                        qr.includes('avalanche');
      return isAlpine || hasKeyword;
    };

    if (checkoutType === 'bundle') {
      const bundle = selectedItemForCheckout;
      const bundleName = (bundle.name || '').toLowerCase();
      const isBundleHighRisk = bundleName.includes('სამაშველო') || bundleName.includes('ზვავის') || bundleName.includes('ალპური');
      if (isBundleHighRisk) return true;

      return bundle.items?.some(comp => {
        const whItem = items.find(i => i.id === comp.itemId);
        return whItem && checkItemHighRisk(whItem);
      });
    }

    return checkItemHighRisk(selectedItemForCheckout);
  }, [selectedItemForCheckout, checkoutType, items]);

  const isUnqualified = React.useMemo(() => {
    if (!selectedAthlete) return false;
    const rank = selectedAthlete.mountaineerRank || 'NONE';
    return rank === 'NONE' || rank === 'BADGE';
  }, [selectedAthlete]);

  const handleCheckoutConfirm = (e) => {
    e.preventDefault();
    if (!selectedAthlete) {
      alert('გთხოვთ აირჩიოთ პასუხისმგებელი პირი (სპორტსმენი)!');
      return;
    }
    if (selectedAthlete.warehouseBlocked) {
      alert('შეცდომა: ამ სპორტსმენს ადევს აქტიური ბლოკი და ნივთებს ვერ მიიღებს!');
      return;
    }
    if (isHighRiskGear && isUnqualified) {
      alert('შეცდომა: ამ სპორტსმენს არ აქვს საკმარისი კვალიფიკაცია მაღალი რისკის აღჭურვილობის მისაღებად!');
      return;
    }
    if (!hasPhysicalDocument) {
      alert('შეცდომა: პრეზიდენტის მიერ ხელმოწერილი ფიზიკური დოკუმენტი სავალდებულოა!');
      return;
    }
    if (!expeditionName) {
      alert('შეცდომა: გთხოვთ მიუთითოთ ექსპედიციის/ღონისძიების დასახელება!');
      return;
    }

    const dateToUse = expectedReturnDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const transId = `t-${Date.now()}`;

    if (checkoutType === 'item') {
      const item = selectedItemForCheckout;
      if (item.qtyLeft < checkoutQty) {
        alert(`საწყობში მხოლოდ ${item.qtyLeft} ერთეული დარჩა!`);
        return;
      }

      setItems(prev => prev.map(i => i.id === item.id ? { ...i, qtyLeft: i.qtyLeft - checkoutQty } : i));

      const newTrans = {
        id: transId,
        type: 'item',
        itemId: item.id,
        itemName: item.name.replace('\n', ' '),
        itemCode: item.qr,
        athleteId: selectedAthlete.id,
        athleteName: `${selectedAthlete.firstName} ${selectedAthlete.lastName}`,
        issueDate: new Date().toISOString().split('T')[0],
        expectedReturnDate: dateToUse,
        status: 'issued',
        qty: checkoutQty,
        expeditionName: expeditionName,
        hasPhysicalDocument: true
      };

      setTransactions(prev => [newTrans, ...prev]);

      const updatedAthlete = {
        ...selectedAthlete,
        issuedItems: [
          ...(selectedAthlete.issuedItems || []),
          {
            id: transId,
            type: 'item',
            itemId: item.id,
            itemName: item.name.replace('\n', ' '),
            itemCode: item.qr,
            expectedReturnDate: dateToUse,
            issueDate: new Date().toISOString().split('T')[0],
            status: 'issued',
            qty: checkoutQty,
            expeditionName: expeditionName,
            hasPhysicalDocument: true
          }
        ]
      };
      onUpdateAthlete(updatedAthlete);
      setLastIssuedTransaction(newTrans);
    } else {
      const bundle = selectedItemForCheckout;
      let ok = true;
      const missing = [];
      bundle.items.forEach(comp => {
        const whItem = items.find(i => i.id === comp.itemId);
        const needed = comp.qty * checkoutQty;
        if (!whItem || whItem.qtyLeft < needed) {
          ok = false;
          missing.push(`${whItem ? whItem.name.replace('\n', ' ') : 'ნივთი'} (საჭიროა: ${needed}, გაქვთ: ${whItem ? whItem.qtyLeft : 0})`);
        }
      });

      if (!ok) {
        alert(`საწყობში არ არის საკმარისი კომპონენტები კომპლექტის გასაცემად:\n${missing.join('\n')}`);
        return;
      }

      setItems(prev => prev.map(i => {
        const comp = bundle.items.find(c => c.itemId === i.id);
        if (comp) {
          return { ...i, qtyLeft: i.qtyLeft - (comp.qty * checkoutQty) };
        }
        return i;
      }));

      const compText = bundle.items.map(comp => {
        const whItem = items.find(i => i.id === comp.itemId);
        return `${comp.qty}x ${whItem ? whItem.name.replace('\n', ' ') : 'ნივთი'}`;
      }).join(', ');

      const newTrans = {
        id: transId,
        type: 'bundle',
        itemId: bundle.id,
        itemName: bundle.name,
        itemCode: bundle.qr,
        athleteId: selectedAthlete.id,
        athleteName: `${selectedAthlete.firstName} ${selectedAthlete.lastName}`,
        issueDate: new Date().toISOString().split('T')[0],
        expectedReturnDate: dateToUse,
        status: 'issued',
        components: compText,
        qty: checkoutQty,
        expeditionName: expeditionName,
        hasPhysicalDocument: true
      };

      setTransactions(prev => [newTrans, ...prev]);

      const updatedAthlete = {
        ...selectedAthlete,
        issuedItems: [
          ...(selectedAthlete.issuedItems || []),
          {
            id: transId,
            type: 'bundle',
            itemId: bundle.id,
            itemName: bundle.name,
            itemCode: bundle.qr,
            expectedReturnDate: dateToUse,
            issueDate: new Date().toISOString().split('T')[0],
            status: 'issued',
            components: compText,
            qty: checkoutQty,
            expeditionName: expeditionName,
            hasPhysicalDocument: true
          }
        ]
      };
      onUpdateAthlete(updatedAthlete);
      setLastIssuedTransaction(newTrans);
    }

    setIsCheckoutOpen(false);
    setSelectedItemForCheckout(null);
    setSelectedAthlete(null);
    setAthleteSearchText('');
    setCheckoutQty(1);
    setExpeditionName('');
    setHasPhysicalDocument(false);
    setActivePrintDoc('handover');
  };

  const openReturn = (trans) => {
    setSelectedTransactionForReturn(trans);
    setReturnForm({ status: 'good', damageReason: '' });
    setDamageReason('');
    setUploadedPhoto('');
    setReturnReasonType('objective');
    setShowReturnConfirmStep(false);
    setIsReturnOpen(true);
  };

  const handleReturnConfirm = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const trans = selectedTransactionForReturn;
    if (!trans) return;

    const isDamaged = returnForm.status === 'damaged';
    const today = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString();

    setTransactions(prev => prev.map(t => {
      if (t.id === trans.id) {
        return {
          ...t,
          status: 'returned',
          returnDate: today,
          returned_at: timestamp,
          isDamaged: isDamaged,
          damageReason: isDamaged ? damageReason : undefined,
          uploadedPhoto: isDamaged ? uploadedPhoto : undefined,
          returnReasonType: isDamaged ? returnReasonType : undefined
        };
      }
      return t;
    }));

    if (trans.type === 'item') {
      setItems(prev => prev.map(i => {
        if (i.id === trans.itemId) {
          const qtyReturned = Number(trans.qty) || 1;
          if (isDamaged) {
            return {
              ...i,
              qtyTotal: Math.max(0, i.qtyTotal - qtyReturned),
              qtyLeft: i.qtyLeft,
              status: 'დაზიანებული',
              damageReason: damageReason
            };
          } else {
            return {
              ...i,
              qtyLeft: Math.min(i.qtyTotal, i.qtyLeft + qtyReturned)
            };
          }
        }
        return i;
      }));
    } else {
      const bundle = bundles.find(b => b.id === trans.itemId);
      if (bundle) {
        setItems(prev => prev.map(i => {
          const comp = bundle.items.find(c => c.itemId === i.id);
          if (comp) {
            const qtyReturned = comp.qty * (Number(trans.qty) || 1);
            if (isDamaged) {
              return {
                ...i,
                qtyTotal: Math.max(0, i.qtyTotal - qtyReturned),
                qtyLeft: i.qtyLeft,
                status: 'დაზიანებული',
                damageReason: damageReason
              };
            } else {
              return {
                ...i,
                qtyLeft: Math.min(i.qtyTotal, i.qtyLeft + qtyReturned)
              };
            }
          }
          return i;
        }));
      }
    }

    const athleteObj = athletes.find(a => a.id === trans.athleteId);
    if (athleteObj) {
      const updatedAthlete = {
        ...athleteObj,
        warehouseBlocked: (isDamaged && returnReasonType === 'subjective') ? true : athleteObj.warehouseBlocked,
        issuedItems: (athleteObj.issuedItems || []).map(it => {
          if (it.id === trans.id) {
            return { 
              ...it, 
              status: 'returned', 
              returnDate: today,
              returned_at: timestamp
            };
          }
          return it;
        })
      };
      onUpdateAthlete(updatedAthlete);
    }

    setIsReturnOpen(false);
    setSelectedTransactionForReturn(null);
    setShowReturnConfirmStep(false);
  };

  const handleCreateKit = (e) => {
    e.preventDefault();
    if (!createKitForm.name || !createKitForm.qr) {
      alert('გთხოვთ შეავსოთ კომპლექტის სახელი და კოდი!');
      return;
    }

    const validItems = createKitForm.items.filter(it => it.itemId && it.qty > 0);
    if (validItems.length === 0) {
      alert('კომპლექტში უნდა იყოს მინიმუმ ერთი ნივთი!');
      return;
    }

    const newBundle = {
      id: `b-${Date.now()}`,
      name: createKitForm.name,
      qr: createKitForm.qr,
      items: validItems.map(it => ({ itemId: it.itemId, qty: Number(it.qty) }))
    };

    setBundles(prev => [...prev, newBundle]);
    setIsCreateKitOpen(false);
    setCreateKitForm({
      name: '',
      qr: '',
      items: [{ itemId: '', qty: 1 }]
    });
  };

  const addKitComponentRow = () => {
    setCreateKitForm(prev => ({
      ...prev,
      items: [...prev.items, { itemId: '', qty: 1 }]
    }));
  };

  const removeKitComponentRow = (index) => {
    setCreateKitForm(prev => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index)
    }));
  };

  const updateKitComponent = (index, field, value) => {
    setCreateKitForm(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  // Styles
  const containerStyle = {
    flex: 1, padding: "30px", backgroundColor: "#121418", color: "#e2e8f0",
    fontFamily: "sans-serif", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px"
  };

  const tabStyle = (tab) => ({
    color: activeTab === tab ? "var(--color-emerald-core)" : "rgba(255,255,255,0.5)",
    fontWeight: activeTab === tab ? "bold" : "normal",
    borderBottom: activeTab === tab ? "2px solid var(--color-emerald-core)" : "2px solid transparent",
    padding: "10px 0",
    cursor: "pointer",
    transition: "all 0.3s",
    textShadow: activeTab === tab ? "0 0 10px color-mix(in oklab, var(--color-emerald-core) 30%, transparent)" : "none"
  });

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "#fff", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
          <i className="fa-solid fa-warehouse" style={{ color: "var(--color-emerald-core)" }}></i> საწყობის მართვა
        </h2>
      </div>

      {/* ფინანსური უწყისი და აქტივების ბალანსი */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "20px", 
        marginBottom: "20px" 
      }}>
        {/* Card A: 💰 საწყობის ჯამური ფასი */}
        <div style={{ 
          backgroundColor: "rgba(15, 23, 42, 0.6)", 
          border: "1px solid color-mix(in oklab, var(--color-emerald-core) 15%, transparent)",
          borderRadius: "12px", 
          padding: "20px", 
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)", 
          backdropFilter: "blur(10px)",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}>
          <div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>💰</span> საწყობის ჯამური ფასი
            </div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#fff", marginTop: "10px", display: "flex", alignItems: "baseline", gap: "8px" }}>
              {totalWarehouseGEL.toLocaleString()} <span style={{ color: "var(--color-emerald-core)", fontSize: "18px" }}>GEL</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
            {categoryValuations.map((cv, idx) => (
              <div key={idx} style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", padding: "6px 12px", flex: 1, minWidth: "100px" }}>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>{cv.category}</div>
                <div style={{ fontSize: "14px", fontWeight: "bold", color: "var(--color-emerald-core)", marginTop: "2px" }}>
                  {cv.val.toLocaleString()} <span style={{ fontSize: "10px", color: "#fff" }}>GEL</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card B: 📉 ჩამოწერილი ინვენტარი */}
        <div style={{ 
          backgroundColor: "rgba(15, 23, 42, 0.6)", 
          border: "1px solid rgba(239, 68, 68, 0.2)",
          borderRadius: "12px", 
          padding: "20px", 
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)", 
          backdropFilter: "blur(10px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>📉</span> ჩამოწერილი ინვენტარი
            </div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#f97316", textShadow: "0 0 10px rgba(249, 115, 22, 0.3)", marginTop: "10px", display: "flex", alignItems: "baseline", gap: "8px" }}>
              {writtenOffTotalGEL.toLocaleString()} <span style={{ color: "#ef4444", fontSize: "18px" }}>GEL</span>
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontStyle: "italic", marginTop: "15px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
            (ავტომატური ჯამი)
          </div>
        </div>

        {/* Card C: 🖨️ ბუღალტერია & ბეჭდვა */}
        <div style={{ 
          backgroundColor: "rgba(15, 23, 42, 0.6)", 
          border: "1px solid color-mix(in oklab, var(--color-emerald-core) 15%, transparent)",
          borderRadius: "12px", 
          padding: "20px", 
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)", 
          backdropFilter: "blur(10px)",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}>
          <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🖨️</span> ბუღალტერია & ბეჭდვა
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", height: "100%", justifyContent: "center" }}>
            <button 
              onClick={() => setIsAccountingOpen(true)}
              style={{ 
                backgroundColor: "color-mix(in oklab, var(--color-emerald-core) 10%, transparent)", 
                border: "1px solid color-mix(in oklab, var(--color-emerald-core) 30%, transparent)", 
                color: "var(--color-emerald-core)", 
                padding: "10px 16px", 
                borderRadius: "8px", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: "8px", 
                fontWeight: "bold", 
                fontSize: "13px", 
                transition: "all 0.3s" 
              }}
            >
              <i className="fa-solid fa-file-invoice-dollar"></i> ბუღალტრული მოდული (A4)
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "25px", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "10px", fontSize: "15px" }}>
        <div style={tabStyle('registry')} onClick={() => setActiveTab('registry')}>
          📦 საწყობის რეესტრი ({unifiedRegistryList.length})
        </div>
        <div style={tabStyle('transactions')} onClick={() => setActiveTab('transactions')}>
          🔄 გაცემული ინვენტარი ({transactions.filter(t => t.status === 'issued').length})
        </div>
        <div style={tabStyle('bundles')} onClick={() => setActiveTab('bundles')}>
          🎒 კომპლექტები (Kits) ({bundles.length})
        </div>
      </div>

      {/* Active Tab Panel */}
      {activeTab === 'registry' && (
        <WarehouseRegistry 
          items={items}
          unifiedRegistryList={unifiedRegistryList}
          filteredItems={filteredItems}
          registryViewType={registryViewType}
          setRegistryViewType={setRegistryViewType}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          setIsAddItemOpen={setIsAddItemOpen}
        />
      )}

      {activeTab === 'transactions' && (
        <WarehouseTransactions 
          transactions={transactions}
          openReturn={openReturn}
        />
      )}

      {activeTab === 'bundles' && (
        <WarehouseKits 
          bundles={bundles}
          items={items}
          openCheckout={openCheckout}
          setIsCreateKitOpen={setIsCreateKitOpen}
        />
      )}

      {/* 1. ADD ITEM MODAL */}
      <AddItemModal 
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        addItemForm={addItemForm}
        setAddItemForm={setAddItemForm}
        handleAddItem={handleAddItem}
      />

      {/* 2. CHECKOUT GEAR MODAL */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        athletes={athletes}
        selectedItemForCheckout={selectedItemForCheckout}
        checkoutType={checkoutType}
        checkoutQty={checkoutQty}
        setCheckoutQty={setCheckoutQty}
        expectedReturnDate={expectedReturnDate}
        setExpectedReturnDate={setExpectedReturnDate}
        expeditionName={expeditionName}
        setExpeditionName={setExpeditionName}
        hasPhysicalDocument={hasPhysicalDocument}
        setHasPhysicalDocument={setHasPhysicalDocument}
        athleteSearchText={athleteSearchText}
        setAthleteSearchText={setAthleteSearchText}
        selectedAthlete={selectedAthlete}
        setSelectedAthlete={setSelectedAthlete}
        handleCheckoutConfirm={handleCheckoutConfirm}
        isHighRiskGear={isHighRiskGear}
        isUnqualified={isUnqualified}
      />

      {/* 3. RETURN MODAL */}
      <ReturnModal 
        isOpen={isReturnOpen}
        onClose={() => setIsReturnOpen(false)}
        selectedTransactionForReturn={selectedTransactionForReturn}
        returnForm={returnForm}
        setReturnForm={setReturnForm}
        damageReason={damageReason}
        setDamageReason={setDamageReason}
        returnReasonType={returnReasonType}
        setReturnReasonType={setReturnReasonType}
        uploadedPhoto={uploadedPhoto}
        setUploadedPhoto={setUploadedPhoto}
        handleReturnStepSubmit={handleReturnStepSubmit}
        showReturnConfirmStep={showReturnConfirmStep}
        setShowReturnConfirmStep={setShowReturnConfirmStep}
        returnTimestamp={returnTimestamp}
        formatTimestamp={formatTimestamp}
        handleReturnConfirm={handleReturnConfirm}
      />

      {/* 4. CREATE KIT BUNDLE MODAL */}
      <CreateKitModal 
        isOpen={isCreateKitOpen}
        onClose={() => setIsCreateKitOpen(false)}
        items={items}
        createKitForm={createKitForm}
        setCreateKitForm={setCreateKitForm}
        addKitComponentRow={addKitComponentRow}
        removeKitComponentRow={removeKitComponentRow}
        updateKitComponent={updateKitComponent}
        handleCreateKit={handleCreateKit}
      />

      {/* 5. ACCOUNTING EXPORT MODAL */}
      <AccountingModal 
        isOpen={isAccountingOpen}
        onClose={() => setIsAccountingOpen(false)}
        items={items}
        transactions={transactions}
        bundles={bundles}
        athletes={athletes}
        writtenOffItems={writtenOffItems}
        getGELValue={getGELValue}
        setActivePrintDoc={setActivePrintDoc}
        prePrintStartDate={prePrintStartDate}
        setPrePrintStartDate={setPrePrintStartDate}
        prePrintEndDate={prePrintEndDate}
        setPrePrintEndDate={setPrePrintEndDate}
        prePrintCategory={prePrintCategory}
        setPrePrintCategory={setPrePrintCategory}
        prePrintAthlete={prePrintAthlete}
        setPrePrintAthlete={setPrePrintAthlete}
        prePrintReason={prePrintReason}
        setPrePrintReason={setPrePrintReason}
      />

      {/* Print Portals */}
      <WarehousePrintPortals 
        activePrintDoc={activePrintDoc}
        lastIssuedTransaction={lastIssuedTransaction}
        prePrintFilteredInflows={prePrintFilteredInflows}
        prePrintFilteredDisposals={prePrintFilteredDisposals}
        prePrintStartDate={prePrintStartDate}
        prePrintEndDate={prePrintEndDate}
        prePrintCategory={prePrintCategory}
        prePrintAthlete={prePrintAthlete}
        prePrintReason={prePrintReason}
        receivedTotalGELForLedger={receivedTotalGELForLedger}
        disposalsTotalGELForLedger={disposalsTotalGELForLedger}
      />
    </div>
  );
};

export default WarehouseDashboard;
