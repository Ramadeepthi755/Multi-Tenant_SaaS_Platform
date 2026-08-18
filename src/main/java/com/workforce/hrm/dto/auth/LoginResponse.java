package com.workforce.hrm.dto.auth;

public class LoginResponse {

    private String token;

    private UserAuthResponse user;

    public LoginResponse() {
    }

    public LoginResponse(
            String token,
            UserAuthResponse user) {

        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserAuthResponse getUser() {
        return user;
    }

    public void setUser(UserAuthResponse user) {
        this.user = user;
    }
}