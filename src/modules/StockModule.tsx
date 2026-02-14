// Get running total of Vendor Issued Qty for an itemCode from all vendor issues
const getVendorIssuedQtyTotal = (itemCode: string) => {
  try {
    const vendorIssues = JSON.parse(localStorage.getItem("vendorIssueData") || "[]");
    return vendorIssues.reduce((total: number, issue: any) => {
      if (Array.isArray(issue.items)) {
        return (
          total +
          issue.items.reduce(
            (sum: number, item: any) =>
              item.itemCode === itemCode && typeof item.qty === "number" ? sum + item.qty : sum,
            0
          )
        );
      }
      return total;
    }, 0);
  } catch {
    return 0;
  }
};
// Get running total of In-House Issued Qty for an itemCode from all in-house issues
const _getInHouseIssuedQtyTotal = (itemCode: string) => {
  try {
    const inHouseIssues = JSON.parse(localStorage.getItem("inHouseIssueData") || "[]");
    return inHouseIssues.reduce((total: number, issue: any) => {
      if (Array.isArray(issue.items)) {
        return (
          total +
          issue.items.reduce(
            (sum: number, item: any) =>
              item.itemCode === itemCode && typeof item.qty === "number" ? sum + item.qty : sum,
            0
          )
        );
      }
      return total;
    }, 0);
  } catch {
    return 0;
  }
};


// Get running total of In-House Issued Qty for an itemCode filtered by transaction type
const getInHouseIssuedQtyByTransactionType = (itemCode: string, transactionType: string) => {
  try {
    const inHouseIssues = JSON.parse(localStorage.getItem("inHouseIssueData") || "[]");
    return inHouseIssues.reduce((total: number, issue: any) => {
      if (Array.isArray(issue.items)) {
        return (
          total +
          issue.items.reduce(
            (sum: number, item: any) => {
              const matches = item.itemCode === itemCode && 
                            (item.transactionType === transactionType || transactionType === '*');
              const qty = item.issueQty || item.qty || 0;
              return matches && typeof qty === "number" ? sum + qty : sum;
            },
            0
          )
        );
      }
      return total;
    }, 0);
  } catch {
    return 0;
  }
};

// Get total In-House Issued Qty for an item matched by itemName OR itemCode (normalized) - includes all transaction types
const getInHouseIssuedQtyByItemName = (itemName: string, itemCode?: string) => {
  try {
    const normalize = (s: any) => (s === undefined || s === null ? '' : String(s).trim().toLowerCase());
    const targetName = normalize(itemName);
    const targetCode = normalize(itemCode);
    
    const inHouseIssues = JSON.parse(localStorage.getItem("inHouseIssueData") || "[]");
    return inHouseIssues.reduce((total: number, issue: any) => {
      if (Array.isArray(issue.items)) {
        return (
          total +
          issue.items.reduce(
            (sum: number, item: any) => {
              const name = normalize(item.itemName || '');
              const code = normalize(item.itemCode || '');
              const matched = (targetName && name === targetName) || (targetCode && code === targetCode);
              const qty = item.issueQty || item.qty || 0;
              return matched && typeof qty === "number" ? sum + qty : sum;
            },
            0
          )
        );
      }
      return total;
    }, 0);
  } catch {
    return 0;
  }
};

// Get In-House Issued Qty for an item - ONLY Stock transaction type (for Closing Stock calculation)
const getInHouseIssuedQtyByItemNameStockOnly = (itemName: string, itemCode?: string) => {
  try {
    const normalize = (s: any) => (s === undefined || s === null ? '' : String(s).trim().toLowerCase());
    const targetName = normalize(itemName);
    const targetCode = normalize(itemCode);
    
    const inHouseIssues = JSON.parse(localStorage.getItem("inHouseIssueData") || "[]");
    return inHouseIssues.reduce((total: number, issue: any) => {
      if (Array.isArray(issue.items)) {
        return (
          total +
          issue.items.reduce(
            (sum: number, item: any) => {
              const name = normalize(item.itemName || '');
              const code = normalize(item.itemCode || '');
              const matched = (targetName && name === targetName) || (targetCode && code === targetCode);
              const isStockType = item.transactionType === 'Stock';
              const qty = item.issueQty || item.qty || 0;
              return matched && isStockType && typeof qty === "number" ? sum + qty : sum;
            },
            0
          )
        );
      }
      return total;
    }, 0);
  } catch {
    return 0;
  }
};

// Get running total of vendor dept qty for an itemCode from all vendor dept orders
const getVendorDeptQtyTotal = (itemCode: string) => {
  try {
    const vendorDeptOrders = JSON.parse(localStorage.getItem("vendorDeptData") || "[]");
    return vendorDeptOrders.reduce((total: number, order: any) => {
      if (Array.isArray(order.items)) {
        return (
          total +
          order.items.reduce(
            (sum: number, item: any) =>
              item.itemCode === itemCode && typeof item.qty === "number" ? sum + item.qty : sum,
            0
          )
        );
      }
      return total;
    }, 0);
  } catch {
    return 0;
  }
};

// Get running total of VSIR received qty (OK + Rework + Reject) for an itemCode from all VSIR records
const getVSIRReceivedQtyTotal = (itemCode: string) => {
  try {
    const vsirRecords = JSON.parse(localStorage.getItem("vsri-records") || "[]");
    return vsirRecords.reduce((total: number, record: any) => {
      if (record.itemCode === itemCode) {
        const okQty = typeof record.okQty === "number" ? record.okQty : 0;
        const reworkQty = typeof record.reworkQty === "number" ? record.reworkQty : 0;
        const rejectQty = typeof record.rejectQty === "number" ? record.rejectQty : 0;
        return total + okQty + reworkQty + rejectQty;
      }
      return total;
    }, 0);
  } catch {
    return 0;
  }
};

// Get adjusted vendor issued qty (after subtracting VSIR received quantities)
const getAdjustedVendorIssuedQty = (itemCode: string) => {
  const vendorIssuedTotal = getVendorIssuedQtyTotal(itemCode) || 0;
  const vsirReceivedTotal = getVSIRReceivedQtyTotal(itemCode) || 0;
  return Math.max(0, vendorIssuedTotal - vsirReceivedTotal);
};

// Get in-house issued qty by batch number from IN-House Issue Module
const _getInHouseIssuedQtyByBatch = (batchNo: string) => {
  try {
    const inHouseIssues = JSON.parse(localStorage.getItem("inHouseIssueData") || "[]");
    return inHouseIssues.reduce((total: number, issue: any) => {
      if (Array.isArray(issue.items)) {
        return (
          total +
          issue.items.reduce(
            (sum: number, item: any) =>
              item.batchNo === batchNo && typeof item.issueQty === "number" ? sum + item.issueQty : sum,
            0
          )
        );
      }
      return total;
    }, 0);
  } catch {
    return 0;
  }
};
void _getInHouseIssuedQtyTotal;
void _getInHouseIssuedQtyByBatch;
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import bus from '../utils/eventBus';
import { getVendorIssues, getVendorDepts, getIndentData, getPurchaseData, getPurchaseOrders, getVSIRRecords, getItemMaster, getStockRecords, getInHouseIssues } from '../utils/firestoreServices';

