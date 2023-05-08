declare const __process: NodeJS.Process; // has been set in rollup.config
declare const _lb_gvar: any; // has been set in rollup.config

export default (function() {
    'use strict';

    /**
     * Get cookies
     *
     * @return {Object}
     */
    function getCookies(name?: string) {
        let cookies: Array<any> | { [key: string]: any[] } = document.cookie.split(';');
        cookies = (cookies as Array<any>).reduce(function(preResult, currentVal) {
            const tmpVals = currentVal.split('=');
            tmpVals.length > 1 && (preResult[tmpVals[0].trim()] = tmpVals[1]);
            return preResult;
        }, {});
        if (!name) return cookies;
        else
            return (cookies as Record<string, any>)[name] !== undefined ? (cookies as Record<string, any>)[name] : null;
    }

    function setCookie(name: string, value: any, days: number) {
        let expires = '';
        if (days > 0) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        } else if (days === -1) {
            const date = new Date(2147483647 * 1000).toUTCString();
            expires = '; expires=' + date;
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }

    /**
     * Generate guestId
     *
     * @return {String}
     */
    function generateGuestId() {
        const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
        return (
            timestamp +
            'xxxxxxxxxxxxxxxx'
                .replace(/[x]/g, function() {
                    return ((Math.random() * 16) | 0).toString(16);
                })
                .toLowerCase()
        );
    }

    /**
     * Get guestId
     *
     * @return {String}
     */
    function getGuestId() {
        let guestId = getCookies('_lb_gid');

        if (!guestId) {
            guestId = generateGuestId();
            setCookie('_lb_gid', guestId, -1);
        }

        return guestId;
    }

    /**
     * Get geo from IP
     * @param ip - IP address
     * @returns
     */
    async function getGeo() {
        const ipLociUrl = 'https://freegeoip.app/json/'; // ip location api url
        const geoApiUrl = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
        let response = await fetch(ipLociUrl);
        const geo = await response.json();

        const tzOffset = new Date().getTimezoneOffset() / 60; // +2 (in hour)
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // i.e. Europe/Berlin

        // Get detail location from long,lat
        const lat = typeof geo !== 'undefined' ? geo.latitude : '0';
        const long = typeof geo !== 'undefined' ? geo.longitude : '0';
        response = await fetch(`${geoApiUrl}?latitude=${lat}&longitude=${long}`);
        const location = await response.json();

        return {
            ip: geo.ip,
            timezone: {
                name: timezone,
                offset: tzOffset,
            },
            geo: location,
        };
    }

    const domain = window.location.hostname;
    const guestId = typeof window.LINEBASE_GUEST_ID !== 'undefined' ? window.LINEBASE_GUEST_ID : getGuestId();
    // const cookie = getCookies()["cart"];
    const globalData = typeof _lb_gvar !== 'undefined' ? _lb_gvar : null;

    const payloadGuestInfo = {
        org_id: window.LINEBASE_ORG_ID,
        workspace_id: window.LINEBASE_WORKSPACE_ID,
        domain: domain,
        guest_id: guestId,
        // cookie: cookie,
        current_page: window.location.href,
        referrer_page: document.referrer ? encodeURI(document.referrer) : null,
        ...globalData,
    };

    function setAttribute(data: [any]) {
        const res: any = {};
        const metadata: Metadata = { scope: null, key: null, value: null };
        data.forEach(element => {
            metadata.scope = element[0] || null;
            if (metadata.scope) {
                metadata.key = metadata.scope.split(':')[1] || null;
                metadata.scope = metadata.scope.split(':')[0] || null;
            }
            metadata.value = element[1] || null;

            if (metadata.value && Array.isArray(metadata.value)) {
                if (metadata.scope === 'session') {
                    if (metadata.key === 'contact') {
                        res[metadata.value[0]] = metadata.value[1];
                    }
                    if (metadata.key === 'attribute') {
                        res['attributes'] = res['attributes'] || {};
                        metadata.value.forEach((el: any) => {
                            if (el && Array.isArray(el)) {
                                res['attributes'][el[0]] = el[1];
                            }
                        });
                    }
                }
            }
        });

        return res;
    }

    /**
     * Get additional data (custom pushing data) from client
     * @param data
     * @returns
     */
    function getAdditionalData(data: Record<string, [any]>): Record<string, any> {
        let res: any = {};
        if (data['set'] && Array.isArray(data['set'])) {
            res = setAttribute(data.set);
        }

        return res;
    }

    interface Metadata {
        scope: string | null;
        key: string | null;
        value: any;
    }

    const lb = window.$linebase ?? null;
    console.log('CONTACT DEBUG', getAdditionalData(lb));
    async function getContactInfo() {
        const constants = { guest_local_key: 'setanykeyname' }; // 'setanykeyname' should be match your local storage key
        const localGuest = localStorage.getItem(constants.guest_local_key);
        if (localGuest) {
            const guestInfo = JSON.parse(localGuest);
            window.$linebase.contact = guestInfo;
            return guestInfo;
        } else {
            const payload = {
                ...(await getGeo()),
                ...payloadGuestInfo,
                contact: {
                    ...getAdditionalData(lb),
                    guest_id: guestId,
                },
            };

            // const fetchUrl = (window.location.hostname === 'localhost') ? 'http://localhost:3002/cdp/api/v1/' :
            const fetchUrl = `${__process.env.VUE_APP_ROOT_API}/cdp/api/v1/`;
            const response = await fetch(fetchUrl + `contacts/detect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const res = await response.json();
            console.log('contact data response: ', res);
            let contactInfo = null;
            if (!res.error) {
                const data = res.data;
                contactInfo = Object.assign(data, payload);
                window.$linebase.contact = contactInfo;
            }
            return contactInfo;
        }
    }

    return {
        getContactInfo: getContactInfo,
    };
})().getContactInfo;
