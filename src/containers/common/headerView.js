import React, { Component } from "react";
import PropTypes from "prop-types";
import { ImageBackground, Dimensions, View, StatusBar, TextInput, ScrollView, TouchableOpacity, Image, Keyboard } from "react-native";
import { Form, Textarea, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Fab, Footer, Input, Item, Picker } from "native-base";
import { Constants } from "values/constants";
import { Colors } from "values/colors";
import BaseView from "containers/base/baseView";
import TimerCountDown from "components/timerCountDown";
import commonStyles from "styles/commonStyles";
import ic_back_blue from "images/ic_back_blue.png";
import ic_down_white from "images/ic_down_white.png";
import { Fonts } from "values/fonts";
import ic_default_user from "images/ic_default_user.png";
import Utils from "utils/utils";
import ImageLoader from "components/imageLoader";
import StringUtil from "utils/stringUtil";
import LinearGradient from "react-native-linear-gradient";
import ic_search_black from 'images/ic_search_blue.png';
import ic_cancel_white from 'images/ic_cancel_blue.png';
import ic_sign_in from 'images/ic_sign_in.png';
import ic_chat_white from 'images/ic_chat_white.png';
import ic_logo from 'images/ic_log_splash.png';
import { localizes } from "locales/i18n";
import ic_notification_blue from 'images/ic_notification_blue.png';
import ModalDropdown from "components/dropdown";
import staffType from "enum/staffType";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from "react-native-popup-menu";

const deviceHeight = Dimensions.get("window").height;
const AVATAR_SIZE = 32;
const AVATAR_BORDER = AVATAR_SIZE / 2

class HeaderView extends Component {
    static propTypes = {
        //Title
        title: PropTypes.string.isRequired,
        //Unit: Seconds
        timeLimit: PropTypes.number,
        //Handle to be called:
        //when user pressed back button
        onBack: PropTypes.func,
        //Called when countdown time has been finished
        onFinishCountDown: PropTypes.func,
        //Called when extra time has been finished
        onTick: PropTypes.func,
        titleStyle: PropTypes.object,
        isReady: PropTypes.bool,
        visibleBack: PropTypes.bool,
        visibleCart: PropTypes.bool,
        visibleLogo: PropTypes.bool,
        visibleNotification: PropTypes.bool,
        visibleMap: PropTypes.bool,
        visibleAccount: PropTypes.bool,
        visibleSearchBar: PropTypes.bool,
        initialIndex: PropTypes.number,
        visibleIconLeft: PropTypes.bool,
        visibleDark: PropTypes.bool,
        barStyle: PropTypes.string,
        barBackground: PropTypes.string,
        barTranslucent: PropTypes.bool,
        backColor: PropTypes.string
    };

    static defaultProps = {
        onFinishCountDown: null,
        onFinishExtraTime: null,
        isReady: true,
        onTick: null,
        visibleBack: false,
        visibleCart: false,
        visibleNotification: false,
        visibleMap: false,
        visibleAccount: false,
        visibleSearchBar: false,
        onBack: null,
        initialIndex: 0,
        titleStyle: null,
        visibleIconLeft: false,
        visibleLogo: false,
        visibleDark: false,
        barStyle: "dark-content",
        barBackground: Colors.COLOR_TRANSPARENT,
        barTranslucent: true,
        backColor: 'black'
    };

    constructor(props) {
        super(props);
        this.state = {
            countDownTime: this.props.timeLimit,
            branchSelected: {
                id: null,
                name: "Tất cả chi nhánh"
            }
        };
        this.timeTick = this.state.countDownTime;
    }

