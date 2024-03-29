export const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                isFetching: true,
                error: false
            }
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                isFetching: false,
                error: false
            }
        case "LOGIN_FAILURE":
            return {
                user: null,
                isFetching: false,
                error: action.payload
            }
        case "EXIT":
            return {
                user: null,
                isFetching: false,
                error: false
            }
        case "UPLOADED":
            return {
                user: action.payload,
                isFetching: false,
                error: false
            }

        default:
            return state;
    }
}