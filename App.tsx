/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {LogLevel, OneSignal} from 'react-native-onesignal';

OneSignal.initialize('d12f0c00-513a-46a5-9d4c-234f228dd79f');

// Remove this method to stop OneSignal Debugging
OneSignal.Debug.setLogLevel(LogLevel.Verbose);

const Check = ({enabled, onPress}: {enabled: boolean; onPress: () => void}) => {
  return (
    <TouchableOpacity
      style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        borderColor: 'grey',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={onPress}>
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: enabled ? 'green' : 'transparent',
        }}></View>
    </TouchableOpacity>
  );
};

function App(): React.JSX.Element {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // requestPermission will show the native iOS or Android notification permission prompt.
    // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
    OneSignal.Notifications.requestPermission(true);

    // Method for listening for notification clicks
    OneSignal.Notifications.addEventListener('click', event => {
      console.log('OneSignal: notification clicked:', event);
    });
  }, []);

  useEffect(() => {
    setTimeout(async () => {
      const hasPermission = await OneSignal.Notifications.getPermissionAsync();
      setIsEnabled(hasPermission);
    }, 1000);
  }, []);

  useEffect(() => {
    const permissionChangedHandler = async (hasPermission: boolean) => {
      console.debug(
        'PermissionsStore.permissionChangedHandler hasPermission?',
        hasPermission,
      );

      if (hasPermission) {
        OneSignal.User.pushSubscription.optIn();
      }
      setIsEnabled(hasPermission);
    };
    OneSignal.Notifications.addEventListener(
      'permissionChange',
      permissionChangedHandler,
    );
  }, []);

  const onToggle = async () => {
    const hasPermission = await OneSignal.Notifications.getPermissionAsync();

    if (!hasPermission) {
      OneSignal.Notifications.requestPermission(true);
      return;
    }

    setIsEnabled(hasPermission);
  };

  return (
    <SafeAreaView style={{flex: 1, margin: 64}}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
        <Check enabled={isEnabled} onPress={onToggle} />
        <Text style={{fontSize: 18}}>
          Permission {isEnabled ? 'Enabled' : 'Disabled'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default App;
