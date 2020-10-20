import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Modal, BackHandler, ScrollView } from 'react-native';
import { Constants } from 'values/constants';
import commonStyles from 'styles/commonStyles';
import { Fonts } from 'values/fonts';
import { Colors } from 'values/colors';
import ic_check_white from 'images/ic_cancel_blue.png';
import StringUtil from 'utils/stringUtil';
import I18n from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import StorageUtil from 'utils/storageUtil';
import Utils from 'utils/utils';
import statusType from 'enum/statusType';
import FlatListCustom from 'components/flatListCustom';
import ImageViewer from 'react-native-image-zoom-viewer';
import DateUtil from 'utils/dateUtil';
import moment from 'moment';
import messing from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import * as actions from 'actions/userActions';
import { ErrorCode } from 'config/errorCode';
import { getActionSuccess, ActionEvent } from 'actions/actionEvent';
import { connect } from 'react-redux';
import ImageLoader from 'components/imageLoader';
import LinearGradient from "react-native-linear-gradient";
import messageType from 'enum/messageType';
import Swipeout from 'react-native-swipeout';
import ic_recycle_bin from 'images/ic_recycle_bin.png';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const PADDING_BUTTON = Constants.PADDING_X_LARGE - 4;
const WIDTH_HEIGHT_AVATAR = 48;

const screen = Dimensions.get("window");
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

