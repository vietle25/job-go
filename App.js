/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text, Button,
    View, TextInput,
    StatusBar
} from 'react-native';
import { capitalizeFirstLetter } from './src/utils/stringUtil';
import { Provider } from 'react-redux';
import * as actions from './src/actions';
import { connect } from 'react-redux';
import store from './src/store';
import { Root } from 'native-base';
import { MenuProvider } from 'react-native-popup-menu';
import { Constants } from 'values/constants';
import KeyboardManager from 'react-native-keyboard-manager';
import StorageUtil from 'utils/storageUtil';
import { Colors } from 'values/colors';
import SplashScreen from 'react-native-splash-screen';
import DeviceInfo from 'react-native-device-info';
import { configConstants } from 'values/configConstants';
import AppNavigator from 'containers/navigation/appNavigator';

export default class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        };
        Platform.OS === 'android' ? null : KeyboardManager.setEnable(false);
    }
    
    componentDidMount(){
        SplashScreen.hide()
    }
    
    render () {
        StatusBar.setBackgroundColor(Colors.COLOR_PRIMARY, true);
        return (
            <Provider store={store}>
                <Root>
                    <MenuProvider>
                        <AppNavigator />
                    </MenuProvider>
                    {/* <StatusBar
                        animated={true}
                        backgroundColor={Colors.COLOR_WHITE}
                        // barStyle={}  // dark-content, light-content and default
                        hidden={false}  //To hide statusBar
                        translucent={true}  //allowing light, but not detailed shapes
                    /> */}
                </Root>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    }
});