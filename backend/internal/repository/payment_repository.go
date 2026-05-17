package repository

import (
	"time"

	"github.com/google/uuid"
	"github.com/tursinaalam/pesantren-api/internal/models"
	"gorm.io/gorm"
)

type PaymentRepository struct {
	db *gorm.DB
}

func NewPaymentRepository(db *gorm.DB) *PaymentRepository {
	return &PaymentRepository{db: db}
}

func (r *PaymentRepository) Create(p *models.Payment) error {
	return r.db.Create(p).Error
}

func (r *PaymentRepository) FindByID(id uuid.UUID) (*models.Payment, error) {
	var p models.Payment
	err := r.db.Preload("Santri").Where("id = ?", id).First(&p).Error
	return &p, err
}

func (r *PaymentRepository) FindBySantriID(santriID uuid.UUID) ([]models.Payment, error) {
	var payments []models.Payment
	err := r.db.Where("santri_id = ?", santriID).Order("created_at desc").Find(&payments).Error
	return payments, err
}

func (r *PaymentRepository) Update(p *models.Payment) error {
	return r.db.Save(p).Error
}

func (r *PaymentRepository) FindAll(db *gorm.DB) ([]models.Payment, int64, error) {
	var payments []models.Payment
	var total int64
	db.Model(&models.Payment{}).Count(&total)
	err := db.Preload("Santri").Find(&payments).Error
	return payments, total, err
}

func (r *PaymentRepository) CountByStatus(status models.PaymentStatus) (int64, error) {
	var count int64
	err := r.db.Model(&models.Payment{}).Where("status = ?", status).Count(&count).Error
	return count, err
}

func (r *PaymentRepository) SumMonthlyRevenue() (float64, error) {
	var sum float64
	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	err := r.db.Model(&models.Payment{}).
		Where("status = ? AND paid_at >= ?", models.PaymentPaid, startOfMonth).
		Select("COALESCE(SUM(paid_amount), 0)").Scan(&sum).Error
	return sum, err
}

func (r *PaymentRepository) DB() *gorm.DB {
	return r.db.Model(&models.Payment{})
}
