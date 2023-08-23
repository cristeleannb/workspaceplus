import {useState} from 'react';
import {LayoutChangeEvent} from 'react-native';

export const useContainer = () => {
  const [containerWidth, setContainerWidth] = useState(0);

  const onContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return {containerWidth, onContainerLayout};
};
