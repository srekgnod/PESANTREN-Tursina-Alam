package service

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/tursinaalam/pesantren-api/internal/config"
	"github.com/tursinaalam/pesantren-api/internal/dto"
	"github.com/tursinaalam/pesantren-api/internal/models"
	"github.com/tursinaalam/pesantren-api/internal/repository"
	"github.com/tursinaalam/pesantren-api/internal/utils"
	"gorm.io/gorm"
)

type AuthService struct {
	userRepo    *repository.UserRepository
	sessionRepo *repository.SessionRepository
	auditRepo   *repository.AuditRepository
	cfg         *config.JWTConfig
}

func NewAuthService(
	userRepo *repository.UserRepository,
	sessionRepo *repository.SessionRepository,
	auditRepo *repository.AuditRepository,
	cfg *config.JWTConfig,
) *AuthService {
	return &AuthService{
		userRepo:    userRepo,
		sessionRepo: sessionRepo,
		auditRepo:   auditRepo,
		cfg:         cfg,
	}
}

func (s *AuthService) Login(req dto.LoginRequest, ip, userAgent string) (*dto.LoginResponse, error) {
	user, err := s.userRepo.FindByUsername(req.Username)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid username or password")
		}
		return nil, err
	}

	if !user.IsActive {
		return nil, errors.New("account is deactivated")
	}

	if !utils.CheckPassword(req.Password, user.Password) {
		return nil, errors.New("invalid username or password")
	}

	accessToken, err := utils.GenerateAccessToken(user.ID, user.Username, string(user.Role), s.cfg.Secret, s.cfg.Expiry)
	if err != nil {
		return nil, errors.New("failed to generate access token")
	}

	refreshToken, err := utils.GenerateRefreshToken(user.ID, s.cfg.RefreshSecret, s.cfg.RefreshExpiry)
	if err != nil {
		return nil, errors.New("failed to generate refresh token")
	}

	// Save session
	session := &models.Session{
		UserID:       user.ID,
		RefreshToken: refreshToken,
		UserAgent:    userAgent,
		IPAddress:    ip,
		ExpiresAt:    time.Now().Add(s.cfg.RefreshExpiry),
	}
	if err := s.sessionRepo.Create(session); err != nil {
		return nil, errors.New("failed to create session")
	}

	// Update last login
	_ = s.userRepo.UpdateLastLogin(user.ID)

	// Audit trail
	s.logAudit(user.ID, "login", "auth", user.ID.String(), ip, userAgent)

	return &dto.LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    int64(s.cfg.Expiry.Seconds()),
		User:         mapUserToResponse(user),
	}, nil
}

func (s *AuthService) RefreshToken(req dto.RefreshRequest) (*dto.LoginResponse, error) {
	userID, err := utils.ValidateRefreshToken(req.RefreshToken, s.cfg.RefreshSecret)
	if err != nil {
		return nil, errors.New("invalid refresh token")
	}

	session, err := s.sessionRepo.FindByRefreshToken(req.RefreshToken)
	if err != nil {
		return nil, errors.New("session not found")
	}

	if time.Now().After(session.ExpiresAt) {
		_ = s.sessionRepo.Delete(session.ID)
		return nil, errors.New("refresh token expired")
	}

	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	// Generate new tokens
	accessToken, _ := utils.GenerateAccessToken(user.ID, user.Username, string(user.Role), s.cfg.Secret, s.cfg.Expiry)
	newRefreshToken, _ := utils.GenerateRefreshToken(user.ID, s.cfg.RefreshSecret, s.cfg.RefreshExpiry)

	// Update session
	session.RefreshToken = newRefreshToken
	session.ExpiresAt = time.Now().Add(s.cfg.RefreshExpiry)
	_ = s.sessionRepo.Create(session)
	_ = s.sessionRepo.Delete(session.ID)

	return &dto.LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: newRefreshToken,
		ExpiresIn:    int64(s.cfg.Expiry.Seconds()),
		User:         mapUserToResponse(user),
	}, nil
}

func (s *AuthService) Logout(userID uuid.UUID) error {
	return s.sessionRepo.DeleteByUserID(userID)
}

func (s *AuthService) ChangePassword(userID uuid.UUID, req dto.ChangePasswordRequest) error {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return errors.New("user not found")
	}

	if !utils.CheckPassword(req.OldPassword, user.Password) {
		return errors.New("old password is incorrect")
	}

	hash, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		return errors.New("failed to hash password")
	}

	user.Password = hash
	return s.userRepo.Update(user)
}

func (s *AuthService) GetProfile(userID uuid.UUID) (*dto.UserResponse, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, errors.New("user not found")
	}
	resp := mapUserToResponse(user)
	return &resp, nil
}

func (s *AuthService) logAudit(userID uuid.UUID, action, module, entityID, ip, ua string) {
	trail := &models.AuditTrail{
		UserID:    userID,
		Action:    action,
		Module:    module,
		EntityID:  entityID,
		IPAddress: ip,
		UserAgent: ua,
	}
	_ = s.auditRepo.Create(trail)
}

func mapUserToResponse(u *models.User) dto.UserResponse {
	return dto.UserResponse{
		ID:        u.ID,
		Email:     u.Email,
		Username:  u.Username,
		FullName:  u.FullName,
		Phone:     u.Phone,
		Avatar:    u.Avatar,
		Role:      string(u.Role),
		IsActive:  u.IsActive,
		LastLogin: u.LastLoginAt,
	}
}