    render () {
        const { title,
            onBack,
            onRefresh,
            renderRightMenu,
            renderLeftMenu,
            renderMidMenu,
            barBackground,
            barTranslucent,
            visibleDark,
            barStyle
        } = this.props;
        return (
            <View style={styles.headerBody}>
                {renderLeftMenu && renderLeftMenu()}
                {this.props.visibleIconLeft ? this.renderIconLeft() : null}

                {this.props.visibleLogo ? this.renderLogo() : null}
                {!StringUtil.isNullOrEmpty(title) ? (
                    <View style={{
                        position: "absolute",
                        right: 0,
                        left: 0
                    }}>
                        <Text numberOfLines={1} style={[commonStyles.title, {
                            textAlign: "center",
                            marginHorizontal: Constants.MARGIN_X_LARGE * 3,
                            color: Colors.COLOR_TEXT_PRIMARY
                        }, this.props.titleStyle]}>
                            {title}
                        </Text>
                    </View>
                ) : null}
                {/*Back button*/}
                {this.props.visibleBack ? this.renderBack() : null}
                {/* Render account */}
                {this.props.visibleAccount ? this.renderAccount() : null}
                {/* Render header home admin general */}
                {/* {this.props.visibleHomeAdmin ? this.renderHomeAdmin() : null} */}
                {/* Render timer countdown */}
                {this.props.visibleSearchBar ? this.renderSearchBar() : null}
                {/* Render timer countdown */}
                {renderMidMenu ? renderMidMenu() : null}
                {this.props.visibleIconRight ? this.renderIconRight() : null}
                {this.props.renderSearch ? this.renderSearch() : null}
                {this.props.visibleMessage ? this.renderMessage() : null}
                {/* Notification button */}
                {this.props.visibleNotification ? this.renderNotification() : null}
                {/* Render cart */}
                {/* {this.props.visibleCart ? this.renderCart() : null} */}
                {renderRightMenu && renderRightMenu()}
                {/* <StatusBar
                    animated={true}
                    backgroundColor={barBackground}
                    barStyle={barStyle}  // dark-content, light-content and default
                    hidden={false}  //To hide statusBar
                    translucent={barTranslucent}  //allowing light, but not detailed shapes
                /> */}
            </View>

        );
    }

    onTimeElapsed = () => {
        if (this.props.onFinishCountDown) this.props.onFinishCountDown();
    };

