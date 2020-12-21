import StringUtil from "./stringUtil";
import colorsType from "enum/colorsType";
import { Colors } from "values/colors";
import resourceType from "enum/resourceType";
import { Platform, StatusBar } from 'react-native';

export default class Utils {

    static chunkArray(array, size) {
        if (array == []) return [];
        return array.reduce((acc, val) => {
            if (acc.length === 0) acc.push([]);
            const last = acc[acc.length - 1];
            if (last.length < size) {
                last.push(val);
            } else {
                acc.push([val]);
            }
            return acc;
        }, []);
    }

    static hex2rgb(hex, opacity) {
        hex = hex.trim();
        hex = hex[0] === '#' ? hex.substr(1) : hex;
        var bigint = parseInt(hex, 16), h = [];
        if (hex.length === 3) {
            h.push((bigint >> 4) & 255);
            h.push((bigint >> 2) & 255);
        } else {
            h.push((bigint >> 16) & 255);
            h.push((bigint >> 8) & 255);
        }
        h.push(bigint & 255);
        if (arguments.length === 2) {
            h.push(opacity);
            return 'rgba(' + h.join() + ')';
        } else {
            return 'rgb(' + h.join() + ')';
        }
    }

    /**
     * Validate email
     * @param {*} email 
     */
    static validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email)
    }

    /**
     * Validate phone
     */
    static validatePhone(phone) {
        // var re = /^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
        // var re = /(\+84|0)([35789]\d{8}|1\d{9})$/g;
        var re = /^0(3[23456789]|5[2689]|7[06789]|8[123456789]|9[012346789])\d{7}$/
            ;
        return re.test(phone)
    }

    /**
     * Validate date of bird
     */
    static validateDate(dateOfBird) {
        var re = /^([0-3]{1})([0-9]{1})\/([0-1]{1})([0-9]{1})\/([0-9]{4})$/;
        return re.test(dateOfBird)
    }

    /**
     * Check data null
     * @param {*} data 
     */
    static isNull(data) {
        if (data == undefined || data == null || data.length == 0) {
            return true
        } else if (typeof data == "string") {
            return StringUtil.isNullOrEmpty(data)
        }
        return false
    }

    /**
     * Random String
     * @param {*} length 
     * @param {*} chars 
     */
    static randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }

    /**
     * Get length of number
     * Ex: 12 => func return 2
     * Ex: 1  => func return 1
     * @param {*} number
     */
    static getLength(number) {
        return (number + '').replace('.', '').length;  // for floats
    }

    /**
     * Convert color
     * @param {*} colorType 
     */
    static convertColor(colorType) {
        let codeHex = "";
        switch (colorType) {
            case colorsType.RED:
                codeHex = Colors.COLOR_RED
                break;
            case colorsType.BLACK:
                codeHex = Colors.COLOR_BLACK
                break;
            case colorsType.BLUE:
                codeHex = Colors.COLOR_BLUE
                break;
            case colorsType.BROW:
                codeHex = Colors.COLOR_BROWN
                break;
            case colorsType.GOLD:
                codeHex = Colors.COLOR_GOLD
                break;
            case colorsType.GREEN:
                codeHex = Colors.COLOR_GREEN
                break;
            case colorsType.ORANGES:
                codeHex = Colors.COLOR_ORANGE
                break;
            case colorsType.PINK:
                codeHex = Colors.COLOR_PINK
                break;
            case colorsType.VIOLET:
                codeHex = Colors.COLOR_VIOLET
                break;
            case colorsType.WHITE:
                codeHex = Colors.COLOR_WHITE
                break;
            case colorsType.YELLOW:
                codeHex = Colors.COLOR_YELLOW
                break;
        }
        return codeHex;
    }

    /**
     * Get language
     * @param {*} deviceLocale 
     */
    static isEnglishLanguage(deviceLocale) {
        if (deviceLocale == 'vi' || deviceLocale == 'vi-VN') {
            return false
        } else if (deviceLocale == 'en-US' || deviceLocale == 'en' || deviceLocale == 'en-UK') {
            return true
        }
    }

    /**
     * Format bytes
     * @param {*} bytes 
     * @param {*} decimals 
     */
    static formatBytes(bytes, decimals) {
        if (bytes == 0) return '0 Bytes';
        var k = 1024,
            dm = decimals <= 0 ? 0 : decimals || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return console.log(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i])
    }

    /**
     * Validate password
     * @param {} passWord 
     */
    static validateSpacesPass(passWord) {
        return passWord.match(' ') == null ? false : true

    }

    static validateContainUpperPassword(passWord) {
        var re = /[A-Z]/;
        return re.test(passWord)
    }

    static validatePhoneContainSpecialCharacter(text) {
        var re = /\W|_/g
        return re.test(text);
    }

    static validatePhoneContainWord(text) {
        var re = /[a-z|A-Z]/;
        return re.test(text);
    }

    static validateHotline(text){
        var re = /^1[89]00\d{4}$/;
        return re.test(text);
    }

    static cloneObject (_object){
        return JSON.parse(JSON.stringify(_object))
    }

    /**
     * Get type resource
     */
    static getTypeResource = (type) => {
        let resType = 0;
        switch (type) {
            case "video/mp4":
            case "video/3gpp":
            case "video/3gpp2":
            case "video/x-flv":
            case "application/x-mpegURL":
            case "video/MP2T":
            case "video/quicktime":
            case "video/x-msvideo":
            case "video/x-matroska":
            case "video/x-ms-wmv":
            case "video":
                resType = resourceType.VIDEO
                break;
            case "image/png":
            case "image/jpeg":
            case "image/apng":
            case "image/bmp":
            case "image/gif":
            case "image/x-icon":
            case "image/svg+xml":
            case "image/tiff":
            case "image/webp":
            case "image":
                resType = resourceType.IMAGE
                break;
            default:
                break;
        }
        return resType;
    }

    /**
     * Set status bar color
     */
    static setStatusBarColor() {
        Platform.OS === "android" ? StatusBar.setBackgroundColor(Colors.COLOR_PRIMARY) : StatusBar.setBarStyle('dark-content', true);
    }

    /**
     * Convert image, video ios to loca path
     */
    static convertLocalIdentifierIOSToAssetLibrary = (localIdentifier, isPhoto) => {
        if (localIdentifier.indexOf('file://') != -1) {
            return localIdentifier;
        }
        var regex = /:\/\/(.{36})\//i;
        var result = localIdentifier.match(regex);
        const ext = isPhoto ? 'JPG' : 'MOV';
        return `assets-library://asset/asset.${ext}?id=${result[1]}&ext=${ext}`;
    };
}
