import React from 'react';
import { HomeScreenPage } from '../pages';

interface HomeScreenProps {
  userId: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ userId }) => {
  return <HomeScreenPage userId={userId} />;
};
