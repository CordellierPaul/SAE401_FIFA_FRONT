import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/pages/index.vue'

const routes = [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/produits',
      name: 'produits',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/pages/produits.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/pages/contact.vue')
    },
    {
      path: '/produit/:id',
      name: 'produit',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/pages/produit.vue')
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/pages/login.vue')
    },
    {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/pages/register.vue')
    },
    {
      path: '/commander',
      name: 'commander',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/pages/commander.vue')
    },
    {
      path: '/articles',
      name: 'articles',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/pages/articles.vue')
    },
    {
      path: '/blog/:id',
      name: 'blog',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/pages/blog.vue')
    },
    {
      path: '/theme',
      name: 'theme',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/pages/theme.vue')
    },
    {
      path: '/vote',
      name: 'vote',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/pages/vote.vue')
    }
    ,
    {
      path: '/club/:id',
      name: 'club',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/pages/club.vue')
    },
    {
      path: '/clubs',
      name: 'clubs',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/pages/clubs.vue')
    },
    {
      path: '/parametres-compte',
      name: 'parametres-compte',
      component: () => import('@/pages/parametresCompte.vue')
    },
    {
      path: '/parametres-compte/donnees-bancaires',
      name: 'donnees-bancaires',
      component: () => import('@/pages/donneesBancaires.vue')
    },
    {
      path: '/erreur-pas-connecte',
      name: 'erreur-pas-connecte',
      component: () => import('@/pages/erreurPasConnecte.vue')
    }
  ];

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});
