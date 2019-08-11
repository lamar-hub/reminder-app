export class User {
    constructor(
        public userId: string,
        public email: string,
        private _token: string,
        private expirationTime: Date) {
    }

    get token() {
        if (!this.expirationTime || this.expirationTime <= new Date()) {
            return null;
        }
        return this._token;
    }

    get tokenDuration() {
        if (!this.token) {
            return 0;
        }
        return this.expirationTime.getTime() - new Date().getTime();
        // return 4000;
    }
}
