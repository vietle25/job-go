import React, { Component } from 'react'
import { View, Text, RefreshControl, BackHandler } from 'react-native'
import { suppressDeprecationWarnings } from 'components/moment'
import BaseView from 'containers/base/baseView'
import { Constants } from 'values/constants'
import { Container, Root } from 'native-base'
import HeaderGradient from 'containers/common/headerGradient'
import FlatListCustom from 'components/flatListCustom'
import * as actions from 'actions/userActions';
import * as commonActions from 'actions/commonActions';
import * as blogActions from 'actions/blogActions';
import { ErrorCode } from "config/errorCode";
import { getActionSuccess, ActionEvent } from "actions/actionEvent";
import { connect } from "react-redux";
import ItemBlog from './itemBlog';
import { Colors } from 'values/colors'
import StorageUtil from 'utils/storageUtil'

class BlogView extends BaseView {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            stringSearch: null,
            enableLoadMore: false,
            enableRefresh: true,
            typing: false,
            typingTimeout: 0,
            user: null
        };
        this.data = [
            // { id: 1, title: "React-native development with new ES6", pathToResource: "https://nordiccoder.com/app/uploads/2018/10/react-native.png", content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum", createdAt: "2020-06-28 17:24:57.557000 +00:00" },
            // { id: 1, title: "React-native development with new ES6", pathToResource: "https://nordiccoder.com/app/uploads/2018/10/react-native.png", content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum", createdAt: "2020-06-28 17:24:57.557000 +00:00" },
            // { id: 1, title: "React-native development with new ES6", pathToResource: "https://nordiccoder.com/app/uploads/2018/10/react-native.png", content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum", createdAt: "2020-06-28 17:24:57.557000 +00:00" },
        ];
        this.filter = {
            paging: {
                page: 0,
                pageSize: Constants.PAGE_SIZE
            },
            stringSearch: null
        }
    }

    componentDidMount () {
        this.getProfile();
        this.getBlogs()
    }

    getBlogs = () => {
        this.props.getBlogs(this.filter)
    }
    /**
     * Receive prop from advisory or redux
     */
    componentWillReceiveProps = nextProps => {
        if (nextProps != this.props) {
            this.props = nextProps;
            this.handleData();
        }
    };

    /**
     * Handle data when request
     */
    handleData () {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_BLOGS)) {
                    if (data != null) {
                        if (data.data.length > 0) {
                            this.state.enableLoadMore = !(data.data.length < Constants.PAGE_SIZE)
                            data.data.forEach(element => {
                                this.data.push({ ...element })
                            });
                            this.showNoData = false
                        } else {
                            this.state.enableLoadMore = false
                            this.showNoData = true;
                        }
                    } else {
                        this.state.enableLoadMore = false
                        this.showNoData = true;
                    }
                }
                this.state.refreshing = false;
                this.state.isLoadingMore = false;
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    /**
     * Get more notification
     */
    getMore = () => {
        if (this.data.length % Constants.PAGE_SIZE == 0 && this.state.enableLoadMore) {
            this.state.isLoadingMore = true;
            this.filter.paging.page = Math.round(this.data.length / Constants.PAGE_SIZE)
            this.getBlogs();
        }
    }

    componentWillUnmount () {

    }

    /**
     * Refresh
     */
    handleRefresh = () => {
        this.state.enableLoadMore = false
        this.data = [];
        this.state.refreshing = true
        this.filter.paging.page = 0;
        this.filter.stringSearch = null;
        this.getBlogs()
    };

    /**
 * Get profile user
 */
    getProfile () {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE)
            .then(user => {
                if (!Utils.isNull(user)) {
                    this.userInfo = user;
                    this.props.getUserProfile(user.id);
                    this.handleGetProfile(user);
                }
            })
            .catch(error => {
                this.saveException(error, "getProfile");
            });
    }

    renderItem = (item, index, parentIndex, indexInParent) => {
        return (
            <ItemBlog
                key={index}
                item={item}
                index={index}
                onPress={this.onPressItem}
            />
        );
    }

    onPressItem = (item) => {
        this.props.navigation.navigate("BlogDetail", { id: item.id })
    }

    render () {
        return (
            <Container style={styles.container}>
                <HeaderGradient
                    onBack={this.onBack}
                    visibleBack={this.state.isSearch ? false : true}
                    title={'Blog'}
                    renderRightMenu={this.renderRightMenu}
                // visibleSearchBar={this.state.isSearch}
                // placeholder={"Tìm kiếm..."}
                // iconLeftSearch={ic_search_blue}
                // inputSearch={this.state.stringSearch}
                // onRef={ref => {
                //     this.inputSearchRef = ref;
                // }}
                // onChangeTextInput={
                //     stringSearch => {
                //         const self = this;
                //         if (self.state.typingTimeout) {
                //             clearTimeout(self.state.typingTimeout)
                //         }
                //         self.setState({
                //             stringSearch: stringSearch,
                //             typing: false,
                //             typingTimeout: setTimeout(() => {
                //                 this.onSearch(stringSearch)
                //             }, 1000)
                //         });
                //     }
                // }
                // onPressLeftSearch={() => (!Utils.isNull(this.state.stringSearch) ? this.onSearch() : this.inputSearchRef.focus())}
                // onSubmitEditing={() => Keyboard.dismiss()}
                // visibleIconRight={ic_search_blue}
                // onPressIconRight={() => {
                //     this.setState({
                //         isSearch: !this.state.isSearch
                //     })
                // }}
                />
                <FlatListCustom
                    onRef={(ref) => { this.flatListRef = ref }}
                    contentContainerStyle={{
                    }}
                    ListHeaderComponent={this.renderFilter}
                    style={{
                        backgroundColor: Colors.COLOR_WHITE,
                    }}
                    data={this.data}
                    renderItem={this.renderItem}
                    enableLoadMore={this.state.enableLoadMore}
                    enableRefresh={this.state.enableRefresh}
                    keyExtractor={item => item.code}
                    onLoadMore={() => {
                        this.getMore()
                    }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            progressViewOffset={Constants.HEIGHT_HEADER_OFFSET_REFRESH}
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh}
                        />
                    }
                    isShowEmpty={!this.props.isLoading && this.data.length == 0}
                    isShowImageEmpty={false}
                    textForEmpty={"Không có dữ liệu"}
                    styleEmpty={{
                        marginTop: -50
                    }}
                />
                {this.state.refreshing || this.state.isLoadingMore ? null : this.showLoadingBar(this.props.isLoading)}
            </Container>
        )
    }
}

const mapStateToProps = (state) => ({
    data: state.blog.data,
    isLoading: state.blog.isLoading,
    errorCode: state.blog.errorCode,
    action: state.blog.action
})

const mapDispatchToProps = {
    ...commonActions,
    ...actions,
    ...blogActions,
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogView)
