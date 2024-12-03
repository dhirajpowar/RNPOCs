/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {it} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import * as permissions from 'react-native-permissions';

import { render, fireEvent, screen } from '@testing-library/react-native';
import { Alert, Platform } from 'react-native';

//Mock the react-native-permissions module to simulate permission behavior
jest.mock('react-native-permissions', () => ({
  request: jest.fn(),
  openSettings: jest.fn(),
  PERMISSIONS: {
    IOS: { CAMERA: 'ios.permission.CAMERA'},
    ANDROID: { CAMERA: 'android.permission.CAMERA'},
  },
  RESULTS: {
    UNAVAILABLE: 'unavailable',
    DENIED: 'denied',
    GRANTED: 'granted',
    BLOCKED: 'blocked',
    LIMITED: 'limited',
  }
}));

//Mock navigation and other dependencies if needed
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  })
});

test('renders the button correctly', () => {
  const { getByText } = render(<App /> );
  expect(getByText('Request Camera Permission')).toBeTruthy();
});

test('request camera permission on button press', async() => {
  (permissions.request as jest.Mock).mockResolvedValueOnce(permissions.RESULTS.GRANTED);

  const { getByText } = render(<App />);
  const button = getByText('Request Camera Permission');

  fireEvent.press(button);

  expect(permissions.request).toHaveBeenCalledWith(
    permissions.PERMISSIONS[Platform.OS === 'ios' ? 'IOS' : 'ANDROID'].CAMERA
  );

 // await screen.findByText('The permission is granted');
  expect(console.log).toHaveBeenCalledWith('The permission is granted');
});

test('handles permission blocked by navigating to settings', async () => {
  (permissions.request as jest.Mock).mockResolvedValueOnce(permissions.RESULTS.BLOCKED);

  const { getByText } = render(<App />);
  const button = getByText('Request Camera Permission');

  fireEvent.press(button);

  expect(permissions.request).toHaveBeenCalled();

  //Ensure Alert is triggered
  expect(Alert.alert).toHaveBeenCalledWith(
    'Camera Permission Needed',
    expect.stringContaining('Please allow camera access.'),
    expect.any(Array)
  )
});

test('logs permission unavailable', async() => {
  (permissions.request as jest.Mock).mockResolvedValueOnce(permissions.RESULTS.UNAVAILABLE);

  const { getByText } = render(<App />);
  fireEvent.press(getByText('Request Camera Permission'));

  expect(permissions.request).toHaveBeenCalled();
})

test('handles unknown permission result gracefully', async() => {
  (permissions.request as jest.Mock).mockResolvedValueOnce('unknown-result');

  const { getByText } = render(<App />);
  fireEvent.press(getByText('Request Camera Permission'));

  expect(console.log).toHaveBeenCalledWith('Default case');

})

