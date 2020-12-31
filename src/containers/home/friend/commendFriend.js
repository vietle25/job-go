import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import {Constants} from 'values/constants';
import commonStyles from 'styles/commonStyles';
import {colors} from 'react-native-elements';
import FlatListCustom from 'components/flatListCustom';
import BaseView from 'containers/base/baseView';
import StorageUtil from "utils/storageUtil";
import * as productActions from 'actions/productActions';
import {connect} from 'react-redux';
import {ActionEvent, getActionSuccess} from "actions/actionEvent";
import {ErrorCode} from "config/errorCode";
import Utils from 'utils/utils';
import actionClickBannerType from 'enum/actionClickBannerType';
import {localizes} from 'locales/i18n';
import {Fonts} from 'values/fonts';
import {Colors} from 'values/colors';
import ItemCommendFriend from './itemCommendFriend';
import productType from 'enum/productType';

const ITEM_PER_COL = 2
class CommendFriend extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            state: false,
            window: Dimensions.get("window"),
        };
    }

    componentDidMount () {
        Dimensions.addEventListener('change', (e) => {
            const window = e.window;
            if (e.window.width > e.window.height) {
                window.width = e.window.height;
                window.height = e.window.width0;
            }
            this.setState({
                window
            });
        });
    }

    render () {
        return (
            <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: Constants.MARGIN_X_LARGE}}>
                    <Text style={[commonStyles.textBold, {marginHorizontal: 0}]}>Gợi ý kết bạn</Text>
                    <TouchableOpacity
                        style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', justifyContent: 'space-between'}}
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        onPress={() => this.props.gotoFriend()}>
                        <Text style={[commonStyles.text, {margin: 0, color: Colors.COLOR_PRIMARY}]}>Tất cả</Text>
                    </TouchableOpacity>
                </View>
                <FlatListCustom
                    contentContainerStyle={{
                        paddingHorizontal: Constants.MARGIN_LARGE
                    }}
                    horizontal={true}
                    data={this.props.data}
                    renderItem={this.renderItem}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        );
    }


    /**
     * Render item
     * @param {*} item
     * @param {*} index
     * @param {*} parentIndex
     * @param {*} indexInParent
     */
    renderItem = (item, index, parentIndex, indexInParent) => {
        const {window} = this.state;
        return (
            <ItemCommendFriend
                key={index.toString()}
                data={this.props.data}
                item={item}
                index={index}
                onPress={this.onClickItem}
                urlPathResize={!Utils.isNull(this.props.resourceUrlPathResize) ? this.props.resourceUrlPathResize.textValue : null}
                onSendFriendRequest={this.props.onSendFriendRequest}
                onCancelFriend={this.props.onCancelFriend}
                onDeleteFriend={this.props.onDeleteFriend}
                window={window}
            />
        );
    }

    /**
     * On click item
     */
    onClickItem = (item, index) => {
        this.props.navigation.navigate("UserProfile", {
            userId: item.friendId
        });
    }
}

export default CommendFriend;
