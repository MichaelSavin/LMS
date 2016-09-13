import 'babel-polyfill';
import 'sanitize.css/sanitize.css';

import store from './store';
store();

import { install } from 'offline-plugin/runtime';
install();
