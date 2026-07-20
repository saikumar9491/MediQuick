import React, { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

import { ProductsStatsStrip } from './components/ProductsStatsStrip';
import { ProductsFilterBar } from './components/ProductsFilterBar';
import { ProductsTable } from './components/ProductsTable';
import { BulkActionsToolbar } from './components/BulkActionsToolbar';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ProductDetailModal } from './components/ProductDetailModal';

const Products = () => {
  // Shared state for filtering and search
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [stockStatus, setStockStatus] = useState('All');
  const [prescriptionReq, setPrescriptionReq] = useState('All');

  // Shared state for selection and actions
  const [selectedRows, setSelectedRows] = useState([]);
  
  // Modals
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState(null);

  const openDetailModal = (product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 relative">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Products</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage your medicine catalog
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300">
            <Download className="h-4 w-4 mr-2" />
            Export Products
          </Button>
          <Link to="/admin/add-product">
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Stats Strip */}
      <ProductsStatsStrip setStockStatus={setStockStatus} />

      {/* 3. Filters & Search */}
      <ProductsFilterBar 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        category={category} setCategory={setCategory}
        stockStatus={stockStatus} setStockStatus={setStockStatus}
        prescriptionReq={prescriptionReq} setPrescriptionReq={setPrescriptionReq}
      />

      {/* 4 & 5. Bulk Actions and Products Table */}
      <div className="relative">
        <BulkActionsToolbar 
          selectedRows={selectedRows} 
          setSelectedRows={setSelectedRows} 
          onBulkDelete={() => {
            setBulkDeleteIds(selectedRows);
            setDeleteModalOpen(true);
          }}
          onRefresh={() => {
            // A trick to trigger a refresh is to toggle a boolean or just re-fetch.
            // For now, we'll just force a small search change to trigger it, or better, 
            // since we don't have a direct refresh, we'll just clear selected rows.
            // Ideally we'd have a refresh function.
            setSearchTerm(prev => prev + ' '); 
            setTimeout(() => setSearchTerm(prev => prev.trim()), 10);
          }}
        />
        
        <ProductsTable 
          searchTerm={searchTerm}
          category={category}
          stockStatus={stockStatus}
          prescriptionReq={prescriptionReq}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onView={openDetailModal}
          onDelete={openDeleteModal}
        />
      </div>

      {/* Modals */}
      <ProductDetailModal 
        isOpen={detailModalOpen} 
        onClose={() => setDetailModalOpen(false)} 
        product={selectedProduct} 
      />
      
      <DeleteConfirmModal 
        isOpen={deleteModalOpen} 
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
          setBulkDeleteIds(null);
        }} 
        product={productToDelete} 
        bulkIds={bulkDeleteIds}
        onSuccess={() => {
          setSelectedRows([]);
          setSearchTerm(prev => prev + ' '); 
          setTimeout(() => setSearchTerm(prev => prev.trim()), 10);
        }}
      />
    </div>
  );
};

export default Products;
