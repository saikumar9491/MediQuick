import React, { useState } from 'react';

const PrescriptionUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="p-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200 text-center">
      <h3 className="text-sm font-bold text-blue-800 mb-2">Upload Doctor's Prescription</h3>
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="text-xs text-gray-600 mb-2"
        accept="image/*,.pdf"
      />
      {file && <p className="text-xs text-green-600">Selected: {file.name}</p>}
    </div>
  );
};

export default PrescriptionUpload;