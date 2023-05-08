export default {
    validateEmail(value: string) {
        if (value) {
           
            const regex = new RegExp(
                /(^[a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*[.][a-zA-Z]{2,})+$/,
            );
            return regex.test(value);
        }
        return false;
    },

    hoursToAMPM(num: number) {
        const hours = Math.floor(num / 60);
        const minutes = num % 60;
        const h = hours % 12 || 12;
        let hString = h.toString();
        hString = hString.length == 1 ? '0' + hString : hString;
        // return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)} ${hours >= 12 ? 'pm' : 'am'}`;
        return `${hString}:${('0' + minutes).slice(-2)} ${hours >= 12 ? 'PM' : 'AM'}`;
    },

    formatAMPM(time: any): string {
        const date = new Date(time);
        console.log({ time, date });
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
    showFormatAMPM(time: any, show: boolean, showAt = false): string {
        if (!show) {
            if (showAt) return 'at ' + this.formatAMPM(time);
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
                        if (logInMessageDetail)
                            return (
                                new Date(time).toString().slice(4, 10) +
                                ', ' +
                                this.showFormatAMPM(time, isshowFormatAMPM)
                            );
                        return (
                            new Date(time).toString().slice(4, 11) +
                            ' ' +
                            this.showFormatAMPM(time, isshowFormatAMPM, showAt)
                        );
                    }
                } else {
                    //different month
                    if (getTimeSet.getDate() === yesterday.getDate()) {
                        // > 1 days
                        return 'Yesterday' + ' ' + this.showFormatAMPM(time, isshowFormatAMPM, true);
                    } else {
                        if (logInMessageDetail)
                            return (
                                new Date(time).toString().slice(4, 10) +
                                ', ' +
                                this.showFormatAMPM(time, isshowFormatAMPM)
                            );
                        return (
                            new Date(time).toString().slice(4, 11) + ' ' + this.showFormatAMPM(time, isshowFormatAMPM)
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
                    } else if (getTimeSet.getDate() <= moreYesterday.getDate()) {
                        // > 2 days
                        return 'on';
                    }
                } else {
                    if (getTimeSet.getDate() === yesterday.getDate()) {
                        // > 1 days
                        return '';
                    } else if (getTimeSet.getTime() <= moreYesterday.getTime()) {
                        // > 2 days
                        return 'on';
                    }
                }
            } else {
                return 'on';
            }
        }
    },
};
