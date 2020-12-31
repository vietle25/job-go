import React, { Component } from 'react';
import {
    View,
    Text,
    RefreshControl,
    Dimensions
} from 'react-native';
import BaseView from 'containers/base/baseView';
import PostListView from 'containers/post/postListView';
import ChoosePost from 'containers/post/choosePost';
import viewPostType from 'enum/viewPostType';
import * as actions from 'actions/userActions';
import * as postActions from 'actions/postActions';
import * as commonActions from 'actions/commonActions';
import * as productActions from 'actions/productActions';
import { connect } from 'react-redux';
import StorageUtil from 'utils/storageUtil';
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { ErrorCode } from "config/errorCode";
import { Constants } from 'values/constants';
import Utils from 'utils/utils';
import choosePostType from 'enum/choosePostType';
import { Colors } from 'values/colors';
import postType from 'enum/postType';
import commonStyles from 'styles/commonStyles';

const window = Dimensions.get("window");

class PostOfUserView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            enableLoadMore: false,
            enableRefresh: true,
            isLoadingMore: false,
            refreshing: false,
            posts: []
        };
        this.filter = {
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            },
            viewPostType: viewPostType.NORMAL_POST,
            userId: null
        };
        this.showNoData = false;
        this.isYour = this.props.isYour;
        this.userInfo = this.props.userInfo;
    }

    componentDidMount() {
        this.getSourceUrlPath();
        this.props.resetAction();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData()
        }
    }

    /**
     * Handle data when request
     */
    handleData() {
        let data = this.props.data;
        this.isYour = this.props.isYour;
        this.userInfo = this.props.userInfo;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_POSTS_OF_USER)) {
                    this.state.refreshing = false;
                    this.state.isLoadingMore = false;
                    if (!Utils.isNull(data)) {
                        if (data.paging.page == 0) {
                            this.state.posts = [];
                        }
                        this.state.enableLoadMore = !(data.data.length < Constants.PAGE_SIZE)
                        if (data.data.length > 0) {
                            data.data.forEach(item => {
                                this.state.posts.push({ ...item });
                            });
                        }
                        console.log("DATA_POST_OF_USER", this.state.posts)
                        this.showNoData = true;
                    }
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    render() {
        const { posts } = this.state;
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
                viewPostType={viewPostType.NEWS}
                enableRefresh={this.state.enableRefresh}
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
                    let index = state.posts.findIndex(item => { return post.id === item.id });
                    state.posts.splice(index, 1, post);
                    this.setState(state);
                }}
                showMenuOption={false}
            />
        );
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

    /**
     * Handle refresh
     */
    handleRefresh = () => {
        this.state.refreshing = true;
        this.filter.paging.page = 0;
        this.handleRequest();
    }

    onRemoveItemPost = (postId) => {
        let state = this.state;
        state.posts = state.posts.filter(item => { return postId != item.id });
        this.setState(state);
    }

    // handle request
    handleRequest = () => {
        if (!Utils.isNull(this.userInfo)) {
            if (!this.isYour) {
                this.filter.userId = this.userInfo.id;
            }
            this.props.getPostsOfUser(this.filter);
        }
    }

    /**
     * Render header flat list
     */
    renderHeaderFlatList = () => {
        let newAvatar = !Utils.isNull(this.userInfo)
            ? this.userInfo.avatarPath : null;
        return (
            <View>
                {this.isYour
                    && <ChoosePost
                        avatar={newAvatar}
                        onPressPost={this.onPressPost}
                    />
                }
            </View>
        )
    }

    /**
     * OnPress post
     */
    onPressPost = (type) => {
        switch (type) {
            case choosePostType.NORMAL:
                this.gotoPost();
                break;
            case choosePostType.IMAGE:
                this.showCameraRollView({
                    assetType: "Photos",
                    callback: this.gotoPost,
                    maximum: 10
                })
                break;
            case choosePostType.VIDEO:
                this.showCameraRollView({
                    assetType: "Videos",
                    selectSingleItem: true,
                    callback: this.gotoPost
                });
                break;
            default:
                break;
        }
    }

    /**
     * Go to post
     */
    gotoPost = (resources = []) => {
        this.props.navigation.navigate("Post", {
            resources: resources,
            callback: (post) => {
                // let state = this.state;
                // state.posts.unshift(post);
                // console.log('UPLOAD DUOC ROI NE', state.posts)
                // this.setState(state);
                this.handleRefresh();
            },
            viewPostType: viewPostType.NORMAL_POST,
        });
    }
}

const mapStateToProps = state => ({
    data: state.postOfUser.data,
    isLoading: state.postOfUser.isLoading,
    error: state.postOfUser.error,
    errorCode: state.postOfUser.errorCode,
    action: state.postOfUser.action
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions,
    ...productActions,
    ...postActions
};

export default connect(mapStateToProps, mapDispatchToProps)(PostOfUserView);
