export interface Authentication{
    message: string,
    isAuthenticated: boolean,
    userName: string,
    email: string,
    token: string,
    refreshToken: string,
}