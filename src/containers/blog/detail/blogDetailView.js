import React, { Component } from 'react'
import { View, Text, RefreshControl, BackHandler, Image, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Header, Content, Container, Right } from "native-base";
import BaseView from 'containers/base/baseView';
import commonStyles from "styles/commonStyles";
import { Colors } from "values/colors";
import { Constants } from "values/constants";
import i18n, { localizes } from "locales/i18n";
import styles from '../styles';
import DateUtil from "utils/dateUtil";
import HTML from 'react-native-render-html';
import { IGNORED_TAGS } from 'react-native-render-html/src/HTMLUtils';
import _ from 'lodash';
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { ErrorCode } from "config/errorCode";
import ImageLoader from 'components/imageLoader';
import { Fonts } from 'values/fonts';
import * as actions from 'actions/userActions';
import * as blogActions from 'actions/blogActions';
import * as commonActions from 'actions/commonActions';
import StorageUtil from "utils/storageUtil";
import { WebView } from 'react-native-webview';
import HeaderGradient from 'containers/common/headerGradient';

const tags = _.without(IGNORED_TAGS,
    'table', 'caption', 'col', 'colgroup', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr'
)
const TYPE = {
    VIEW_ALL: 0,
    VIEW_CHILL: 1
}

const DEFAULT_PROPS = {
    htmlStyles: { paddingHorizontal: Constants.PADDING_X_LARGE, marginHorizontal: Constants.MARGIN_X_LARGE },
    onLinkPress: (evt, href) => { Linking.openURL(href); },
};

const defaultRenderer = {
    renderers: {
        img: (htmlAttribs, children, convertedCSSStyles, passProps) => {
            let attr = htmlAttribs;
            if (htmlAttribs && htmlAttribs.style) {
                let style = htmlAttribs.style;
                var styleMap = style.split(";").reduce((a, c) => (d = c.split(":"), a[d[0].trim()] = String(d[1]).trim(), a), {});
                let valueWidth = Constants.MAX_WIDTH - 2 * Constants.PADDING_X_LARGE;
                let valueHeight = valueWidth * (9 / 16);
                if (styleMap.height != null) {
                    valueHeight = parseInt(styleMap.height.match(/\d+/)[0]);
                }
                if (styleMap.width != null) {
                    valueWidth = parseInt(styleMap.width.match(/\d+/)[0]);
                }
                const ratio = valueWidth / valueHeight;
                let width = Constants.MAX_WIDTH - 2 * Constants.PADDING_X_LARGE;
                if (valueWidth < (Constants.MAX_WIDTH - 2 * Constants.PADDING_X_LARGE)) {
                    width = valueWidth;
                } else {
                    width = Constants.MAX_WIDTH - 2 * Constants.PADDING_X_LARGE;
                }
                let height = width / ratio;
                return (<Image style={[{ borderColor: 'black', borderWith: 0 }, convertedCSSStyles, { width: width, height: height }]} source={{ uri: attr.src }} />)
            } else {
                let width = Constants.MAX_WIDTH - 2 * Constants.PADDING_X_LARGE;
                return <Image
                    width={width}
                    source={{ uri: attr.src }
                    } />
            }
        },
        table: (x, c) => <View style={styles.tableDefaultStyle}>{c}</View>,
    },
}


