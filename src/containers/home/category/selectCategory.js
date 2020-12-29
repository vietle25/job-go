import React, { Component } from 'react';
import { View, Text, Image, Form, TouchableOpacity, RefreshControl, ImageBackground, Keyboard, BackHandler } from 'react-native';
import styles from '../styles';
import { Container, Root, Header, Content } from 'native-base';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import { localizes } from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import ic_logo_large from "images/ic_logo_splash.png";
import commonStyles from 'styles/commonStyles';
import { Fonts } from 'values/fonts';
import FlatListCustom from 'components/flatListCustom';
import ItemCategory from './itemCategory';
import * as actions from 'actions/categoryActions';
import { connect } from 'react-redux';
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { ErrorCode } from "config/errorCode";
import Utils from 'utils/utils';
import categoryType from 'enum/categoryType';
import ic_search_blue from "images/ic_search_blue.png";
import ic_close_blue from "images/ic_close.png";
import ic_back_blue from "images/ic_back_blue.png";
import HeaderGradient from 'containers/common/headerGradient';
import screenType from 'enum/screenType';

class SelectCategory extends BaseView {
    constructor(props) {
        super(props);
        this.itemAll = {
            id: null,
            name: "Tất cả"
        }
        this.state = {
            refreshing: false,
            enableRefresh: true,
            enableLoadMore: false,
            stringSearch: null,
            typing: false,
            typingTimeout: 0,
            isSearch: false
        };
        const { callBack, type, current, screenType } = this.props.route.params;
        this.data = [];
        this.onItemSelected = this.onItemSelected.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.callBack = callBack;
        this.current = current;
        this.showNoData = false;
        this.screenType = screenType
        this.filter = {
            nameSearch: null,
            paging: {
                pageSize: Constants.PAGE_SIZE * 10,
                page: 0
            },
            status: 1
        };
        this.listCategory = current != null ? current : []
        this.itemSelected = this.itemAll
    }

    componentDidMount () {
        BackHandler.addEventListener('hardwareBackPress', this.handlerBackButton);
        this.handleRequest()
    }

