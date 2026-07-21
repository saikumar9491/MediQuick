import React from 'react';
import CategoryLandingPage from './CategoryLanding/CategoryLandingPage';

const AyurvedaPage = () => {
  return (
    <CategoryLandingPage
      categoryName="Ayurveda"
      heroTitle="Ayurveda, rooted in tradition"
      heroSubtitle="Discover authentic herbal formulations, ancient remedies, and pure botanicals crafted for natural daily balance."
      trustBadges={['Authentic Formulations', 'Trusted Herbal Brands', '100% Natural Botanicals']}
    />
  );
};

export default AyurvedaPage;