class BlogDetailView extends BaseView {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            refresh: true,
            user: null
        }
        const { id } = this.props.route.params;
        this.id = id
        this.data = null;
    }

    componentDidMount () {
        BackHandler.addEventListener('hardwareBackPress', this.handlerBackButton);
        this.handleRequest()
        this.getProfile()
    }

    handleRequest () {
        this.props.getDetailBlog(this.id)
    }

    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.handlerBackButton);
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData()
        }
    }

    handleData () {
        let data = this.props.data
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_DETAIL_BLOG)) {
                    this.data = data
                }
                this.state.refreshing = false
            } else {
                this.handleError(this.props.errorCode, this.props.error)
            }
        }
    }

    getProfile () {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            if (!Utils.isNull(user)) {
                this.setState({
                    user: user
                });
            }
        }).catch((error) => {
            this.saveException(error, 'getProfile');
        });
    }

    handleRefresh = () => {
        this.state.refreshing = false
        this.handleRequest()
        this.getProfile();
    };

    /**
     * Render children
     */
    alterNode = (node) => {
        const { name, parent } = node;
        if (name == "iframe") {
            const { name, parent } = node;

            let widthVideo = Constants.MAX_WIDTH - Constants.MARGIN_XX_LARGE * 2;
            let heightVideo = widthVideo * (9 / 16);
            if (name == "iframe") {
                node.attribs.style = `width: ${widthVideo};`;
                parent.attribs.style = `align-items: center;width:${widthVideo};height:${heightVideo};`;
                return node;
            }
        }
    }

    render () {
        console.log("this.data.content this.data.content ", this.data == null || this.data.content == null);
        return (
            <Container style={{ backgroundColor: Colors.COLOR_WHITE }}>
                <HeaderGradient
                    onBack={this.onBack}
                    title={this.data && this.data.title != null ? this.data.title : 'Chi tiết tin tức'} />

                {this.data == null || this.data.content == null ? null :
                    this.data && this.data.content && this.data.content.indexOf('http') == 0 ?
                        <WebView
                            // mediaPlaybackRequiresUserAction={((Platform.OS !== 'android') || (Platform.Version >= 17)) ? false : undefined}
                            // userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
                            scrollEnabled={false}
                            useWebKit={true}
                            containerStyle={{
                                flex: 1,
                                height: "100%", width: "100%", alignItems: 'center', justifyContent: 'center',
                            }}
                            style={{
                                flex: 1,
                                height: "100%", width: "100%", alignItems: 'center', justifyContent: 'center',
                            }}
                            scalesPageToFit={false}
                            source={{ uri: this.data.content }}
                        />
                        :
                        <Content
                            contentContainerStyle={styles.contentContainer}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    progressViewOffset={Constants.HEIGHT_HEADER_OFFSET_REFRESH}
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.handleRefresh}
                                />
                            }>
                            {this.renderHeaderBlog()}
                            <View style={styles.contentStyle}>
                                <HTML
                                    {...DEFAULT_PROPS}
                                    {...defaultRenderer}
                                    ignoredTags={tags}
                                    containerStyle={{
                                        paddingVertical: Constants.PADDING_X_LARGE,
                                    }}
                                    tagsStyles={{
                                        figure: {
                                            textAlign: 'center'
                                        },
                                        p: {
                                            fontSize: Fonts.FONT_SIZE_X_MEDIUM
                                        }
                                    }}
                                    staticContentMaxWidth={Constants.MAX_WIDTH - Constants.MARGIN_X_LARGE * 4}
                                    imagesInitialDimensions={{ width: 0, height: 0 }}
                                    html={this.data.content}
                                    alterNode={this.alterNode}
                                />
                            </View>
                        </Content>
                }
                {this.showLoadingBar(this.props.isLoading)}
            </Container>
        )
    }

    /**
  * Render time, title
  */
    renderHeaderBlog () {
        return (
            <View>
                <View style={{ alignItems: 'flex-start', justifyContent: 'center', }}>
                    {this.data ? <Text style={[commonStyles.textBold, { margin: 0, fontSize: Fonts.FONT_SIZE_XX_MEDIUM, color: Colors.COLOR_BLACK }]}>{this.data.title}</Text> : null}
                </View>
                <View style={[styles.viewTime]}>
                    {this.data ? <Text style={styles.txtTime}>{DateUtil.convertFromFormatToFormat(
                        this.data.createdAt, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE)}</Text> : null}
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    data: state.blog.data,
    isLoading: state.blog.isLoading,
    errorCode: state.blog.errorCode,
    action: state.blog.action
})

const mapDispatchToProps = {
    ...commonActions,
    ...actions,
    ...blogActions,
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogDetailView)
