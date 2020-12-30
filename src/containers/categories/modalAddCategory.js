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
import styles from './styles';

const screen = Dimensions.get("window");

export default class modalAdd extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            contentValue: null,
            titleValue: null,
            category: null
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
    showModal () {
        this.refs.modalAdd.open();
    }

    /**
     * hide Modal Week
     */
    hideModal () {
        this.refs.modalAdd.close();
    }

    componentWillUpdate (nextProps, nextState) {
    }

    componentWillUnmount = () => {
    }

    render () {
        return (
            <Modal
                ref={"modalAdd"}
                animationType={'fade'}
                transparent={true}
                style={{
                    backgroundColor: "#00000000",
                    flex: 1,
                    justifyContent: 'center',
                    // alignItems: 'center',
                }}
                backdrop={true}
                onClosed={() => {
                    this.hideModal()
                }}
                backButtonClose={true}
                swipeToClose={false}
            >
                <View style={[{
                    borderRadius: Constants.CORNER_RADIUS,
                    width: screen.width - Constants.MARGIN_XX_LARGE,
                    backgroundColor: Colors.COLOR_WHITE,
                    marginHorizontal: Constants.MARGIN_X_LARGE
                    // alignItems: 'center',
                }]}>
                    <View style={{marginVertical: Constants.MARGIN_X_LARGE, height: 50}}>
                        <TextInput
                            backgroundColor={Colors.COLOR_TRANSPARENT}
                            placeholderTextColor={Colors.COLOR_BLACK}
                            styleInputGroup={{
                                borderColor: Colors.COLOR_PRIMARY,
                                borderWidth: 0.8,
                                height: 50
                            }}
                            refInput={ref => (this.rPassword = ref)}
                            isInputNormal={true}
                            placeholder={"Nhập tên danh mục tạo mới"}
                            value={this.state.category ? this.state.category : ""}
                            onChangeText={(text) => {
                                this.setState({
                                    category: text
                                })
                            }}
                            onSubmitEditing={() => {

                            }}
                            returnKeyType={'done'}
                            inputNormalStyle={styles.inputNormal}
                        />
                    </View>

                    <View style={[{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                    }]} >
                        <TouchableOpacity block
                            activeOpacity={Constants.ACTIVE_OPACITY}
                            style={[commonStyles.buttonStyle, {
                                // width: screen.width - Constants.MARGIN_XX_LARGE * 2,
                                marginHorizontal: Constants.MARGIN_LARGE,
                                paddingVertical: Constants.PADDING,
                                backgroundColor: Colors.COLOR_PRIMARY
                            }]}
                            onPress={() => {this.hideModal()}}>
                            <Text style={[commonStyles.text, {
                                textAlign: "center",
                                color: Colors.COLOR_WHITE
                            }]}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity block
                            activeOpacity={Constants.ACTIVE_OPACITY}
                            style={[commonStyles.buttonStyle, {
                                // width: screen.width - Constants.MARGIN_XX_LARGE * 2,
                                marginHorizontal: Constants.MARGIN_LARGE,
                                paddingVertical: Constants.PADDING,
                                backgroundColor: Colors.COLOR_PRIMARY
                            }]}
                            onPress={() => {
                                console.log("Category name", this.state.category)
                                if (this.state.category != null) {
                                    if (this.state.category.trim() != "") {
                                        this.props.onAddCategory(this.state.category);
                                        this.hideModal()
                                    }
                                }
                            }}>
                            <Text style={[commonStyles.text, {
                                textAlign: "center",
                                color: Colors.COLOR_WHITE
                            }]}>Đồng ý</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}