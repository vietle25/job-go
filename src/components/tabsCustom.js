'use strict';
import React, { Component } from "react";
import PropTypes from 'prop-types';
import {
    ImageBackground,
    View,
    StatusBar,
    TextInput,
    Animated,
    TouchableOpacity,
    Dimensions
} from "react-native";
import {
    Tabs, ScrollableTab, Tab, TabHeading
} from "native-base";
import commonStyles from "styles/commonStyles";
import { Colors } from "values/colors";
import { Constants } from "values/constants";
import { Fonts } from "values/fonts";
import Utils from "utils/utils";

const screen = Dimensions.get("window");

export default class TabsCustom extends Component {

    constructor(props) {
        super(props)
        this.state = {

        };
    }

    render = () => {
        const { tabs = [], child, initialPage, onChangeTab, onScroll, underlineStyle, disableScroll = false, tabY = 0, textStyle, tabHeading } = this.props;
        return (
            <Tabs
                {...this.props}
                initialPage={initialPage}
                renderTabBar={(props) =>
                    <Animated.View
                        style={{ transform: [{ translateY: tabY }], zIndex: 1, width: "100%", backgroundColor: "white" }}>
                        <ScrollableTab
                            {...props}
                            renderTab={(name, page, active, onPress, onLayout) => (
                                <TouchableOpacity key={page}
                                    onPress={() => onPress(page)}
                                    onLayout={onLayout}
                                    activeOpacity={Constants.ACTIVE_OPACITY}>
                                    <Animated.View
                                        style={{
                                            flex: 1,
                                            width: "100%"
                                        }}>
                                        <TabHeading
                                            scrollable={false}
                                            style={[styles.tabHeading, tabHeading]}
                                            active={active}>
                                            <Animated.Text style={[commonStyles.textStyle, textStyle, {
                                                fontWeight: active ? "bold" : "normal",
                                                color: active ? Colors.COLOR_PRIMARY : Colors.COLOR_BLACK
                                            }]}>
                                                {name}
                                            </Animated.Text>
                                        </TabHeading>
                                    </Animated.View>
                                </TouchableOpacity>
                            )}
                            tabsContainerStyle={{ backgroundColor: Colors.COLOR_WHITE }}
                            style={[commonStyles.scrollableTab]}
                            underlineStyle={[commonStyles.tabBarUnderlineStyle, underlineStyle]}
                        />
                    </Animated.View>
                }
                locked={disableScroll}
                tabContainerStyle={{ elevation: 0 }}
                onChangeTab={(event) => onChangeTab && onChangeTab(event)}
                onScroll={(event) => onScroll && onScroll(event)}>
                {tabs.map((tab, index) => {
                    return (
                        <Tab
                            key={index.toString()}
                            heading={tab.name}
                            tabStyle={[commonStyles.tabStyle, {
                                backgroundColor: Colors.COLOR_WHITE,
                                borderBottomWidth: Constants.BORDER_WIDTH,
                                borderColor: Colors.COLOR_GRAY,
                            }]}
                            activeTabStyle={commonStyles.activeTabStyle}
                            textStyle={commonStyles.textStyle}
                            activeTextStyle={commonStyles.activeTextStyle}
                        >
                            {child(tab, index)}
                        </Tab>
                    )
                })}
            </Tabs>
        )
    }
}

TabsCustom.defaultProps = {

}

TabsCustom.propTypes = {

}

const styles = {
    tabHeading: {
        backgroundColor: "transparent",
        width: screen.width / 3,
        flex: 1,
        borderBottomWidth: Constants.BORDER_WIDTH,
        borderColor: Colors.COLOR_BACKGROUND
    }
}