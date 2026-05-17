package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/tursinaalam/pesantren-api/internal/dto"
	"github.com/tursinaalam/pesantren-api/internal/service"
	"github.com/tursinaalam/pesantren-api/internal/utils"
)

type AuthHandler struct {
	svc *service.AuthService
}

func NewAuthHandler(svc *service.AuthService) *AuthHandler {
	return &AuthHandler{svc: svc}
}

// Login godoc
// @Summary Login user
// @Tags Auth
// @Accept json
// @Produce json
// @Param body body dto.LoginRequest true "Login credentials"
// @Success 200 {object} utils.StandardResponse
// @Router /api/v1/auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResBadRequest(c, "Validation failed", err.Error())
		return
	}
	resp, err := h.svc.Login(req, c.ClientIP(), c.GetHeader("User-Agent"))
	if err != nil {
		utils.ResUnauthorized(c, err.Error())
		return
	}
	utils.ResOK(c, "Login successful", resp)
}

// RefreshToken godoc
// @Summary Refresh access token
// @Tags Auth
// @Accept json
// @Produce json
// @Param body body dto.RefreshRequest true "Refresh token"
// @Success 200 {object} utils.StandardResponse
// @Router /api/v1/auth/refresh [post]
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var req dto.RefreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResBadRequest(c, "Validation failed", err.Error())
		return
	}
	resp, err := h.svc.RefreshToken(req)
	if err != nil {
		utils.ResUnauthorized(c, err.Error())
		return
	}
	utils.ResOK(c, "Token refreshed", resp)
}

// Logout godoc
// @Summary Logout user
// @Tags Auth
// @Security BearerAuth
// @Success 200 {object} utils.StandardResponse
// @Router /api/v1/auth/logout [post]
func (h *AuthHandler) Logout(c *gin.Context) {
	userID := c.MustGet("user_id").(uuid.UUID)
	if err := h.svc.Logout(userID); err != nil {
		utils.ResInternalError(c, "Failed to logout")
		return
	}
	utils.ResOK(c, "Logged out successfully", nil)
}

// GetProfile godoc
// @Summary Get current user profile
// @Tags Auth
// @Security BearerAuth
// @Success 200 {object} utils.StandardResponse
// @Router /api/v1/auth/profile [get]
func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID := c.MustGet("user_id").(uuid.UUID)
	resp, err := h.svc.GetProfile(userID)
	if err != nil {
		utils.ResNotFound(c, err.Error())
		return
	}
	utils.ResOK(c, "Profile retrieved", resp)
}

// ChangePassword godoc
// @Summary Change password
// @Tags Auth
// @Security BearerAuth
// @Param body body dto.ChangePasswordRequest true "Password change"
// @Success 200 {object} utils.StandardResponse
// @Router /api/v1/auth/change-password [put]
func (h *AuthHandler) ChangePassword(c *gin.Context) {
	userID := c.MustGet("user_id").(uuid.UUID)
	var req dto.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResBadRequest(c, "Validation failed", err.Error())
		return
	}
	if err := h.svc.ChangePassword(userID, req); err != nil {
		utils.ResBadRequest(c, err.Error(), nil)
		return
	}
	utils.ResOK(c, "Password changed successfully", nil)
}
