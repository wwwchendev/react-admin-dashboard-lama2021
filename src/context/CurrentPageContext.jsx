import { createContext, useContext, useState } from 'react';

const CurrentPageContext = createContext();

export const useCurrentPage = () => {
  const contextValue = useContext(CurrentPageContext);
  if (!contextValue) {
    throw new Error('useCurrentPage需在有效作用域中調用');
  }
  return contextValue;
};

export const CurrentPageProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('/');

  return (
    <CurrentPageContext.Provider
      value={{
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </CurrentPageContext.Provider>
  );
};