    handleRequest = () => {
        this.props.getCategoriesAddJobView(this.filter)
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData()
        }
    }

    // Confirm choose 
    confirmChoosePartner = (data) => {
        if (this.callBack) {
            this.callBack(data);
            this.onBack();
        }
    }

    /**
     * Handler back button
     */
    handlerBackButton () {
        console.log(this.className, 'back pressed')
        if (this.props.navigation && this.callBack) {
            this.onBack();
        }
        return true;
    }

    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.handlerBackButton);
    }


    /**
    * On back
    */
    onBack () {
        if (this.props.navigation.goBack) {
            if (this.callBack) {
                if (this.screenType == screenType.FROM_HOME_VIEW) {
                    this.callBack(this.itemSelected)
                } else {
                    this.callBack(this.listCategory);
                }
            }
            setTimeout(() => {
                console.log("");

                this.props.navigation.goBack()
            })
        }
    }

    /** 
     * Handle data when request
     */
    handleData () {
        let data = this.props.data
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_CATEGORIES_ADD_JOB_VIEW)) {
                    console.log("GET CATEGORY IN ADD JOB VIEW: ", data);
                    this.data = [];
                    if (data.data.length > 0) {
                        if (this.screenType == screenType.FROM_HOME_VIEW) {
                            this.data.push({ ...this.itemAll })
                        }
                        data.data.forEach((item, index) => {
                            this.data.push({ ...item })
                        })
                        this.showNoData = false
                    }
                    else {
                        this.showNoData = true
                    }
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    render () {
        const { } = this.state;
        return (
            <Container style={styles.container}>
                <Root>
                    <HeaderGradient
                        onBack={this.onBack}
                        visibleBack={this.state.isSearch ? false : true}
                        title={this.state.isSearch ? '' : "Chọn danh mục"}
                        visibleSearchBar={this.state.isSearch}
                        placeholder={"Tìm kiếm..."}
                        iconLeftSearch={ic_search_blue}
                        inputSearch={this.state.stringSearch}
                        onRef={ref => {
                            this.inputSearchRef = ref;
                        }}
                        onChangeTextInput={
                            stringSearch => {
                                const self = this;
                                if (self.state.typingTimeout) {
                                    clearTimeout(self.state.typingTimeout)
                                }
                                self.setState({
                                    stringSearch: stringSearch,
                                    typing: false,
                                    typingTimeout: setTimeout(() => {
                                        this.onSearch(stringSearch)
                                    }, 1000)
                                });
                            }
                        }
                        iconLeftSearch={ic_search_blue}
                        onPressLeftSearch={() => (!Utils.isNull(this.state.stringSearch) ? this.onSearch() : this.inputSearchRef.focus())}
                        onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    <Content
                        refreshControl={
                            <RefreshControl
                                progressViewOffset={Constants.HEIGHT_HEADER_OFFSET_REFRESH}
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                        contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.COLOR_WHITE }}
                        style={{ flex: 1 }}>
                        {this.renderList()}
                        {this.screenType == screenType.FROM_HOME_VIEW ? null : this.renderChoosedCategories()}
                    </Content>
                    {this.showLoadingBar(this.props.isLoading)}
                </Root>
            </Container>
        );
    }


    /**
     * on toggle search
     */
    onToggleSearch () {
        if (!Utils.isNull(this.state.stringSearch)) {
            this.setState({
                stringSearch: ""
            })
        }
        this.setState({
            isSearch: !this.state.isSearch
        }, () => {
            if (this.state.isSearch && this.inputSearchRef) {
                this.inputSearchRef.focus()
            }
        })
    }

    /**
     * On search
     * @param {} text 
     */
    onSearch (text) {
        this.filterSubject.stringSearch = text
        if (!Utils.isNull(text)) {
            this.props.isLoading = true
            this.data = []
            this.handleRequest()
        } else {
            this.handleRefresh()
        }
    }

    /**
     * renderRightHeader
     */
    renderRightHeader = () => {
        return (
            <View>
                {this.state.isSearch ?
                    <TouchableOpacity
                        style={{ padding: Constants.PADDING_LARGE }}
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        onPress={() => {
                            this.state.stringSearch = null
                            this.onToggleSearch()
                            this.handleRefresh()
                        }}
                    >
                        <Image
                            style={{ resizeMode: 'contain' }}
                            source={ic_close_red} />
                    </TouchableOpacity>
                    :

                    <TouchableOpacity
                        style={{ padding: Constants.PADDING_LARGE }}
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        onPress={() => {
                            this.onToggleSearch()

                        }}
                    >
                        <Image
                            style={{ resizeMode: 'contain' }}
                            source={ic_search_blue} />
                    </TouchableOpacity>
                }
            </View>
        )
    }

    /**
     * Render list 
     */
    renderList () {
        return (
            <View style={{ flex: 1 }}>
                <FlatListCustom
                    style={{
                        paddingVertical: Constants.PADDING_LARGE
                    }}
                    horizontal={false}
                    data={this.data}
                    itemPerCol={1}
                    renderItem={this.renderItem.bind(this)}
                    showsHorizontalScrollIndicator={false}
                    isShowEmpty={this.showNoData}
                    isShowImageEmpty={true}
                    textForEmpty={"Không có dữ liệu"}
                    styleEmpty={{}}
                />
            </View>

        )
    }

    renderChoosedCategories () {
        if (this.listCategory.length > 0) {
            return (
                <View style={{
                    position: 'absolute',
                    bottom: 0, left: 0, width: "100%"
                }}>
                    <FlatListCustom
                        style={{
                            marginTop: Constants.MARGIN_X_LARGE,
                            backgroundColor: Colors.COLOR_WHITE,
                            paddingHorizontal: Constants.PADDING_LARGE,
                            paddingVertical: Constants.PADDING_X_LARGE
                        }}
                        // itemPerRow={3}
                        keyExtractor={(item) => item.id}
                        horizontal={true}
                        data={this.listCategory}
                        renderItem={this.renderItemCategory}
                        showsVerticalScrollIndicator={false}
                    />
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.COLOR_PRIMARY, width: "100%", padding: Constants.PADDING_X_LARGE,
                            justifyContent: 'center', alignItems: 'center'
                        }}
                        onPress={() => {
                            this.onBack()
                        }}>
                        <Text style={[commonStyles.text, { color: Colors.COLOR_WHITE }]}>Hoàn thành</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }


    /**
 * Render item category
 */
    renderItemCategory = (item, index, parentIndex, indexInParent) => {
        let length = this.listCategory.length
        return (
            <View style={{
                flexDirection: 'row',
                padding: Constants.PADDING_LARGE,
                borderRadius: Constants.CORNER_RADIUS,
                backgroundColor: Colors.COLOR_BACKGROUND, marginHorizontal: Constants.MARGIN_X_LARGE
            }}>
                <Text style={[commonStyles.text, { flex: 1 }]} >{item.name}</Text>
                <TouchableOpacity
                    style={{ justifyContent: 'center' }}
                    onPress={() => {
                        this.listCategory.splice(index, 1)
                        this.setState({
                            ok: true
                        })
                    }}
                    activeOpacity={Constants.ACTIVE_OPACITY}>
                    <Image source={ic_close_blue} style={{ width: 18, height: 18, marginLeft: Constants.MARGIN_LARGE }} />
                </TouchableOpacity>
            </View>
        );
    }

    //onRefreshing
    handleRefresh () {
        this.state.refreshing = false
        this.state.selected = 0
        this.filter.nameSearch = null
        this.state.stringSearch = null
        this.data = []
        this.handleRequest()
    }

    /**
     * Render item
     * @param {*} onItemSelected
     * @param {*} item 
     * @param {*} index 
     * @param {*} parentIndex  
     * @param {*} indexInParent 
     */
    renderItem (item, index, parentIndex, indexInParent) {
        const { selected } = this.state
        return (
            <ItemCategory
                key={index.toString()}
                data={this.data}
                item={item}
                index={index}
                current={this.listCategory}
                onItemSelected={this.onItemSelected}
            // selected={this.partnerCurrent}
            />
        );
    }

    /**
     * On itemSelected
     */
    onItemSelected (item, index, isChoose) {
        if (this.screenType == screenType.FROM_HOME_VIEW) {
            let itemSelect = {
                id: item.id,
                name: item.name
            }
            this.itemSelected = itemSelect
            this.onBack()
        } else {
            if (isChoose) {
                this.listCategory.push({ ...item })
            } else {
                this.listCategory.forEach((element, indexSplice) => {
                    if (element.id == item.id) {
                        this.listCategory.splice(indexSplice, 1);
                        this.setState({
                            ok: true
                        })
                        return;
                        // break;
                    }
                })
            }
            this.setState({
                ok: true
            })
        }
    }

}

const mapStateToProps = state => ({
    data: state.job.data,
    isLoading: state.job.isLoading,
    error: state.job.error,
    errorCode: state.job.errorCode,
    action: state.job.action
});

const mapDispatchToProps = {
    ...actions
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectCategory);
