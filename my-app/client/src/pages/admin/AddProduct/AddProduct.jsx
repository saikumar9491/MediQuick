import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import BasicInfoSection from './components/BasicInfoSection';
import PricingStockSection from './components/PricingStockSection';
import ComplianceSection from './components/ComplianceSection';
import MedicalDetailsSection from './components/MedicalDetailsSection';
import MediaUploadSection from './components/MediaUploadSection';
import StatusSection from './components/StatusSection';
import { createProduct, getProductById, updateProduct } from '../../../api/products';
// fetchCategories is not used here right now, we can remove it.

const initialFormState = {
  name: '',
  brand: '',
  salt: '',
  description: '',
  category: '',
  subCategory: '',
  price: '',
  discountPrice: '',
  countInStock: '',
  unit: 'Tablet',
  lowStockThreshold: 10,
  needsRx: false,
  batchNumber: '',
  manufacturingDate: '',
  expiryDate: '',
  dosageForm: 'Tablet',
  strength: '',
  image: '',
  isActive: true,
  isFeatured: false,
  usesAndBenefits: '',
  howToUse: '',
  safetyInformation: '',
  ingredients: '',
  verifiedAuthentic: false,
};

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setInitialLoading(true);
      const product = await getProductById(id);
      
      // Format dates for input type="date"
      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
      };

      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        salt: product.salt || '',
        description: product.description || '',
        category: product.category || '',
        subCategory: product.subCategory || '',
        price: product.price || '',
        discountPrice: product.discountPrice || '',
        countInStock: product.countInStock || '',
        unit: product.unit || 'Tablet',
        lowStockThreshold: product.lowStockThreshold || 10,
        needsRx: product.needsRx || false,
        batchNumber: product.batchNumber || '',
        manufacturingDate: formatDate(product.manufacturingDate),
        expiryDate: formatDate(product.expiryDate),
        dosageForm: product.dosageForm || 'Tablet',
        strength: product.strength || '',
        image: product.image || '',
        isActive: product.isActive !== undefined ? product.isActive : true,
        isFeatured: product.isFeatured || false,
        usesAndBenefits: product.usesAndBenefits || '',
        howToUse: product.howToUse || '',
        safetyInformation: product.safetyInformation || '',
        ingredients: product.ingredients || '',
        verifiedAuthentic: product.verifiedAuthentic || false,
      });
    } catch (error) {
      toast.error('Failed to load product details');
      navigate('/admin/products');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.salt.trim()) newErrors.salt = 'Salt / Composition is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.subCategory) newErrors.subCategory = 'Subcategory is required';
    
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (formData.countInStock === '' || isNaN(formData.countInStock) || Number(formData.countInStock) < 0) {
      newErrors.countInStock = 'Valid stock quantity is required';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const exp = new Date(formData.expiryDate);
      if (exp <= new Date()) {
        newErrors.expiryDate = 'Expiry date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        countInStock: Number(formData.countInStock),
        lowStockThreshold: Number(formData.lowStockThreshold)
      };

      if (isEditMode) {
        await updateProduct(id, payload);
        toast.success('Product updated successfully!');
      } else {
        await createProduct(payload);
        toast.success('Product added successfully!');
      }
      
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <button onClick={() => navigate('/admin/products')} className="hover:text-blue-600">Products</button>
            <span>/</span>
            <span className="text-slate-900 font-medium">{isEditMode ? 'Edit Product' : 'Add Product'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isEditMode ? 'Update the details of this medicine' : 'Add a new medicine to your catalog'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-20">
        <BasicInfoSection formData={formData} onChange={handleChange} errors={errors} />
        <PricingStockSection formData={formData} onChange={handleChange} errors={errors} />
        <ComplianceSection formData={formData} onChange={handleChange} errors={errors} />
        <MedicalDetailsSection formData={formData} onChange={handleChange} />
        <MediaUploadSection formData={formData} onChange={handleChange} />
        <StatusSection formData={formData} onChange={handleChange} />

        {/* Footer actions */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-slate-200 p-4 px-6 flex items-center justify-end gap-3 z-10">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEditMode ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
