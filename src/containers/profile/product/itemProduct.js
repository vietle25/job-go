// import React, { PureComponent } from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, NativeModules } from 'react-native';
// import BaseView from 'containers/base/baseView';
// import { Colors } from 'values/colors';
// import commonStyles from 'styles/commonStyles';
// import DateUtil from 'utils/dateUtil';
// import { Fonts } from 'values/fonts';
// import { Constants } from 'values/constants';
// import StringUtil from 'utils/stringUtil';
// import Utils from 'utils/utils';
// import ImageLoader from 'components/imageLoader';
// import StarRating from 'components/starRating';
// import img_ribbon_out_of_stock from 'images/img_ribbon_out_of_stock.png';
// import ic_check_black from 'images/ic_check_black.png';
// import ic_coin_green from 'images/ic_coin_green.png';
// import { localizes } from 'locales/i18n';
// import screenType from 'enum/screenType';
// import productType from 'enum/productType';
// import ic_sound_on_white from 'images/ic_sound_on_white.png';
// import ic_sound_off_white from 'images/ic_sound_off_white.png';
// import VideoPlayer from 'components/videoPlayer';
// // import { ProcessingManager } from 'react-native-video-processing';
// import FastImage from 'react-native-fast-image';
// const window = Dimensions.get('window');
// // const TrimmerManager = NativeModules.RNTrimmerManager;

// const WIDTH_IMAGE = window.width / 3;
// const HEIGHT_IMAGE = window.width / 3;
// const LINE_TITLE = 2;
// const HEIGHT_TITLE = 42;

// export default class ItemProduct extends PureComponent {
//     constructor(props) {
//         super(props);
//         this.state = {
//             isCheck: false,
//             videoPaused: true,
//             videoThumbnail: ''
//         };
//     }

//     render() {
//         const { lengthData, item, index, onPressItem, urlPathResize, urlPath, fromScreen, horizontal } = this.props;
//         const { isCheck } = this.state;
//         let marginRight = Constants.MARGIN_X_LARGE;
//         let marginLeft = Constants.MARGIN_X_LARGE;
//         let marginBottom = Constants.MARGIN_LARGE;
//         let marginTop = Constants.MARGIN_LARGE;
//         if (horizontal == true) {
//             marginRight = index == lengthData - 1 ? Constants.MARGIN_X_LARGE : Constants.MARGIN_LARGE;
//             marginLeft = index == 0 ? Constants.MARGIN_X_LARGE : Constants.MARGIN_LARGE;
//         } else {
//             if (index % 2 == 0) {
//                 marginRight = Constants.MARGIN_LARGE;
//                 marginLeft = Constants.MARGIN_X_LARGE;
//             } else {
//                 marginLeft = Constants.MARGIN_LARGE;
//                 marginRight = Constants.MARGIN_X_LARGE;
//             }

//             if (index == 0 || index == 1) {
//                 marginTop = Constants.MARGIN_X_LARGE;
//             }

//             if (index == lengthData - 1 || (index % 2 == 0 && index == lengthData - 2)) {
//                 marginBottom = Constants.MARGIN_X_LARGE;
//             }
//         }

//         const ImageItem = () => {
//             let image = "";
//             let pathVideo = "";
//             let hasHttp = false;
//             let thumbnaiLVideo = '';
//             if (!Utils.isNull(item.resources)) {
//                 hasHttp = !Utils.isNull(item.resources[0]) && item.resources[0].path.indexOf('http') != -1;
//                 image = hasHttp ? item.resources[0].path : urlPathResize + "=" + item.resources[0].path;
//                 pathVideo = hasHttp ? item.resources[0].path : urlPath + "/" + item.resources[0].path;
//                 thumbnaiLVideo = StringUtil.isNullOrEmpty(item.resources[0].pathToThumbnailResource) ? "" : urlPathResize + "=" + item.resources[0].pathToThumbnailResource;
//             }

//             if (item.resources[0].type == 1) {
//                 return (
//                     <View style={styles.imageGrid}>
//                         <ImageLoader
//                             resizeModeType={'cover'}
//                             resizeAtt={hasHttp ? null : { type: 'resize', width: WIDTH_IMAGE }}
//                             path={image}
//                             style={[styles.image, {
//                                 width: "100%",
//                                 height: WIDTH_IMAGE
//                             }]}
//                         />
//                     </View>
//                 )
//             } else {
//                 return (
//                     <ImageLoader
//                         resizeModeType={'cover'}
//                         resizeAtt={hasHttp ? null : { type: 'resize', width: WIDTH_IMAGE }}
//                         path={thumbnaiLVideo}
//                         style={[styles.image, {
//                             width: "100%",
//                             height: WIDTH_IMAGE
//                         }]}
//                     />
//                 )