    /**
     * Render back
     */
    renderBack () {
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{
                    padding: Constants.PADDING_LARGE
                }}
                onPress={() => {
                    if (this.props.onBack) this.props.onBack();
                }}
            >
                <Image source={ic_back_blue} />
            </TouchableOpacity>
        );
    }

    /**
     * Render icon left
     */
    renderIconLeft () {
        const { onPressIconLeft } = this.props;
        return (
            <TouchableOpacity
                style={{ padding: Constants.PADDING_X_LARGE }}
                onPress={() => {
                    if (onPressIconLeft) this.props.onPressIconLeft();
                }}
            >
                <Image source={this.props.visibleIconLeft} />
            </TouchableOpacity>
        );
    }

    /**
     * Render icon right
     */
    renderIconRight () {
        const { onPressIconRight } = this.props;
        return (
            <TouchableOpacity
                style={{ padding: Constants.PADDING_X_LARGE }}
                onPress={() => {
                    if (onPressIconRight) this.props.onPressIconRight();
                }}
            >
                <Image source={this.props.visibleIconRight} />
            </TouchableOpacity>
        );
    }

    /**
     * Render message
     */
    renderMessage () {
        const { onPressMess, quantityMess } = this.props;
        return (
            <TouchableOpacity
                style={{
                    paddingVertical: Constants.PADDING, paddingHorizontal: Constants.PADDING_X_LARGE
                }}
                onPress={() => {
                    if (onPressMess) this.props.onPressMess();
                }}
            >
                <Image source={ic_chat_white} style={{ aspectRatio: 0.85, resizeMode: 'contain' }} />
                {quantityMess != 0 ? (
                    <View
                        style={[
                            commonStyles.viewCenter,
                            {
                                position: "absolute",
                                top: Constants.MARGIN,
                                right: 0,
                                //width: quantityMess >= 10 ? 24 : 16,
                                height: 16,
                                borderRadius: Constants.CORNER_RADIUS,
                                backgroundColor: Colors.COLOR_BACKGROUND_COUNT_NOTIFY
                            }
                        ]}
                    >
                        <Text
                            style={[
                                commonStyles.text,
                                {
                                    color: Colors.COLOR_WHITE,
                                    fontSize: Fonts.FONT_SIZE_SMALL
                                }
                            ]}
                        >
                            {quantityMess}
                        </Text>
                    </View>
                ) : null}
            </TouchableOpacity>
        );
    }
    /**
     * Render cart
     */
    renderCart () {
        const { quantityCart, visibleDark } = this.props;
        const WIDTH = Utils.getLength(parseInt(quantityCart)) < 2 ? 16 : 26;
        const HEIGHT = 16;
        const RIGHT = Utils.getLength(parseInt(quantityCart)) < 2 ? 0 : -4;
        return (
            <TouchableOpacity
                style={{
                    padding: Constants.PADDING_LARGE
                }}
                onPress={() => {
                    if (this.props.showCart) this.props.showCart();
                }}
            >
                <Image source={!visibleDark ? ic_cart_white : ic_cart_black} />
                {quantityCart != 0 ? (
                    <View
                        style={[
                            {
                                position: 'absolute',
                                alignSelf: 'flex-start',
                                right: RIGHT,
                                top: 2,
                                width: WIDTH,
                                height: HEIGHT,
                                backgroundColor: Colors.COLOR_RED,
                                borderRadius: WIDTH / 2,
                                justifyContent: 'center', alignItems: 'center'
                            }
                        ]}
                    >
                        <Text style={{
                            textAlign: 'center',
                            color: Colors.COLOR_WHITE,
                            fontSize: Fonts.FONT_SIZE_SMALL
                        }}>{quantityCart}</Text>
                    </View>
                ) : null}
            </TouchableOpacity>
        );
    }

    /**
     * Render account
     */
    renderAccount () {
        const { user, onPressUser, source } = this.props;
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                onPress={onPressUser}
                style={{
                    alignItems: "center",
                    flexDirection: "row",
                    width: "75%",
                    marginHorizontal: Constants.MARGIN_LARGE
                }}
            >
                <ImageLoader
                    style={{
                        width: AVATAR_SIZE,
                        height: AVATAR_SIZE,
                        borderRadius: AVATAR_BORDER,
                        position: "relative"
                    }}
                    // resizeModeType={"cover"}
                    path={!Utils.isNull(user) ? user.avatarPath : null}
                />
                <View>
                    <Text numberOfLines={1} style={[commonStyles.textSmall, {
                        opacity: 0.8,
                        margin: 0,
                        marginLeft: Constants.MARGIN_LARGE,
                        color: Colors.COLOR_BLACK
                    }]}>{user != null ? "Chào, " + user.name : "Đăng nhập/ Đăng ký"}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    /**
     * Render home admin
     */
    renderHomeAdmin () {
        const { user, userName, gotoLogin, source, onSelectBranch } = this.props; //type=1 gerenal, type=2 branch, type=3 employee
        if (global.appAdminType === staffType.GENERAL_MANAGER) {
            return (
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    style={[commonStyles.viewHorizontal, {
                        alignItems: 'center',
                        justifyContent: 'center',
                    }]}
                    onPress={() => this.menuOption.open()}>
                    {Utils.isNull(this.props.source) ? null : this.renderMenuBranch()}
                    <Text style={[commonStyles.text, { color: Colors.COLOR_WHITE, textAlign: 'center' }]}>
                        {this.state.branchSelected.name}
                    </Text>
                    <Image source={ic_down_white} />
                </TouchableOpacity>
            );
        } else if (global.appAdminType === staffType.BRANCH_MANAGER) {
            return (
                <View style={{ flex: 1, flexDirection: 'row', marginLeft: Constants.MARGIN_LARGE, alignItems: 'center', marginRight: Constants.MARGIN_LARGE }}>
                    <Text style={[commonStyles.Text, { flex: 1, color: Colors.COLOR_WHITE, textAlign: 'center' }]}>{source}</Text>
                    <TouchableOpacity style={{ position: 'absolute', right: Constants.MARGIN_LARGE }} onPress={() => this.props.gotoNotification()}>
                        {/* <Image source={ic_notification_white} /> */}
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={{ flexDirection: 'row', marginLeft: Constants.MARGIN_LARGE, alignItems: 'center', marginRight: Constants.MARGIN_LARGE }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <ImageLoader
                            style={[{
                                width: AVATAR_SIZE,
                                height: AVATAR_SIZE,
                                borderRadius: AVATAR_SIZE / 2
                            }]}
                            resizeModeType={"cover"}
                            path={Utils.isNull(source) ? null : source.avatarPath}
                        />
                        <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: Constants.MARGIN_LARGE }}>
                            <Text style={[commonStyles.textSmall, { color: Colors.COLOR_WHITE, margin: 0 }]}>{Utils.isNull(source) ? null : source.name}</Text>
                            <Text style={[commonStyles.textBold, { color: Colors.COLOR_WHITE, margin: 0 }]}>{Utils.isNull(source) ? null : this.nameType(source.userRole.staffType)}</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={() => this.props.gotoNotification()}>
                        {/* <Image source={ic_notification_white} /> */}
                    </TouchableOpacity>
                </View>
            );
        }
    }

    /**
     * Render menu branch
     */
    renderMenuBranch = () => {
        const { user, userName, gotoLogin, source, onSelectBranch } = this.props;
        return (
            <Menu
                style={{
                    top: Constants.MARGIN_X_LARGE + Constants.MARGIN_LARGE,
                    left: Constants.MARGIN_LARGE
                }}
                ref={ref => (this.menuOption = ref)}
            >
                <MenuTrigger text="" />
                <MenuOptions>
                    {this.props.source.map((item, index) => {
                        return (
                            <MenuOption
                                key={index.toString()}
                                onSelect={() => {
                                    this.setState({
                                        branchSelected: item
                                    });
                                    onSelectBranch(item);
                                }}
                            >
                                <View
                                    style={[
                                        commonStyles.viewHorizontal,
                                        {
                                            alignItems: "center",
                                            padding: Constants.MARGIN
                                        }
                                    ]}
                                >
                                    <Text style={[styles.textMenu]}>{item.name}</Text>
                                </View>
                            </MenuOption>
                        )
                    })}
                </MenuOptions>
            </Menu>
        );
    }

    /**
     * Render notification button
     */
    renderNotification () {
        const { quantityNotification, visibleDark } = this.props;
        // const WIDTH = Utils.getLength(parseInt(quantityNotification)) < 2 ? 16 : 26;
        const HEIGHT = 16;
        const RIGHT = -4;
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{
                    padding: Constants.PADDING_LARGE,
                }}
                onPress={() => { if (this.props.gotoNotification) this.props.gotoNotification(); }}
            >
                <Image source={ic_notification_blue} />
                {global.badgeCount && global.badgeCount > 0 ? (
                    <View
                        style={[
                            {
                                position: 'absolute',
                                alignSelf: 'flex-start',
                                right: 5,
                                top: 6,
                                borderWidth: 1, borderColor: Colors.COLOR_WHITE,
                                backgroundColor: Colors.COLOR_RED,
                                borderRadius: 16,
                                paddingHorizontal: Constants.PADDING,
                                justifyContent: 'center', alignItems: 'center'
                            }
                        ]}
                    >
                        <Text style={{
                            textAlign: 'center',
                            color: Colors.COLOR_WHITE,
                            fontSize: Fonts.FONT_SIZE_SMALL
                        }}>{global.badgeCount}</Text>
                    </View>
                ) : null}
            </TouchableOpacity>
        );
    }

    /***
     * render title search
     */
    renderTitleSearch () {
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={[commonStyles.viewHorizontal, commonStyles.viewCenter]}
                onPress={() => {
                    if (this.props.onTouchStart) {
                        this.props.onTouchStart(); // with editable = false
                    }
                }}
            >
                <TextInput
                    style={[
                        commonStyles.text,
                        {
                            margin: 0,
                            borderRadius: 0,
                            flex: 1,
                            paddingHorizontal: Constants.PADDING_LARGE,
                            color: Colors.COLOR_WHITE
                        }
                    ]}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={Colors.COLOR_WHITE}
                    ref={ref => {
                        if (this.props.onRef) this.props.onRef(ref);
                    }}
                    value={this.props.inputSearch}
                    onChangeText={this.props.onChangeTextInput}
                    onSubmitEditing={() => {
                        this.props.onSubmitEditing();
                        Keyboard.dismiss();
                    }}
                    keyboardType="default"
                    underlineColorAndroid="transparent"
                    returnKeyType={"search"}
                    blurOnSubmit={false}
                    autoCorrect={false}
                    autoFocus={this.props.autoFocus}
                    editable={this.props.editable}
                />
            </TouchableOpacity>
        )
    }

    /**
     * Render timer count down
     */
    renderSearchBar () {
        return (
            <View style={[styles.searchBar, this.props.styleSearch]}>
                {/*Left button*/}
                {!Utils.isNull(this.props.iconLeftSearch) ? (
                    <TouchableOpacity
                        style={[this.props.styleLeftSearch, {
                            paddingHorizontal: Constants.PADDING_LARGE
                        }]}
                        onPress={() => {
                            this.props.onPressLeftSearch();
                        }}
                    >
                        <Image source={this.props.iconLeftSearch} style={this.props.styleIconLeftSearch} />
                    </TouchableOpacity>
                ) : null}
                {this.props.onPressSearch ? this.renderSearch() : <TextInput
                    style={[commonStyles.inputText, { flex: 1 }]}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={Colors.COLOR_TEXT}
                    ref={ref => {
                        if (this.props.onRef) this.props.onRef(ref);
                    }}
                    value={this.props.searchString}
                    onChangeText={this.props.onChangeTextInput}
                    onSubmitEditing={() => {
                        this.props.onSubmitEditing();
                        Keyboard.dismiss();
                    }}
                    keyboardType="default"
                    underlineColorAndroid="transparent"
                    returnKeyType={"search"}
                    blurOnSubmit={false}
                    autoCorrect={false}
                    autoFocus={this.props.autoFocus}
                    editable={this.props.editable}
                />}
                {/*Right button*/}
                {!Utils.isNull(this.props.iconRightSearch) ? (
                    <TouchableOpacity
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        style={{
                            paddingHorizontal: Constants.PADDING_LARGE
                        }}
                        onPress={() => {
                            this.props.onPressRightSearch();
                        }}
                    >
                        <Image source={this.props.iconRightSearch} />
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    }

    componentWillReceiveProps (newProps) {
        if (newProps.timeLimit <= 0) this.timeTick = newProps.timeLimit;
        this.setState({
            countDownTime: newProps.timeLimit
        });
    }

    /**
     * Get remain time is countdown
     */
    getTime () {
        return this.timeTick;
    }

    /**
     * Render logo
     */
    renderLogo () {
        return (
            <View style={[commonStyles.viewCenter, {
                position: "absolute",
                padding: Constants.PADDING_LARGE,
                left: 0
            }]}>
                <Image source={ic_logo} style={{ width: 42, height: 42 }} />
            </View>
        );
    }

    /**
     * Render mif menu
     */
    renderMidMenu = () => {
        return (
            <View style={{ flex: 1 }} />
        )
    }

    nameType (type) {
        if (type == staffType.GENERAL_MANAGER) {
            return 'Admin tổng';
        } else if (type == staffType.BRANCH_MANAGER) {
            return 'Admin';
        } else if (type == staffType.TECHNICAL_EMPLOYEE
            || type == staffType.COMMON_EMPLOYEE) {
            return 'Nhân viên';
        } else {
            return null;
        }
    }

    /**
     * Render logo
     */
    renderSearch () {
        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                    paddingHorizontal: Constants.PADDING,
                    paddingVertical: Constants.PADDING_LARGE
                }}
                onPress={() => this.props.onSelectSearch()}
            >
                <Text style={{ color: Colors.COLOR_PLACEHOLDER_TEXT_DISABLE }}>Tìm nhóm</Text>
            </TouchableOpacity>
        );
    }

}

const styles = {
    headerBody: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    searchBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.COLOR_BACKGROUND,
        margin: Constants.MARGIN_LARGE,
        borderRadius: Constants.CORNER_RADIUS * 6
    }
};
export default HeaderView;
