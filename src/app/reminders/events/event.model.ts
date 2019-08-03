import {PlaceLocation} from './location.model';

export class Event {
    constructor(
        public id: string,
        public title: string,
        public notes: string,
        public date: Date,
        public beginTime: Date,
        public endTime: Date,
        public location: PlaceLocation) {
    }
}
