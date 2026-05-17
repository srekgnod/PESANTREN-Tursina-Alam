package repository

import (
	"time"

	"github.com/google/uuid"
	"github.com/tursinaalam/pesantren-api/internal/models"
	"gorm.io/gorm"
)

type AttendanceRepository struct {
	db *gorm.DB
}

func NewAttendanceRepository(db *gorm.DB) *AttendanceRepository {
	return &AttendanceRepository{db: db}
}

func (r *AttendanceRepository) Create(att *models.Attendance) error {
	return r.db.Create(att).Error
}

func (r *AttendanceRepository) FindByID(id uuid.UUID) (*models.Attendance, error) {
	var att models.Attendance
	err := r.db.Preload("Santri").Where("id = ?", id).First(&att).Error
	return &att, err
}

func (r *AttendanceRepository) FindTodayBySantri(santriID uuid.UUID) (*models.Attendance, error) {
	var att models.Attendance
	today := time.Now().Format("2006-01-02")
	err := r.db.Where("santri_id = ? AND date = ?", santriID, today).First(&att).Error
	return &att, err
}

func (r *AttendanceRepository) Update(att *models.Attendance) error {
	return r.db.Save(att).Error
}

func (r *AttendanceRepository) FindAll(db *gorm.DB) ([]models.Attendance, int64, error) {
	var atts []models.Attendance
	var total int64
	db.Model(&models.Attendance{}).Count(&total)
	err := db.Preload("Santri").Find(&atts).Error
	return atts, total, err
}

func (r *AttendanceRepository) CountTodayByStatus(status models.AttendanceStatus) (int64, error) {
	var count int64
	today := time.Now().Format("2006-01-02")
	err := r.db.Model(&models.Attendance{}).Where("date = ? AND status = ?", today, status).Count(&count).Error
	return count, err
}

func (r *AttendanceRepository) DB() *gorm.DB {
	return r.db.Model(&models.Attendance{})
}
