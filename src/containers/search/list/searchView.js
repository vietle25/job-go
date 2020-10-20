import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    BackHandler,
    Keyboard,
    Dimensions,
    RefreshControl,
    ScrollView,
    Animated,
    ActivityIndicator
} from 'react-native'
import styles from './styles';
import { Container, Root, Header, Content } from 'native-base';
import BaseView from 'containers/base/baseView';
import { localizes } from 'locales/i18n';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import ic_search_black from 'images/ic_search_blue.png';
import Utils from 'utils/utils';
import StringUtil from 'utils/stringUtil';
import commonStyles from 'styles/commonStyles';
import FlatListCustom from 'components/flatListCustom';
import * as userActions from 'actions/userActions';
import * as commonActions from 'actions/commonActions';
import * as jobActions from 'actions/jobActions';
import { connect } from 'react-redux';
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { ErrorCode } from "config/errorCode";
import ItemSearch from './itemSearch';
import StorageUtil from 'utils/storageUtil';
import screenType from 'enum/screenType';
import LinearGradient from "react-native-linear-gradient";
import HeaderGradient from 'containers/common/headerGradient';
import Hr from 'components/hr';
import searchType from 'enum/searchType';
import { Fonts } from 'values/fonts';
import ic_close from 'images/ic_close.png';
import ic_cancel from 'images/ic_cancel_blue.png';
import ItemJob from 'containers/job/list/itemJob';
import statusType from 'enum/statusType';
import sortType from 'enum/sortType';


const screen = Dimensions.get("window");
const PAGE_SIZE_DEFAULT = 4;

class SearchView extends BaseView {

