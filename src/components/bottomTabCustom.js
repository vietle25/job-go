import React, { Component } from 'react';
import {
    SafeAreaView, TouchableOpacity, View, Image,
    Text, Dimensions, Platform, Keyboard,
    StyleSheet
} from "react-native";
import { Constants } from 'values/constants';
import { Colors } from 'values/colors';
import StorageUtil from 'utils/storageUtil';
import Utils from 'utils/utils';
import StringUtil from 'utils/stringUtil';
import commonStyles from 'styles/commonStyles';
import TabButton from 'containers/main/tabIcon/tabButton';

const screen = Dimensions.get("window");

export default class BottomTabCustom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            heightTab: 54
        };
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            this.keyboardEventListeners = [
                Keyboard.addListener('keyboardDidShow', this.handleStyle({ heightTab: 0 })),
                Keyboard.addListener('keyboardDidHide', this.handleStyle({ heightTab: 54 }))
            ];
        }
    }

    componentWillUnmount() {
        this.keyboardEventListeners && this.keyboardEventListeners.forEach((eventListener) => eventListener.remove());
    }

    handleStyle = style => () => this.setState({ heightTab: style.heightTab });

    render() {
        const { heightTab } = this.state;
        const { state, descriptors, navigation } = this.props;
        return (
            <View style={[styles.container, { height: heightTab }]}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];

                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const icon =
                        options.icon !== undefined
                            ? options.icon
                            : null;

                    const iconActive =
                        options.iconActive !== undefined
                            ? options.iconActive
                            : null;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityStates={isFocused ? ['selected'] : []}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={{ flex: 1 }}
                        >
                            <TabButton
                                focused={isFocused}
                                navigation={navigation}
                                route={route}
                                icon={isFocused ? iconActive : icon}
                                label={label}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flexDirection: 'row',
        backgroundColor: Colors.COLOR_WHITE,
        elevation: Constants.ELEVATION
    }
});