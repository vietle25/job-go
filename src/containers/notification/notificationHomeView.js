import React, { Component } from "react";
import { View, Dimensions, TouchableOpacity, BackHandler } from "react-native";
import {
    Container, Header, Content, Tabs,
    Tab, TabHeading, Text, SwipeRow, Body,
    Root, Left, Title, Right
} from "native-base";
import { localizes } from 'locales/i18n';
import I18n from 'react-native-i18n';
import { Colors } from "values/colors";
import commonStyles from "styles/commonStyles";
import styles from "./styles";
import { Constants } from "values/constants";
import BaseView from "containers/base/baseView";
import { Fonts } from "values/fonts";
import NotificationView from "./notificationList/notificationView";
import ListChatView from "containers/chat/listChatView";
import Utils from "utils/utils";
import HeaderGradient from "containers/common/headerGradient";
import StringUtil from 'utils/stringUtil';
import StorageUtil from 'utils/storageUtil';
import { ErrorCode } from "config/errorCode";
import database from '@react-native-firebase/database';

const HEADER_HEIGHT = Platform.OS === "ios" ? 64 : 56;
const deviceWidth = Dimensions.get("window").width;

let context;
class NotificationHomeView extends BaseView {

    constructor(props) {
        super(props);
        this.state = {
            currentTab: 0,
            badgeCount: global.badgeCount,
            numberUnseen: global.numberUnseen
        };
        context = this;
        // this.tabs = [
        //     { title: localizes("notificationView.notification"), badge: global.badgeCount, component: <NotificationView navigation={this.props.navigation} callback={this.handleData} /> },
        //     { title: localizes("chat.title"), badge: global.numberUnseen, component: <ListChatView navigation={this.props.navigation} callback={this.handleData} /> }
        // ];
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
        });
        this.props.navigation.addListener('blur', () => {
            BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
        });
        this.handleUnseen();
    }

    componentWillUnmount() {

    }

    /**
     * Handle number unseen chat
     */
    handleUnseen() {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then(user => {
            if (!Utils.isNull(user)) {
                try {
                    database().ref(`members`).on('value', (memberSnap) => {
                        let unseen = 0
                        if (!Utils.isNull(memberSnap.val())) {
                            let conversationIds = []
                            memberSnap.forEach(item => {
                                const objMember = item.val()
                                Object.keys(objMember).map((key, index) => {
                                    const uIdMember = key // ~ u1, u2, u3 ... (u = user_id)
                                    const valueMember = objMember[key] // ~ {number_of_unseen_messages: 15, deleted_conversation: true or false}
                                    const idMember = StringUtil.getNumberInString(uIdMember) // from u1 => 1...
                                    if (idMember == user.id & !valueMember.deleted_conversation) {
                                        unseen += valueMember.number_of_unseen_messages
                                    }
                                });
                            });
                            global.numberUnseen = unseen
                            console.log("Notification home: ", global.numberUnseen)
                        }
                        this.setState({ numberUnseen: unseen })
                    })
                } catch (error) {
                    console.log("ERROR GET UNSEEN BASEVIEW: ", error)
                }
            }
        }).catch(error => {

        });
    }

    handleData() {
        setTimeout(() => {
            context.setState({ badgeCount: global.badgeCount, numberUnseen: global.numberUnseen });
        }, 500);
    }

    render() {
        
        return (
            <Container style={styles.container}>
                <Root>
                    <HeaderGradient
                        onBack={this.onBack}
                        visibleBack={true}
                        title={localizes("notificationView.notification")}
                        renderRightMenu={this.renderRightMenu}
                        elevation={0}
                    />
                    {this.renderTabs(this.tabs)}
                </Root>
            </Container>
        );
    }

    /**
     * Render tabs
     */
    renderTabs(tabs = []) {
        return (
            <Tabs tabBarBackgroundColor={Colors.COLOR_PRIMARY} tabBarUnderlineStyle={[styles.tabBarUnderlineStyle]} initialPage={0} onChangeTab={(i) => { this.setState({ currentTab: i }) }}>
                {/* {tabs.map((tab, index) => {
                    return (
                        <Tab
                            key={index.toString()}
                            heading={this.renderBadge(tab.title, tab.badge, index)}
                            tabStyle={styles.tabStyle}
                            activeTabStyle={styles.activeTabStyle}
                            textStyle={styles.textStyle}
                            activeTextStyle={styles.activeTextStyle}
                        >
                            {tab.component}
                        </Tab>
                    )
                })} */}
                <Tab
                    key={0}
                    heading={this.renderBadge(
                        localizes("notificationView.notification"),
                        this.state.badgeCount,
                        0)}
                    tabStyle={styles.tabStyle}
                    activeTabStyle={styles.activeTabStyle}
                    textStyle={styles.textStyle}
                    activeTextStyle={styles.activeTextStyle}
                >
                    <NotificationView navigation={this.props.navigation} callback={this.handleData} />
                </Tab>
                <Tab
                    key={1}
                    heading={this.renderBadge(
                        localizes("chat.title"),
                        this.state.numberUnseen,
                        1)}
                    tabStyle={styles.tabStyle}
                    activeTabStyle={styles.activeTabStyle}
                    textStyle={styles.textStyle}
                    activeTextStyle={styles.activeTextStyle}
                >
                    <ListChatView navigation={this.props.navigation} callback={this.handleData} />
                </Tab>
            </Tabs>
        )
    }

    renderBadge(title, badge, index) {
        const WIDTH = Utils.getLength(parseInt(badge)) < 2 ? 20 : 13.5 * Utils.getLength(parseInt(badge));
        const HEIGHT = 20;
        const RIGHT = Utils.getLength(parseInt(badge)) < 2 ? - Utils.getLength(title) : - Utils.getLength(title + index) * Utils.getLength(parseInt(badge));
        return (
            <TabHeading style={this.state.currentTab.i == index || this.state.currentTab == index ? styles.tabStyle : styles.activeTabStyle}>
                <View>
                    <Text style={this.state.currentTab.i == index || this.state.currentTab == index ? styles.activeTextStyle : styles.textStyle}>{title}</Text>
                    {badge > 0 ?
                        <View
                            style={[
                                {
                                    position: 'absolute',
                                    alignSelf: 'flex-start',
                                    right: RIGHT,
                                    top: - Constants.MARGIN_LARGE,
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
                            }}>{badge}</Text>
                        </View> : null}
                </View>
            </TabHeading>
        );
    }

}

export default NotificationHomeView;