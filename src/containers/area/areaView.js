import React, { Component } from 'react';
import { View, Text, Image, Form, TouchableOpacity, RefreshControl, ImageBackground, Keyboard, BackHandler } from 'react-native';
import styles from './styles';
import { Container, Root, Header, Content } from 'native-base';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import { localizes } from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import ic_logo_large from "images/ic_logo_splash.png";
import commonStyles from 'styles/commonStyles';
import { Fonts } from 'values/fonts';
import FlatListCustom from 'components/flatListCustom';
import ItemAre from './itemArea';
import * as actions from 'actions/commonActions';
import { connect } from 'react-redux';
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { ErrorCode } from "config/errorCode";
import Utils from 'utils/utils';
import categoryType from 'enum/categoryType';
import ic_search_blue from "images/ic_search_blue.png";
import ic_close_blue from "images/ic_close.png";
import ic_back_blue from "images/ic_back_blue.png";
import HeaderGradient from 'containers/common/headerGradient';
import ScreenType from 'enum/screenType';
import areaType from 'enum/areaType';

class AreaView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            enableRefresh: true,
            enableLoadMore: false,
            stringSearch: null,
            typing: false,
            typingTimeout: 0,
            isSearch: false
        };
        const { callBack, type, current, screenType, parentAreaId, parentAreaName } = this.props.route.params;
        this.data = [];
        this.callBack = callBack;
        this.current = current;
        this.showNoData = false;
        this.screenType = screenType;
        this.type = type;
        this.itemAll = {
            id: null,
            name: type == areaType.DISTRICT ? "Tất cả" : "Toàn quốc"
        }
        this.parentAreaId = parentAreaId;
        this.parentAreaName = parentAreaName;
        this.filter = {
            parentAreaId: null,
            type: type,
            paramSearch: this.state.stringSearch,
            parentAreaId: parentAreaId
        };
        this.itemSelected = this.current && type == areaType.PROVINCE ? {
            id: this.current.province.id,
            name: this.current.province.name
        } : this.itemAll
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handlerBackButton);
        this.handleRequest()
    }

    handleRequest = () => {
        this.props.getArea(this.filter)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData()
        }
    }

    // Confirm choose 
    confirmChoose = (data) => {
        if (this.callBack) {
            this.callBack(data);
        }
        this.callBack(this.itemSelected)
    }

    /**
     * Handler back button
     */
    handlerBackButton() {
        console.log(this.className, 'back pressed')
        if (this.props.navigation && this.callBack) {
            console.log("ON BACK JOB LIST: ", this.screenType);
            this.onBack()
        }
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handlerBackButton);
    }


    /**
    * On back
    */
    onBack() {
        if (this.props.navigation.goBack) {
            if (this.callBack) {
                console.log("CALL BACK", this.itemSelected);
                if (this.screenType == ScreenType.FROM_JOB_VIEW) {
                    this.onBackInJobList();
                } else {
                    this.callBack(this.itemSelected)
                    setTimeout(() => {
                        this.props.navigation.goBack()
                    })
                }
            }
        }
    }

    /** 
     * Handle data when request
     */
    handleData() {
        let data = this.props.data
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                this.state.refreshing = false
                if (this.props.action == getActionSuccess(ActionEvent.GET_AREA)) {
                    this.data = [];
                    if (this.screenType == ScreenType.FROM_JOB_VIEW) {
                        this.data.push({ ...this.itemAll })
                    }
                    if (data.data && data.data.length > 0) {
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

    getTitle = () => {
        if (this.type == areaType.PROVINCE) {
            return "Chọn tỉnh thành";
        } else if (this.type == areaType.DISTRICT) {
            return "Chọn quận huyện";
        }
    }

    render() {
        const { } = this.state;
        return (
            <Container style={styles.container}>
                <Root>
                    <HeaderGradient
                        onBack={this.onBack}
                        visibleBack={this.state.isSearch ? false : true}
                        title={this.state.isSearch ? '' : this.getTitle()}
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
                    </Content>
                    {this.showLoadingBar(this.props.isLoading)}
                </Root>
            </Container>
        );
    }


    /**
     * on toggle search
     */
    onToggleSearch() {
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
    onSearch(text) {
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
    renderList() {
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


    /**
 * Render item category
 */
    renderItemCategory = (item, index, parentIndex, indexInParent) => {
        return (
            <View style={{ flexDirection: 'row', paddingHorizontal: Constants.PADDING_LARGE, backgroundColor: Colors.COLOR_BACKGROUND, marginHorizontal: Constants.MARGIN_X_LARGE }}>
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
    handleRefresh = () => {
        this.filter.paramSearch = null
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
    renderItem(item, index, parentIndex, indexInParent) {
        const { selected } = this.state
        return (
            <ItemAre
                key={index.toString()}
                length={this.data.length}
                item={item}
                index={index}
                current={this.current}
                onPress={this.onItemSelected}
            />
        );
    }

    /**
     * On itemSelected
     */
    onItemSelected = (item, index, isChoose) => {
        this.itemSelected = item;
        if (this.screenType == ScreenType.FROM_JOB_VIEW) {
            if (item.id != null && this.parentAreaId == null) {
                this.props.navigation.push("Area", { type: areaType.DISTRICT, callBack: this.callBack, screenType: this.screenType, current: this.current, parentAreaId: item.id, parentAreaName: item.name })
            } else {
                this.onBackInJobList()
            }
        } else {
            if (this.callBack) {
                this.onBack()
            }
            this.setState({
                ok: true
            })
        }
    }


    /**
    * On back
    */
    onBackInJobList() {
        if (this.props.navigation.goBack) {
            if (this.callBack) {
                console.log("this.itemSelected", this.itemSelected)
                if (this.type == areaType.PROVINCE) {
                    this.callBack(this.itemSelected, {
                        id: null,
                        name: "Tất cả"
                    });
                } else {
                    let province = {
                        id: this.parentAreaId,
                        name: this.parentAreaName
                    }
                    this.callBack(province, this.itemSelected);
                }
            }
            setTimeout(() => {
                this.props.navigation.pop(2)
            })
        }
    }


}

const mapStateToProps = state => ({
    data: state.area.data,
    isLoading: state.area.isLoading,
    error: state.area.error,
    errorCode: state.area.errorCode,
    action: state.area.action
});

const mapDispatchToProps = {
    ...actions
};

export default connect(mapStateToProps, mapDispatchToProps)(AreaView);
