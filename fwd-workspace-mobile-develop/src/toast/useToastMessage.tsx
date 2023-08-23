import React, {createContext, useCallback, useContext} from 'react';
import Toast, {ToastShowOptions} from 'react-native-toast-message';

import {ToastMessage, ToastType} from './ToastMessage';

interface ToastOption {
  label: string;
  rightIcon?: React.ReactElement;
}

type TransformedToastShowOptions = Omit<ToastShowOptions, 'text1' | 'text2'>;
type ReformedToastShowOptions = TransformedToastShowOptions & {
  type: ToastType;
  label: string;
  rightIcon?: React.ReactElement;
};

interface ExtendedToastOption extends ToastShowOptions {
  props: ToastOption;
}

type ToastConfig = {
  [key in ToastType]?: (toastOptions: ExtendedToastOption) => any;
};

const toastConfig: ToastConfig = {
  success: ({props}) => {
    return <ToastMessage type="success" label={props.label} />;
  },
  fullwidth: ({props}) => {
    return (
      <ToastMessage
        type="fullwidth"
        label={props.label}
        rightIcon={props.rightIcon}
      />
    );
  },
};

export interface TToastMessage {
  showToast: (options: ReformedToastShowOptions) => void;
  hideToast: () => void;
}

export const ToastMessageContext = createContext<TToastMessage | null>(null);

export const ToastMessageProvider: React.FC = ({children}) => {
  const showToast = useCallback((options: ReformedToastShowOptions) => {
    Toast.show({
      visibilityTime: 2500,
      ...options,
      props: {
        label: options.label,
        rightIcon: options.rightIcon,
      },
    });
  }, []);

  const hideToast = useCallback(() => {
    Toast.hide();
  }, []);

  return (
    <ToastMessageContext.Provider
      value={{
        showToast,
        hideToast,
      }}>
      {children}
      <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
    </ToastMessageContext.Provider>
  );
};

export const useToastMessage = () => {
  const context = useContext(ToastMessageContext);

  if (!context) {
    throw new Error('You have forgotten to use ToastMessage.');
  }

  return context;
};
