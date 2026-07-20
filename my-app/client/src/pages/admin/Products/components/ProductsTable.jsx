import React, { useState, useEffect } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { DataTable } from '../../../../components/ui/DataTable';
import { RefreshCw, Edit, Trash2, Eye, Image as ImageIcon, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../../components/ui/Button';
import { fetchProducts } from '../../../../api/products';

export const ProductsTable = ({ 
  searchTerm, category, stockStatus, prescriptionReq,
  selectedRows, setSelectedRows, onView, onDelete 
}) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  
  // Pagination / Sorting state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortField, setSortField] = useState('name');

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, category, stockStatus, prescriptionReq]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit,
        };
        
        if (searchTerm) params.search = searchTerm;
        if (category && category !== 'All') params.category = category;
        if (stockStatus && stockStatus !== 'All') params.stockStatus = stockStatus;
        if (prescriptionReq && prescriptionReq !== 'All') params.rx = prescriptionReq;

        const response = await fetchProducts(params);
        
        // Map the backend schema (Medicine.js) to the frontend table schema
        const mappedData = response.data.map(item => ({
          id: item._id,
          name: item.name,
          generic: item.subCategory || 'N/A', 
          category: item.category,
          mfg: item.brand,                   
          price: item.price,
          stock: item.countInStock,          
          rx: item.needsRx,                  
          status: item.isActive ? 'Active' : 'Inactive',
          expiry: 'N/A' // Not present in schema yet
        }));

        setProducts(mappedData);
        setTotalPages(response.totalPages);
        setTotalItems(response.total);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [searchTerm, category, stockStatus, prescriptionReq, page, limit, sortField]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(products.map(p => p.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return <Badge variant="danger">Out of Stock</Badge>;
    if (stock < 10) return <Badge variant="warning">Low ({stock})</Badge>;
    return <Badge variant="success">In Stock ({stock})</Badge>;
  };

  const getExpiryStyle = (expiry) => {
    if (expiry === 'N/A') return 'text-slate-500';
    const days = Math.floor((new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'text-rose-600 font-black'; // Expired
    if (days <= 30) return 'text-rose-500 font-bold';
    if (days <= 60) return 'text-orange-500 font-bold';
    return 'text-slate-500';
  };

  const columns = [
    {
      header: (
        <div className="flex items-center justify-center">
          <input 
            type="checkbox" 
            onChange={handleSelectAll} 
            checked={products.length > 0 && selectedRows.length === products.length} 
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4" 
          />
        </div>
      ),
      accessor: 'checkbox',
      className: 'w-10 px-2 text-center',
      cellClassName: 'px-2 text-center',
      cell: (row) => (
        <div className="flex items-center justify-center">
          <input 
            type="checkbox" 
            checked={selectedRows.includes(row.id)} 
            onChange={() => handleSelectRow(row.id)} 
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4" 
          />
        </div>
      )
    },
    {
      header: 'Product',
      accessor: 'product',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-400">
            <ImageIcon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-800" title={row.name}>
              {row.name.length > 55 ? row.name.substring(0, 55) + '...' : row.name}
            </p>
            <p className="text-[10px] font-bold text-slate-500 mt-0.5">{row.category}</p>
          </div>
        </div>
      )
    },
    { header: 'Category', accessor: 'category', cellClassName: 'text-xs font-bold text-slate-600' },
    { header: 'Price', accessor: 'price', cellClassName: 'text-xs font-black text-slate-800', cell: (row) => `₹${row.price}` },
    { header: 'Stock', accessor: 'stock', cell: (row) => getStockBadge(row.stock) },
    { header: 'Rx', accessor: 'rx', cellClassName: 'text-center', cell: (row) => row.rx ? <Badge variant="warning">Rx</Badge> : <span className="text-slate-300">-</span> },
    { header: 'Status', accessor: 'status', cell: (row) => <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>{row.status}</Badge> },
    { header: 'Expiry', accessor: 'expiry', cell: (row) => <span className={`text-[11px] ${getExpiryStyle(row.expiry)}`}>{row.expiry}</span> },
    {
      header: 'Actions',
      accessor: 'actions',
      className: 'text-right',
      cellClassName: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => onView(row)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors">
            <Eye className="h-4 w-4" />
          </button>
          <Link to={`/admin/add-product?edit=${row.id}`}>
            <button className="p-1.5 text-blue-400 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors">
              <Edit className="h-4 w-4" />
            </button>
          </Link>
          <button onClick={() => onDelete(row)} className="p-1.5 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <Card className="overflow-hidden bg-white mt-6 animate-in fade-in duration-500">
      {loading ? (
        <div className="h-[400px] flex items-center justify-center bg-white">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <DataTable 
            columns={columns} 
            data={products} 
            keyField="id"
            emptyMessage={
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-slate-200 mb-4" />
                <p className="text-sm font-black text-slate-600">No products found</p>
                <p className="text-xs font-medium text-slate-400 mt-1 mb-6">Try adjusting your filters or search term.</p>
                <Link to="/admin/add-product">
                  <Button variant="primary">Add New Product</Button>
                </Link>
              </div>
            }
          />
          
          {/* Pagination Strip */}
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-slate-500 bg-slate-50 gap-4">
            <p>Showing {products.length} of {totalItems} products</p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select 
                  value={limit} 
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                  className="bg-white border border-slate-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-3 py-1 bg-white border border-slate-200 rounded ${page === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Prev
                </button>
                
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded border border-slate-200">
                  Page {page} of {totalPages}
                </span>
                
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className={`px-3 py-1 bg-white border border-slate-200 rounded ${page >= totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};
