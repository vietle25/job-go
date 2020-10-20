import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import {ImageBackground, Dimensions, View, StatusBar, TextInput, ScrollView, TouchableOpacity, Image, Keyboard} from "react-native";
import {Form, Textarea, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Fab, Footer, Input, Item} from "native-base";
import {Constants} from "values/constants";
import {Colors} from "values/colors";
import BaseView from "containers/base/baseView";
import TimerCountDown from "components/timerCountDown";
import commonStyles from "styles/commonStyles";
import ic_back_black from "images/ic_back_white.png";
import ic_notification_white from "images/ic_notification_white.png";
import {Fonts} from "values/fonts";
import ic_default_user from "images/ic_default_user.png";
import shadow_avatar_home from "images/shadow_avatar_home.png";
import Utils from "utils/utils";
import ImageLoader from "components/imageLoader";
import BackgroundShadow from "components/backgroundShadow";
import StringUtil from "utils/stringUtil";
import {localizes} from "locales/i18n";
import styles from './styles';
import slidingMenuType from 'enum/slidingMenuType';

const screen = Dimensions.get('window');
const widthItem = (screen.width - 4 * Constants.MARGIN_XX_LARGE) / 4
export default class ItemBox extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render () {
        const {item, index, data, navigation, userInfo, callBack} = this.props;
        return (
            <View>
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    onPress={() => {
                        if (!Utils.isNull(item.screen)) {
                            if (item.screen == slidingMenuType.BRANCH) {
                                navigation.navigate(item.screen, {
                                    destination: null
                                });
                            } else if (item.screen == slidingMenuType.CHAT) {
                                callBack();
                            } else {
                                navigation.navigate(item.screen);
                            }
                        }
                    }}
                    block
                    style={styles.itemBox}>
                    <Image source={item.icon} style={{width: 24, height: 24}} ></Image>
                </TouchableOpacity>
                <Text style={styles.titleBox}>{item.title}</Text>
            </View>
        )
    }
}

