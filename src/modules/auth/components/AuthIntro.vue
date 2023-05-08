<template>
    <div class="auth__intro relative w-382 px-48p py-36p">
        <div class="relative z-1">
            <img class="logo" src="@/assets/images/logo.svg" alt="banner" />
            <h2 class="font-heading font-semibold italic text-23 text-neutrals-700">It's time</h2>
            <h3 class="font-heading text-32 text-neutrals-700">to get conversational</h3>
        </div>
        <div class="intro__image"></div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'AuthIntro',
    setup() {
        return {};
    },
};
</script>

<style lang="scss" scoped>
.auth__intro {
    background-color: #f4f7ff;
    .logo {
        margin-bottom: 108px;
    }
    h3 {
        line-height: 32px;
        margin-top: 21px;
        margin-bottom: 105px;
    }
    .intro__image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        min-height: 600px;
        background-image: url(./../images/intro-image.png);
        background-position: center bottom;
        background-repeat: no-repeat;
        background-size: contain;
    }
}
</style>
