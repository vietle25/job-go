import React, {Component} from 'react';
import {
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    View,
    Text
} from 'react-native';
import PropTypes from 'prop-types';

import ic_check_white from 'images/ic_cancel_blue.png';
import {Colors} from 'values/colors';
import {Constants} from 'values/constants';
import commonStyles from 'styles/commonStyles';
import Utils from 'utils/utils';
import resourceType from 'enum/resourceType';

class ImageItem extends Component {
    componentWillMount () {
        let {width} = Dimensions.get('screen');
        const {imageMargin, imagesPerRow, containerWidth} = this.props;

        if (typeof containerWidth !== 'undefined') {
            width = containerWidth;
        }
        this.imageSize = (width - ((imagesPerRow) * imageMargin) + imageMargin) / imagesPerRow;
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            const {imageMargin, imagesPerRow, containerWidth} = this.props;
            this.imageSize = (containerWidth - ((imagesPerRow) * imageMargin) + imageMargin) / imagesPerRow;
        }
    }

    handleClick (item) {
        this.props.onClick(item);
    }

    render () {
        const {
            item, selected, selectedMarker, imageMargin,
        } = this.props;

        const marker = selectedMarker || (
            <View style={styles.marker}>
                <Image source={ic_check_white} />
            </View>
        );

        const {image} = item.node;
        const {type} = item.node;

        return (
            <TouchableOpacity
                style={{marginBottom: imageMargin, marginRight: imageMargin}}
                onPress={() => this.handleClick({...image, mime: type})}
            >
                <Image
                    source={{uri: image.uri}}
                    style={{height: this.imageSize, width: this.imageSize}}
                />
                <View style={styles.type}>
                    <Text style={[commonStyles.text, {color: Colors.COLOR_WHITE, marginVertical: 0}]}>
                        {this.renderTypeResource(type)}
                    </Text>
                </View>
                {(selected) ? marker : null}
            </TouchableOpacity>
        );
    }

    /**
     * Render type resource
     */
    renderTypeResource = (type) => {
        let resType = "";
        if (Utils.getTypeResource(type) != 0) {
            resType = Utils.getTypeResource(type) == resourceType.VIDEO ? "video" : "image";
        }
        return resType;
    }
}

ImageItem.defaultProps = {
    item: {},
    selected: false,
};

ImageItem.propTypes = {
    item: PropTypes.object,
    selected: PropTypes.bool,
    selectedMarker: PropTypes.element,
    imageMargin: PropTypes.number,
    imagesPerRow: PropTypes.number,
    onClick: PropTypes.func,
};

const styles = StyleSheet.create({
    marker: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: Colors.COLOR_PRIMARY,
        padding: 2,
        borderRadius: 2
    },
    type: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.COLOR_PLACEHOLDER_TEXT_DISABLE
    }
});

export default ImageItem;
