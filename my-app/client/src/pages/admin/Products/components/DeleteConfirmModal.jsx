import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from '../../../../components/ui/Modal';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { deleteProduct, bulkDeleteProducts } from '../../../../api/products';

export const DeleteConfirmModal = ({ isOpen, onClose, product, bulkIds, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!product && !bulkIds?.length) return null;

  const isBulk = bulkIds && bulkIds.length > 0;
  const count = isBulk ? bulkIds.length : 1;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (isBulk) {
        await bulkDeleteProducts(bulkIds);
        toast.success(`Successfully deleted ${count} products`);
      } else {
        await deleteProduct(product.id);
        toast.success(`Successfully deleted ${product.name}`);
      }
      
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete product(s). Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <div className="flex flex-col items-center text-center py-4">
        <div className="h-16 w-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8" />
        </div>
        
        <h3 className="text-lg font-black text-slate-800 mb-2">
          {isBulk ? `Delete ${count} Products?` : `Delete ${product?.name}?`}
        </h3>
        <p className="text-sm font-medium text-slate-500 px-4">
          Are you absolutely sure you want to delete {isBulk ? 'these products' : 'this product'}? This action cannot be undone and will permanently remove {isBulk ? 'them' : 'it'} from your catalog.
        </p>

        <div className="mt-8 flex items-center gap-3 w-full">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            className="flex-1 bg-rose-600 hover:bg-rose-700 border-transparent text-white" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : (
              <span className="flex items-center justify-center gap-2">
                <Trash2 className="h-4 w-4" /> Delete {isBulk ? 'Products' : 'Product'}
              </span>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
