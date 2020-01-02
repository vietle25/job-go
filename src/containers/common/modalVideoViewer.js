import React, {Component} from "react";
import {
    ImageBackground, Text, View, Image, TouchableOpacity,
    StyleSheet, Dimensions, Platform, ScrollView, SafeAreaView,
    Modal, PermissionsAndroid, StatusBar
} from "react-native";
import {Colors} from "values/colors";
import {Constants} from "values/constants";
import commonStyles from "styles/commonStyles";
import Utils from "utils/utils";
import {localizes} from "locales/i18n";
import ImageViewer from 'react-native-image-zoom-viewer';
import BaseView from "containers/base/baseView";
import {Header} from "native-base";
import ic_cancel_white from 'images/ic_cancel_blue.png';

const screen = Dimensions.get("window");

export default class ModalVideoViewer extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            isVisible: false,
            pathVideo: null,
            videoRotate: '90deg',
            currentTimeVideo: 0
        };
    }

    componentDidMount () {
        this.getSourceUrlPath();
    }

    /**
     * Show modal
     */
    showModal (pathVideo, currentTimeVideo) {
        this.setState({
            isVisible: true,
            pathVideo,
            currentTimeVideo
        });
        StatusBar.setHidden(true);
    }

    /**
     * Hide modal
     */
    hideModal () {
        this.setState({
            isVisible: false
        });
        StatusBar.setHidden(false);
    }

    render () {
        const {isVisible, pathVideo, currentTimeVideo} = this.state;
        return (
            <SafeAreaView>
                <Modal
                    ref={"modalVideoViewer"}
                    onRequestClose={() => this.hideModal()}
                    visible={isVisible}
                    transparent={true}
                    useNativeDriver={true}
                >
                   
                </Modal>
            </SafeAreaView>
        );
    }
}