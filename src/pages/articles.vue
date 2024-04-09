<template>
    <div class="min-h-screen">
        <div v-if="articles">

            <div class="sticky top-20 z-[5] bg-secondary p-4 flex  items-center text-white min-h-20" >
                
                <div class="text-sm breadcrumbs hidden lg:block">
                    <ul>
                        <li><RouterLink :to="{name: 'index'}" class="hover:opacity-50 hover:cursor-pointer">FIFA</RouterLink></li> 
                        <li>Articles</li>
                    </ul>
                </div>
            </div>
            <p class="flex justify-center items-center m-12 text-3xl font-bold">Articles</p>
            <div class="m-5 *:my-8">
                
                <ArticleComponent v-if="articles" v-for="(article, index) in articles" key="index" :article="article"></ArticleComponent>
            </div>
        </div>
        <div v-else class="flex justify-center items-center h-screen">
            <span class="loading loading-spinner loading-lg"></span>
        </div>

    </div>

</template>

<script setup>
    import ArticleComponent from '@/components/article/ArticleComponent.vue'
    import { useRouter } from 'vue-router';
    import { getRequest } from '../composable/httpRequests.js'
    import { ref } from 'vue'
    const router = useRouter();
    function retour (){
        router.back()
    }
    
    const articles = ref([])

    getRequest(articles, "https://apififa2.azurewebsites.net/api/article");
</script>