    constructor(props) {
        super(props);
        this.state = {
            searchString: null,
            typing: false,
            typingTimeout: 0,
            enableLoadMore: false,
            enableRefresh: true,
            isLoadingMore: false,
            refreshing: false,
            searchHistories: [],
            hasResult: false,
            searching: searchType.SEARCH_ALL,
        };
        const { callback } = this.props.route.params;
        this.callBack = callback;
        this.filter = {
            searchString: null,
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            },
            categoryId: null,
            status: statusType.ACTIVE,
            orderBy: sortType.DATE_MOST_RECENT.value
        }
        this.scrollY = new Animated.Value(0);
        this.userInfo = null;
        this.indexSpliceUser = null;
        this.data = []
        this.showNoData = false
        this.searchHistories = []
    }

    componentDidMount () {
        setTimeout(() => {
            this.setState({ searchString: '' })
        }, 100);
        BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            if (!Utils.isNull(user)) {
                this.userInfo = user;
            }
        }).catch((error) => {
            this.saveException(error, 'componentDidMount searchView')
        });
        StorageUtil.retrieveItem(StorageUtil.SEARCH_HISTORY).then((searchHistory) => {
            if (!Utils.isNull(searchHistory)) {
                this.searchHistories = searchHistory
                this.setState({
                    searchHistories: searchHistory
                })
                console.log("SEARCH HISTORY: ", searchHistory);
            }
        }).catch((error) => {
            this.saveException(error, 'componentDidMount searchView')
        });
    }

    componentWillUnmount () {
        BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
        if (this.state.searchString != null && this.state.searchString.trim() != '') {
            if (this.searchHistories.indexOf(this.state.searchString) == -1) {
                this.searchHistories.push(this.state.searchString)
                StorageUtil.storeItem(StorageUtil.SEARCH_HISTORY, this.searchHistories)
            }
        }
    }

    search = () => {
        this.data = []
        if (this.state.searchString != null && this.state.searchString.trim() != "") {
            console.log("search filter", this.filter);
            this.props.searchJob(this.filter)
        } else {

        }
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
        let data = this.props.data
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                this.state.isLoadingMore = false;
                this.state.refreshing = false;
                if (this.props.action == getActionSuccess(ActionEvent.SEARCH_JOB)) {
                    if (this.state.searchString == null || this.state.searchString.trim() == '') {
                        this.data = []
                        this.state.enableLoadMore = false
                        this.showNoData = true;
                    } else {
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
                    }
                }
            }
            else {
                this.handleError(this.props.errorCode, this.props.error)
            }
        }
    }

    /**
     * Load more
     */
    loadMore = async () => {
        if (this.data.length % Constants.PAGE_SIZE == 0 && this.state.enableLoadMore) {
            this.state.isLoadingMore = true;
            this.filter.paging.page = Math.round(this.data.length / Constants.PAGE_SIZE)
            this.search();
        }
    }


    render () {
        const { searchString, enableLoadMore } = this.state;
        console.log("render search view: ", this.data);
        return (
            <Container style={styles.container}>
                <Root>
                    <HeaderGradient
                        onBack={this.onBack}
                        title={""}
                        visibleSearchBar={true}
                        iconRightSearch={ic_cancel}
                        onPressRightSearch={() => {
                            this.data = []
                            this.setState({
                                searchString: null
                            })
                            if (this.state.searchString != null && this.state.searchString.trim() != '') {
                                if (this.searchHistories.indexOf(searchString) == -1) {
                                    this.searchHistories.push(searchString)
                                    StorageUtil.storeItem(StorageUtil.SEARCH_HISTORY, this.searchHistories)
                                }
                            }
                        }}
                        placeholder={localizes("search")}
                        searchString={this.state.searchString}
                        onRef={(ref) => { this.inputSearchRef = ref }}
                        autoFocus={true}
                        onChangeTextInput={this.onChangeTextInput}
                        onSubmitEditing={this.onSubmitEditing}
                        elevation={!StringUtil.isNullOrEmpty(searchString) ? 0 : Constants.ELEVATION}
                    />
                    {/* {!this.state.hasResult && Utils.isNull(searchString)
                        ? null : <View style={styles.listOption}>
                            <FlatListCustom
                                contentContainerStyle={{
                                    backgroundColor: Colors.COLOR_WHITE,
                                    paddingHorizontal: Constants.PADDING_LARGE
                                }}
                                keyExtractor={(item) => item.id}
                                horizontal={true}
                                data={this.dataSearches}
                                renderItem={this.renderItemListSearch}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    } */}
                    {/* <ScrollView
                        keyboardShouldPersistTaps='always'
                        scrollEnabled={true}
                        enableRefresh={this.state.enableRefresh}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                        contentContainerStyle={{
                            flexGrow: 1
                        }}
                        onScroll={Animated.event(
                            [{
                                nativeEvent: { contentOffset: { y: this.scrollY } }
                            }],
                            {
                                listener: (event) => {
                                    if (enableLoadMore && this.isCloseToBottom(event.nativeEvent)) {
                                        !this.props.isLoading && this.loadMore();
                                    }
                                }
                            },
                            { useNativeDriver: true }
                        )}
                        showsVerticalScrollIndicator={false}> */}
                    <View style={{ flex: 1, backgroundColor: Colors.COLOR_WHITE }}>
                        {this.data.length == 0 && (searchString == null || searchString == '')
                            ? this.renderHistory()
                            : this.renderSearchResult()
                        }
                    </View>
                    {/* {!this.state.hasResult
                        && !Utils.isNull(searchString)
                        && this.showNoData
                        && !this.props.isLoading
                        && <View style={[commonStyles.viewCenter, { flex: 1 }]}>
                            <Text style={[commonStyles.text, { fontSize: Fonts.FONT_SIZE_MEDIUM }]}>
                                {localizes("noData")}
                            </Text>
                        </View>
                    } */}
                    {/* </ScrollView> */}
                    {this.state.isLoadingMore || this.state.refreshing ? null : this.showLoadingBar(this.props.isLoading)}
                </Root>
            </Container>
        )
    }

    //onRefreshing
    handleRefresh = () => {
        this.state.refreshing = true;
        this.filter.paging.page = 0;
        this.search();
    }

    /**
     * Render history
     */
    renderHistory = () => {
        const { searchString, searchHistories } = this.state;
        return (
            <View>
                <FlatListCustom
                    ListHeaderComponent={this.searchHistories.length == 0 ? undefined : this.renderHeaderHistory}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{
                        marginTop: 2,
                        backgroundColor: Colors.COLOR_WHITE
                    }}
                    keyExtractor={(item) => item.id}
                    horizontal={false}
                    data={this.searchHistories}
                    renderItem={this.renderItem}
                    showsVerticalScrollIndicator={false}
                />
                {
                    Utils.isNull(searchString) && Utils.isNull(searchHistories)
                        ? <View style={[commonStyles.viewCenter, { marginTop: Constants.MARGIN_XX_LARGE * 5 }]}>
                            <Text style={commonStyles.text}>
                                {localizes("searchView.noDataSearched")}
                            </Text>
                        </View>
                        : null
                }
            </View>
        )
    }

    renderHeaderHistory = () => {
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: Constants.MARGIN_X_LARGE,
                marginVertical: Constants.MARGIN_LARGE
            }}>
                <Text >Lịch sử tìm kiếm</Text>
                {this.searchHistories.length > 0 ?
                    <TouchableOpacity
                        onPress={() => {
                            StorageUtil.deleteItem(StorageUtil.SEARCH_HISTORY);
                            this.searchHistories = []
                            this.setState({
                                searchHistories: []
                            })
                        }}
                        style={{

                        }}>
                        <Text>Xóa lịch sử</Text>
                    </TouchableOpacity>
                    : null}
            </View>
        )
    }

    /**
     * Render section search result
     */
    renderSearchResult = () => {
        return (
            <View style={{ marginTop: 0 }}>
                <FlatListCustom
                    contentContainerStyle={{
                        paddingVertical: Constants.PADDING_LARGE,
                        // backgroundColor: Colors.COLOR_WHITE
                    }}
                    keyExtractor={(item) => item.id}
                    horizontal={false}
                    data={this.data}
                    itemPerCol={1}
                    renderItem={this.renderItemResult}
                    enableLoadMore={this.state.enableLoadMore}
                    enableRefresh={this.state.enableRefresh}
                    keyExtractor={item => item.code}
                    onLoadMore={() => {
                        this.loadMore()
                    }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            progressViewOffset={Constants.HEIGHT_HEADER_OFFSET_REFRESH}
                            refreshing={this.state.refreshing}
                            onRefresh={this.handleRefresh}
                        />
                    }
                    isShowEmpty={!this.props.isLoading && this.showNoData && this.state.searchString != null}
                    isShowImageEmpty={false}
                    textForEmpty={"Không có kết quả tìm kiếm phù hợp"}
                    styleTextEmpty={{
                        marginTop: Constants.MAX_HEIGHT / 2 - 56
                    }}
                />
            </View>
        )
    }

    renderItem = (item, index, parentIndex, indexInParent) => {
        if (item != "" && item != null) {
            return (
                <View style={{ marginVertical: Constants.MARGIN }}>
                    <TouchableOpacity
                        onPress={() => {

                            this.setState({
                                searchString: item
                            }, () => {
                                this.filter.searchString = item;
                                this.search()
                            })
                        }}
                        style={{
                            backgroundColor: Colors.COLOR_WHITE, paddingHorizontal: Constants.PADDING_X_LARGE, paddingVertical: Constants.PADDING
                        }}>
                        <Text style={[commonStyles.text]}>{item}</Text>
                    </TouchableOpacity>
                    <Hr />
                </View>
            )
        }
    }

    /**
     * Render item list search
     */
    renderItemListSearch = (item, index, parentIndex, indexInParent) => {
        return (
            <TouchableOpacity
                style={[styles.itemList, {
                    backgroundColor: this.state.searching == item.id ? Colors.COLOR_PRIMARY : Colors.COLOR_BACKGROUND
                }]}
                activeOpacity={Constants.ACTIVE_OPACITY}
                onPress={() => this.handleSearch(item.id)}>
                <Text style={[commonStyles.textBold, {
                    color: this.state.searching == item.id ? Colors.COLOR_WHITE : Colors.COLOR_TEXT
                }]}>{item.name}</Text>
            </TouchableOpacity>
        )
    }


    renderItemResult = (item, index, parentIndex, indexInParent) => {
        return (
            <ItemJob
                key={index}
                item={item}
                index={index}
                resourceUrlPathResize={this.resourceUrlPathResize}
                onPress={this.onPressItem}
            />
        );
    }

    onPressItem = (item) => {
        this.props.navigation.navigate("JobDetail", { id: item.id, callBack: this.handleRefresh })
    }

    /**
     * Manager text input search
     * @param {*} searchString
     */
    onChangeTextInput = (searchString) => {
        const self = this;
        if (self.state.typingTimeout) {
            clearTimeout(self.state.typingTimeout);
        }
        if (searchString != null && searchString.trim() != '') {
            self.setState({
                searchString: searchString,
                typing: false,
                typingTimeout: setTimeout(() => {
                    this.filter.searchString = searchString;
                    this.filter.paging.page = 0;
                    this.search()
                }, 1000),
            });
        } else {
            setTimeout(() => {
                this.data = []
                this.setState({ searchString: null, hasResult: false });
            }, 300)
        }
    }

    /**
     * On submit editing
     */
    onSubmitEditing = (index) => {
        const { searchString, searchHistories } = this.state
        if (!StringUtil.isNullOrEmpty(searchString)) {
            if (this.searchHistories.indexOf(searchString) == -1) {
                this.searchHistories.push(searchString)
                StorageUtil.storeItem(StorageUtil.SEARCH_HISTORY, this.searchHistories)
            }
            Keyboard.dismiss()
            // if (index != 0 && index != 1) {
            //     this.filter.paging.page = 0;
            //     this.filter.searchString = searchString;
            //     this.search();
            // }
            // searchHistories.forEach((item, index) => {
            //     if (item.name === searchString) {
            //         searchHistories.splice(index, 1)
            //     }
            // })
            // if (searchHistories.length < 10) {
            //     searchHistories.splice(0, 0, { name: searchString })
            // } else {
            //     searchHistories.splice(0, 0, { name: searchString })
            //     searchHistories.splice(-1, 1)
            // }
            // StorageUtil.storeItem(StorageUtil.PRODUCT_SEARCH_HISTORY, searchHistories)
        }
    }

    /**
     * Delete search history
     */
    deleteSearchHistory () {
        StorageUtil.deleteItem(StorageUtil.PRODUCT_SEARCH_HISTORY)
        this.setState({
            searchHistories: []
        })
    }

    // Reset data
    resetData () {
        this.data = [];
    }

}

const mapStateToProps = state => ({
    data: state.search.data,
    isLoading: state.search.isLoading,
    error: state.search.error,
    errorCode: state.search.errorCode,
    action: state.search.action
});

const mapDispatchToProps = {
    ...userActions,
    ...commonActions,
    ...jobActions
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchView);
