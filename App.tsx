/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import * as  permissions from 'react-native-permissions';

const CAMERA_PERMISSION_MESSAGE = "The app requires camera access to take photos and videos." + 
                                  " Please allow camera access.";
const CAMERA_PERMISSION_TITLE = "Camera Permission Needed";

function App(): React.JSX.Element {
  return (
      <View style={styles.buttonContainer}>
         <TouchableOpacity style={styles.btn} onPress={handleCameraRequest}>
            <Text style={styles.txt}>Request Camera Permission</Text>
         </TouchableOpacity>
      </View>
  );
}

function handleCameraRequest() {
  console.log("Handle camera request permission");
  permissions.request(Platform.OS === 'ios' ? permissions.PERMISSIONS.IOS.CAMERA : 
    permissions.PERMISSIONS.ANDROID.CAMERA).then((result) => {
      switch (result) {
        case permissions.RESULTS.UNAVAILABLE:
          console.log("This feature is not available(on this device / in this context");
          break;
        case permissions.RESULTS.DENIED: 
          console.log("The permission has not been requested / is denied but requestable");
          break;
        case permissions.RESULTS.GRANTED: 
          console.log("The permission is granted");
          break;
        case permissions.RESULTS.LIMITED: 
          console.log("The permission is granted but with limitations");
          break;
        case permissions.RESULTS.BLOCKED:
          console.log("The permission is denied and not requestable anymore");
          navigateToSettings();
          break;
        default:
          console.log("Default case");
          break;
      }
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
  });
}

function navigateToSettings() {
  Alert.alert(CAMERA_PERMISSION_TITLE, CAMERA_PERMISSION_MESSAGE, [
    {
      text: 'Cancel', 
      onPress:(
        () => console.log("Cancel pressed")
      )
    },
    {
      text: 'Ok',
      onPress: (
        () => permissions.openSettings()
      )
    }
  ])
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 50,
    height: 50,
    width: 200,
    backgroundColor: '#CCCCCC',
  },
  txt: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default App;
