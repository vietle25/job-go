import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Colors } from 'values/colors';
import styles from "./styles";
import SliderEntry from './sliderEntry/sliderEntry';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { scrollInterpolators, animatedStyles } from './animations';
import { sliderWidth, itemWidth } from './sliderEntry/styles';

const SLIDER_1_FIRST_ITEM = 0;

class SliderBanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
        };
    }

    render () {
        const { slider1ActiveSlide } = this.state;
        const { navigation, resourceUrlPath } = this.props;
        let data = this.props.data != null && this.props.data.length > 0 ? this.props.data : [""];
        return (
            <View style={{ backgroundColor: Colors.COLOR_TRANSPARENT, flex: 1 }}>
                <Carousel
                    ref={c => this._slider1Ref = c}
                    data={data}
                    renderItem={this.renderItem.bind(this, navigation, resourceUrlPath)}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    firstItem={SLIDER_1_FIRST_ITEM}
                    inactiveSlideScale={1}
                    inactiveSlideOpacity={1}
                    inactiveSlideShift={0}
                    containerCustomStyle={styles.slider}
                    contentContainerCustomStyle={styles.sliderContentContainer}
                    loop={true}
                    loopClonesPerSide={5}
                    autoplay={true}
                    autoplayDelay={5000}
                    autoplayInterval={5000}
                    onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
                />
                {/* <Pagination
                    dotsLength={data.length}
                    activeDotIndex={slider1ActiveSlide}
                    containerStyle={styles.paginationContainer}
                    dotColor={Colors.COLOR_PRIMARY}
                    dotStyle={styles.paginationDot}
                    inactiveDotColor={Colors.COLOR_DRK_GREY}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={1}
                    carouselRef={this._slider1Ref}
                    tappableDots={!!this._slider1Ref}
                /> */}
            </View>
        );
    }

    renderItem (navigation, resourceUrlPath, { item, index }, parallaxProps) {
        return (
            <SliderEntry
                key={index}
                data={item}
                resourceUrlPath={resourceUrlPath}
                navigation={navigation}
            />
        );
    }
}

export default SliderBanner;
