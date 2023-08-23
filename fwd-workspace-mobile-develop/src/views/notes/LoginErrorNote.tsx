import React from 'react';
import {Text, View, TouchableWithoutFeedback, Linking} from 'react-native';

import {layoutStyles, spacer} from '@/utils';
import {FWDColors, Typography} from '@/components';
import {ExclamationCircle} from '@/components/icons';

const LoginErrorNote: React.FC = ({children}) => {
  return (
    <View
      style={[
        layoutStyles.row,
        layoutStyles.startCenter,
        {
          paddingVertical: spacer(12),
          paddingHorizontal: spacer(16),
          borderRadius: spacer(8),
          backgroundColor: FWDColors.red5,
        },
      ]}>
      {children}
    </View>
  );
};

interface LoginAttemptsErrorProps {
  count: number;
}

const serviceDeskNumber = '09178165417';

export const LoginAttemptsErrorNote = ({count}: LoginAttemptsErrorProps) => {
  return (
    <LoginErrorNote>
      <View
        style={{
          marginRight: spacer(4),
        }}>
        <ExclamationCircle width={24} height={24} color={FWDColors.red} />
      </View>
      <Text
        style={[
          layoutStyles.row,
          layoutStyles.cover,
          layoutStyles.startCenter,
        ]}>
        <Typography
          label="Oops! Username and password do not match. "
          color={FWDColors.red}
          variant="l3-m"
        />
        <Typography
          label={`${count} ${count > 1 ? 'attempts' : 'attempt'}  remaining.`}
          color={FWDColors.red}
          variant="l3-bold"
        />
      </Text>
    </LoginErrorNote>
  );
};

export const LoginAccountDisabledErrorNote = () => {
  return (
    <LoginErrorNote>
      <View
        style={{
          marginRight: spacer(4),
        }}>
        <ExclamationCircle width={24} height={24} color={FWDColors.red} />
      </View>
      <Text
        style={[
          layoutStyles.row,
          layoutStyles.cover,
          layoutStyles.startCenter,
        ]}>
        <Typography
          label="Oops! Your account has been disabled due to multiple failed attempts. For assistance,
          please contact "
          color={FWDColors.red}
          variant="l3-m"
        />
        <TouchableWithoutFeedback
          onPress={() => Linking.openURL(`tel:${serviceDeskNumber}`)}>
          <Typography
            label="Service "
            color={FWDColors.red}
            variant="l3-bold"
          />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => Linking.openURL(`tel:${serviceDeskNumber}`)}>
          <Typography label="Desk." color={FWDColors.red} variant="l3-bold" />
        </TouchableWithoutFeedback>
      </Text>
    </LoginErrorNote>
  );
};

export const LoginAccountDoesNotExistErrorNote = () => {
  return (
    <LoginErrorNote>
      <View
        style={{
          marginRight: spacer(4),
        }}>
        <ExclamationCircle width={24} height={24} color={FWDColors.red} />
      </View>
      <Text
        style={[
          layoutStyles.row,
          layoutStyles.cover,
          layoutStyles.startCenter,
        ]}>
        <Typography
          label="Oops! This account does not exist. For assistance, please contact "
          color={FWDColors.red}
          variant="l3-m"
        />
        <TouchableWithoutFeedback
          onPress={() => Linking.openURL(`tel:${serviceDeskNumber}`)}>
          <Typography
            label="Service "
            color={FWDColors.red}
            variant="l3-bold"
          />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => Linking.openURL(`tel:${serviceDeskNumber}`)}>
          <Typography label="Desk." color={FWDColors.red} variant="l3-bold" />
        </TouchableWithoutFeedback>
      </Text>
    </LoginErrorNote>
  );
};

interface LoginGenericErrorProps {
  message: string;
}

export const LoginGenericErrorNote = ({message}: LoginGenericErrorProps) => {
  return (
    <LoginErrorNote>
      <View
        style={{
          marginRight: spacer(4),
        }}>
        <ExclamationCircle width={24} height={24} color={FWDColors.red} />
      </View>
      <Text
        style={[
          layoutStyles.row,
          layoutStyles.cover,
          layoutStyles.startCenter,
        ]}>
        <Typography label={message} color={FWDColors.red} variant="l3-m" />
      </Text>
    </LoginErrorNote>
  );
};
