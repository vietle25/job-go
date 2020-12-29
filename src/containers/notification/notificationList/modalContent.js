import React, {Component} from "react";
import {ImageBackground, View, StatusBar, Image, TouchableWithoutFeedback, BackHandler, ScrollView, Alert, Linking, RefreshControl, StyleSheet, Slider, TextInput, Dimensions, FlatList, TouchableHighlight, TouchableOpacity} from "react-native";
import {Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Form} from "native-base";
import {Colors} from "values/colors";
import {Constants} from "values/constants";
import ic_back_model from 'images/ic_cancel_blue.png';
import ic_next_white from 'images/ic_next_white.png';
import commonStyles from "styles/commonStyles";
import BaseView from "containers/base/baseView"
import TextInputCustom from "components/textInputCustom";
import ModalDropdown from 'components/dropdown';
import I18n, {localizes} from "locales/i18n";
import StringUtil from "utils/stringUtil";
import {Fonts} from "values/fonts";
import {months} from "moment";
import ServiecType from 'enum/serviceType';
import FlatListCustom from "components/flatListCustom";
import Modal from 'react-native-modalbox';
import moment from 'moment';
import DateUtil from "utils/dateUtil";
import ic_close from 'images/ic_close.png';

const screen = Dimensions.get("window");

export default class ModalContent extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            contentValue: null,
            titleValue: null
        };
    }

    componentDidUpdate = (prevProps, prevState) => {
    }

    componentWillMount = () => {
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData()
        }
    }

    /**
      * Handle data when request
      */
    handleData () {}

    /**
     * Show Modal Week
     */
    showModal (contentValue, titleValue) {
        this.setState({
            contentValue,
            titleValue
        })
        this.refs.modalContent.open();
    }

    /**
     * hide Modal Week
     */
    hideModal () {
        this.refs.modalContent.close();
    }

    componentWillUpdate (nextProps, nextState) {
    }

    componentWillUnmount = () => {
    }

    render () {
        return (
            <Modal
                ref={"modalContent"}
                animationType={'fade'}
                transparent={true}
                style={{
                    backgroundColor: "#00000000",
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: '14%'
                }}
                backdrop={true}
                onClosed={() => {
                    this.hideModal()
                }}
                backButtonClose={true}
                swipeToClose={false}
            >
                <View style={[commonStyles.shadowOffset, {
                    borderRadius: Constants.CORNER_RADIUS,
                    width: screen.width - Constants.MARGIN_XX_LARGE,
                    backgroundColor: Colors.COLOR_WHITE,
                    alignItems: 'center',
                }]}>
                    {/* <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}>
                        </View>
                        <TouchableOpacity style={{
                            padding: Constants.PADDING_LARGE, paddingBottom: 0, margin: Constants.MARGIN_LARGE
                        }}
                            onPress={() => {
                                this.hideModal();
                            }}>
                            <Image source={ic_close}/>
                        </TouchableOpacity>
                    </View> */}
                    <Text style={[commonStyles.textBold, {
                        margin: Constants.MARGIN_X_LARGE,
                        marginTop: Constants.MARGIN_X_LARGE,
                        fontSize: Fonts.FONT_SIZE_XX_MEDIUM,
                        textAlign: 'center',
                        color: Colors.COLOR_BLACK
                    }]}>
                        {this.state.titleValue}
                    </Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={[commonStyles.text, {
                            marginHorizontal: Constants.MARGIN_X_LARGE,
                            marginBottom: Constants.MARGIN_X_LARGE
                        }]}>{this.state.contentValue}</Text>
                    </ScrollView>
                    <View style={[{
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }]} >
                        <TouchableOpacity block
                            activeOpacity={Constants.ACTIVE_OPACITY}
                            style={[commonStyles.buttonStyle, {
                                width: screen.width - Constants.MARGIN_XX_LARGE * 2,
                                marginHorizontal: Constants.MARGIN_LARGE,
                                paddingVertical: Constants.PADDING,
                                backgroundColor: Colors.COLOR_PRIMARY
                            }]}
                            onPress={() => {this.hideModal()}}>
                            <Text style={[commonStyles.text, {
                                textAlign: "center",
                                color: Colors.COLOR_WHITE
                            }]}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}