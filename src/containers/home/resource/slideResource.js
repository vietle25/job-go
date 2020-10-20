import React, {Component} from 'react';
import {
    View,
    Text,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Colors} from 'values/colors';
import {Constants} from 'values/constants';
import FlatListCustom from 'components/flatListCustom';
import ItemResThumbnail from './itemResThumbnail';
import Utils from 'utils/utils';
import resourceType from 'enum/resourceType';
import ImageLoader from 'components/imageLoader';
import commonStyles from 'styles/commonStyles';
import styles from './styles';
// import ic_plus_gray from "images/ic_plus_gray.png";
import ItemCarouselRes from './itemCarouselRes';

class SlideResource extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indexRes: this.props.indexRes,
            currentTimeVideo: this.props.currentTimeVideo,
            screen: Dimensions.get("screen"),
        };
    }

    componentDidMount () {
        Dimensions.addEventListener('change', this.onChangeDimensions);
    }

    onChangeDimensions = (e) => {
        const screen = e.screen;
        this.setState({
            screen
        });
    }

    componentWillUnmount () {
        Dimensions.removeEventListener('change', this.onChangeDimensions);
    }

    render () {
        const {data, indexRes} = this.props;
        const {screen} = this.state;
        return (
            <View style={{position: 'relative'}}>
                <Carousel
                    ref={(c) => {this._carousel = c}}
                    data={data}
                    renderItem={this.renderItemCarousel}
                    sliderWidth={screen.width}
                    itemWidth={screen.width}
                    firstItem={indexRes}
                    loop={false}
                    autoplay={false}
                    onSnapToItem={(index) => {this.setState({indexRes: index})}}
                    containerCustomStyle={{
                        flexGrow: 0,
                        backgroundColor: Colors.COLOR_WHITE
                    }}
                    onLayout={event => {
                        this.props.callbackGetHeightOfCarouselVideoItem && this.props.callbackGetHeightOfCarouselVideoItem(event);
                    }}
                />
                <FlatListCustom
                    getItemLayout={(data, index) => {return {length: data.length, index, offset: data.length * index}}}
                    ref={(ref) => {this.thumbListRef = ref}}
                    contentContainerStyle={{
                        backgroundColor: Colors.COLOR_WHITE,
                        padding: Constants.PADDING_LARGE
                    }}
                    style={{}}
                    horizontal={true}
                    data={data}
                    renderItem={this.renderItemResource}
                    showsHorizontalScrollIndicator={false}
                    ListFooterComponent={this.renderAddRes}
                />
            </View>
        );
    }

    /**
     * Render add resource
     */
    renderAddRes = () => {
        const {isEdit} = this.props;
        return (
            isEdit && <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={[styles.resource, commonStyles.viewCenter, {
                    borderWidth: Constants.BORDER_WIDTH,
                    borderColor: Colors.COLOR_GRAY,
                    margin: Constants.MARGIN_LARGE - 2
                }]}
                onPress={() => this.props.onOpenCameraRoll()}>
                {/* <Image source={ic_plus_gray} /> */}
            </TouchableOpacity>
        )
    }

    /**
     * Render Item Carousel
     * @param {*} param0
     */
    renderItemCarousel = ({item, index}) => {
        const {screen} = this.state;
        return (
            <ItemCarouselRes
                key={index.toString()}
                item={item}
                index={index}
                indexRes={this.state.indexRes}
                isEdit={this.props.isEdit}
                urlPathResize={this.props.urlPathResize}
                urlPath={this.props.urlPath}
                onOpenImage={this.props.onOpenImage}
                onOpenVideo={this.props.onOpenVideo}
                callbackGetRealVideoWidthAndHeight={this.props.callbackGetRealVideoWidthAndHeight}
                pauseVideoInItemCarouselRes={this.props.pauseVideoInItemCarouselRes}
                currentTimeVideo={this.state.currentTimeVideo}
                onProgressVideo={this.props.onProgressVideo}
                screen={screen}
            />
        )
    }

    /**
     * Render item
     * @param {*} item 
     * @param {*} index 
     * @param {*} parentIndex 
     * @param {*} indexInParent 
     */
    renderItemResource = (item, index, parentIndex, indexInParent) => {
        return (
            <ItemResThumbnail
                key={index.toString()}
                item={item}
                index={index}
                onPress={this.onChooseRes}
                indexChoose={this.state.indexRes}
                urlPathResize={this.props.urlPathResize}
                urlPath={this.props.urlPath}
                videoRestriction={this.props.videoRestriction}
                imageRestriction={this.props.imageRestriction}
                isEdit={this.props.isEdit}
                onDeleteRes={this.props.onDeleteRes}
            />
        )
    }



    /**
     * Choose res
     * @param {*} item 
     * @param {*} index 
     */
    onChooseRes = (item, index) => {
        this.setState({
            indexRes: index
        });
        this._carousel.snapToItem(index);
    }
}

export default SlideResource;