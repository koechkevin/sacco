import { useContext, useEffect } from 'react';
import { AppContext } from '../Context/AppContext';

const useLayout = (show: boolean) => {
  const {
    dispatch,
    state: { showHeader, showLayout, showSidebar, auth: {idNumber} },
  } = useContext(AppContext);

  useEffect(() => {
    if (show) {
      if (idNumber) {
        if (dispatch && (!showSidebar || !showHeader || !showLayout)) {
          dispatch({
            showSidebar: true,
            showHeader: true,
            showLayout: true,
          });
        }
      }
    } else {
      if (showLayout) {
        dispatch && dispatch({ showLayout: false, })
      }
    }
  }, [dispatch, showHeader, showLayout, showSidebar, idNumber, show]);
};

export default useLayout;
