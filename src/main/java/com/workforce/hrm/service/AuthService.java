package com.workforce.hrm.service;

import com.workforce.hrm.dto.auth.LoginRequest;
import com.workforce.hrm.dto.auth.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    void logout();
}