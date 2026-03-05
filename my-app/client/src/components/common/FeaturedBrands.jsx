import React from 'react';
import { Link } from 'react-router-dom';

const brands = [
  { name: 'Cetaphil', logo: 'https://brandlogos.net/wp-content/uploads/2022/06/cetaphil-logo_brandlogos.net_e7mys.png' },
  { name: 'Himalaya', logo: 'https://zerocreativity0.wordpress.com/wp-content/uploads/2017/01/himalaya-logo.jpg' },
  { name: 'Abbott', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0cb9mh8T2WrdZ9OnjwGzq0rG2hcuNCZ5Tsw&s' },
  { name: 'Cipla', logo: 'https://cdn.thepharmaletter.com/convert/files/2024/04/d048f3d0-0153-11ef-a588-e798d47e404e-cipla-big.png/r%5Bwidth%5D=320/d048f3d0-0153-11ef-a588-e798d47e404e-cipla-big.webp' },
  { name: 'Dettol', logo: 'https://1000logos.net/wp-content/uploads/2020/04/Dettol-Logo-2010.jpg' },
  { name: 'Nivea', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiREgSU9NaKl9HrEiyo-IH-xPSeOd_Tb5_zA&s' },
  { name: 'Omron', logo: 'https://industrial.omron.eu/images/video_default_thumbnail.jpg' },
  { name: 'PentaSure', logo: 'https://pentasurenutrition.com/cdn/shop/files/PentaSure-logo.png?v=1718862987' },
  { name: 'Dr. Morepen', logo: 'https://media.licdn.com/dms/image/v2/C4E0BAQFj9xmjoi9Ccg/company-logo_200_200/company-logo_200_200/0/1630643946445?e=2147483647&v=beta&t=EGJjuMhTrRnMXN4MN74ZpN6nj5f0jjjOPC1NphqvgfE' },
  { name: 'Tata 1mg', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3uwK-Jo4awLWQbvrSASmkKaRsguDcG98V4Q&s' },
];

const FeaturedBrands = () => {
  return (
    <div className="my-12 px-2">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-xl font-black text-gray-800 tracking-tight border-l-4 border-blue-600 pl-4">
          Featured Brands
        </h2>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex space-x-6 overflow-x-auto pb-6 overflow-y-hidden">
        {brands.map((brand, index) => (
          /* Wrap the content in a Link to enable brand-specific routing */
          <Link 
            key={index} 
            to={`/brand/${brand.name}`}
            className="flex-shrink-0 flex flex-col items-center group cursor-pointer no-underline"
          >
            <div className="w-24 h-24 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center p-4 group-hover:shadow-lg group-hover:border-blue-200 transition-all duration-300">
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                onError={(e) => { e.target.src = 'https://placehold.co/100?text=Brand'; }} 
              />
            </div>
            <span className="mt-3 text-xs font-bold text-gray-400 group-hover:text-blue-600 uppercase tracking-widest transition-colors">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Internal CSS for hidden scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default FeaturedBrands;