import React, {useEffect, useMemo, useState} from 'react';
import {TextInput, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/core';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {observer} from 'mobx-react';

import {NavigationHeader, Tag} from '@/views';
import {
  Add,
  Button,
  Close,
  FWDColors,
  InfoCircle,
  Left,
  Typography,
} from '@/components';
import {layoutStyles, spacer} from '@/utils';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {Controller, useForm} from 'react-hook-form';
import {NavigationKey} from '@/navigations';
import {useExtractReport, useGetAppSetting} from '@/services/query';
import {generateGuid} from '@/utils/object.util';
import {useStores} from '@/stores';

type FieldStatus = 'valid' | 'invalid' | 'empty';

interface FieldState {
  id: string;
  email: string;
  status: FieldStatus;
}

interface RequestReportEmailFieldSchema {
  email: string;
}

interface RequestReportEmailFieldProps {
  regex: RegExp[];
  initialState: FieldState;
  onUpdate?: (state: FieldState) => void;
  onRemoveEmail?: () => void;
}

const RequestReportEmailField = ({
  regex,
  initialState,
  onUpdate,
  onRemoveEmail,
}: RequestReportEmailFieldProps) => {
  const [status, setStatus] = useState<FieldStatus>(initialState.status);

  const schema: yup.SchemaOf<RequestReportEmailFieldSchema> = yup
    .object()
    .shape({
      email: yup
        .string()
        .required('This field is required.')
        .test('Test email validity', 'Invalid email address', value => {
          const emailRegex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

          if (value && emailRegex) {
            return emailRegex.test(value);
          } else {
            return false;
          }
        })
        .test('Test FWD Email validity', 'Invalid FWD email address', value => {
          if (value && regex) {
            let valid = false;

            regex.forEach(reg => {
              if (reg.test(value)) {
                valid = true;
              }
            });

            return valid;
          } else {
            return true;
          }
        }),
    })
    .required();

  const {
    control,
    trigger,
    watch,
    formState: {errors},
  } = useForm<RequestReportEmailFieldSchema>({
    mode: 'onSubmit',
    defaultValues: {
      email: initialState.email,
    },
    resolver: yupResolver(schema),
  });

  const emailValue = watch('email', initialState.email);

  const onBlur = async () => {
    const valid = await trigger('email');
    const email = emailValue.trim();
    let newStatus: FieldStatus = 'empty';

    if (valid) {
      newStatus = 'valid';
      setStatus('valid');
    } else {
      if (email) {
        newStatus = 'invalid';
        setStatus('invalid');
      } else {
        newStatus = 'empty';
        setStatus('empty');
      }
    }

    onUpdate?.({
      id: initialState.id,
      email: email,
      status: newStatus,
    });
  };

  return (
    <>
      {status !== 'valid' ? (
        <Controller
          control={control}
          name="email"
          render={({field: {onChange, value}}) => (
            <>
              <View
                style={[layoutStyles.relative, layoutStyles.alignSelfStart]}>
                <TextInput
                  keyboardType="email-address"
                  style={[
                    layoutStyles.alignSelfStart,
                    {
                      backgroundColor: FWDColors.greyLight,
                      height: spacer(40),
                      borderRadius: spacer(4),
                      padding: spacer(8),
                      color:
                        status === 'invalid'
                          ? FWDColors.red
                          : FWDColors.greenDarker,
                      fontSize: spacer(16),
                      paddingRight: spacer(status === 'empty' ? 8 : 48),
                    },
                  ]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={() => onBlur()}
                  underlineColorAndroid="transparent"
                  autoFocus={true}
                  blurOnSubmit={true}
                />

                {status === 'invalid' && (
                  <View
                    style={[
                      layoutStyles.absolute,
                      layoutStyles.centerCenter,
                      {
                        top: spacer(0),
                        bottom: spacer(0),
                        right: spacer(12),
                      },
                    ]}>
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={onRemoveEmail}>
                      <Close
                        width={16}
                        height={16}
                        color={FWDColors.greenDarker}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {errors.email && (
                <View
                  style={[
                    layoutStyles.row,
                    layoutStyles.startCenter,
                    {
                      marginTop: spacer(4),
                    },
                  ]}>
                  <InfoCircle width={16} height={16} color={FWDColors.red} />
                  <View
                    style={{
                      marginLeft: spacer(4),
                    }}>
                    <Typography
                      label={errors.email.message || ''}
                      color={FWDColors.red}
                      variant="l2-b"
                    />
                  </View>
                </View>
              )}
            </>
          )}
        />
      ) : (
        <View>
          <Tag value={emailValue} onRemove={() => onRemoveEmail?.()} />
        </View>
      )}
    </>
  );
};

const RequestReportScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {authStore} = useStores();

  const {data: appSetting} = useGetAppSetting();
  const {mutateAsync: extractReport, isLoading: extractReportLoading} =
    useExtractReport();

  const [domainName, setDomainName] = useState('');
  const [emailList, setEmailList] = useState<FieldState[]>([]);

  const onBack = () => {
    navigation.goBack();
  };

  const onAddEmail = () => {
    const list = [...emailList];
    list.push({
      id: generateGuid(),
      email: '',
      status: 'empty',
    });
    setEmailList(list);
  };

  const removeEmail = (id: string) => {
    const list = [...emailList];
    const emailIndex = list.findIndex(email => email.id === id);

    if (emailIndex >= 0) {
      list.splice(emailIndex, 1);
      setEmailList(list);
    }
  };

  const onRequestReport = async () => {
    try {
      const emailBody = emailList.map(emailItem => emailItem.email).join(',');
      await extractReport(emailBody);

      navigation.navigate(NavigationKey.DRAWER_MAIN, {
        screen: NavigationKey.STACK_LANDING,
        params: {
          screen: NavigationKey.SCREEN_REQUEST_REPORT_SUCCESS,
        },
      });
    } catch (error) {}
  };

  const onFieldUpdate = (state: FieldState) => {
    const list = [...emailList];
    const emailIndex = list.findIndex(email => email.id === state.id);

    if (state.status === 'empty') {
      if (emailIndex >= 0) {
        list.splice(emailIndex, 1);
        setEmailList(list);
      }
    } else {
      list[emailIndex] = state;
      setEmailList(list);
    }
  };

  useEffect(() => {
    if (appSetting) {
      setDomainName(appSetting.officialDomainName || '');
    }
  }, [appSetting]);

  useEffect(() => {
    if (authStore.user?.emailAddress) {
      const list: FieldState[] = [];
      list.push({
        id: generateGuid(),
        email: authStore.user?.emailAddress,
        status: 'valid',
      });
      setEmailList(list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const regex = useMemo(() => {
    if (domainName) {
      const domains = domainName.split(',');

      return domains.map(domain => {
        return new RegExp(`[a-z0-9]+@${domain}`);
      });
    } else {
      return [];
    }
  }, [domainName]);

  const canSubmit = useMemo(() => {
    const incorrectEmail = emailList.find(
      emailItem =>
        emailItem.status === 'empty' || emailItem.status === 'invalid',
    );
    return !incorrectEmail;
  }, [emailList]);

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        layoutStyles.cover,
        {
          backgroundColor: FWDColors.orange,
        },
      ]}>
      <View
        style={[
          layoutStyles.cover,
          {
            backgroundColor: FWDColors.white,
            paddingBottom: spacer(insets.bottom),
          },
        ]}>
        <View style={[layoutStyles.cover]}>
          <NavigationHeader
            flat
            height={72}
            title={
              <Typography
                label="Request Workforce Report"
                variant="h2"
                color={FWDColors.white}
              />
            }
            leftAction={
              <Button
                iconOnly
                icon={<Left />}
                size="small"
                color="light"
                onPress={onBack}
              />
            }
          />

          <ScrollView
            keyboardShouldPersistTaps="never"
            style={[
              layoutStyles.cover,
              {
                paddingHorizontal: spacer(16),
              },
            ]}>
            <View
              style={{
                paddingVertical: spacer(24),
              }}>
              <Typography
                label="Send Workforce Report to:"
                variant="l1-m"
                color={FWDColors.greenDark}
              />

              {emailList.map(item => (
                <View
                  key={item.id}
                  style={{
                    marginTop: spacer(16),
                  }}>
                  <RequestReportEmailField
                    regex={regex}
                    initialState={item}
                    onUpdate={onFieldUpdate}
                    onRemoveEmail={() => removeEmail(item.id)}
                  />
                </View>
              ))}

              <TouchableOpacity
                style={{marginTop: spacer(16)}}
                onPress={onAddEmail}>
                <View
                  style={[
                    layoutStyles.row,
                    layoutStyles.startCenter,
                    layoutStyles.alignSelfStart,
                    {
                      borderRadius: spacer(4),
                      padding: spacer(8),
                      backgroundColor: FWDColors.greyLight,
                    },
                  ]}>
                  <Add width={16} height={16} color={FWDColors.orange} />
                  <Typography
                    style={{marginLeft: spacer(4)}}
                    label="Add another email"
                    variant="l1-m"
                    color={FWDColors.orange}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <View
          style={{
            paddingVertical: spacer(16),
            paddingHorizontal: spacer(24),
            backgroundColor: FWDColors.white,
          }}>
          <Button
            label="Request Report"
            onPress={onRequestReport}
            disabled={emailList.length <= 0 || !canSubmit}
            loading={extractReportLoading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default observer(RequestReportScreen);
