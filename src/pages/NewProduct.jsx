import React from 'react';
import { useCurrentPage } from '../context/CurrentPageContext';
import { useEffect } from 'react';
import { PageLayout } from '@/components';

const NewProduct = () => {
  const { setCurrentPage } = useCurrentPage();
  useEffect(() => {
    setCurrentPage('/products');
  }, []);

  return <PageLayout>NewProduct</PageLayout>;
};

export default NewProduct;
