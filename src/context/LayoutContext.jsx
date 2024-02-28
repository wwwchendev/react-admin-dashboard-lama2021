import { createContext, useContext, useState } from 'react';

const LayoutContext = createContext({});

export const LayoutProvider = ({ children }) => {
  // 變數管理:元素寬高
  const initState = {
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

  const [elState, setElState] = useState(initState);

  // 自定義方法
  const toggleAnnouncement = () => {
    setElState(prevState => ({
      ...prevState,
      announcement: {
        ...prevState.announcement,
        actived: !prevState.announcement.actived,
      },
    }));
  };
  const toggleSidebar = () => {
    setElState(prevState => ({
      ...prevState,
      sidebar: {
        ...prevState.sidebar,
        actived: !prevState.sidebar.actived,
      },
    }));
  };

  return (
    <LayoutContext.Provider
      value={{
        elState,
        toggleAnnouncement,
        toggleSidebar,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

// 自定義 hook 以便在其他元件中訪問
export const useLayout = () => {
  return useContext(LayoutContext);
};
