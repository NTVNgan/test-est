<template>
    <div class="flex flex-col ">
        <h1 class="text-12">{{ msg }}</h1>

        <div class="relative overflow-hidden mb-8">
            <div class="rounded-t-xl overflow-hidden bg-gradient-to-r from-purple-50 to-purple-100 p-10 h-96">
                <div class="flex flex-col">
                    <div class="flex">
                        <avatar-component
                            :label-show="false"
                            size="extra-large"
                            label-avatar="Oluwayemisi Eun-Jung"
                            class-component="mr-4"
                            bgAvatar="bg-avatar-2"
                        />
                        <avatar-component
                            :label-show="false"
                            size="large"
                            label-avatar="Oluwayemisi Eun-Jung"
                            class-component="mr-4"
                            bgAvatar="bg-avatar-2"
                        />
                        <avatar-component
                            size="medium"
                            :label-show="false"
                            label-avatar="Oluwayemisi Eun-Jung"
                            class-component="mr-4"
                            bgAvatar="bg-avatar-2"
                        />
                        <avatar-component
                            size="small"
                            :label-show="false"
                            label-avatar="Oluwayemisi Eun-Jung"
                            class-component="mr-4"
                            bgAvatar="bg-avatar-2"
                        />
                        <avatar-component size="xs" :label-show="false" label-avatar="Oluwayemisi Eun-Jung" />
                    </div>
                    <div class="flex mt-5">
                        <avatar-component
                            image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
                            :label-show="false"
                            size="extra-large"
                            label-avatar="Oluwayemisi Eun-Jung"
                            class-component="mr-4"
                        />
                        <avatar-component
                            image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
                            :label-show="false"
                            size="large"
                            label-avatar="Oluwayemisi Eun-Jung"
                            class-component="mr-4"
                        />
                        <avatar-component
                            image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
                            size="medium"
                            :label-show="false"
                            label-avatar="Oluwayemisi Eun-Jung"
                            class-component="mr-4"
                        />
                        <avatar-component
                            image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
                            size="small"
                            :label-show="false"
                            label-avatar="Oluwayemisi Eun-Jung"
                            class-component="mr-4"
                        />
                        <avatar-component
                            image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
                            size="xs"
                            :label-show="false"
                            label-avatar="Oluwayemisi Eun-Jung"
                        />
                    </div>
                    <div class="flex mt-5">
                        <avatar-component
                            image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
                            :label-show="true"
                            size="extra-large"
                            label-avatar="Oluwayemisi Eun-Jung"
                            class-component="mr-4"
                        />
                        <avatar-component
                            image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
                            :label-show="true"
                            size="large"
                            label-avatar="Oluwayemisi Eun-Jung"
                            class-component="mr-4"
                        />
                        <avatar-component
                            image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
                            size="medium"
                            :label-show="true"
                            label-avatar="Oluwayemisi Eun-Jung"
                            class-component="mr-4"
                        />
                        <avatar-component
                            image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
                            size="small"
                            :label-show="true"
                            label-avatar="Oluwayemisi Eun-Jung"
                            class-component="mr-4"
                        />
                        <avatar-component
                            image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
                            size="xs"
                            :label-show="true"
                            label-avatar="Oluwayemisi Eun-Jung"
                        />
                    </div>
                </div>
            </div>
        </div>

        <!--
	    
	    <div>
		    <p>You clicked {{ numOfClick }} times</p>
		    <button @click="handleClick()">Click me to increment</button>
	    </div>

      <div>
        <input type="text" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-pink-300 placeholder-pink-500 text-pink-900 rounded-t-md focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"/>
      </div>-->
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import AvatarComponent from '@/components/ui/AvatarComponent.vue';

export default defineComponent({
    name: 'DSAvatar',
    components: { AvatarComponent },
    props: {
        msg: String,
    },
    setup() {
        const numOfClick = ref(0);
        const handleClick = () => {
            numOfClick.value++;
        };

        return {
            handleClick,
            numOfClick,
        };
    },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
