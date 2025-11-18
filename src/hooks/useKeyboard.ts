import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

export function useKeyboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      (e: KeyboardEvent) => {
        setIsVisible(true);
        setHeight(e.endCoordinates.height);
      }
    );

    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsVisible(false);
        setHeight(0);
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return { isVisible, height };
}
