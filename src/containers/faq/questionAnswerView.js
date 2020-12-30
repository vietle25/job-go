import React, { Component } from "react";
import { ImageBackground, View, StatusBar, Image, TouchableOpacity, BackHandler, ScrollView, ActivityIndicator } from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem } from "native-base";
import BaseView from "containers/base/baseView";
import { Colors } from 'values/colors';
import * as actions from 'actions/userActions';
import { Constants } from "values/constants";
import { connect } from 'react-redux';
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { ErrorCode } from "config/errorCode";
import StorageUtil from 'utils/storageUtil';
import { localizes } from "locales/i18n";
import Utils from "utils/utils";
import { WebView } from 'react-native-webview';

class QuestionAnswerView extends BaseView {
    constructor(props) {
        super(props)
        const { route, navigation } = this.props;
        this.state = {
            visible: true,
            urlFaq: {}
        }
        this.configList = [];
        this.actionTarget = route.params.actionTarget;
        this.titleScreen = "";
    }
    hideSpinner() {
        this.setState({ visible: false });
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
        });
        this.props.navigation.addListener('blur', () => {
            BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
        });
        if (!Utils.isNull(this.actionTarget)) {
            var myObj = JSON.parse(this.actionTarget);
            // var x = myObj["url"].price;
            console.log(myObj)
            this.setState({
                urlFaq: myObj
            })
        }
    }

    componentWillUnmount() {

    }

    handlerBackButton = () => {
        this.props.navigation.pop(1);
        return true;
    }

    render() {
        console.log('faq', this.state.urlFaq)
        return (
            <Container style={{ backgroundColor: Colors.COLOR_WHITE }}>
                <Header style={{ backgroundColor: Colors.COLOR_BACKGROUND }}>
                    {this.renderHeaderView({
                        title: `${this.titleScreen}`,

                        titleStyle: { marginRight: Constants.MARGIN_X_LARGE * 2 }
                    })}
                </Header>
                <Content contentContainerStyle={{ flexGrow: 1 }}>
                    <WebView
                        source={{ uri: this.state.urlFaq != null ? this.state.urlFaq.url : '' }}
                        originWhitelist={['*']}
                        onLoad={() => (this.hideSpinner())}
                        style={{ marginTop: Constants.MARGIN_LARGE }}
                    >
                    </WebView>
                    {this.showLoadingBar(this.state.visible)}
                </Content>
            </Container>
        )
    }
}

export default QuestionAnswerView;