class ItemListChat extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            unseen: 0,
            lastMessage: {},
            deleted: false,
            isRightOpen: false
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            if (nextProps.isPressDelete) {
                // this.scrollView.scrollTo({ x: 80 });
            } else {
                // this.scrollView.scrollTo({ x: 0 });
            }
            this.getUnseen();
            this.getLastMessage();
            this.getDeleted();
        }
    }

    /**
     * Get unseen
     */
    getUnseen = () => {
        const { item, userId } = this.props;
        database()
            .ref(`chats_by_user/u${userId}/_conversation/c${item.conversationId}/number_unseen`)
            .on('value', (unseen) => {
                // alert(unseen.val())
                if (Utils.isNull(unseen.val())) {
                    this.setState({
                        unseen: 0
                    })
                } else {
                    this.setState({
                        unseen: unseen.val()
                    })
                }
            });
    }

    /**
     * Get last message
     */
    getLastMessage = () => {
        const { item, userId } = this.props;
        database().ref(`conversation/c${item.conversationId}/last_messages`).on('value', (lastMessage) => {
            console.log("get last message: ", lastMessage);
            if (Utils.isNull(lastMessage.val())) {
                this.setState({
                    lastMessage: {}
                })
            } else {
                this.setState({
                    lastMessage: lastMessage.val()
                })
            }
        });
    }

    /**
     * Get deleted
     */
    getDeleted = () => {
        const { item, userId } = this.props;
            database()
            .ref(`conversation/c${item.conversationId}/deleted`)
            .on('value', (deleted) => {
                if (Utils.isNull(deleted.val())) {
                    this.setState({
                        deleted: false
                    })
                } else {
                    this.setState({
                        deleted: deleted.val()
                    })
                }
            });
    }

    componentDidMount() {
        this.getUnseen();
        this.getLastMessage();
        this.getDeleted();
    }

    render() {
        const { data, item, index, onPressItemChat, onPressDeleteItem, resourcePath, onLongPressItem, itemSelected, length } = this.props;
        let parseItem = {
            lastMessage: !Utils.isNull(this.state.lastMessage)
                ? this.state.lastMessage.message_type == messageType.NORMAL_MESSAGE
                    ? this.state.lastMessage.content
                    : !Utils.isNull(this.state.lastMessage.message_type) ? "[Hình ảnh]" : ''
                : "",
            updatedAt: !Utils.isNull(this.state.lastMessage) ? this.state.lastMessage.timestamp : DateUtil.getTimestamp(),
            nameUserChat: !Utils.isNull(item) ? item.name + (item.unseen > 0 ? " (" + item.unseen + ")" : "") : "",
            avatar: !Utils.isNull(item) && !Utils.isNull(item.avatarPath) ? item.avatarPath : "",
            unseen: this.state.unseen
        };
        const HEIGHT_NOT_SEEN = 20;
        const WIDTH__NOT_SEEN = Utils.getLength(parseInt(parseItem.unseen)) < 2 ? 20 : 28;
        const date = new Date(parseInt(parseItem.updatedAt));
        this.hours = date.getHours();
        this.minutes = date.getMinutes();
        this.seconds = date.getSeconds();
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.day = date.getDate();
        this.time = this.day + "/" + this.month + "/" + this.year + " " + this.hours + ":" + this.minutes + ":" + this.seconds;
        let marginBottom = Constants.MARGIN_LARGE;
        if (index == length - 1) {
            marginBottom = Constants.MARGIN_X_LARGE;
        };
        const styleText = parseItem.unseen == 0 ? commonStyles.text : commonStyles.textBold;
        // this.getLastMessage()
        const swipeSettings = {
            autoClose: true,
            right: [
                {
                    onPress: () => { },
                    component: (
                        <View style={{ alignItems: 'center', marginLeft: Constants.MARGIN_LARGE }}>
                            <Image source={ic_recycle_bin} />
                        </View>
                    ),
                    backgroundColor: 'white',
                    type: 'delete'
                }
            ]
        };
        return (
            <Swipeout
                {...swipeSettings}
                openRight={this.state.isRightOpen}
                backgroundColor='white'
                scroll={() => {
                    this.setState({
                        isRightOpen: false
                    })
                }}
                style={{ flex: 1, justifyContent: 'center', marginVertical: Constants.MARGIN_LARGE }}>
                <TouchableOpacity
                    style={{ flex: 1, width: width, }}
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    onPress={() => {
                        onPressItemChat()
                    }}
                // onLongPress={() => {
                //     this.setState({
                //         isRightOpen: true
                //     })
                // }}
                // delayLongPress={200}
                >
                    <View style={[commonStyles.viewHorizontal, {
                        marginHorizontal: Constants.MARGIN_X_LARGE,
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                    }]}>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <View>
                                <ImageLoader
                                    style={{
                                        width: WIDTH_HEIGHT_AVATAR,
                                        height: WIDTH_HEIGHT_AVATAR,
                                        borderRadius: WIDTH_HEIGHT_AVATAR / 2
                                    }}
                                    resizeModeType={"cover"}
                                    path={item.avatarPath}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View style={{ flex: 1, justifyContent: 'flex-start', marginLeft: Constants.MARGIN_X_LARGE }}>
                                    <View style={commonStyles.viewSpaceBetween}>
                                        <Text numberOfLines={1} style={[commonStyles.textBold, {
                                            margin: 0, flex: 1,
                                            marginRight: Constants.MARGIN_X_LARGE
                                        }]}>{parseItem.nameUserChat}</Text>
                                        <Text style={[commonStyles.text, {
                                            alignSelf: 'flex-start',
                                            flexDirection: 'column',
                                            margin: 0,
                                            fontSize: Fonts.FONT_SIZE_X_MEDIUM - 2,
                                            color: Colors.COLOR_PLACEHOLDER_TEXT_DISABLE,
                                            opacity: Constants.ACTIVE_OPACITY,
                                        }]}>
                                            {DateUtil.timeAgoChat(DateUtil.convertFromFormatToFormat(
                                                this.time, DateUtil.FORMAT_DATE_TIME_SQL,
                                                DateUtil.FORMAT_DATE_TIME_ZONE_T
                                            ))}
                                        </Text>
                                    </View>
                                    <View style={commonStyles.viewSpaceBetween}>
                                        <Text numberOfLines={1} style={[styleText, {
                                            flex: 1,
                                            color: parseInt(parseItem.unseen) > 0 ? Colors.COLOR_TEXT : Colors.COLOR_PLACEHOLDER_TEXT_DISABLE,
                                            margin: 0,
                                            marginRight: Constants.MARGIN_XX_LARGE * 2
                                        }]}>{parseItem.lastMessage}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeout>
        );
    }
}

const styles = StyleSheet.create({
    name: {
        borderRadius: Constants.CORNER_RADIUS,
        margin: 0,
        padding: Constants.PADDING_LARGE,
        backgroundColor: Colors.COLOR_WHITE
    },
    image: {
        backgroundColor: Colors.COLOR_WHITE,
        borderRadius: Constants.CORNER_RADIUS,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: Constants.PADDING_X_LARGE
    },
    buttonSpecial: {
        paddingHorizontal: Constants.PADDING_X_LARGE,
        paddingVertical: Constants.PADDING_LARGE,
    }
});

export default ItemListChat;