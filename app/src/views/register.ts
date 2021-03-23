import Vue from 'vue';

import PublicView from './public/';
const PrivateView = () => import(/* webpackChunkName: "private-view" */ './private');
const SmartView = () => import(/* webpackChunkName: "smart-view" */ './smart');

Vue.component('public-view', PublicView);
Vue.component('private-view', PrivateView);
Vue.component('smart-view', SmartView);
