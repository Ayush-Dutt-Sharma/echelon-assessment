import React, { createContext, useCallback, useContext, useState } from 'react';
import { API_URL,PAGE_SIZE } from '../constants';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [itemsTotalCount, setItemsTotalCount] = useState(0);
  const fetchItems = useCallback(async ({ search = '', page = 1, signal }) => {
    const params = new URLSearchParams({ q: search, page, limit: PAGE_SIZE });
    const res = await fetch(`${API_URL}/api/items?${params}`, { signal });
    const json = await res.json();
    setItems(json?.results || []);
    setItemsTotalCount(json?.totalCount || 0);
  }, []);

  return (
    <DataContext.Provider value={{ items, fetchItems, itemsTotalCount }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);