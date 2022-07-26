import { dateFormatConstants } from 'utils/constants';

import MomentUtils from '@date-io/moment';

export default class TabulaMomentUtils extends MomentUtils {
    parse(value, format) {
        if (value === '') {
            return null;
        }
        const momentValue = this.moment(value, format, true);
        //NOTE: This condition to handle case user type data in TblDateTimePicker
        if(format === dateFormatConstants.TWELVE_HOURS_TWO_DIGITS_TIME && momentValue.isValid()){
          return this.moment().set({'hour': momentValue.get('hour'),'minute': momentValue.get('minute')});
        }
        return momentValue;
    }
}