import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/pages/index.vue'

const routes = [
    {
      path: '/',
      name: 'index',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Index
    },
    {
      path: '/produits/:recherche?',
      name: 'produits',
      component: () => import('@/pages/produits.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/pages/contact.vue')
    },
    {
      path: '/produit/:id',
      name: 'produit',
      component: () => import('@/pages/produit.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/register.vue')
    },
    {
      path: '/commander',
      name: 'commander',
      component: () => import('@/pages/commander.vue')
    },
    {
      path: '/articles',
      name: 'articles',
      component: () => import('@/pages/articles.vue')
    },
    {
      path: '/blog/:id',
      name: 'blog',
      component: () => import('@/pages/blog.vue')
    },
    {
      path: '/theme',
      name: 'theme',
      component: () => import('@/pages/theme.vue')
    },
    {
      path: '/vote',
      name: 'vote',
      component: () => import('@/pages/vote.vue')
    }
    ,
    {
      path: '/club/:id',
      name: 'club',
      component: () => import('@/pages/club.vue')
    },
    {
      path: '/match/:id',
      name: 'match',
      component: () => import('@/pages/match.vue')
    },
    {
      path: '/clubs',
      name: 'clubs',
      component: () => import('@/pages/clubs.vue')
    },
    {
      path: '/classement',
      name: 'classement',
      component: () => import('@/pages/classement.vue')
    },
    
    {
      path: '/commandes',
      name: 'commandes',
      component: () => import('@/pages/commandes.vue')
    },
    {
      path: '/commande/:id',
      name: 'commande',
      component: () => import('@/pages/commande.vue')
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
