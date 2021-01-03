import React, { Component } from 'react';
import { View, Text, Image, BackHandler } from 'react-native';
import BaseView from 'containers/base/baseView';
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts';
import { Constants } from 'values/constants';
import commonStyles from 'styles/commonStyles';

class TabButton extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
        });
        this.props.navigation.addListener('blur', () => {
            BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
        });
    }

    componentWillUnmount() {

    }

    /**
     * Handler back button
     */
    handlerBackButton = () => {
        const { focused, route, navigation } = this.props;
        focused && console.log(route, 'back pressed')
        if (focused && navigation) {
            if (route.name == "Home") {
                global.onExitApp();
            } else {
                this.props.navigation.navigate('Home');
            }
        } else {
            return false
        }
        return true
    }

    render() {
        const { focused, icon, label } = this.props;
        return (
            <View style={{ height: 54 }}>
                <View style={[commonStyles.viewCenter, { flex: 1 }]}>
                    <Image
                        resizeMode={'contain'}
                        source={icon}
                    />
                    {focused
                        && <Text style={[{
                            color: Colors.COLOR_PRIMARY,
                            textAlign: 'center',
                            fontSize: Fonts.FONT_SIZE_X_SMALL
                        }]}>{label}</Text>
                    }
                </View>
            </View>
        );
    }
}


export default TabButton;
