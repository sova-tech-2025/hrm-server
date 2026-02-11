import { ACCESS_CLIENT_URL, CLIENT_ID, CLIENT_URL } from "../constants/env.constants"

export const generateLoginFun = () => {
    return `${ACCESS_CLIENT_URL}/login?client_id=${CLIENT_ID}&redirect_uri=${CLIENT_URL}/auth/access`
}