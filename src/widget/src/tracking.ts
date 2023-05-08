export default (function () {
    'use strict';

    const contactInfo = window.$linebase.contact;
    const ioClient = window.$linebase.io;

    if (!contactInfo) {
        console.error('Cant get visitorInfo')
    }

    ioClient.emit('contactActivity', { ...contactInfo, ...{ contact_activity_type: 1 } });

    /**
     * Detect idle status of visitor
     * @type {Array}
     */
    const intervals: Array<any> = [];
    ioClient.on('resetIdleTimer', function (data: any) {
        console.log('resetIdleTimer', data);

        intervals.forEach(clearInterval);
        const idleTimeRange: number = 0.2; // Time in minutes // 12 seconds to test
        const currentTime: number = Date.parse((new Date()).toDateString());
        const deadline: string = (new Date(currentTime + idleTimeRange * 60 * 1000)).toDateString();
        function updateClock() {
            const t = getTimeRemaining(deadline);
            //console.log(t);
            if (t.total <= 0) {
                clearInterval(idleTimeInterval);
                // ioClient.emit('sendIdleStatus', {
                //     org_id: window.LINEBASE_ORG_ID,
                //     contact_id: window.$linebase.contact._id,
                //     convo_id: window.$linebase.contact.conversation_id,
                // });
            }
        }
        updateClock();
        const idleTimeInterval = setInterval(updateClock, 1000);
        intervals.push(idleTimeInterval);
    });

    /**
     * Get time amount after interval time
     * @param endTime
     * @returns {{total: number, hours: number, seconds: number, minutes: number, days: number}}
     */
    function getTimeRemaining(endTime: string) {
        const total = Date.parse(endTime) - Date.parse((new Date()).toDateString());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24));

        return {
            total,
            days,
            hours,
            minutes,
            seconds
        };
    }
})();
