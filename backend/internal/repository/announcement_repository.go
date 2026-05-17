package repository

import (
	"github.com/google/uuid"
	"github.com/tursinaalam/pesantren-api/internal/models"
	"gorm.io/gorm"
)

type AnnouncementRepository struct {
	db *gorm.DB
}

func NewAnnouncementRepository(db *gorm.DB) *AnnouncementRepository {
	return &AnnouncementRepository{db: db}
}

func (r *AnnouncementRepository) Create(a *models.Announcement) error {
	return r.db.Create(a).Error
}

func (r *AnnouncementRepository) FindByID(id uuid.UUID) (*models.Announcement, error) {
	var a models.Announcement
	err := r.db.Preload("Author").Where("id = ?", id).First(&a).Error
	return &a, err
}

func (r *AnnouncementRepository) Update(a *models.Announcement) error {
	return r.db.Save(a).Error
}

func (r *AnnouncementRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Announcement{}, "id = ?", id).Error
}

func (r *AnnouncementRepository) FindAll(db *gorm.DB) ([]models.Announcement, int64, error) {
	var items []models.Announcement
	var total int64
	db.Model(&models.Announcement{}).Count(&total)
	err := db.Preload("Author").Find(&items).Error
	return items, total, err
}

func (r *AnnouncementRepository) FindPublic(db *gorm.DB) ([]models.Announcement, int64, error) {
	var items []models.Announcement
	var total int64
	q := db.Where("is_public = ?", true)
	q.Model(&models.Announcement{}).Count(&total)
	err := q.Preload("Author").Find(&items).Error
	return items, total, err
}

func (r *AnnouncementRepository) DB() *gorm.DB {
	return r.db.Model(&models.Announcement{})
}

// ===================== PPDB =====================

type PPDBRepository struct {
	db *gorm.DB
}

func NewPPDBRepository(db *gorm.DB) *PPDBRepository {
	return &PPDBRepository{db: db}
}

func (r *PPDBRepository) Create(p *models.PPDBRegistration) error {
	return r.db.Create(p).Error
}

func (r *PPDBRepository) FindByID(id uuid.UUID) (*models.PPDBRegistration, error) {
	var p models.PPDBRegistration
	err := r.db.Where("id = ?", id).First(&p).Error
	return &p, err
}

func (r *PPDBRepository) FindByRegNumber(regNum string) (*models.PPDBRegistration, error) {
	var p models.PPDBRegistration
	err := r.db.Where("registration_number = ?", regNum).First(&p).Error
	return &p, err
}

func (r *PPDBRepository) Update(p *models.PPDBRegistration) error {
	return r.db.Save(p).Error
}

func (r *PPDBRepository) FindAll(db *gorm.DB) ([]models.PPDBRegistration, int64, error) {
	var items []models.PPDBRegistration
	var total int64
	db.Model(&models.PPDBRegistration{}).Count(&total)
	err := db.Find(&items).Error
	return items, total, err
}

func (r *PPDBRepository) CountAll() (int64, error) {
	var count int64
	err := r.db.Model(&models.PPDBRegistration{}).Count(&count).Error
	return count, err
}

func (r *PPDBRepository) DB() *gorm.DB {
	return r.db.Model(&models.PPDBRegistration{})
}
