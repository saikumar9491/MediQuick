import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturedBrands = () => {
  const navigate = useNavigate();

  const brands = [
    { name: "Pilgrim", logo: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/e8e604d5-072e-4b77-8051-9310a08e6587.png" },
    { name: "Dr. Morepen", logo: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/6ec7a4f5-9377-4959-992e-360e676104bc.png" },
    { name: "Miduty", logo: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/8b46e9df-9884-482d-8007-881b212f0290.png" },
    { name: "Omron", logo: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/72574e4c-1e81-432d-82d2-83b53c713b1d.png" },
    { name: "PentaSure", logo: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/43773177-3e2b-435f-846c-2f941198642a.png" },
    { name: "Optimum Nutrition", logo: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/d6f4661a-283e-4d4b-97e3-0c460d3d5f57.png" },
    { name: "Prohance", logo: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/80d07525-412f-48e0-a430-671c08007323.png" },
    { name: "Tejasya", logo: "https://onemg.gumlet.io/a_ignore,w_150,h_150,c_fit,q_auto,f_auto/273d6118-977a-426b-967b-232506e76315.png" }
  ];

  return (
    <section className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Title and See All Button */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-2">
          <h2 className="text-xl font-bold text-[#212121]">Featured brands</h2>
          <button 
            onClick={() => navigate('/all-brands')}
            className="text-[#ff6f61] font-bold text-xs uppercase border border-[#ff6f61] px-3 py-1 rounded hover:bg-[#ff6f61] hover:text-white transition-all"
          >
            See All
          </button>
        </div>

        {/* Circular Logo Grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {brands.map((brand, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(`/brand/${brand.name}`)}
              className="group cursor-pointer flex flex-col items-center"
            >
              <div className="w-full aspect-square bg-white border border-gray-100 rounded-lg flex items-center justify-center p-2 hover:shadow-md transition-shadow">
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center shadow-inner bg-white">
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="w-[85%] h-[85%] object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <span className="mt-2 text-[10px] font-bold text-gray-600 text-center uppercase tracking-tighter">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands;