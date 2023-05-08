// import { reactive } from 'vue';

// let linebase: any = reactive<any>({});

function removeJS(filename: string) {
    const tags = document.getElementsByTagName('script');
    for (let i = tags.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
        if (tags[i] && tags[i].getAttribute('src') != null && tags[i].getAttribute('src')?.indexOf(filename) != -1) {
            console.log(':: REMOVED APPENDED SCRIPT ::', tags[i]);
            tags[i].parentNode?.removeChild(tags[i]); //remove element by calling parentNode.removeChild()
        }
    }
}

export const useLinebase = () => {
    /** INIT/LOAD LINEBASE SCRIPTS */
    const loadScript = (data?: any, callback?: Function) => {
        if (!window.$linebase) {
            console.log('::INSTALL CW:: script');
            const guest_id = data?._id ? `${data?._id}` : `${(new Date()).getTime()}`;
            const linebaseScript = document.createElement('script');
            linebaseScript.setAttribute('type', 'text/javascript');
            linebaseScript.setAttribute('class', 'linebase-widget-script-tag');
            linebaseScript.text = `window.$linebase={set:[]};
window.LINEBASE_GUEST_ID="${guest_id}";
window.LINEBASE_ORG_ID='${process.env.VUE_APP_LINEBASE_ORG_ID}';
window.LINEBASE_WORKSPACE_ID='${process.env.VUE_APP_LINEBASE_WORKSPACE_ID}';
(function(){d=document;s=d.createElement('script');s.src='${process.env.VUE_APP_WIDGET_URL}/main.js';s.async=1;d.getElementsByTagName('head')[0].appendChild(s);})();`;
            const scriptTag = document.head.appendChild(linebaseScript);

            window.$linebase.scriptTag = scriptTag;
        }

        if (window.$linebase.set && data) {
            const dataSession = [];
            dataSession.push(['installed_at', data.created_at]);
            // Update session data (attributes & contact info)
            window.$linebase.set.push(["session:attribute", dataSession]);
            window.$linebase.set.push(["session:contact", ["name", data.username]]);
            window.$linebase.set.push(['session:contact', ["email", data.email]]);
        }
        if (callback) { // callback function
            window.$linebase.scriptTag.onload = callback();
        }

        // return Promise.resolve(linebase);
    }

    /** REMOVE LINEBASE */
    const clearScript = (callback?: Function) => {
        if (window.$linebase) {
            if (document.contains(document.getElementById("linebase-widget"))) {
                // console.log(':: REMOVE CW 1 ::', document.getElementById("linebase-widget"));
                document.getElementById("linebase-widget")?.remove();

                const lbClassEl = document.getElementsByClassName("linebase-widget");
                while (lbClassEl[0]) {
                    console.log(':: REMOVE CW 2 ::', lbClassEl[0].parentNode?.removeChild(lbClassEl[0]));
                    lbClassEl[0].parentNode?.removeChild(lbClassEl[0]);
                }
            }
            if (window.$linebase.scriptTag) {
                console.log('::REMOVE::', window.$linebase.scriptTag);
                document.head.removeChild(window.$linebase.scriptTag);
            }
            removeJS(`${process.env.VUE_APP_WIDGET_URL}/main.js`);
            removeJS(`${process.env.VUE_APP_WIDGET_URL}/socket.js`);
            removeJS(`${process.env.VUE_APP_WIDGET_URL}/tracking.js`);
            removeJS(`${process.env.VUE_APP_WIDGET_URL}/bundle-widget.js`);

            delete (window.$linebase); // this removes the variable completely
            console.log(':::: DELETED LINEBASE SCRIPT ::::');

            if (callback) { // callback function
                callback();
            }
        }
    }

    /**
     * Dynamically removing an external JavaScript or CSS file
     * @param fileName 
     * @param fileType 
     * @example
     *  removeFile("somescript.js", "js") // remove all occurences of "somescript.js" on page
     *  removeFile("somestyle.css", "css") // remove all occurences "somestyle.css" on page
     */
    const removeFile = (fileName: string, fileType?: 'css' | 'js'): void => {
        // determine element type to create nodelist from
        const targetElement = (fileType?.toString() == "js") ? "script" : (fileType?.toString() == "css") ? "link" : "none";
        // determine corresponding attribute to test for
        const targetAttr = (fileType?.toString() == "js") ? "src" : (fileType?.toString() == "css") ? "href" : "none";

        const allSuspects = document.getElementsByTagName(targetElement);
        for (let i = allSuspects.length; i >= 0; i--) { // search backwards within nodelist for matching elements to remove
            if (allSuspects[i]
                && allSuspects[i].getAttribute(targetAttr) != null
                && allSuspects[i].getAttribute(targetAttr)?.indexOf(fileName) != -1
            ) {
                allSuspects[i].parentNode?.removeChild(allSuspects[i]); //remove element by calling parentNode.removeChild()
            }
        }
    }

    return { loadScript, clearScript };
}