import React, {Component} from "react";
import {
    ImageBackground, View, Image, TouchableOpacity,
    BackHandler, Alert, Linking, ScrollView, NativeEventEmitter,
    DeviceEventEmitter, Platform, RefreshControl, Dimensions,
    SafeAreaView, NativeModules, Text
} from "react-native";
import {
    Container, Form, Content, Input, Button, Right, Radio,
    center, ListItem, Left, Header, Root
} from 'native-base';
import * as actions from 'actions/userActions';
import * as locationActions from 'actions/locationActions';
import * as commonActions from 'actions/commonActions';
import * as postActions from 'actions/postActions';
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
import ic_cancel_white from "images/ic_cancel_blue.png";
import {ErrorCode} from "config/errorCode";
import {ActionEvent, getActionSuccess} from "actions/actionEvent";
import {Fonts} from 'values/fonts';
import viewPostType from "enum/viewPostType";
import ItemProduct from "./itemProduct";
import PostListView from "containers/post/postListView";

const screen = Dimensions.get("window");

class ProductOfUserView extends BaseView {

    constructor(props) {
        super(props)
        const {navigation} = this.props;
        this.state = {
            enableLoadMore: false,
            isLoadingMore: false,
            enableRefresh: true,
            refreshing: false,
            posts: [],
        };
        this.filter = {
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            },
            viewPostType: viewPostType.SELL_PRODUCT
        };
        this.isYour = this.props.isYour;
        this.userInfo = this.props.userInfo;
    }

    componentDidMount () {
        this.getSourceUrlPath();
        this.props.resetAction();
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
        let data = this.props.data;
        this.isYour = this.props.isYour;
        this.userInfo = this.props.userInfo;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_PRODUCT_USER)) {
                    this.state.refreshing = false;
                    this.state.isLoadingMore = false;
                    if (!Utils.isNull(data)) {
                        if (data.paging.page == 0) {
                            this.state.posts = [];
                        }
                        this.state.enableLoadMore = !(data.data.length < Constants.PAGE_SIZE)
                        if (data.data.length > 0) {
                            data.data.forEach(item => {
                                this.state.posts.push({...item});
                            });
                        }
                        console.log("DATA_PRODUCT", this.state.posts)
                    }
                    this.showNoData = true;
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    // handle request
    handleRequest () {
        if (!Utils.isNull(this.userInfo)) {
            if (!this.isYour) {
                this.filter.userId = this.userInfo.id;
            }
            this.props.getProductUser(this.filter);
        }
    }

    render () {
        const {posts} = this.state;
        return (
            <PostListView
                onRef={ref => (this.postListRef = ref)}
                ListHeaderComponent={this.renderHeaderFlatList}
                contentContainerStyle={this.props.contentContainerStyle}
                scrollEventThrottle={this.props.scrollEventThrottle}
                onScroll={this.props.onScroll}
                dataPost={posts}
                showNoData={this.showNoData}
                navigation={this.props.navigation}
                viewPostType={viewPostType.SELL_PRODUCT}
                enableRefresh={this.state.enableRefresh}
                itemPerRow={2}
                refreshControl={
                    <RefreshControl
                        progressViewOffset={this.props.heightAppBar + 46}
                        refreshing={this.state.refreshing}
                        onRefresh={this.handleRefresh}
                    />
                }
                enableLoadMore={this.state.enableLoadMore}
                onLoadMore={() => {
                    this.loadMore()
                }}
                onRemoveItemPost={this.onRemoveItemPost}
                onEditItemPost={(post) => {
                    let state = this.state;
                    let index = state.posts.findIndex(item => {return post.id === item.id});
                    state.posts.splice(index, 1, post);
                    this.setState(state);
                }}
                showMenuOption={false}
            />
        )
    }

    onRemoveItemPost = (postId) => {
        let state = this.state;
        state.posts = state.posts.filter(item => {return postId != item.id});
        this.setState(state);
    }

    /**
     * Handle refresh
     */
    handleRefresh = () => {
        this.state.refreshing = true;
        this.filter.paging.page = 0;
        this.handleRequest();
    }

    /**
     * Load more
     */
    loadMore = () => {
        if (!this.props.isLoading) {
            this.state.isLoadingMore = true;
            this.filter.paging.page += 1;
            this.handleRequest();
        }
    }
}

const mapStateToProps = state => ({
    data: state.productOfUser.data,
    isLoading: state.productOfUser.isLoading,
    error: state.productOfUser.error,
    errorCode: state.productOfUser.errorCode,
    action: state.productOfUser.action
});

const mapDispatchToProps = {
    ...actions,
    ...locationActions,
    ...postActions,
    ...commonActions
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductOfUserView);