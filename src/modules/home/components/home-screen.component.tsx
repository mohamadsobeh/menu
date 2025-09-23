import React from 'react';
import { HomeScreenPage } from '../pages';

interface HomeScreenProps {
  restaurantId: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ restaurantId }) => {
  return <HomeScreenPage restaurantId={restaurantId} />;
};
