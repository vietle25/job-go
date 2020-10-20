import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Text,
    findNodeHandle,
    ImageBackground,
    Dimensions
} from 'react-native';
import { Constants } from 'values/constants';
import FlatListCustom from 'components/flatListCustom';
import Dialog, { DIALOG_WIDTH } from 'components/dialog';
import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { localizes } from 'locales/i18n';
import Utils from 'utils/utils';
import { Fonts } from 'values/fonts';

const screen = Dimensions.get("window");

class DialogCustom extends Component {

    static defaultProps = {
        isVisibleCustomContentView: false
    }

    constructor(props) {
        super(props)
        this.state = {
            visible: props.visible
        }
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            visible: nextProps.visible
        })
    }

    /**
     * text: ex: "do you want to logout?"
     */
    renderContentText () {
        const { contentText, styleContentText, styleContainerText } = this.props;
        return (
            <View style={styleContainerText} >
                <Text style={[commonStyles.text, styleContentText]} >
                    {contentText}
                </Text>
            </View>
        )
    }

    /**
     * for choose images from camera and gallery
     */
    renderContentForChooseImg () {
        const { styleItemRow, styleContainerFroImg, onPressCamera, onPressGallery, onPressX } = this.props;
        return (
            <View style={styleContainerFroImg} >
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    block style={[commonStyles.buttonStyle, {
                        width: 150,
                        marginHorizontal: Constants.MARGIN_LARGE,
                        backgroundColor: Colors.COLOR_PRIMARY
                    }]} info
                    onPress={() => onPressCamera()}>
                    <Text style={[commonStyles.text, { color: Colors.COLOR_WHITE }, styleItemRow]}>
                        Chụp ảnh
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    block style={[commonStyles.buttonStyle, {
                        width: 150,
                        marginHorizontal: Constants.MARGIN_LARGE,
                        backgroundColor: Colors.COLOR_PRIMARY
                    }]} info
                    onPress={() => onPressGallery()}>
                    <Text style={[commonStyles.text, { color: Colors.COLOR_WHITE }]} >Thư viện</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    block style={[commonStyles.buttonStyle, {
                        width: 150,
                        marginHorizontal: Constants.MARGIN_LARGE,
                        backgroundColor: Colors.COLOR_WHITE,
                        borderWidth: Constants.BORDER_WIDTH,
                        borderColor: Colors.COLOR_TEXT,
                        margin: 3
                    }]} info
                    onPress={() => onPressX()}>
                    <Text style={[commonStyles.text, { margin: 3 }, styleItemRow]} >Hủy</Text>
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * render title for dialog
     */
    renderTitle () {
        const { contentTitle, styleItemBtn, styleTextTitle } = this.props;
        return (
            <View style={[commonStyles.viewCenter, { paddingVertical: Constants.PADDING_LARGE }]}>
                <Text style={[commonStyles.titleBold, styleTextTitle]}>
                    {contentTitle}
                </Text>
            </View>
        )
    }

    /**
     * Render one button
     */
    renderOneButton () {
        const { textBtn, styleContainerBtn, styleTextBtn, onPressBtn, styleItemBtn } = this.props;
        return (
            <View style={[{ backgroundColor: Colors.COLOR_WHITE }]}>
                <View style={[{
                    flexDirection: 'row',
                    justifyContent: 'center',
                }, styleContainerBtn]} >
                    <TouchableOpacity block
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        style={[commonStyles.buttonStyle, {
                            width: screen.width / 2 - (Constants.MARGIN_XX_LARGE + Constants.MARGIN_LARGE),
                            marginHorizontal: Constants.MARGIN_LARGE,
                            paddingVertical: Constants.PADDING,
                            backgroundColor: Colors.COLOR_PRIMARY
                        }, styleItemBtn]} info
                        onPress={() => { onPressBtn() }}>
                        <Text style={[commonStyles.text, {
                            textAlign: "center",
                            color: Colors.COLOR_WHITE
                        }, styleTextBtn]} >{textBtn}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    /**
     * render btn Cancel and ...
     */
    renderTwoButton () {
        const { textBtnOne, textBtnTwo, styleContainerBtn, styleItemBtnOne, styleItemBtnTwo, disableOne = false, disableTwo = false,
            styleTextBtnTwo, styleTextBtnOne, onPressX, onPressBtnOne, onPressBtnPositive } = this.props;
        return (
            <View style={[{ backgroundColor: Colors.COLOR_WHITE }]}>
                <View style={[{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }, styleContainerBtn]} >
                    {!Utils.isNull(textBtnOne)
                        ? <TouchableOpacity
                            activeOpacity={Constants.ACTIVE_OPACITY}
                            block
                            disabled={disableOne}
                            style={[commonStyles.buttonStyle, {
                                width: screen.width / 2 - (Constants.MARGIN_XX_LARGE + Constants.MARGIN_LARGE),
                                marginHorizontal: 0,
                                marginRight: Constants.MARGIN_LARGE,
                                backgroundColor: Colors.COLOR_WHITE,
                                borderWidth: 1,
                                borderColor: Colors.COLOR_BACKGROUND,
                                opacity: disableOne ? 0 : 1
                            }, styleItemBtnOne]} info
                            info
                            onPress={
                                () => { onPressBtnOne ? onPressBtnOne() : onPressX() }}>
                            <Text style={[commonStyles.text, {
                                textAlign: "center",
                                color: Colors.COLOR_TEXT,
                                margin: 3
                            }, styleTextBtnOne]} >{textBtnOne}</Text>
                        </TouchableOpacity>
                        : null
                    }
                    <TouchableOpacity
                        disabled={disableTwo}
                        block
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        style={[commonStyles.buttonStyle, {
                            width: screen.width / 2 - (Constants.MARGIN_XX_LARGE + Constants.MARGIN_LARGE),
                            marginHorizontal: 0,
                            marginLeft: Constants.MARGIN_LARGE,
                            backgroundColor: Colors.COLOR_PRIMARY,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }, styleItemBtnTwo]} info
                        onPress={
                            () => { onPressBtnPositive() }}>
                        <Text
                            style={[commonStyles.text, {
                                textAlign: "center",
                                color: Colors.COLOR_WHITE
                            }, styleTextBtnTwo]} >{textBtnTwo}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    _renderOutsideTouchable (onTouch) {
        const view = <View style={{ flex: 1, width: '100%' }} />

        // if (!onTouch) return view;

        return (
            <TouchableWithoutFeedback onPress={() => {
                this.showDialog(false)
                onTouch && onTouch()
            }} style={{ flex: 1, width: '100%' }}>
                {view}
            </TouchableWithoutFeedback>
        )
    }

    render () {
        return (
            <Dialog
                visible={this.state.visible}
                dialogStyle={[commonStyles.shadowOffset, commonStyles.viewCenter, {
                    borderRadius: Constants.CORNER_RADIUS,
                    backgroundColor: Colors.COLOR_WHITE,
                    width: screen.width - Constants.MARGIN_XX_LARGE
                }]}
                onTouchOutside={() => { this.setState({ isAlert: false }) }}
                renderContent={
                    () => {
                        return (
                            <View style={[commonStyles.viewCenter, {}]} >
                                {this.props.isVisibleTitle ? this.renderTitle() : null}
                                {this.props.isVisibleCustomContentView ? this.props.customContentView : null}
                                {this.props.isVisibleContentText ? this.renderContentText() : null}
                                {this.props.isVisibleContentForChooseImg ? this.renderContentForChooseImg() : null}
                                {this.props.isVisibleTwoButton ? this.renderTwoButton() : null}
                                {this.props.isVisibleOneButton ? this.renderOneButton() : null}
                            </View>
                        )
                    }
                } />
        )
    }
}

export default DialogCustom;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.COLOR_WHITE
    },
    card: {
        flex: 1,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#E8E8E8',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    text: {
        textAlign: 'center',
        fontSize: 50,
        backgroundColor: 'transparent'
    },
    done: {
        textAlign: 'center',
        fontSize: 30,
        color: 'white',
        backgroundColor: 'transparent'
    }
})