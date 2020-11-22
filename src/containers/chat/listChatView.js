import React, { Component } from "react";
import {
    View, Text, TouchableOpacity, Image,
    BackHandler, RefreshControl, TextInput, Keyboard, Animated
} from "react-native";
import BaseView from "containers/base/baseView";
import { Container, Header, Content, Root, Title } from "native-base";
import FlatListCustom from "components/flatListCustom";
import { Colors } from "values/colors";
import { Constants } from "values/constants";
import commonStyles from "styles/commonStyles";
import { Fonts } from "values/fonts";
import ItemListChat from "./itemListChat";
import firebase from "react-native-firebase";
import Utils from "utils/utils";
import StorageUtil from "utils/storageUtil";
import ic_search_black from "images/ic_search_blue.png";
import ic_cancel_white from "images/ic_cancel_blue.png";
import DialogCustom from "components/dialogCustom";
import StringUtil from "utils/stringUtil";
import * as actions from "actions/userActions";
import * as commonActions from "actions/commonActions";
import { ErrorCode } from "config/errorCode";
import { getActionSuccess, ActionEvent } from "actions/actionEvent";
import { connect } from "react-redux";
import conversationStatus from "enum/conversationStatus";
import styles from "./styles";
import { localizes } from "locales/i18n";
import HeaderGradient from "containers/common/headerGradient";
// import ic_chat_add_green from 'images/ic_chat_add_green.png';
import screenType from "enum/screenType";

