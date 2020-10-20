import React, { Component } from "react";
import {
    ImageBackground, View, StatusBar, Image, TouchableWithoutFeedback, BackHandler, Alert,
    WebView, Linking, RefreshControl, StyleSheet, Slider, TextInput, Dimensions, FlatList,
    TouchableHighlight, TouchableOpacity, ScrollView
} from "react-native";
import {
    Container, Header, Title, Left, Icon, Right, Button,
    Body, Content, Text, Card, CardItem, Form
} from "native-base";
import { Colors } from "values/colors";
import { Constants } from "values/constants";
import commonStyles from "styles/commonStyles";
import BaseView from "containers/base/baseView"
import TextInputCustom from "components/textInputCustom";
import ModalDropdown from 'components/dropdown';
import I18n, { localizes } from "locales/i18n";
import StringUtil from "utils/stringUtil";
import { Fonts } from "values/fonts";
import { months } from "moment";
import ServiecType from 'enum/serviceType';
import FlatListCustom from "components/flatListCustom";
import Modal from "react-native-modal";
import moment from 'moment';
import DateUtil from "utils/dateUtil";
import Hr from "components/hr";
import Utils from "utils/utils";
import notificationType from 'enum/notificationType';

const screen = Dimensions.get("window");
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default class ModalPopup extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            content: '',
            visible: false
        };
        this.idSelling = null;
    }

    componentDidUpdate = (prevProps, prevState) => {
    }

    componentWillMount = () => {
        this.getSourceUrlPath();
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
        }
    }

    /**
     * Show Modal Week
     */
    showModal () {
        // this.refs.modalPopup.open();
        this.setState({
            visible: true
        })
    }

    /**
     * hide Modal Week
     */
    hideModal () {
        // this.refs.modalPopup.close();
        this.setState({
            visible: false
        })
    }

    componentWillUpdate (nextProps, nextState) {
    }

    componentWillUnmount = () => {
    }

    render () {
        const { content, onPressYes, onPressNo, modalVisible, isVisibleButtonNo } = this.props;
        return (
            <Modal
                ref={"modalPopup"}
                style={{
                    backgroundColor: Colors.COLOR_TRANSPARENT,
                    margin: 0,
                    justifyContent: 'center',
                }}
                isVisible={this.state.visible}
                onBackButtonPress={() => {
                    this.hideModal()
                }}
                backdropOpacity={0.5}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                animationInTiming={500}
                animationOutTiming={500}
                backdropTransitionInTiming={500}
                backdropTransitionOutTiming={500}
                useNativeDriver={true}
                coverScreen={true}
                deviceHeight={Constants.MAX_HEIGHT}
            >
                {/* <View style={styles.container}> */}
                <View style={[styles.viewContainer]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: Fonts.FONT_SIZE_XX_MEDIUM }} >
                            {content()}
                        </Text>
                    </View>
                    <View style={{
                        flexDirection: "row-reverse",
                        marginTop: Constants.MARGIN_X_LARGE * 1.5
                    }}>
                        <TouchableOpacity
                            activeOpacity={Constants.ACTIVE_OPACITY}
                            style={{ marginRight: Constants.MARGIN_LARGE }}
                            onPress={() => {
                                this.hideModal()
                                if (onPressYes != null) {
                                    onPressYes()
                                }
                            }
                            }>
                            <Text style={[commonStyles.textBold, {
                                color: Colors.COLOR_BLUE_SEA, margin: 0,
                                fontSize: Fonts.FONT_SIZE_X_MEDIUM
                            }]}>
                                {localizes("yes")}
                            </Text>
                        </TouchableOpacity>
                        {isVisibleButtonNo == false ? null :
                            <TouchableOpacity
                                activeOpacity={Constants.ACTIVE_OPACITY}
                                style={{ marginRight: Constants.MARGIN_XX_LARGE }}
                                onPress=
                                {() => {
                                    this.hideModal()
                                    if (onPressNo != null) {
                                        onPressNo()
                                    }
                                }
                                }>
                                <Text style={[commonStyles.textBold, {
                                    color: Colors.COLOR_BLUE_SEA,
                                    margin: 0, fontSize: Fonts.FONT_SIZE_X_MEDIUM
                                }]}>
                                    {localizes("reject")}
                                </Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                {/* </View> */}
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.COLOR_BLACK_OPACITY_50
    },
    viewContainer: {
        backgroundColor: Colors.COLOR_WHITE,
        marginHorizontal: Constants.MARGIN_X_LARGE,
        width: screen.width - Constants.MARGIN_XX_LARGE,
        paddingHorizontal: Constants.MARGIN_X_LARGE,
        borderRadius: Constants.CORNER_RADIUS,
        borderColor: Colors.COLOR_DRK_GREY,
        paddingBottom: Constants.PADDING_LARGE + Constants.MARGIN,
        paddingTop: Constants.PADDING_LARGE + Constants.MARGIN
    }
});