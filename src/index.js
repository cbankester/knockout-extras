import './polyfills';
import * as json_api_utils from './json-api-utils';
import KOFormBase from './ko-form-base';

window.ko_extras = {};

Object.assign(window.ko_extras, {json_api_utils, KOFormBase});
