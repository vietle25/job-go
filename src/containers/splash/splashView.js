import React, { Component } from "react";
import { FlatList, Picker, ScrollView, Dimensions, ImageBackground, View, 
    StatusBar, StyleSheet, Alert, Animated, Easing, Image } from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem } from "native-base";
import { Colors } from "values/colors";
import BaseView from "containers/base/baseView";
import StorageUtil from "utils/storageUtil";
import Utils from 'utils/utils';
import statusType from "enum/statusType";
import * as actions from 'actions/userActions';
import { connect } from 'react-redux';
import { ErrorCode } from "config/errorCode";
import { getActionSuccess, ActionEvent } from "actions/actionEvent";
import bannerType from "enum/bannerType";
import SplashScreen from 'react-native-splash-screen';
import appType from "enum/appType";
import ic_logo_splash from 'images/ic_logo_splash.png'

class SplashView extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            user: null
        }
        this.animate = new Animated.Value(1)
    }

    render() {
        const animateStyle = this.animate.interpolate({
            inputRange: [0, 0],
            outputRange: [0.5, 1],
        })
        console.log("render splash view");
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: `center`,
                    backgroundColor: Colors.COLOR_BACKGROUND
                }}>
                <Animated.Image
                    style={{
                        transform: [{
                            scale: animateStyle
                        }
                        ],
                        resizeMode: 'contain',
                        opacity: 0,
                        width: 150,
                        height: 170
                    }}
                    source={ic_logo_splash}
                />
            </View>
        );
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData()
        }
    }

    handleData() {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            console.log("handle data splash view");
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_CONFIG)) {
                    this.configList = data;
                    StorageUtil.storeItem(StorageUtil.MOBILE_CONFIG, this.configList);
                    // this.login();
                    this.goHomeScreen();
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
                // this.login();
                this.goHomeScreen();
            }
        }
    }

    componentDidMount () {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            if (!Utils.isNull(user)) {
                if (user.status == statusType.ACTIVE) {
                    this.setState({ user });
                    this.getToken();
                }
            } else {
                this.props.getConfig();
            }
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });
    }

    /**
     * Get token
     */
    getToken() {
        StorageUtil.retrieveItem(StorageUtil.USER_TOKEN).then((token) => {
            global.token = token;
            console.log("USER TOKEN IN SPLASH VIEW: ", token);
            this.props.getConfig();
            this.goHomeScreen();
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
            this.props.getConfig();
        })
    }
}

const mapStateToProps = state => ({
    data: state.splash.data,
    isLoading: state.splash.isLoading,
    error: state.splash.error,
    errorCode: state.splash.errorCode,
    action: state.splash.action
});

const mapDispatchToProps = {
    ...actions
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashView);