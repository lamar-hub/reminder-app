export class User {
    constructor(
        private userId: string,
        public email: string,
        private token: string,
        private expirationTime: string
    ) {
    }
}
