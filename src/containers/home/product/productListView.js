import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Constants} from 'values/constants';
import commonStyles from 'styles/commonStyles';
import {colors} from 'react-native-elements';
import FlatListCustom from 'components/flatListCustom';
import BaseView from 'containers/base/baseView';
import itemSellingVehicleType from 'enum/itemSellingVehicleType';
import * as productActions from 'actions/productActions';
import {connect} from 'react-redux';
import {ActionEvent, getActionSuccess} from "actions/actionEvent";
import {ErrorCode} from "config/errorCode";
import Utils from 'utils/utils';
import actionClickBannerType from 'enum/actionClickBannerType';
import {localizes} from 'locales/i18n';
import screenType from 'enum/screenType';
import {Fonts} from 'values/fonts';
import ItemProduct from 'containers/product/itemProduct';
import productType from 'enum/productType';
import StorageUtil from 'utils/storageUtil';
import ic_down_white from 'images/ic_down_white.png';

class ProductListView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.filter = {
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0
            }
        };
        this.renderItem = this.renderItem.bind(this);
        this.onClickItem = this.onClickItem.bind(this);
    }

    componentDidMount () {
        this.getSourceUrlPath();
    }

    render () {
        const {vehicleParts} = this.props;
        return (
            <View>
                <View style={{flex: 1, marginBottom: Constants.MARGIN}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: Constants.MARGIN_X_LARGE}}>
                        <Text style={[commonStyles.textBold, {margin: 0}]}>Phụ tùng</Text>
                        <TouchableOpacity
                            style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', justifyContent: 'space-between'}}
                            activeOpacity={Constants.ACTIVE_OPACITY}
                            onPress={() => this.props.gotoProductView(productType.VEHICLE_PARTS)}>
                            <Text style={[commonStyles.text, {margin: 0, fontSize: Fonts.FONT_SIZE_XX_SMALL}]}>Tất cả</Text>
                            <Image source={ic_down_white} style={{width: 14, height: 14}} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{marginTop: -Constants.MARGIN}}>
                    <FlatListCustom
                        onRef={(ref) => {this.flatListRef = ref}}
                        style={{
                            paddingVertical: Constants.PADDING_LARGE,
                        }}
                        keyExtractor={(item) => item.id}
                        horizontal={true}
                        data={vehicleParts}
                        itemPerCol={1}
                        renderItem={this.renderItem}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
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
    renderItem (item, index, parentIndex, indexInParent) {
        return (
            <ItemProduct
                key={item.id}
                data={this.props.vehicleParts}
                item={item}
                index={index}
                horizontal={true}
                onPressItem={this.onClickItem}
                onPressBottomItem={this.onPressBottomItem}
                resource={this.resourceUrlPathResize.textValue}
            />
        );
    }

	/**
	 * On click item
	 */
    onClickItem = (item) => {
        this.props.navigation.navigate("ProductDetail", {
            productId: item.id,
            isVehicleParts: true
        })
    }

    /**
     * On click bottom item
     */
    onPressBottomItem = (item) => {
        const {carts} = this.props;
        if (item.type == productType.VEHICLE_PARTS) {
            this.props.addItemToCart(this.customItemProductCart(item));
        } else if (item.type == productType.VEHICLE) {
            this.props.navigation.navigate("ContactQuote", {
                productId: item.id,
                productColor: null
            })
        }
    }
}

export default ProductListView;
