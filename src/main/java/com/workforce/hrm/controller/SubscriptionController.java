package com.workforce.hrm.controller;

import com.workforce.hrm.dto.response.ApiResponse;
import com.workforce.hrm.dto.response.SubscriptionUsageDTO;
import com.workforce.hrm.entity.CompanySubscription;
import com.workforce.hrm.entity.SubscriptionPlan;
import com.workforce.hrm.service.SubscriptionService;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/subscription", "/api/subscriptions"})
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @Autowired
    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/usage")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN', 'HR')")
    public ResponseEntity<ApiResponse<SubscriptionUsageDTO>> getUsage() {
        SubscriptionUsageDTO usage = subscriptionService.getCurrentSubscriptionUsage();
        return ResponseEntity.ok(ApiResponse.success("Subscription usage loaded", usage));
    }

    @GetMapping("/plans")
    public ResponseEntity<ApiResponse<List<SubscriptionPlan>>> getPlans() {
        List<SubscriptionPlan> plans = subscriptionService.getAllPlans();
        return ResponseEntity.ok(ApiResponse.success("Available subscription plans", plans));
    }

    @PostMapping("/change-plan")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'COMPANY_ADMIN')")
    public ResponseEntity<ApiResponse<CompanySubscription>> changePlan(@RequestBody Map<String, String> payload) {
        String planCode = payload.get("planCode");
        CompanySubscription sub = subscriptionService.changeSubscriptionPlan(planCode);
        return ResponseEntity.ok(ApiResponse.success("Subscription upgraded successfully", sub));
    }
}
