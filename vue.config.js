module.exports = {
    // options...
    chainWebpack: config => {
        // A, remove the plugin
        config.plugins.delete('prefetch');

    },
};