interface StockRecord {
  id: number;
  itemName: string;
  itemCode: string;
  batchNo: string;
  stockQty: number;
  indentQty: number;
  purchaseQty: number;
  vendorQty: number;
  purStoreOkQty: number;
  vendorOkQty: number;
  inHouseIssuedQty: number;
  vendorIssuedQty: number;
  closingStock: number;
}

const LOCAL_STORAGE_KEY = "stock-records";

const STOCK_MODULE_FIELDS = [
  { key: "itemName", label: "Item Name", type: "text" },
  { key: "itemCode", label: "Item Code", type: "text" },
  { key: "batchNo", label: "Batch No", type: "text" },
  { key: "stockQty", label: "Stock Qty", type: "number" },
  { key: "indentQty", label: "Indent Qty", type: "number", readOnly: true },
  { key: "purchaseQty", label: "Purchase Qty", type: "number", readOnly: true },
  { key: "vendorQty", label: "Vendor Qty", type: "number", readOnly: true },
  { key: "purStoreOkQty", label: "Pur Store OK Qty", type: "number", readOnly: true },
  { key: "vendorOkQty", label: "Vendor OK Qty", type: "number", readOnly: true },
  { key: "inHouseIssuedQty", label: "In-House Issued Qty", type: "number" },
  { key: "vendorIssuedQty", label: "Vendor Issued Qty", type: "number" },
  { key: "closingStock", label: "Closing Stock", type: "number" }
];
// Get running total of Vendor OK Qty for an itemCode from all vendor dept orders
const getVendorDeptOkQtyTotal = (itemCode: string) => {
  try {
    const vendorDeptOrders = JSON.parse(localStorage.getItem("vendorDeptData") || "[]");
    return vendorDeptOrders.reduce((total: number, order: any) => {
      if (Array.isArray(order.items)) {
        return (
          total +
          order.items.reduce(
            (sum: number, item: any) =>
              item.itemCode === itemCode && typeof item.okQty === "number" ? sum + item.okQty : sum,
            0
          )
        );
      }
      return total;
    }, 0);
  } catch {
    return 0;
  }
};

// Get adjusted Vendor OK Qty (Vendor Dept OK Qty - In-House Issued where transactionType='Vendor')
const getAdjustedVendorOkQty = (itemCode?: string) => {
  const vendorDeptOkQty = getVendorDeptOkQtyTotal(itemCode || "") || 0;
  
  // Subtract ONLY in-house issued quantities where transactionType='Vendor'
  const totalInHouseIssuedVendor = getInHouseIssuedQtyByTransactionType(itemCode || "", "Vendor") || 0;
  
  const result = Math.max(0, vendorDeptOkQty - totalInHouseIssuedVendor);

  console.log('[DEBUG] getAdjustedVendorOkQty:', { itemCode, vendorDeptOkQty, totalInHouseIssuedVendor, result });
  return result;
};

// Get running total of indent qty for an itemCode from all indents
const getIndentQtyTotal = (itemCode: string) => {
  try {
    const indents = JSON.parse(localStorage.getItem("indentData") || "[]");
    return indents.reduce((total: number, indent: any) => {
      if (Array.isArray(indent.items)) {
        return (
          total +
          indent.items.reduce(
            (sum: number, item: any) =>
              item.itemCode === itemCode && typeof item.qty === "number" ? sum + item.qty : sum,
            0
          )
        );
      }
      return total;
    }, 0);
  } catch {
    return 0;
  }
};

// Get running total of purchase qty for an itemCode from all purchase orders
const getPurchaseQtyTotal = (itemCode: string) => {
  try {
    // Use 'purchaseOrders' for correct source
    const purchaseOrders = JSON.parse(localStorage.getItem("purchaseOrders") || "[]");
    // If purchaseOrders is an array of grouped entries, flatten to items
    let items: any[] = [];
    if (Array.isArray(purchaseOrders)) {
      purchaseOrders.forEach((entry: any) => {
        if (Array.isArray(entry.items)) {
          items = items.concat(entry.items);
        } else if (entry.itemCode && typeof entry.qty === "number") {
          items.push(entry);
        }
      });
    }
    return items.reduce((sum: number, item: any) =>
      item.itemCode === itemCode && typeof item.qty === "number" ? sum + item.qty : sum,
      0
    );
  } catch {
    return 0;
  }
};

const defaultItemInput: Omit<StockRecord, "id"> = {
  itemName: "",
  itemCode: "",
  batchNo: "",
  stockQty: 0,
  indentQty: 0,
  purchaseQty: 0,
  vendorQty: 0,
  purStoreOkQty: 0,
  vendorOkQty: 0,
  inHouseIssuedQty: 0,
  vendorIssuedQty: 0,
  closingStock: 0,
};

