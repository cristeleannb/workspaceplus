import React, {useCallback, useMemo, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Animated} from 'react-native';

import {AngleDownThin, Unread} from '@/components/icons';
import {FWDColors, Typography} from '@/components';
import {layoutStyles, spacer} from '@/utils';

interface PeopleManagerMessageAccordionProps {
  managerName: string;
  message: string;
}

export const PeopleManagerMessageAccordion = ({
  managerName,
  message,
}: PeopleManagerMessageAccordionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsloaded] = useState(false);
  const [messageLineCount, setMessageLineCount] = useState(0);

  const toggleAccordion = () => {
    setIsVisible(!isVisible);
  };

  const onTextLayout = useCallback(
    e => {
      if (!isLoaded) {
        const lineCount = e.nativeEvent.lines.length;
        setMessageLineCount(lineCount);
        setIsloaded(true);
      }
    },
    [isLoaded],
  );

  const messageLines = useMemo(() => {
    if (!isLoaded) {
      return 0;
    }
    return messageLineCount < 2 ? 0 : isVisible ? 0 : 2;
  }, [isLoaded, messageLineCount, isVisible]);

  const showReadMore = useMemo(() => {
    return messageLineCount > 2;
  }, [messageLineCount]);

  return (
    <View
      style={[
        layoutStyles.fullWidth,
        {
          borderRadius: spacer(8),
          paddingHorizontal: spacer(16),
          paddingVertical: spacer(8),
          borderWidth: spacer(1),
          borderColor: FWDColors.orange,
          borderBottomLeftRadius: spacer(16),
          borderTopLeftRadius: spacer(16),
          borderTopRightRadius: spacer(16),
        },
      ]}>
      <View style={[layoutStyles.row, layoutStyles.fullWidth]}>
        <View
          style={[
            layoutStyles.row,
            layoutStyles.cover,
            {
              marginRight: spacer(12),
            },
          ]}>
          <Unread height={20} width={20} color={FWDColors.orange} />
          <Typography
            variant="b4-m"
            color={FWDColors.orange}
            label={`Message from ${managerName}:`}
            style={[
              layoutStyles.cover,
              {
                marginLeft: spacer(12),
              },
            ]}
          />
        </View>
      </View>

      <View
        style={[
          layoutStyles.row,
          layoutStyles.fullWidth,
          {
            marginTop: spacer(8),
          },
        ]}>
        <Typography
          variant="l3-b"
          color={FWDColors.grey4}
          label={message}
          numberOfLines={messageLines}
          style={[layoutStyles.cover]}
          onTextLayout={onTextLayout}
        />
      </View>
      {showReadMore && (
        <TouchableOpacity
          activeOpacity={0.75}
          style={[
            layoutStyles.row,
            layoutStyles.startCenter,
            {marginTop: spacer(8)},
          ]}
          onPress={toggleAccordion}>
          <Typography
            style={{marginRight: spacer(8)}}
            label={isVisible ? 'Read less' : 'Read more'}
            variant="l2-m"
            color={FWDColors.orange}
          />
          <Animated.View style={isVisible ? styles.rotateUp : {}}>
            <AngleDownThin height={16} width={16} color={FWDColors.orange} />
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rotateUp: {
    transform: [{rotateZ: '-180deg'}],
  },
});
