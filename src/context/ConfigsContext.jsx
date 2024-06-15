import { createContext, useContext, useState } from 'react';
const ConfigsContext = createContext();

const initCSSVariables = {
  announcement: {
    used: false,
    actived: false,
    height: '0px',
  },
  navbar: {
    used: true,
    height: '60px',
    widthSm: '50px',
  },
  sidebar: {
    used: true,
    actived: true,
    width: '20%',
    widthSm: '37.5%',
  },
};

export const ConfigsProvider = ({ children }) => {
  //✅當前路徑
  const [currentPage, setCurrentPage] = useState('/');
  //✅樣式設定
  const [CSSVariables, setCSSVariables] = useState(initCSSVariables);
  //自定義方法
  const showAnnouncementElement = v => {
    let newActivedState;
    switch (v) {
      case 'show':
        newActivedState = true;
        break;
      case 'hide':
        newActivedState = false;
        break;
      case 'toggle':
        newActivedState = !CSSVariables.announcement.actived;
        break;
      default:
        return;
    }
    setCSSVariables(prevState => ({
      ...prevState,
      announcement: {
        ...prevState.announcement,
        actived: newActivedState,
      },
    }));
  };
  const showSidebarElement = v => {
    let newActivedState;
    switch (v) {
      case 'show':
        newActivedState = true;
        break;
      case 'hide':
        newActivedState = false;
        break;
      case 'toggle':
        newActivedState = !CSSVariables.sidebar.actived;
        break;
      default:
        return;
    }
    setCSSVariables(prevState => ({
      ...prevState,
      sidebar: {
        ...prevState.sidebar,
        actived: newActivedState,
      },
    }));
  };

  return (
    <ConfigsContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        CSSVariables,
        showAnnouncementElement,
        showSidebarElement,
      }}
    >
      {children}
    </ConfigsContext.Provider>
  );
};

export const useConfigs = () => {
  const contextValue = useContext(ConfigsContext);
  if (!contextValue) {
    throw new Error('useConfigs需在有效作用域中調用');
  }
  return contextValue;
};