class ListChatView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            isShowLoading: true,
            refreshing: false,
            enableRefresh: true,
            enableLoadMore: false,
            isLoadingMore: false,
            stringSearch: null,
            isAlertDelete: false,
            itemSelected: null,
            isPressDelete: false,
            mainConversation: [],
            showNoData: false,
            loadFirth: true
        };
        const { route, navigation, callback } = this.props;
        this.callback = callback;
        this.conversationIds = [];
        this.conversations = [];
        this.userId = null;
        this.onBackConversation = null;
        this.scrollY = 32;
        global.positionX = 0;
        this.onceQuery = Constants.PAGE_SIZE * 50;
        this.filter = {
            paging: {
                page: 0,
                pageSize: Constants.PAGE_SIZE
            }
        }
        this.numberUnseen = 0;
    }

    componentDidMount () {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then(user => {
            if (!Utils.isNull(user)) {
                this.userId = user.id;
                // this.getConversation()
                this.readDataListChat()
                this.getUnSeenConversation()
            }
        }).catch(error => {
            this.saveException(error, "componentWillMount");
        });
    }

    getConversation = () => {
        this.props.getConversation(this.filter);
    }

    componentWillReceiveProps = nextProps => {
        if (nextProps != this.props) {
            this.props = nextProps;
            this.handleData();
        }
    };

    getUnSeenConversation = () => {
        // try {
        //      .database()
        //         .ref(`chats_by_user/u${this.userId}/_conversation`)
        //         .orderByChild("deleted__last_updated_at")
        //         .startAt(`1_`)
        //         .limitToLast(this.onceQuery)
        //         .on("value", conversationSnap => {
        //             const conversationValue = conversationSnap.val();
        //             console.log("conversationValue: ", conversationValue);
        //             if (!Utils.isNull(conversationValue)) {
        //                 if (this.callback != null) {
        //                     this.callback();
        //                 }
        //                 this.conversationIds = [];
        //                 conversationSnap.forEach(element => {
        //                     this.conversationIds.push(parseInt(StringUtil.getNumberInString(element.key)));
        //                 });
        //                 this.conversationIds.reverse();
        //                 this.getInformationMemberChat();
        //             } else {
        //                 this.setState({
        //                     refreshing: false,
        //                     isLoadingMore: false,
        //                     isShowLoading: false,
        //                     loadFirth: false,
        //                     mainConversation: [],
        //                     showNoData: true
        //                 });
        //             }
        //         });
        // } catch (error) {
        //     this.saveException(error, "readDataListChat");
        // }
    }

    /**
     * read conversations on firebase
     * @param {*} usersKey (~ array contain userKey) is used when search
     */
    readDataListChat = async (usersKey) => {
        try {
            firebase
                .database()
                .ref(`chats_by_user/u${this.userId}/_conversation`)
                .orderByChild("deleted__last_updated_at")
                .startAt(`1_`)
                .limitToLast(this.onceQuery)
                .on("value", conversationSnap => {
                    console.log("conversationSnap", conversationSnap);
                    const conversationValue = conversationSnap.val();
                    if (!Utils.isNull(conversationValue)) {
                        console.log("conversationSnap 2", conversationValue);
                        if (this.callback != null) {
                            this.callback();
                        }
                        this.conversationIds = [];
                        conversationSnap.forEach(element => {
                            let numberUnseen = 0;
                            numberUnseen = numberUnseen + element.val().number_unseen
                            console.log("conversationSnap 3", element.val().number_unseen);
                            this.props.getUnseenConversation(numberUnseen)  
                            this.conversationIds.push(parseInt(StringUtil.getNumberInString(element.key)));
                        });
                        global.numberUnseen = this.numberUnseen
                        this.conversationIds.reverse();
                        this.getInformationMemberChat();
                    } else {
                        this.setState({
                            refreshing: false,
                            isLoadingMore: false,
                            isShowLoading: false,
                            loadFirth: false,
                            mainConversation: [],
                            showNoData: true
                        });
                    }
                });
        } catch (error) {
            console.log("error firebase: ", error)
            this.saveException(error, "readDataListChat");
        }
    };

    /**
     * Get information member chat (name, avatarPath)
     */
    getInformationMemberChat () {
        console.log("conver sation 4", this.conversationIds);
        if (this.conversationIds.length > 0) {
            this.props.getMemberOfConversation({
                conversationIds: this.conversationIds
            });
        }
    }

    /**
     * Get valueLastMessage and valueUnseen
     */
    getInformationConversation = async () => {
        this.saveListChat({ listChat: this.conversations })
        this.setState({
            refreshing: false,
            isLoadingMore: false,
            mainConversation: this.conversations,
            isShowLoading: false,
            showNoData: true
        });
        this.conversations = [];
    };

    /**
     * Handle data when request
     */
    handleData () {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_CONVERSATION)) {
                    if (data && data.data.length > 0) {
                        console.log("GET CONVERSATION", data);
                        this.state.enableLoadMore = !(data.data.length < Constants.PAGE_SIZE)
                        data.data.forEach(element => {
                            this.conversations.push({ ...element })
                        });
                        this.showNoData = false
                    } else {
                        this.state.enableLoadMore = false
                    }
                    this.showNoData = true;
                    // this.getInformationConversation();
                } if (this.props.action == getActionSuccess(ActionEvent.GET_MEMBER_OF_CONVERSATION)) {
                    console.log("GET_MEMBER_OF_CONVERSATION: ", data);
                    this.conversations = data;
                    this.state.mainConversation = this.conversations;
                    // add information conversation
                    this.getInformationConversation();
                } else if (this.props.action == getActionSuccess(ActionEvent.DELETE_CONVERSATION)) {
                    this.showMessage(localizes("listChatView.deleteChatSuccess"));
                } else if (this.props.action == getActionSuccess(ActionEvent.SEARCH_CONVERSATION)) {
                    if (!Utils.isNull(data)) {
                        this.conversations = data;
                        this.getInformationConversation();
                    } else {
                        this.conversations = [];
                        this.getInformationConversation();
                    }
                }
                this.state.refreshing = false;
                this.state.isLoadingMore = false;
            } else {
                this.handleError(this.props.errorCode, this.props.error, this.props.action);
            }
        }
    }

    /**
     * Get more conversation
     */
    loadMoreConversation = () => {
        if (this.conversations.length % Constants.PAGE_SIZE == 0 && this.state.enableLoadMore) {
            this.state.isLoadingMore = true;
            this.filter.paging.page = Math.round(this.data.length / Constants.PAGE_SIZE)
            this.getConversation();
        }
    }

    /**
     * Get more testing
     */
    getMoreTesting = () => {
        if (this.isLoadMore) {
            this.isLoadMore = false;
            global.pageConversation += 10;
            this.readDataListChat();
        }
    };

    componentWillUnmount () {
    }

    //onRefreshing
    handleRefresh = () => {
        this.conversations = []
        this.filter.paging.page = 0;
        this.state.mainConversation = []
        // this.getConversation()
        this.readDataListChat()
        this.getUnSeenConversation()
    };

    // onRequest
    handleRequest = () => {
        this.readDataListChat();
    };

    /**
     * Search user chat
     * @param {*} str
     */
    onSearch (str) {
        this.setState({
            stringSearch: str
        });
        if (!Utils.isNull(str)) {
            this.props.searchConversation({
                paramsSearch: str
            });
        } else {
            this.readDataListChat();
        }
    }

    /**
     * Get list chat
     */
    getListChat () {
        StorageUtil.retrieveItem(StorageUtil.LIST_CHAT).then((listChat) => {
            if (!Utils.isNull(listChat)) {
                console.log("list chat view: ", listChat);
                this.setState({
                    mainConversation: listChat.listChat,
                    loadFirth: false
                });
            }
        }).catch((error) => {
            this.saveException(error, 'getListChat');
        })

    }

    /**
     * Save list chat
     * @param {*} listChat
     */
    saveListChat (listChat) {
        StorageUtil.storeItem(StorageUtil.LIST_CHAT, listChat);
        this.getListChat();
    }


    render () {
        return (
            <Container style={[styles.container, { backgroundColor: Colors.COLOR_WHITE }]}>
                <Root>
                    <HeaderGradient
                        onBack={this.onBack}
                        title={"Tin nhắn"}>
                    </HeaderGradient>
                    <FlatListCustom
                        contentContainerStyle={{
                            paddingVertical: Constants.PADDING_LARGE
                        }}
                        horizontal={false}
                        data={this.state.mainConversation}
                        itemPerCol={1}
                        renderItem={this.renderItemListChat}
                        showsVerticalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{
                                nativeEvent: { contentOffset: { y: this.scrollY } }
                            }],
                            {
                                listener: (event) => {
                                    if (event.nativeEvent.contentOffset.y > this.scrollY) {
                                        this.setState({ isPressDelete: false })
                                    }
                                }
                            },
                        )}
                        enableLoadMore={this.state.enableLoadMore}
                        onLoadMore={this.loadMoreConversation}
                        enableRefresh={this.state.enableRefresh}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                        isShowEmpty={this.state.mainConversation.length == 0}
                        textForEmpty={'Những người bạn liên hệ sẽ xuất hiện ở đây'}
                    />
                    {/* {this.renderIconNewConversation()} */}
                    {this.state.isLoadingMore || this.state.refreshing ? null : this.showLoadingBar(this.props.isLoading)}
                    {this.renderDialogDelete()}
                </Root>
            </Container>
        );
    }

    /**
     * Render icon new conversation
     */
    renderIconNewConversation = () => {
        return (
            <View>
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    style={styles.iconNewConversation}
                    onPress={() =>
                        this.props.navigation.navigate("NewConversation")
                    }>
                    {/* <Image source={ic_chat_add_green} /> */}
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * Render dialog delete conversation
     */
    renderDialogDelete () {
        const { itemSelected } = this.state;
        return (
            <DialogCustom
                visible={this.state.isAlertDelete}
                isVisibleTitle={true}
                isVisibleContentText={true}
                isVisibleTwoButton={true}
                contentTitle={localizes('notification')}
                textBtnOne={localizes('cancel')}
                textBtnTwo={localizes('delete')}
                contentText={localizes('listChatView.confirmDeleteChat')}
                onPressX={() => {
                    this.setState({ isAlertDelete: false });
                }}
                onPressBtnPositive={() => {
                    firebase
                        .database()
                        .ref()
                        .update({
                            [`members/c${itemSelected.conversationId}/u${this.userId}/deleted_conversation`]: true,
                            [`chats_by_user/u${this.userId}/_conversation/c${itemSelected.conversationId}/deleted`]: true,
                            [`chats_by_user/u${this.userId}/_conversation/c${itemSelected.conversationId}/deleted__last_updated_at`]: "0_0",
                            [`conversation/c${itemSelected.conversationId}/deleted`]: true
                        })
                        .then(() => {
                            this.readDataListChat();
                            // update DB
                            // + set conversation.status = 2 (suspended)
                            // + set conversation_member.deleted_conversation = true (with me id)
                            this.props.deleteConversation(itemSelected.conversationId);
                            this.setState({
                                isAlertDelete: false
                            });
                            this.onBackConversation ? this.onBackConversation() : null;
                        });
                }}
            />
        );
    }

    /**
     * Render item
     * @param {*} item
     * @param {*} index
     * @param {*} parentIndex
     * @param {*} indexInParent
     */
    renderItemListChat = (item, index, parentIndex, indexInParent) => {
        const { isPressDelete, itemSelected } = this.state;
        return (
            <ItemListChat
                key={index.toString()}
                length={this.conversations.length}
                item={item}
                index={index}
                onPressItemChat={() => {
                    this.props.navigation.navigate("Chat", {
                        me: this.userId,
                        userMember: {
                            id: item.userId,
                            name: item.name,
                            avatarPath: item.avatarPath
                        },
                        conversationId: item.conversationId,
                    });
                }}
                onPressDeleteItem={this.onDeleteItem}
                userId={this.userId}
            />
        );
    }

    /**
     * On delete item
     */
    onDeleteItem = (item, index) => {
        this.setState({ isAlertDelete: true, itemSelected: item });
    }

    /**
     * On long press item
     */
    onLongPressItem = (item, index) => {
        this.setState({ isPressDelete: true, itemSelected: item });
    }
}

const mapStateToProps = state => ({
    data: state.listChat.data,
    isLoading: state.listChat.isLoading,
    error: state.listChat.error,
    errorCode: state.listChat.errorCode,
    action: state.listChat.action
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ListChatView);