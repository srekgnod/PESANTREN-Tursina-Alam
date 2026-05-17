package repository

import (
	"github.com/google/uuid"
	"github.com/tursinaalam/pesantren-api/internal/models"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) FindByID(id uuid.UUID) (*models.User, error) {
	var user models.User
	err := r.db.Where("id = ?", id).First(&user).Error
	return &user, err
}

func (r *UserRepository) FindByUsername(username string) (*models.User, error) {
	var user models.User
	err := r.db.Where("username = ?", username).First(&user).Error
	return &user, err
}

func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	return &user, err
}

func (r *UserRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *UserRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.User{}, "id = ?", id).Error
}

func (r *UserRepository) FindAll(db *gorm.DB) ([]models.User, int64, error) {
	var users []models.User
	var total int64
	db.Model(&models.User{}).Count(&total)
	err := db.Find(&users).Error
	return users, total, err
}

func (r *UserRepository) UpdateLastLogin(id uuid.UUID) error {
	return r.db.Model(&models.User{}).Where("id = ?", id).Update("last_login_at", gorm.Expr("NOW()")).Error
}

func (r *UserRepository) DB() *gorm.DB {
	return r.db.Model(&models.User{})
}

// ===================== SESSION =====================

type SessionRepository struct {
	db *gorm.DB
}

func NewSessionRepository(db *gorm.DB) *SessionRepository {
	return &SessionRepository{db: db}
}

func (r *SessionRepository) Create(session *models.Session) error {
	return r.db.Create(session).Error
}

func (r *SessionRepository) FindByRefreshToken(token string) (*models.Session, error) {
	var session models.Session
	err := r.db.Where("refresh_token = ?", token).First(&session).Error
	return &session, err
}

func (r *SessionRepository) DeleteByUserID(userID uuid.UUID) error {
	return r.db.Where("user_id = ?", userID).Delete(&models.Session{}).Error
}

func (r *SessionRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Session{}, "id = ?", id).Error
}

// ===================== AUDIT =====================

type AuditRepository struct {
	db *gorm.DB
}

func NewAuditRepository(db *gorm.DB) *AuditRepository {
	return &AuditRepository{db: db}
}

func (r *AuditRepository) Create(trail *models.AuditTrail) error {
	return r.db.Create(trail).Error
}

func (r *AuditRepository) FindAll(db *gorm.DB) ([]models.AuditTrail, int64, error) {
	var trails []models.AuditTrail
	var total int64
	db.Model(&models.AuditTrail{}).Count(&total)
	err := db.Preload("User").Find(&trails).Error
	return trails, total, err
}

func (r *AuditRepository) DB() *gorm.DB {
	return r.db.Model(&models.AuditTrail{})
}
