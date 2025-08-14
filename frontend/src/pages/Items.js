import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import { PAGE_SIZE, API_URL } from '../constants';

function Items() {
  const { items, fetchItems, itemsTotalCount } = useData();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Add item modal state
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: '', price: '' });
  const [adding, setAdding] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 200);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetchItems({ search: debouncedSearch, page, signal: controller.signal })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [fetchItems, debouncedSearch, page]);

  const maxPage = Math.ceil(itemsTotalCount / PAGE_SIZE);

  // Skeleton loader
  const skeletons = Array.from({ length: 5 }, (_, i) => (
    <div className="skeleton" key={i} />
  ));

  const handleAddItem = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch(`${API_URL}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItem.name,
          category: newItem.category,
          price: Number(newItem.price)
        })
      });
      if (!res.ok) throw new Error('Failed to add item');
      setShowModal(false);
      setNewItem({ name: '', category: '', price: '' });
      fetchItems({ search: debouncedSearch, page });
    } catch (err) {
      alert('Error adding item');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="search"
          placeholder="Search items..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          aria-label="Search items"
          style={{ flex: 1 }}
        />
        <button style ={{'marginTop':'-15px'}} type="button" onClick={() => setShowModal(true)}>Add</button>
      </div>
      {loading ? (
        <div>{skeletons}</div>
      ) : !items.length ? (
        <p style={{ color: '#888', textAlign: 'center', marginTop: 32 }}>No items found</p>
      ) : (
        <>
          <List
            height={400}
            itemCount={items.length}
            itemSize={40}
            width={'100%'}
            className='overflowXHidden'
          >
            {({ index, style }) => (
              <div style={style} className="ListItem" key={items[index].id}>
                <Link to={'/items/' + items[index].id}>{items[index].name}</Link>
              </div>
            )}
          </List>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 16 }}>
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
            <button
              disabled={page >= maxPage}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
            <span style={{marginLeft: 12, color: '#555'}}>Page {page} of {maxPage}</span>
          </div>
        </>
      )}

      {/* Add Item Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Add New Item</h3>
            <form onSubmit={handleAddItem}>
              <input
                type="text"
                placeholder="Name"
                value={newItem.name}
                required
                className='marginLeft'
                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Category"
                value={newItem.category}
                required
                className='marginLeft'
                onChange={e => setNewItem({ ...newItem, category: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price"
                value={newItem.price}
                required
                min={0}
                className='marginLeft'
                onChange={e => setNewItem({ ...newItem, price: e.target.value })}
              />
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <button type="submit" disabled={adding}>Submit</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Items;