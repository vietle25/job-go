import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from './styles';
import ImageLoader from 'components/imageLoader';
import bannerType from 'enum/bannerType';
import actionClickBannerType from 'enum/actionClickBannerType';
import BaseView from 'containers/base/baseView';
import commonStyles from 'styles/commonStyles';
import ic_default_user from 'images/ic_default_user.png';

import Utils from 'utils/utils';
import { Constants } from 'values/constants';
const widthDevice = Dimensions.get('window').width;

export default class SliderEntry extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render () {
        const { data, resourceUrlPath } = this.props;
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.slideInnerContainer}
                onPress={() => this.handleClickBanner(data)}
            >
                <View style={[styles.imageContainer]}>
                    <Image
                        style={styles.image}
                        resizeModeType={"cover"}
                        source={data == "" ? ic_default_user : { uri: data }} />
                </View>
            </TouchableOpacity>
        );
    }

    /**
     * Handle click banner
     */
    handleClickBanner (data) {
        switch (data.actionOnClickType) {
            case actionClickBannerType.DO_NOTHING:
                global.openModalBanner(data)
                break;
            case actionClickBannerType.GO_TO_SCREEN:

                break;
            case actionClickBannerType.OPEN_OTHER_APP:
                Linking.openURL('https://www.google.com/')
                break;
            case actionClickBannerType.OPEN_URL:
                this.props.navigation.navigate("QuestionAnswer", {
                    actionTarget: data.actionTarget
                })
                break;

            default:
                break;
        }
    }
}
