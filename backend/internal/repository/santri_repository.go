package repository

import (
	"github.com/google/uuid"
	"github.com/tursinaalam/pesantren-api/internal/models"
	"gorm.io/gorm"
)

type SantriRepository struct {
	db *gorm.DB
}

func NewSantriRepository(db *gorm.DB) *SantriRepository {
	return &SantriRepository{db: db}
}

func (r *SantriRepository) Create(santri *models.Santri) error {
	return r.db.Create(santri).Error
}

func (r *SantriRepository) FindByID(id uuid.UUID) (*models.Santri, error) {
	var santri models.Santri
	err := r.db.Preload("User").Where("id = ?", id).First(&santri).Error
	return &santri, err
}

func (r *SantriRepository) FindByNIS(nis string) (*models.Santri, error) {
	var santri models.Santri
	err := r.db.Where("nis = ?", nis).First(&santri).Error
	return &santri, err
}

func (r *SantriRepository) FindByQRCode(qrCode string) (*models.Santri, error) {
	var santri models.Santri
	err := r.db.Where("qr_code = ?", qrCode).First(&santri).Error
	return &santri, err
}

func (r *SantriRepository) FindByWaliUserID(userID uuid.UUID) ([]models.Santri, error) {
	var santris []models.Santri
	err := r.db.Where("wali_user_id = ?", userID).Find(&santris).Error
	return santris, err
}

func (r *SantriRepository) Update(santri *models.Santri) error {
	return r.db.Save(santri).Error
}

func (r *SantriRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Santri{}, "id = ?", id).Error
}

func (r *SantriRepository) FindAll(db *gorm.DB) ([]models.Santri, int64, error) {
	var santris []models.Santri
	var total int64
	db.Model(&models.Santri{}).Count(&total)
	err := db.Find(&santris).Error
	return santris, total, err
}

func (r *SantriRepository) CountByStatus(status string) (int64, error) {
	var count int64
	err := r.db.Model(&models.Santri{}).Where("status = ?", status).Count(&count).Error
	return count, err
}

func (r *SantriRepository) CountAll() (int64, error) {
	var count int64
	err := r.db.Model(&models.Santri{}).Count(&count).Error
	return count, err
}

func (r *SantriRepository) DB() *gorm.DB {
	return r.db.Model(&models.Santri{})
}
