import './polyfills';
import * as json_api_utils from './json-api-utils';
import extenders from './ko-extenders';
import KOFormBase from './ko-form-base';
import Fraction from 'fraction.js';
import humanizeDuration from 'humanize-duration';
import ko from 'knockout';

let extenders_assigned = false;

export default class KnockoutJsonApiUtils {
  static setupExtenders(){
    if (!extenders_assigned) {
      Object.assign(ko.extenders, extenders);
      extenders_assigned = true;
    }
  }
  static get utils(){
    return json_api_utils;
  }
  static get KOFormBase(){
    return KOFormBase;
  }
  static get Fraction(){
    return Fraction;
  }
  static get humanizeDuration(){
    return humanizeDuration;
  }
};