//             }
//         }

//         const DataItem = () => {
//             return (
//                 <View style={styles.boxData}>
//                     <View style={[styles.priceBox, { justifyContent: 'center' }]}>
//                         <Text style={[styles.text, {
//                             fontWeight: 'bold',
//                         }]}>
//                             {StringUtil.formatStringCash(item.price)}
//                         </Text>
//                         <Image
//                             source={ic_coin_green}
//                             style={{
//                                 width: 16,
//                                 height: 16,
//                                 margin: 4,
//                             }}
//                         />
//                     </View>
//                     <Text numberOfLines={LINE_TITLE} ellipsizeMode={"tail"}
//                         style={[styles.text, {
//                             color: Colors.COLOR_TEXT,
//                             height: HEIGHT_TITLE,
//                             marginBottom: Constants.MARGIN_LARGE,
//                             textAlign: 'center'
//                         }]}>
//                         {item.title}
//                     </Text>
//                 </View>
//             )
//         }

//         return (
//             <View style={styles.container}>
//                 <TouchableOpacity
//                     activeOpacity={Constants.ACTIVE_OPACITY}
//                     style={{ flex: 1 }}
//                     onPress={() => Utils.isNull(fromScreen) ? onPressItem(item) : this.toggleCheck(item)}>
//                     <View style={[styles.boxGrid, {
//                         marginRight: marginRight,
//                         marginLeft: marginLeft,
//                         marginBottom: marginBottom,
//                         marginTop: marginTop,
//                         width: horizontal == true ? window.width * 0.4 : null
//                     }]}>
//                         {!Utils.isNull(item)
//                             ? <View style={{ flex: 1, position: "relative" }}>
//                                 <ImageItem />
//                                 <DataItem />
//                                 {isCheck
//                                     ? <Image
//                                         source={ic_check_black}
//                                         style={{
//                                             position: "absolute",
//                                             top: Constants.MARGIN_LARGE, right: Constants.MARGIN_LARGE
//                                         }}
//                                     />
//                                     : null
//                                 }
//                             </View>
//                             : <View style={{ flex: 1 }} />
//                         }
//                     </View>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     /**
//      * Toggle check
//      */
//     toggleCheck = (item) => {
//         const { isCheck } = this.state;
//         const isCheckTemp = !isCheck;
//         this.setState({ isCheck: isCheckTemp }, () => {
//             this.props.onCheck({ ...item, isCheck: isCheckTemp })
//         });
//     }

//     /**
//      * Get width resource
//      */
//     getWidthImage = (item, index) => {
//         switch (item.oriented) {
//             case resourceOrientationType.SQUARE_ORIENTED:
//                 return this.handleWidthSquare(item, index);
//             case resourceOrientationType.PORTRAIT_ORIENTED:
//                 return this.handleWidthPortrait(item, index);
//             case resourceOrientationType.LANDSCAPE_ORIENTED:
//                 return this.handleWidthLandscape(item, index);
//             default:
//                 return 0;
//         }
//     }

//     /**
//      * Play this video
//      */
//     playThisVideo = (videoPlayed) => {
//         this.setState({ videoPaused: !videoPlayed });
//     }
// }

// const styles = StyleSheet.create({
//     container: {

//     },
//     boxGrid: {
//         ...commonStyles.shadowOffset,
//         backgroundColor: Colors.COLOR_WHITE,
//         marginVertical: Constants.MARGIN_LARGE,
//         borderRadius: Constants.CORNER_RADIUS
//     },
//     boxData: {
//         flex: 1,
//         paddingHorizontal: Constants.MARGIN_X_LARGE,
//         paddingVertical: Constants.PADDING_LARGE
//     },
//     text: {
//         ...commonStyles.text,
//         color: Colors.COLOR_TEXT,
//         margin: 0
//     },
//     priceBox: {
//         flexDirection: 'row'
//     },
//     imageGrid: {
//         flex: 1
//     },
//     image: {
//         borderTopLeftRadius: Constants.CORNER_RADIUS,
//         borderTopRightRadius: Constants.CORNER_RADIUS
//     },
//     boxContact: {
//         backgroundColor: Colors.COLOR_PRIMARY,
//         borderBottomLeftRadius: Constants.CORNER_RADIUS,
//         borderBottomRightRadius: Constants.CORNER_RADIUS
//     },
//     resource: {
//         margin: 1
//     },
//     muted: {
//         ...commonStyles.viewCenter,
//         backgroundColor: Colors.COLOR_PLACEHOLDER_TEXT_DISABLE,
//         position: "absolute",
//         right: Constants.MARGIN_X_LARGE,
//         bottom: Constants.MARGIN_X_LARGE
//     },
// });
