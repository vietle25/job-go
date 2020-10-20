import React, {Component} from "react";
import {
    ImageBackground, View, Image, TouchableOpacity, Animated,
    BackHandler, Alert, Linking, ScrollView, NativeEventEmitter,
    DeviceEventEmitter, Platform, RefreshControl, Dimensions,
    SafeAreaView, NativeModules, Text
} from "react-native";
import {
    Container, Form, Content, Input, Button, Right, Radio,
    center, ListItem, Left, Header, Item, Picker, Body, Root
} from 'native-base';
import * as actions from 'actions/userActions'
import * as commonActions from 'actions/commonActions'
import {connect} from 'react-redux';
import FlatListCustom from "components/flatListCustom";
import {Constants} from "values/constants";
import {localizes} from "locales/i18n";
import BaseView from "containers/base/baseView";
import HeaderView from "containers/common/headerView";
import HeaderGradient from 'containers/common/headerGradient.js';
import commonStyles from "styles/commonStyles";
import {Colors} from "values/colors";
import Utils from 'utils/utils';
import {ErrorCode} from "config/errorCode";
import {ActionEvent, getActionSuccess} from "actions/actionEvent";
import {Fonts} from 'values/fonts'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from "react-native-popup-menu";
import {configConstants} from "values/configConstants";
import GenderType from "enum/genderType";
import StorageUtil from "utils/storageUtil";
import Hr from "components/hr";
import styles from "./styles";
import screenType from "enum/screenType";
import DateUtil from "utils/dateUtil";

const window = Dimensions.get("window");

class UserDetailView extends BaseView {

    constructor(props) {
        super(props)
        const {navigation} = this.props;
        this.state = {
            phone: '',
            email: '',
            address: '',
            gender: null,
        };

        this.dataShop = null;
        this.menuOptions = [
            {
              
            },
            {
           
            }
        ];
        this.isYour = this.props.isYour;
    }

    componentDidMount () {
        this.getSourceUrlPath();
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
    handleData () {
        const {userInfo, isYour} = this.props;
        this.isYour = isYour;
        if (!Utils.isNull(userInfo)) {
            this.handleGetProfile(userInfo);
        }
    }

    /**
     * Handle data user profile
     * @param {*} user 
     */
    handleGetProfile (user) {
        // if (!Utils.isNull(user.shop)) {
        this.dataShop = user.shop;
        // }
        this.setState({
            fullName: user.name.trim(),
            phone: user.phone,
            email: user.email,
            gender: user.gender,
            address: user.address,
            description: user.description,
            birthDate: user.birthDate
        });
    }

    render () {
        return (
            <View></View>
        )
    }

    /**
     * Get gender user
     * @param {*} gender
     */
    getGender (gender) {
        let genderText = '';
        if (gender === GenderType.MALE)
            genderText = localizes("userProfileView.male");
        else if (gender === GenderType.FEMALE)
            genderText = localizes("userProfileView.female");
        return genderText;
    }


    /**
     * Render menu option
     */
    renderMenuOption = () => {
        return (
            <Menu
                style={{
                    top: Constants.MARGIN_LARGE,
                    right: 0,
                }}
                ref={ref => (this.menuOption = ref)}
            >
                <MenuTrigger text="" />
                <MenuOptions>
                    {this.menuOptions.map((item, index) => {
                        return (
                            <MenuOption
                                index={index.toString()}
                                onSelect={() => {
                                    item.event()
                                }}
                            >
                                <View
                                    style={[
                                        commonStyles.viewHorizontal,
                                        {
                                            alignItems: "center",
                                            padding: Constants.MARGIN_LARGE,
                                        }
                                    ]}
                                >
                                    <View style={[styles.iconMenu, {marginRight: Constants.MARGIN_LARGE}]}>
                                        <Image source={item.icon} />
                                    </View>
                                    <Text style={[styles.textMenu], {marginRight: Constants.MARGIN}}>{item.name}</Text>
                                </View>
                            </MenuOption>
                        )
                    })}
                </MenuOptions>
            </Menu>
        );
    };
}

export default UserDetailView;