const StockModule: React.FC = () => {
  const [itemInput, setItemInput] = useState<Omit<StockRecord, "id">>(defaultItemInput);
  const [records, setRecords] = useState<StockRecord[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [userUid, setUserUid] = useState<string | null>(null);
  const [derived, setDerived] = useState<any>({
    indentQty: 0,
    purchaseQty: 0,
    vendorDeptQty: 0,
    vendorIssuedQty: 0,
    vsirReceivedQty: 0,
    purStoreOkQty: 0,
    vendorOkQty: 0,
    inHouseIssuedQty: 0,
    inHouseIssuedStockOnly: 0,
  });
  const [perRecordDerived, setPerRecordDerived] = useState<Record<string | number, any>>({});
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [itemMaster, setItemMaster] = useState<{ itemName: string; itemCode: string }[]>([]);
  const [draftPsirItems, setDraftPsirItems] = useState<any[]>([]);
  const [lastPsirEventAt, setLastPsirEventAt] = useState<string>('');
  const [, setLastPsirDetail] = useState<any>(null);
  const [lastStorageEventAt, setLastStorageEventAt] = useState<string>('');
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Listen for changes in relevant localStorage keys and reload or force re-render
  useEffect(() => {
    function handleStorageChange(e: StorageEvent) {
      if (e.key === LOCAL_STORAGE_KEY) {
        try {
          setRecords(JSON.parse(e.newValue || "[]"));
        } catch {
          setRecords([]);
        }
      } else if (['indentData', 'purchaseOrders', 'vendorDeptData', 'psirData', 'inHouseIssueData', 'vendorIssueData', 'vsri-records'].includes(e.key || '')) {
        // Force re-render for calculated fields
        if (e.key === 'psirData') setLastStorageEventAt(new Date().toISOString());
        setRecords(prev => [...prev]);
      }
    }
    window.addEventListener('storage', handleStorageChange);
    // Listen for same-window PSIR updates via the event bus and force re-render
    const psirHandler = (ev: Event) => {
      try {
        const ce = ev as CustomEvent;
        setLastPsirEventAt(new Date().toISOString());
        setLastPsirDetail((ce && (ce as any).detail) || null);
        const det = (ce && (ce as any).detail) || {};
        if (det.draftItem) {
          setDraftPsirItems(prev => [...prev, det.draftItem]);
        } else if (det.psirs) {
          // persisted update — clear drafts
          setDraftPsirItems([]);
        }
      } catch (err) {}
      setRecords(prev => [...prev]);
    };
    try {
      bus.addEventListener('psir.updated', psirHandler as EventListener);
    } catch (err) {
      // no-op
    }
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      try { bus.removeEventListener('psir.updated', psirHandler as EventListener); } catch (err) {}
    };
  }, []);

  // Load item master
  useEffect(() => {
    const itemMasterRaw = localStorage.getItem("itemMasterData");
    if (itemMasterRaw) {
      try {
        setItemMaster(JSON.parse(itemMasterRaw));
      } catch {}
    }
  }, []);

  // Sync key datasets from Firestore into localStorage (so existing synchronous helpers keep working)
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      const uid = u ? u.uid : null;
      if (!uid) return;

      // fetch and populate several collections into localStorage so the module's sync functions can remain synchronous
      (async () => {
        try {
          const [vendorIssues, vendorDepts, indentData, purchaseData, purchaseOrders, vsirRecords, itemMaster, stockRecords] = await Promise.all([
            getVendorIssues(uid).catch(() => []),
            getVendorDepts(uid).catch(() => []),
            getIndentData(uid).catch(() => []),
            getPurchaseData(uid).catch(() => []),
            getPurchaseOrders(uid).catch(() => []),
            getVSIRRecords(uid).catch(() => []),
            getItemMaster(uid).catch(() => []),
            getStockRecords(uid).catch(() => []),
          ]);

          try { localStorage.setItem('vendorIssueData', JSON.stringify(vendorIssues)); } catch {}
          try { localStorage.setItem('vendorDeptData', JSON.stringify(vendorDepts)); } catch {}
          try { localStorage.setItem('indentData', JSON.stringify(indentData)); } catch {}
          try { localStorage.setItem('purchaseData', JSON.stringify(purchaseData)); } catch {}
          try { localStorage.setItem('purchaseOrders', JSON.stringify(purchaseOrders)); } catch {}
          try { localStorage.setItem('vsri-records', JSON.stringify(vsirRecords)); } catch {}
          try { localStorage.setItem('itemMasterData', JSON.stringify(itemMaster)); setItemMaster(Array.isArray(itemMaster) ? itemMaster.filter((i:any)=>i.itemName&&i.itemCode).map((i:any)=>({itemName:i.itemName,itemCode:i.itemCode})) : []); } catch {}
          try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stockRecords)); setRecords((stockRecords || []).map((r: any) => ({ ...r }))); } catch {}
        } catch (e) {
          console.error('[StockModule] Error syncing from Firestore:', e);
        }
      })();
    });

    return () => { try { unsubAuth(); } catch {} };
  }, []);

  // Update debug panel when item input changes
  useEffect(() => {
    if (itemInput.itemName || itemInput.itemCode) {
      const psirOkQty = getPSIROkQtyTotal(itemInput.itemName, itemInput.itemCode) || 0;
      const totalInHouseIssuedPurchase = derived.totalInHouseIssuedPurchase || 0;
      const vendorIssuedQty = derived.vendorIssuedQty || 0;
      const purStoreOkQty = derived.purStoreOkQty || Math.max(0, psirOkQty - totalInHouseIssuedPurchase - vendorIssuedQty);
      
      const vendorDeptOkQty = derived.vendorDeptQty || 0;
      const totalInHouseIssuedVendor = derived.totalInHouseIssuedVendor || 0;
      const vendorOkQty = derived.vendorOkQty || Math.max(0, vendorDeptOkQty - totalInHouseIssuedVendor);

      setDebugInfo({
        itemName: itemInput.itemName,
        itemCode: itemInput.itemCode,
        psirOkQty: psirOkQty,
        totalInHouseIssuedPurchase: totalInHouseIssuedPurchase,
        vendorIssuedQty: vendorIssuedQty,
        purStoreOkQty: purStoreOkQty,
        vendorDeptOkQty: vendorDeptOkQty,
        totalInHouseIssuedVendor: totalInHouseIssuedVendor,
        vendorOkQty: vendorOkQty
      });
    } else {
      setDebugInfo(null);
    }
  }, [itemInput.itemName, itemInput.itemCode, draftPsirItems]);

  // Persist records
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
    try {
      // Notify other modules that stock has changed so they can re-read current stock
      bus.dispatchEvent(new CustomEvent('stock.updated', { detail: { records } }));
    } catch (err) {
      console.error('[StockModule] Error dispatching stock.updated:', err);
    }
  }, [records]);

  // track auth uid
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUserUid(u ? u.uid : null);
    });
    return () => { try { unsub(); } catch {} };
  }, []);

  // compute derived totals from Firestore (async) or from localStorage fallback
  useEffect(() => {
    let active = true;
    const code = itemInput.itemCode || '';
    const name = itemInput.itemName || '';

    const compute = async () => {
      try {
        let vendorIssues: any[] = [];
        let vendorDepts: any[] = [];
        let indentData: any[] = [];
        let purchaseData: any[] = [];
        let purchaseOrders: any[] = [];
        let vsirRecords: any[] = [];
        let inHouseIssues: any[] = [];

        if (userUid) {
          [vendorIssues, vendorDepts, indentData, purchaseData, purchaseOrders, vsirRecords, inHouseIssues] = await Promise.all([
            getVendorIssues(userUid).catch(() => []),
            getVendorDepts(userUid).catch(() => []),
            getIndentData(userUid).catch(() => []),
            getPurchaseData(userUid).catch(() => []),
            getPurchaseOrders(userUid).catch(() => []),
            getVSIRRecords(userUid).catch(() => []),
            getInHouseIssues(userUid).catch(() => []),
          ]);
        } else {
          try { vendorIssues = JSON.parse(localStorage.getItem('vendorIssueData') || '[]'); } catch {};
          try { vendorDepts = JSON.parse(localStorage.getItem('vendorDeptData') || '[]'); } catch {};
          try { indentData = JSON.parse(localStorage.getItem('indentData') || '[]'); } catch {};
          try { purchaseData = JSON.parse(localStorage.getItem('purchaseData') || '[]'); } catch {};
          try { purchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders') || '[]'); } catch {};
          try { vsirRecords = JSON.parse(localStorage.getItem('vsri-records') || '[]'); } catch {};
          try { inHouseIssues = JSON.parse(localStorage.getItem('inHouseIssueData') || '[]'); } catch {};
        }

        const normalize = (s: any) => (s === undefined || s === null ? '' : String(s).trim().toLowerCase());
        const targetCode = normalize(code);
        const targetName = normalize(name);

        const vendorIssuedTotal = vendorIssues.reduce((total: number, issue: any) => {
          if (!Array.isArray(issue.items)) return total;
          return total + issue.items.reduce((sum: number, it: any) => (normalize(it.itemCode || it.Code || '') === targetCode && typeof it.qty === 'number' ? sum + it.qty : sum), 0);
        }, 0);

        const vsirReceivedTotal = vsirRecords.reduce((total: number, r: any) => {
          const codeMatch = normalize(r.itemCode || '') === targetCode;
          if (!codeMatch) return total;
          const ok = typeof r.okQty === 'number' ? r.okQty : 0;
          const rework = typeof r.reworkQty === 'number' ? r.reworkQty : 0;
          const rejectQty = typeof r.rejectQty === 'number' ? r.rejectQty : 0;
          return total + ok + rework + rejectQty;
        }, 0);

        // const adjustedVendorIssued = Math.max(0, vendorIssuedTotal - vsirReceivedTotal);

        const vendorDeptTotal = vendorDepts.reduce((total: number, order: any) => {
          if (!Array.isArray(order.items)) return total;
          return total + order.items.reduce((sum: number, it: any) => (normalize(it.itemCode || it.Code || '') === targetCode && typeof it.qty === 'number' ? sum + it.qty : sum), 0);
        }, 0);

        const inHouseIssuedQty = inHouseIssues.reduce((total: number, issue: any) => {
          if (!Array.isArray(issue.items)) return total;
          return total + issue.items.reduce((sum: number, it: any) => {
            const code = normalize(it.itemCode || it.Code || '');
            const nm = normalize(it.itemName || it.Item || '');
            const qty = (it.issueQty === undefined || it.issueQty === null) ? (it.qty || 0) : it.issueQty;
            const match = (targetName && nm === targetName) || (targetCode && code === targetCode);
            return match && typeof qty === 'number' ? sum + qty : sum;
          }, 0);
        }, 0);

        const inHouseIssuedStockOnly = inHouseIssues.reduce((total: number, issue: any) => {
          if (!Array.isArray(issue.items)) return total;
          return total + issue.items.reduce((sum: number, it: any) => {
            const code = normalize(it.itemCode || it.Code || '');
            const nm = normalize(it.itemName || it.Item || '');
            const qty = (it.issueQty === undefined || it.issueQty === null) ? (it.qty || 0) : it.issueQty;
            const isStockType = it.transactionType === 'Stock';
            const match = (targetName && nm === targetName) || (targetCode && code === targetCode);
            return match && isStockType && typeof qty === 'number' ? sum + qty : sum;
          }, 0);
        }, 0);

        const vendorDeptOkQty = vendorDepts.reduce((total: number, order: any) => {
          if (!Array.isArray(order.items)) return total;
          return total + order.items.reduce((sum: number, it: any) => (normalize(it.itemCode || it.Code || '') === targetCode && typeof it.okQty === 'number' ? sum + it.okQty : sum), 0);
        }, 0);

        const totalInHouseIssuedVendor = inHouseIssues.reduce((total: number, issue: any) => {
          if (!Array.isArray(issue.items)) return total;
          return total + issue.items.reduce((sum: number, it: any) => {
            const code = normalize(it.itemCode || it.Code || '');
            const qty = (it.issueQty === undefined || it.issueQty === null) ? (it.qty || 0) : it.issueQty;
            const match = code === targetCode && it.transactionType === 'Vendor';
            return match && typeof qty === 'number' ? sum + qty : sum;
          }, 0);
        }, 0);

        const adjustedVendorOkQty = Math.max(0, vendorDeptOkQty - totalInHouseIssuedVendor);

        // indent qty
        const indentQty = indentData.reduce((total: number, indent: any) => {
          if (!Array.isArray(indent.items)) return total;
          return total + indent.items.reduce((sum: number, it: any) => (normalize(it.itemCode || it.Code || '') === targetCode && typeof it.qty === 'number' ? sum + it.qty : sum), 0);
        }, 0);

        // purchase qty: flatten purchaseOrders or purchaseData
        let purchaseItems: any[] = [];
        if (Array.isArray(purchaseOrders) && purchaseOrders.length) {
          purchaseOrders.forEach((entry: any) => {
            if (Array.isArray(entry.items)) purchaseItems = purchaseItems.concat(entry.items);
            else if (entry.itemCode && typeof entry.qty === 'number') purchaseItems.push(entry);
          });
        } else if (Array.isArray(purchaseData) && purchaseData.length) {
          purchaseData.forEach((entry: any) => {
            if (Array.isArray(entry.items)) purchaseItems = purchaseItems.concat(entry.items);
            else if (entry.itemCode && typeof entry.qty === 'number') purchaseItems.push(entry);
          });
        }
        const purchaseQty = purchaseItems.reduce((sum: number, it: any) => (normalize(it.itemCode || it.Code || '') === targetCode && typeof it.qty === 'number' ? sum + it.qty : sum), 0);

        // purStoreOkQty = PSIR ok - inHouse issued Purchase - vendorIssuedQty (adjusted)
        const psirOkQty = getPSIROkQtyTotal(itemInput.itemName, itemInput.itemCode) || 0;
        const totalInHouseIssuedPurchase = inHouseIssues.reduce((total: number, issue: any) => {
          if (!Array.isArray(issue.items)) return total;
          return total + issue.items.reduce((sum: number, it: any) => {
            const code = normalize(it.itemCode || it.Code || '');
            const qty = (it.issueQty === undefined || it.issueQty === null) ? (it.qty || 0) : it.issueQty;
            const match = code === targetCode && it.transactionType === 'Purchase';
            return match && typeof qty === 'number' ? sum + qty : sum;
          }, 0);
        }, 0);

        const purStoreOkQty = Math.max(0, psirOkQty - totalInHouseIssuedPurchase - vendorIssuedTotal);

        if (!active) return;
        setDerived({
          indentQty,
          purchaseQty,
          vendorDeptQty: vendorDeptTotal,
          vendorIssuedQty: vendorIssuedTotal,
          vsirReceivedQty: vsirReceivedTotal,
          purStoreOkQty,
          vendorOkQty: adjustedVendorOkQty,
          inHouseIssuedQty,
          inHouseIssuedStockOnly,
          totalInHouseIssuedPurchase,
          totalInHouseIssuedVendor
        });
      } catch (e) {
        console.error('[StockModule] compute derived failed', e);
      }
    };

    compute();
    return () => { active = false; };
  }, [itemInput.itemCode, itemInput.itemName, userUid, draftPsirItems]);

  // Component-scoped helpers that prefer Firestore-derived `perRecordDerived` over localStorage
  const normalizeLocal = (s: any) => (s === undefined || s === null ? '' : String(s).trim().toLowerCase());

  const getInHouseIssuedQtyByTransactionTypeDerived = (itemCode: string, transactionType: string) => {
    try {
      if (!perRecordDerived || Object.keys(perRecordDerived).length === 0) return getInHouseIssuedQtyByTransactionType(itemCode, transactionType);
      const target = normalizeLocal(itemCode);
      return records.reduce((total: number, rec) => {
        const recCode = normalizeLocal(rec.itemCode || '');
        if (!recCode || recCode !== target) return total;
        const d = perRecordDerived[rec.id] || {};
        if (transactionType === '*') return total + (d.inHouseIssuedQty || 0);
        if (transactionType === 'Purchase') return total + (d.totalInHouseIssuedPurchase || d.inHouseIssuedQty || 0);
        if (transactionType === 'Vendor') return total + (d.totalInHouseIssuedVendor || d.inHouseIssuedQty || 0);
        if (transactionType === 'Stock') return total + (d.inHouseIssuedStockOnly || 0);
        return total;
      }, 0);
    } catch (e) {
      return getInHouseIssuedQtyByTransactionType(itemCode, transactionType);
    }
  };

  const getInHouseIssuedQtyByItemNameDerived = (itemName: string, itemCode?: string) => {
    try {
      if (!perRecordDerived || Object.keys(perRecordDerived).length === 0) return getInHouseIssuedQtyByItemName(itemName, itemCode);
      const targetName = normalizeLocal(itemName);
      const targetCode = normalizeLocal(itemCode);
      return records.reduce((total: number, rec) => {
        const recCode = normalizeLocal(rec.itemCode || '');
        const recName = normalizeLocal(rec.itemName || '');
        if (targetCode && recCode !== targetCode && !(targetName && recName === targetName)) return total;
        const d = perRecordDerived[rec.id] || {};
        return total + (d.inHouseIssuedQty || 0);
      }, 0);
    } catch (e) {
      return getInHouseIssuedQtyByItemName(itemName, itemCode);
    }
  };

  const getInHouseIssuedQtyByItemNameStockOnlyDerived = (itemName: string, itemCode?: string) => {
    try {
      if (!perRecordDerived || Object.keys(perRecordDerived).length === 0) return getInHouseIssuedQtyByItemNameStockOnly(itemName, itemCode);
      const targetName = normalizeLocal(itemName);
      const targetCode = normalizeLocal(itemCode);
      return records.reduce((total: number, rec) => {
        const recCode = normalizeLocal(rec.itemCode || '');
        const recName = normalizeLocal(rec.itemName || '');
        if (targetCode && recCode !== targetCode && !(targetName && recName === targetName)) return total;
        const d = perRecordDerived[rec.id] || {};
        return total + (d.inHouseIssuedStockOnly || 0);
      }, 0);
    } catch (e) {
      return getInHouseIssuedQtyByItemNameStockOnly(itemName, itemCode);
    }
  };

  const getAdjustedVendorOkQtyDerived = (itemCode?: string) => {
    try {
      if (!perRecordDerived || Object.keys(perRecordDerived).length === 0) return getAdjustedVendorOkQty(itemCode);
      const target = normalizeLocal(itemCode);
      return records.reduce((total: number, rec) => {
        const recCode = normalizeLocal(rec.itemCode || '');
        if (!recCode || recCode !== target) return total;
        const d = perRecordDerived[rec.id] || {};
        return total + (d.vendorOkQty || 0);
      }, 0);
    } catch (e) {
      return getAdjustedVendorOkQty(itemCode);
    }
  };

  // Compute derived values for each record so table rendering is async-friendly
  useEffect(() => {
    let active = true;
    const computeAll = async () => {
      try {
        let vendorIssues: any[] = [];
        let vendorDepts: any[] = [];
        let indentData: any[] = [];
        let purchaseData: any[] = [];
        let purchaseOrders: any[] = [];
        let vsirRecords: any[] = [];
        let inHouseIssues: any[] = [];

        if (userUid) {
          [vendorIssues, vendorDepts, indentData, purchaseData, purchaseOrders, vsirRecords, inHouseIssues] = await Promise.all([
            getVendorIssues(userUid).catch(() => []),
            getVendorDepts(userUid).catch(() => []),
            getIndentData(userUid).catch(() => []),
            getPurchaseData(userUid).catch(() => []),
            getPurchaseOrders(userUid).catch(() => []),
            getVSIRRecords(userUid).catch(() => []),
            getInHouseIssues(userUid).catch(() => []),
          ]);
        } else {
          try { vendorIssues = JSON.parse(localStorage.getItem('vendorIssueData') || '[]'); } catch {};
          try { vendorDepts = JSON.parse(localStorage.getItem('vendorDeptData') || '[]'); } catch {};
          try { indentData = JSON.parse(localStorage.getItem('indentData') || '[]'); } catch {};
          try { purchaseData = JSON.parse(localStorage.getItem('purchaseData') || '[]'); } catch {};
          try { purchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders') || '[]'); } catch {};
          try { vsirRecords = JSON.parse(localStorage.getItem('vsri-records') || '[]'); } catch {};
          try { inHouseIssues = JSON.parse(localStorage.getItem('inHouseIssueData') || '[]'); } catch {};
        }

        const normalize = (s: any) => (s === undefined || s === null ? '' : String(s).trim().toLowerCase());

        const map: Record<string | number, any> = {};

        await Promise.all(records.map(async (rec) => {
          try {
            const code = normalize(rec.itemCode || '');
            const name = normalize(rec.itemName || '');

            const vendorIssuedTotal = vendorIssues.reduce((total: number, issue: any) => {
              if (!Array.isArray(issue.items)) return total;
              return total + issue.items.reduce((sum: number, it: any) => (normalize(it.itemCode || it.Code || '') === code && typeof it.qty === 'number' ? sum + it.qty : sum), 0);
            }, 0);

            const vsirReceivedTotal = vsirRecords.reduce((total: number, r: any) => {
              const codeMatch = normalize(r.itemCode || '') === code;
              if (!codeMatch) return total;
              const ok = typeof r.okQty === 'number' ? r.okQty : 0;
              const rework = typeof r.reworkQty === 'number' ? r.reworkQty : 0;
              const rejectQty = typeof r.rejectQty === 'number' ? r.rejectQty : 0;
              return total + ok + rework + rejectQty;
            }, 0);

            // const adjustedVendorIssued = Math.max(0, vendorIssuedTotal - vsirReceivedTotal);

            const vendorDeptTotal = vendorDepts.reduce((total: number, order: any) => {
              if (!Array.isArray(order.items)) return total;
              return total + order.items.reduce((sum: number, it: any) => (normalize(it.itemCode || it.Code || '') === code && typeof it.qty === 'number' ? sum + it.qty : sum), 0);
            }, 0);

            const inHouseIssuedQty = inHouseIssues.reduce((total: number, issue: any) => {
              if (!Array.isArray(issue.items)) return total;
              return total + issue.items.reduce((sum: number, it: any) => {
                const ic = normalize(it.itemCode || it.Code || '');
                const nm = normalize(it.itemName || it.Item || '');
                const qty = (it.issueQty === undefined || it.issueQty === null) ? (it.qty || 0) : it.issueQty;
                const match = (name && nm === name) || (code && ic === code);
                return match && typeof qty === 'number' ? sum + qty : sum;
              }, 0);
            }, 0);

            const inHouseIssuedStockOnly = inHouseIssues.reduce((total: number, issue: any) => {
              if (!Array.isArray(issue.items)) return total;
              return total + issue.items.reduce((sum: number, it: any) => {
                const ic = normalize(it.itemCode || it.Code || '');
                const nm = normalize(it.itemName || it.Item || '');
                const qty = (it.issueQty === undefined || it.issueQty === null) ? (it.qty || 0) : it.issueQty;
                const isStockType = it.transactionType === 'Stock';
                const match = (name && nm === name) || (code && ic === code);
                return match && isStockType && typeof qty === 'number' ? sum + qty : sum;
              }, 0);
            }, 0);

            const vendorDeptOkQty = vendorDepts.reduce((total: number, order: any) => {
              if (!Array.isArray(order.items)) return total;
              return total + order.items.reduce((sum: number, it: any) => (normalize(it.itemCode || it.Code || '') === code && typeof it.okQty === 'number' ? sum + it.okQty : sum), 0);
            }, 0);

            const totalInHouseIssuedVendor = inHouseIssues.reduce((total: number, issue: any) => {
              if (!Array.isArray(issue.items)) return total;
              return total + issue.items.reduce((sum: number, it: any) => {
                const ic = normalize(it.itemCode || it.Code || '');
                const qty = (it.issueQty === undefined || it.issueQty === null) ? (it.qty || 0) : it.issueQty;
                const match = ic === code && it.transactionType === 'Vendor';
                return match && typeof qty === 'number' ? sum + qty : sum;
              }, 0);
            }, 0);

            const adjustedVendorOkQty = Math.max(0, vendorDeptOkQty - totalInHouseIssuedVendor);

            // indent qty
            const indentQty = indentData.reduce((total: number, indent: any) => {
              if (!Array.isArray(indent.items)) return total;
              return total + indent.items.reduce((sum: number, it: any) => (normalize(it.itemCode || it.Code || '') === code && typeof it.qty === 'number' ? sum + it.qty : sum), 0);
            }, 0);

            // purchase qty: flatten purchaseOrders or purchaseData
            let purchaseItems: any[] = [];
            if (Array.isArray(purchaseOrders) && purchaseOrders.length) {
              purchaseOrders.forEach((entry: any) => {
                if (Array.isArray(entry.items)) purchaseItems = purchaseItems.concat(entry.items);
                else if (entry.itemCode && typeof entry.qty === 'number') purchaseItems.push(entry);
              });
            } else if (Array.isArray(purchaseData) && purchaseData.length) {
              purchaseData.forEach((entry: any) => {
                if (Array.isArray(entry.items)) purchaseItems = purchaseItems.concat(entry.items);
                else if (entry.itemCode && typeof entry.qty === 'number') purchaseItems.push(entry);
              });
            }
            const purchaseQty = purchaseItems.reduce((sum: number, it: any) => (normalize(it.itemCode || it.Code || '') === code && typeof it.qty === 'number' ? sum + it.qty : sum), 0);

            // include any draft PSIR items
            const psirOkQty = getPSIROkQtyTotal(rec.itemName, rec.itemCode) || 0;
            const totalInHouseIssuedPurchase = inHouseIssues.reduce((total: number, issue: any) => {
              if (!Array.isArray(issue.items)) return total;
              return total + issue.items.reduce((sum: number, it: any) => {
                const ic = normalize(it.itemCode || it.Code || '');
                const qty = (it.issueQty === undefined || it.issueQty === null) ? (it.qty || 0) : it.issueQty;
                const match = ic === code && it.transactionType === 'Purchase';
                return match && typeof qty === 'number' ? sum + qty : sum;
              }, 0);
            }, 0);

            const purStoreOkQty = Math.max(0, psirOkQty - totalInHouseIssuedPurchase - vendorIssuedTotal);

            map[rec.id] = {
              indentQty,
              purchaseQty,
              vendorDeptQty: vendorDeptTotal,
              vendorIssuedQty: vendorIssuedTotal,
              vsirReceivedTotal,
              purStoreOkQty,
              vendorOkQty: adjustedVendorOkQty,
              inHouseIssuedQty,
              inHouseIssuedStockOnly,
              totalInHouseIssuedPurchase,
              totalInHouseIssuedVendor
            };
          } catch (err) {
            console.error('[StockModule] computeAll per-record failed for', rec, err);
          }
        }));

        if (!active) return;
        setPerRecordDerived(map);
      } catch (e) {
        console.error('[StockModule] computeAllRecords failed', e);
      }
    };

    computeAll();
    return () => { active = false; };
  }, [records, userUid, draftPsirItems]);

  // Calculate total OK Qty from PSIR — match by itemName OR itemCode (normalized)
  const normalize = (s: any) => (s === undefined || s === null ? '' : String(s).trim().toLowerCase());
  const getPSIROkQtyTotal = (itemName: string, itemCode?: string) => {
    try {
      const psirs = JSON.parse(localStorage.getItem("psirData") || "[]");
      const targetName = normalize(itemName);
      const targetCode = normalize(itemCode);

      console.log('[DEBUG] getPSIROkQtyTotal called:', { itemName, itemCode, targetName, targetCode });

      const totalFromPsirs = psirs.reduce((total: number, psir: any) => {
        if (Array.isArray(psir.items)) {
          return (
            total +
            psir.items.reduce((sum: number, item: any) => {
              const name = normalize(item.itemName || item.Item || '');
              const code = normalize(item.itemCode || item.Code || item.CodeNo || '');
              const okRaw = (item.okQty === undefined || item.okQty === null) ? 0 : Number(item.okQty || 0);
              const qtyReceivedRaw = (item.qtyReceived === undefined || item.qtyReceived === null) ? 0 : Number(item.qtyReceived || 0);
              const ok = okRaw > 0 ? okRaw : qtyReceivedRaw;
              if ((targetName && name === targetName) || (targetCode && code === targetCode)) {
                return sum + ok;
              }
              return sum;
            }, 0)
          );
        }
        return total;
      }, 0);

      console.log('[DEBUG] totalFromPsirs:', totalFromPsirs);

      // include any draft PSIR items (added in current session but not yet persisted)
      const draftTotal = (draftPsirItems || []).reduce((sum: number, it: any) => {
        const name = normalize(it.itemName || it.Item || '');
        const code = normalize(it.itemCode || it.Code || it.CodeNo || '');
        const okRaw = (it.okQty === undefined || it.okQty === null) ? 0 : Number(it.okQty || 0);
        const qtyReceivedRaw = (it.qtyReceived === undefined || it.qtyReceived === null) ? 0 : Number(it.qtyReceived || 0);
        const ok = okRaw > 0 ? okRaw : qtyReceivedRaw;
        if ((targetName && name === targetName) || (targetCode && code === targetCode)) {
          return sum + ok;
        }
        return sum;
      }, 0);

      console.log('[DEBUG] result:', totalFromPsirs + draftTotal);
      return totalFromPsirs + draftTotal;
    } catch (e) {
      console.error('[DEBUG] Error in getPSIROkQtyTotal:', e);
      return 0;
    }
  };

  // Get adjusted Pur Store OK Qty (PSIR OK Qty - In-House Issued Purchase - Vendor Issued Qty)
  const getAdjustedPurStoreOkQty = (itemName: string, itemCode?: string, _batchNo?: string) => {
    const psirOkQty = getPSIROkQtyTotal(itemName, itemCode) || 0;
    
    // Subtract in-house issued quantities where transactionType='Purchase'
    const totalInHouseIssuedPurchase = getInHouseIssuedQtyByTransactionTypeDerived(itemCode || "", "Purchase") || 0;
    
    // Subtract total vendor issued qty from Vendor Issue Module (don't adjust by VSIR received)
    const vendorIssuedQty = getVendorIssuedQtyTotal(itemCode || "") || 0;
    
    const result = Math.max(0, psirOkQty - totalInHouseIssuedPurchase - vendorIssuedQty);

    console.log('[DEBUG] getAdjustedPurStoreOkQty:', { itemName, itemCode, psirOkQty, totalInHouseIssuedPurchase, vendorIssuedQty, result });
    return result;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === "itemName") {
      const found = itemMaster.find((item) => item.itemName === value);
      setItemInput((prev) => ({
        ...prev,
        itemName: value,
        itemCode: found ? found.itemCode : "",
      }));
    } else {
      setItemInput((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemInput.itemName) {
      alert("Item Name is required.");
      return;
    }
    // Auto-calculate all fields except itemName/itemCode/stockQty/batchNo using derived async values
    const vendorIssuedTotal = derived.vendorIssuedQty || 0;
    const vendorDeptTotal = derived.vendorDeptQty || 0;
    const vsirReceivedTotal = derived.vsirReceivedQty || 0;
    const vendorIssuedQtyAdjusted = Math.max(0, vendorIssuedTotal - vsirReceivedTotal);
    const purStoreOkQtyAdjusted = derived.purStoreOkQty || 0;
    const inHouseIssuedStockOnly = derived.inHouseIssuedStockOnly || 0;
    const autoRecord = {
      ...itemInput,
      indentQty: derived.indentQty || 0,
      purchaseQty: derived.purchaseQty || 0,
      vendorQty: Math.max(0, (derived.vendorDeptQty || 0) - (derived.vendorIssuedQty || 0)), // Deduct issued qty from vendor dept qty
      purStoreOkQty: purStoreOkQtyAdjusted,
      vendorOkQty: derived.vendorOkQty || 0,
      inHouseIssuedQty: derived.inHouseIssuedQty || 0,
      vendorIssuedQty: vendorIssuedQtyAdjusted,
      closingStock:
        (Number(itemInput.stockQty) || 0)
        + (purStoreOkQtyAdjusted)
        + (derived.vendorOkQty || 0)
        - (inHouseIssuedStockOnly),
    };

    console.log('[DEBUG] handleSubmit - Full Payload:', {
      itemInput: itemInput,
      calculations: {
        vendorIssuedTotal,
        vendorDeptTotal,
        vsirReceivedTotal,
        vendorIssuedQtyAdjusted,
        purStoreOkQtyAdjusted
      },
      autoRecord: autoRecord
    });

    if (editIdx !== null) {
      setRecords((prev) =>
        prev.map((rec, idx) =>
          idx === editIdx ? { ...autoRecord, id: rec.id } : rec
        )
      );
      setEditIdx(null);
    } else {
      setRecords((prev) => [
        ...prev,
        { ...autoRecord, id: Date.now() },
      ]);
    }
    setItemInput(defaultItemInput);
  };

  const handleEdit = (idx: number) => {
    setItemInput(records[idx]);
    setEditIdx(idx);
  };

  const handleDelete = (idx: number) => {
    setRecords((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <h2>Stock Module</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        {STOCK_MODULE_FIELDS.map((field) => (
          <div key={field.key} style={{ flex: "1 1 200px", minWidth: 180 }}>
            <label style={{ display: "block", marginBottom: 4 }}>{field.label}</label>
            {field.key === "itemName" && itemMaster.length > 0 ? (
              <select
                name="itemName"
                value={itemInput.itemName}
                onChange={handleChange}
                style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #bbb" }}
              >
                <option value="">Select Item Name</option>
                {itemMaster.map((item) => (
                  <option key={item.itemCode} value={item.itemName}>
                    {item.itemName}
                  </option>
                ))}
              </select>
            ) : field.key === "indentQty" ? (
              <input
                type="number"
                name="indentQty"
                value={derived.indentQty || 0}
                readOnly
                style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #bbb", background: "#eee" }}
              />
            ) : field.key === "purchaseQty" ? (
              <input
                type="number"
                name="purchaseQty"
                value={derived.purchaseQty || 0}
                readOnly
                style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #bbb", background: "#eee" }}
              />
            ) : field.key === "vendorQty" ? (
              <input
                type="number"
                name="vendorQty"
                value={Math.max(0, (derived.vendorDeptQty || 0) - (derived.vendorIssuedQty || 0))}
                readOnly
                style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #bbb", background: "#eee" }}
              />
            ) : field.key === "purStoreOkQty" ? (
              <input
                type="number"
                name="purStoreOkQty"
                value={derived.purStoreOkQty || 0}
                readOnly
                style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #bbb", background: "#eee" }}
              />
            ) : field.key === "vendorOkQty" ? (
              <input
                type="number"
                name="vendorOkQty"
                value={derived.vendorOkQty || 0}
                readOnly
                style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #bbb", background: "#eee" }}
              />
            ) : field.key === "inHouseIssuedQty" ? (
              <input
                type="number"
                name="inHouseIssuedQty"
                value={derived.inHouseIssuedQty || 0}
                readOnly
                style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #bbb", background: "#eee" }}
              />
            ) : field.key === "vendorIssuedQty" ? (
              <input
                type="number"
                name="vendorIssuedQty"
                value={derived.vendorIssuedQty || 0}
                readOnly
                style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #bbb", background: "#eee" }}
              />
            ) : field.key === "closingStock" ? (
              <input
                type="number"
                name="closingStock"
                value={
                  (Number(itemInput.stockQty) || 0)
                          + (derived.purStoreOkQty || 0)
                  + (derived.vendorOkQty || 0)
                  - (derived.inHouseIssuedStockOnly || 0)
                }
                readOnly
                style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #bbb", background: "#eee" }}
              />
            ) : (
              <input
                type={field.type}
                name={field.key}
                value={(itemInput as any)[field.key] || ""}
                onChange={handleChange}
                required
                readOnly={field.readOnly}
                style={{ width: "100%", padding: 6, borderRadius: 4, border: "1px solid #bbb" }}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          style={{
            padding: "10px 24px",
            background: "#1a237e",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            fontWeight: 500,
            marginTop: 24,
          }}
        >
          {editIdx !== null ? "Update" : "Add"}
        </button>
      </form>

      <div style={{ marginBottom: 12, padding: 12, background: showDebugPanel ? '#e3f2fd' : '#f5f5f5', border: '2px solid #1976d2', borderRadius: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <strong style={{ fontSize: '16px' }}>🐛 DEBUG PANEL - Pur Store OK Qty Calculation</strong>
          <button 
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            style={{
              padding: '6px 12px',
              background: '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {showDebugPanel ? 'Hide' : 'Show'}
          </button>
        </div>

        {showDebugPanel && (
          <div style={{ background: '#fff', padding: 12, borderRadius: 4, border: '1px solid #90caf9' }}>
            {debugInfo ? (
              <div>
                <div style={{ marginBottom: 12, padding: 8, background: '#f3e5f5', borderRadius: 4 }}>
                  <strong>Current Item:</strong> {debugInfo.itemName || '(none)'} [{debugInfo.itemCode || '(none)'}]
                </div>

                <div style={{ marginBottom: 12, padding: 8, background: '#fff3e0', borderRadius: 4 }}>
                  <strong style={{ display: 'block', marginBottom: 4, color: '#f57c00' }}>PSIR OK Qty Calculation:</strong>
                  <div style={{ marginLeft: 16 }}>
                    <div>Total PSIR OK Qty: <strong style={{ color: '#f57c00', fontSize: '16px' }}>{debugInfo.psirOkQty || 0}</strong></div>
                    {debugInfo.psirItems && debugInfo.psirItems.length > 0 && (
                      <details style={{ marginTop: 8 }}>
                        <summary>Breakdown ({debugInfo.psirItems.length} items)</summary>
                        <div style={{ marginLeft: 16, marginTop: 8 }}>
                          {debugInfo.psirItems.map((item: any, idx: number) => (
                            <div key={idx} style={{ padding: 6, background: '#ffe0b2', marginBottom: 4, borderRadius: 4, fontSize: '12px' }}>
                              <div><strong>{item.itemName}</strong> [{item.itemCode}] {item.isDraft ? '(DRAFT)' : ''}</div>
                              <div>okQty: {item.okQty}, qtyReceived: {item.qtyReceived} → Using: <strong>{item.usedValue}</strong></div>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: 12, padding: 8, background: '#e8f5e9', borderRadius: 4 }}>
                  <strong style={{ display: 'block', marginBottom: 4, color: '#2e7d32' }}>In-House Issued Qty - Transaction Type: "Purchase" (Deduction):</strong>
                  <div style={{ marginLeft: 16 }}>
                    Total In-House Issued (Purchase): <strong style={{ color: '#2e7d32', fontSize: '16px' }}>{debugInfo.totalInHouseIssuedPurchase || 0}</strong>
                  </div>
                </div>

                <div style={{ marginBottom: 12, padding: 8, background: '#ffe0b2', borderRadius: 4 }}>
                  <strong style={{ display: 'block', marginBottom: 4, color: '#e65100' }}>Vendor Issued Qty - From Vendor Issue Module (Deduction):</strong>
                  <div style={{ marginLeft: 16 }}>
                    Total Vendor Issued: <strong style={{ color: '#e65100', fontSize: '16px' }}>{debugInfo.vendorIssuedQty || 0}</strong>
                  </div>
                </div>

                <div style={{ padding: 12, background: '#c8e6c9', borderRadius: 4, border: '2px solid #2e7d32', marginBottom: 12 }}>
                  <strong style={{ display: 'block', marginBottom: 4, color: '#1b5e20', fontSize: '16px' }}>Final Pur Store OK Qty:</strong>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1b5e20' }}>
                    {debugInfo.psirOkQty || 0} - {debugInfo.totalInHouseIssuedPurchase || 0} - {debugInfo.vendorIssuedQty || 0} = <span style={{ color: '#d32f2f', fontSize: '24px' }}>{debugInfo.purStoreOkQty || 0}</span>
                  </div>
                </div>

                <div style={{ marginBottom: 12, padding: 8, background: '#f3e0f5', borderRadius: 4 }}>
                  <strong style={{ display: 'block', marginBottom: 4, color: '#7b1fa2' }}>Vendor Dept OK Qty - Transaction Type: "Vendor" Deduction:</strong>
                  <div style={{ marginLeft: 16 }}>
                    Vendor Dept OK Qty: <strong style={{ color: '#7b1fa2', fontSize: '16px' }}>{debugInfo.vendorDeptOkQty || 0}</strong>
                    <div style={{ marginTop: 4 }}>In-House Issued (Vendor): <strong style={{ color: '#7b1fa2', fontSize: '16px' }}>{debugInfo.totalInHouseIssuedVendor || 0}</strong></div>
                  </div>
                </div>

                <div style={{ padding: 12, background: '#e1bee7', borderRadius: 4, border: '2px solid #7b1fa2', marginBottom: 12 }}>
                  <strong style={{ display: 'block', marginBottom: 4, color: '#4a148c', fontSize: '16px' }}>Final Vendor OK Qty:</strong>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4a148c' }}>
                    {debugInfo.vendorDeptOkQty || 0} - {debugInfo.totalInHouseIssuedVendor || 0} = <span style={{ color: '#d32f2f', fontSize: '28px' }}>{debugInfo.vendorOkQty || 0}</span>
                  </div>
                </div>

                <div style={{ marginTop: 12, padding: 8, background: '#eceff1', borderRadius: 4, fontSize: '12px' }}>
                  <div>Last psir.updated event: {lastPsirEventAt || '(none)'}</div>
                  <div>Last psirData storage event: {lastStorageEventAt || '(none)'}</div>
                </div>
              </div>
            ) : (
              <div style={{ color: '#666', fontStyle: 'italic' }}>Enter an item and its values will appear here...</div>
            )}
          </div>
        )}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fafbfc" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: 8, background: "#e3e6f3", fontWeight: 600 }}>S.No</th>
              {STOCK_MODULE_FIELDS.map((field) => (
                <th key={field.key} style={{ border: "1px solid #ddd", padding: 8, background: "#e3e6f3" }}>
                  {field.label}
                </th>
              ))}
              <th style={{ border: "1px solid #ddd", padding: 8, background: "#e3e6f3" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, idx) => (
              <tr key={rec.id}>
                <td style={{ border: "1px solid #eee", padding: 8 }}>{idx + 1}</td>
                {STOCK_MODULE_FIELDS.map((field) => (
                  <td key={field.key} style={{ border: "1px solid #eee", padding: 8 }}>
                    {(() => {
                      const d = perRecordDerived[rec.id] || {};
                      switch (field.key) {
                        case 'purStoreOkQty':
                          return d.purStoreOkQty ?? getAdjustedPurStoreOkQty(rec.itemName, rec.itemCode, rec.batchNo);
                        case 'indentQty':
                          return d.indentQty ?? getIndentQtyTotal(rec.itemCode);
                        case 'purchaseQty':
                          return d.purchaseQty ?? getPurchaseQtyTotal(rec.itemCode);
                        case 'vendorQty':
                          return (d.vendorDeptQty ?? getVendorDeptQtyTotal(rec.itemCode)) - (d.vendorIssuedQty ?? getVendorIssuedQtyTotal(rec.itemCode));
                        case 'vendorOkQty':
                          return d.vendorOkQty ?? getAdjustedVendorOkQty(rec.itemCode);
                        case 'inHouseIssuedQty':
                          return d.inHouseIssuedQty ?? getInHouseIssuedQtyByItemNameDerived(rec.itemName, rec.itemCode);
                        case 'vendorIssuedQty':
                          return d.vendorIssuedQty ?? getAdjustedVendorIssuedQty(rec.itemCode);
                        case 'closingStock': {
                          const pur = d.purStoreOkQty ?? getAdjustedPurStoreOkQty(rec.itemName, rec.itemCode, rec.batchNo);
                          const vok = d.vendorOkQty ?? getAdjustedVendorOkQtyDerived(rec.itemCode);
                          const inHouseStock = d.inHouseIssuedStockOnly ?? getInHouseIssuedQtyByItemNameStockOnlyDerived(rec.itemName, rec.itemCode);
                          return (Number(rec.stockQty) || 0) + (pur || 0) + (vok || 0) - (inHouseStock || 0);
                        }
                        default:
                          return (rec as any)[field.key];
                      }
                    })()}
                  </td>
                ))}
                <td style={{ border: "1px solid #eee", padding: 8 }}>
                  <button
                    style={{ marginRight: 8, background: "#1976d2", color: "#fff", border: "none", padding: "4px 12px" }}
                    onClick={() => handleEdit(idx)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ background: "#e53935", color: "#fff", border: "none", padding: "4px 12px" }}
                    onClick={() => handleDelete(idx)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockModule;