import React from 'react'
import HeroSection from '../Component/HeroSection'
import VibeSection from '../Component/VibeSection'
import MostLoved from '../Component/MostLoved'
import SpotlightSection from '../Component/SpotlightSection'
import WeddingBanner from '../Component/WeddingBanner'
import FeatureIcons from '../Component/FeatureIcons'

export default function Home() {
  return (
    <div>
      <HeroSection/> 
      <VibeSection/>
      <MostLoved/>
      <SpotlightSection/>
      <WeddingBanner/>
      <FeatureIcons/>
    </div>
  )
}
