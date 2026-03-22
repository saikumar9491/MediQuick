import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturedBrands = () => {
  const navigate = useNavigate();

  const brands = [
    { name: "Fhzer", logo: "https://www.watsons.com.sg/medias/04-Brand-Story-Banner-750x530px-01-IL-01.jpg?context=bWFzdGVyfHJvb3R8NjAxNjF8aW1hZ2UvanBlZ3xoZmMvaGU1LzkwNzMyOTQyNDU5MTguanBnfGQ5ZWI3NGQyMTJkOTU5MzA5YTkzNGNjOWM2NjVhZDBiMjFkZjdkZDQzNDNhNjBhNTUwYjBiZjk3OWQyZGEwMTI" },
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-2">
          <h2 className="text-base sm:text-xl font-bold text-[#212121]">
            Featured brands
          </h2>

          <button
            onClick={() => navigate('/all-brands')}
            className="text-[#ff6f61] font-bold text-[10px] sm:text-xs uppercase border border-[#ff6f61] px-2 py-1 sm:px-3 rounded hover:bg-[#ff6f61] hover:text-white transition-all"
          >
            See All
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-4">
          {brands.map((brand, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/brand/${encodeURIComponent(brand.name)}`)}
              className="group cursor-pointer flex flex-col items-center"
            >
              <div className="w-full aspect-square bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1.5 sm:p-3 hover:shadow-md transition-shadow">
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center shadow-inner bg-white">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-[78%] h-[78%] sm:w-[80%] sm:h-[80%] object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>

              <span className="mt-1.5 sm:mt-2 text-[7px] sm:text-[10px] font-bold text-gray-600 text-center uppercase tracking-tight leading-tight line-clamp-2 min-h-[20px] sm:min-h-[28px]">
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