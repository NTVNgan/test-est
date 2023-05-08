import { format } from 'date-fns';
import { truncate } from 'lodash';

function toFixedNumberic(number: number, fixed: number) {
    const regex = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
    const strinNum: any = number.toString();
    const numberFixed = strinNum.match(regex)[0];
    const result = new Intl.NumberFormat(undefined, { maximumSignificantDigits: 20 }).format(numberFixed);
    return result;
}

export default {
    formatCurrency(value: number, { rounded = 5, currency }: any) {
        if (isNaN(value)) {
            return 0;
        }
        if (currency) {
            switch (currency.toLowerCase()) {
                case 'vnd':
                    return new Intl.NumberFormat().format(value) + ' VND';
                case 'dolar':
                    return '$' + toFixedNumberic(value, rounded);
            }
        }
        return new Intl.NumberFormat().format(value);
    },
    formatDate(value: any, formatType: string) {
        if (value) {
            return format(value, formatType);
        }
        return '';
    },
    formatAMPM(time: any) {
        const date = new Date(time);
        let hours = date.getHours();
        let minutes = date.getMinutes().toString();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes.length == 1 ? '0' + minutes : minutes;
        let hoursString = hours.toString();
        if (ampm == 'AM' && hours == 12) hoursString = '00';
        hoursString = hoursString.length == 1 ? '0' + hoursString : hoursString;
        return hoursString + ':' + minutes + ' ' + ampm;
    },
    showFormatAMPM(time: any, show: boolean, showAt = false, showComma = false) {
        if (!show) {
            if (showAt) return 'at ' + this.formatAMPM(time);
            if (showComma) return ', ' + this.formatAMPM(time);
            return this.formatAMPM(time);
        } else return '';
    },
    formatTime(time: any, isshowFormatAMPM: boolean, logInMessageDetail = false, groupTime = false, showAt = true) {
        if (time) {
            this.formatAMPM(time);
            switch (typeof time) {
                case 'number':
                    break;
                case 'string':
                    time = +new Date(time);
                    break;
                case 'object':
                    if (time.constructor === Date) time = time.getTime();
                    break;
                default:
                    time = +new Date();
            }

            const getTimeSet = new Date(time); //time
            const current = new Date(); //now
            const yesterday = new Date();
            yesterday.setDate(current.getDate() - 1); //yesterday
            const moreYesterday = new Date(yesterday);
            moreYesterday.setDate(moreYesterday.getDate() - 1);
            const seconds = (+new Date() - time) / 1000;

            if (getTimeSet.getFullYear() === current.getFullYear()) {
                // same year
                if (getTimeSet.getMonth() + 1 === current.getMonth() + 1) {
                    // same month
                    if (getTimeSet.getDate() === current.getDate()) {
                        //same date
                        if (groupTime) return 'Today';
                        if (seconds <= 60) return 'Now';
                        else return this.formatAMPM(time);
                    } else if (getTimeSet.getDate() === yesterday.getDate()) {
                        // > 1 days
                        return 'Yesterday' + ' ' + this.showFormatAMPM(time, isshowFormatAMPM, showAt);
                        // } else if (getTimeSet.getDate() == moreYesterday.getDate() || getTimeSet.getDate() > moreYesterday.getDate() || getTimeSet.getDate() < moreYesterday.getDate()) { // > 2 days
                    } else {
                        return (
                            new Date(time).toString().slice(4, 10) +
                            this.showFormatAMPM(time, isshowFormatAMPM, false, true)
                        );
                    }
                } else {
                    //different month
                    if (getTimeSet.getDate() === yesterday.getDate()) {
                        // > 1 days
                        return 'Yesterday' + ' ' + this.showFormatAMPM(time, isshowFormatAMPM, showAt);
                    } else {
                        return (
                            new Date(time).toString().slice(4, 10) +
                            this.showFormatAMPM(time, isshowFormatAMPM, false, true)
                        );
                    }
                }
            } else {
                return (
                    new Date(time)
                        .toString()
                        .slice(4, 15)
                        .replace(/ (?![\s\S]* )/, ', ') +
                    ' ' +
                    this.showFormatAMPM(time, isshowFormatAMPM)
                );
            }
        }
    },

    textBeforeTime(time: any) {
        if (time) {
            this.formatAMPM(time);
            switch (typeof time) {
                case 'number':
                    break;
                case 'string':
                    time = +new Date(time);
                    break;
                case 'object':
                    if (time.constructor === Date) time = time.getTime();
                    break;
                default:
                    time = +new Date();
            }

            // const seconds = (+new Date() - time) / 1000;
            // switch (true) {
            //     case seconds < 60:
            //         return 'just now';
            //     case seconds < 86400: // 24h
            //         return 'at';
            //     case seconds > 86400: // 48h
            //         return 'on';
            // }
            const getTimeSet = new Date(time); //time
            const current = new Date(); //now
            const yesterday = new Date();
            yesterday.setDate(current.getDate() - 1); //yesterday
            const moreYesterday = new Date(yesterday);
            moreYesterday.setDate(moreYesterday.getDate() - 1);
            const seconds = (+new Date() - time) / 1000;

            if (getTimeSet.getFullYear() === current.getFullYear()) {
                // same year
                if (getTimeSet.getMonth() + 1 === current.getMonth() + 1) {
                    // same month
                    if (getTimeSet.getDate() === current.getDate()) {
                        //same date
                        if (seconds <= 60) return 'just now';
                        else return 'at';
                    } else if (getTimeSet.getDate() === yesterday.getDate()) {
                        // > 1 days
                        return '';
                    } else {
                        return 'on';
                    }
                } else {
                    if (getTimeSet.getDate() === yesterday.getDate()) {
                        // > 1 days
                        return '';
                        // } else if (getTimeSet.getTime() >= moreYesterday.getTime()) { // > 2 days
                    } else {
                        return 'on';
                    }
                }
            } else {
                return 'on';
            }
        }
    },
    formatBytes(bytes: any, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    formatNumberWithCommas(number: number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    convertImgAvatar(record: string, userList: any, envURL: any) {
        if (record && userList && envURL) {
            const name = userList.filter((value: any) => {
                return value._id === record;
            });
            if (name[0]){
                if (name[0].avatar_src){
                    return envURL+'/'+name[0].avatar_src;
                } else {
                    return 'null';
                }
            }
            else {
                return '';
            }
        } else {
            return '';
        }
    },

    convertBgAvatar(record: string, userList: any) {
        if (record && userList) {
            const name = userList.filter((value: any) => {
                return value._id === record;
            });
            if (name[0])
                return name[0].avatar_bg;
            else return '';
        } else {
            return '';
        }
    },

    convertNameUpdate(record: string, userList: any) {
        if (record && userList) {
            const name = userList.filter((value: any) => {
                return value._id === record;
            });
            if (name[0])
                return name[0].username;
            else return '';
        } else {
            return '';
        }
    },

    checkZero(val: any) {
        if (val.toString().length == 1) {
            val = '0' + val;
        }
        return val;
    },

    convertDate(val: Date) {
        const day = val.getDate();
        const month = val.getMonth() + 1;
        const year = val.getFullYear();
        return year + '-' + this.checkZero(month) + '-' + this.checkZero(day);
    },

    truncateFileName(filePath: string) {
        const findLastIndex = filePath.lastIndexOf('.');
        const fileName = filePath.slice(0, findLastIndex);
        const fileExtension = filePath.slice(findLastIndex, filePath.length);
        return `<span class="truncate">${ fileName }</span><span>${ fileExtension }</span>`
    },
};
