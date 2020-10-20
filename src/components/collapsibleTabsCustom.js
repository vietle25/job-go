import React, { Component } from 'react';
import {
    View,
    Dimensions,
    Animated,
    ScrollView,
    StyleSheet,
    RefreshControl
} from 'react-native';
import { map, min } from 'lodash';
import PropTypes from 'prop-types';
import Carousel from 'react-native-snap-carousel';
import { Colors } from 'values/colors';
import Hr from './hr';
import MaterialTabs from 'react-native-material-tabs';

const headerCollapsedHeight = 46;

class CollapsibleTabsCustom extends Component {

    scrolls = [];

    constructor(props) {
        super(props);
        this.headerExpandedHeight = headerCollapsedHeight;
        this.state = {
            scrollY: new Animated.Value(0),
            selectedTab: 0,
            screenWidth: Dimensions.get('screen').width
        }
    }

    componentDidMount() {
        Dimensions.addEventListener('change', this.onChangeDimensions);
    }

    onChangeDimensions = (e) => {
        const screen = e.screen;
        this.setState({
            screenWidth: screen.width
        });
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.onChangeDimensions);
    }

    onChangePage(index) {
        const { scrollY } = this.state;
        Animated.timing(scrollY, {
            toValue: min([this.scrolls[index] || 0, this.headerExpandedHeight]),
            duration: 200,
            useNativeDriver: true
        }).start();

        this.carousel.snapToItem(index);
        this.setState({ selectedTab: index });
        this.props.onChangePage(index);
    }

    render() {
        const { selectedTab, scrollY, screenWidth } = this.state;
        const { collapsibleContent, tabs } = this.props;
        const { headerExpandedHeight } = this;

        const headerHeight = scrollY.interpolate({
            inputRange: [0, headerExpandedHeight - headerCollapsedHeight],
            outputRange: [0, -(headerExpandedHeight - headerCollapsedHeight)],
            extrapolate: 'clamp'
        });

        const headerOpacity = scrollY.interpolate({
            inputRange: [0, headerExpandedHeight - headerCollapsedHeight],
            outputRange: [1, 0],
        });

        const scrollProps = index => ({
            contentContainerStyle: { paddingTop: headerExpandedHeight + this.props.headerTopHeight },
            scrollEventThrottle: 16,
            onScroll: Animated.event([{
                nativeEvent: {
                    contentOffset: {
                        y: this.state.scrollY
                    }
                }
            }], {
                listener: ({ nativeEvent }) => (this.scrolls[index] = nativeEvent.contentOffset.y)
            })
        });

        return (
            <View style={{ flex: 1 }}>
                <Carousel
                    ref={ref => this.carousel = ref}
                    onSnapToItem={index => this.onChangePage(index)}
                    style={{ flex: 1 }}
                    data={tabs}
                    itemWidth={screenWidth}
                    sliderWidth={screenWidth}
                    inactiveSlideScale={1}
                    renderItem={({ item: { component, isFlatList, refreshing, handleRefresh }, index }) => (
                        isFlatList
                            ? React.cloneElement(component, scrollProps(index))
                            : (
                                <Animated.ScrollView
                                    {...scrollProps(index)}
                                    showsVerticalScrollIndicator={false}
                                    enableRefresh={true}
                                    refreshControl={
                                        <RefreshControl
                                            progressViewOffset={this.headerExpandedHeight + this.props.headerTopHeight}
                                            refreshing={refreshing}
                                            onRefresh={handleRefresh}
                                        />
                                    }>
                                    {component}
                                </Animated.ScrollView>
                            )
                    )}
                />
                {/* HEADER */}
                <Animated.View
                    style={{
                        transform: [{ translateY: headerHeight }],
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        backgroundColor: Colors.COLOR_WHITE
                    }}
                    onLayout={({ nativeEvent }) => {
                        if (this.headerExpandedHeight === headerCollapsedHeight) {
                            this.forceUpdate();
                        }
                        this.headerExpandedHeight = nativeEvent.layout.height + 0.1 - this.props.headerTopHeight;
                    }}
                >
                    <Animated.View style={{ opacity: headerOpacity }}>
                        {collapsibleContent}
                    </Animated.View>
                    <Animated.View style={{ height: headerCollapsedHeight }} />
                    <View style={styles.tabsContainer}>
                        <MaterialTabs
                            {...this.props}
                            items={map(tabs, ({ label }) => label)}
                            selectedIndex={selectedTab}
                            onChange={index => this.onChangePage(index)}
                        />
                    </View>
                </Animated.View>
            </View>
        )
    }
}

CollapsibleTabsCustom.defaultProps = {
    collapsibleContent: (
        <View />
    )
};

CollapsibleTabsCustom.propTypes = {
    collapsibleContent: PropTypes.element,
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            component: PropTypes.element,
            isFlatList: PropTypes.bool
        })
    ).isRequired,
    ...MaterialTabs.propTypes,
    items: PropTypes.any,
    onChange: PropTypes.any
}

const styles = StyleSheet.create({
    tabsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'stretch'
    }
});

export default CollapsibleTabsCustom;
