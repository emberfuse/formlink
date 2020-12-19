import moment from 'moment';

export function fromNow(timestamp) {
    return moment(timestamp).local().fromNow();
}
