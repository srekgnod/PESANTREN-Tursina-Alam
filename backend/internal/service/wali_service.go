package service

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/tursinaalam/pesantren-api/internal/models"
	"github.com/tursinaalam/pesantren-api/internal/utils"
	"gorm.io/gorm"
)

type WaliPortalService struct {
	db *gorm.DB
}

func NewWaliPortalService(db *gorm.DB) *WaliPortalService {
	return &WaliPortalService{db: db}
}

type WaliChildDashboard struct {
	Santri           models.Santri `json:"santri"`
	AttendanceStats  AttendanceStats `json:"attendance_stats"`
	PaymentStats     PaymentStats    `json:"payment_stats"`
	RecentNotes      []models.SantriNote `json:"recent_notes"`
	ActiveLeaves     []models.SantriLeave `json:"active_leaves"`
	PendingPayments  []models.Payment `json:"pending_payments"`
}

type AttendanceStats struct {
	TotalDays   int64   `json:"total_days"`
	Present     int64   `json:"present"`
	Absent      int64   `json:"absent"`
	Sick        int64   `json:"sick"`
	Late        int64   `json:"late"`
	Permission  int64   `json:"permission"`
	Rate        float64 `json:"rate"`
}

type PaymentStats struct {
	TotalBilled float64 `json:"total_billed"`
	TotalPaid   float64 `json:"total_paid"`
	TotalDebt   float64 `json:"total_debt"`
	PendingCount int64  `json:"pending_count"`
	OverdueCount int64  `json:"overdue_count"`
}

func (s *WaliPortalService) GetChildren(waliUserID uuid.UUID) ([]models.Santri, error) {
	var santris []models.Santri
	err := s.db.Where("wali_user_id = ?", waliUserID).Find(&santris).Error
	return santris, err
}

func (s *WaliPortalService) GetChildDashboard(santriID, waliUserID uuid.UUID) (*WaliChildDashboard, error) {
	var santri models.Santri
	if err := s.db.Where("id = ? AND wali_user_id = ?", santriID, waliUserID).First(&santri).Error; err != nil {
		return nil, fmt.Errorf("santri not found or unauthorized")
	}

	dashboard := &WaliChildDashboard{Santri: santri}

	// Attendance stats (current month)
	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	attDB := s.db.Model(&models.Attendance{}).Where("santri_id = ? AND date >= ?", santriID, startOfMonth)
	attDB.Count(&dashboard.AttendanceStats.TotalDays)
	s.db.Model(&models.Attendance{}).Where("santri_id = ? AND date >= ? AND status = ?", santriID, startOfMonth, "present").Count(&dashboard.AttendanceStats.Present)
	s.db.Model(&models.Attendance{}).Where("santri_id = ? AND date >= ? AND status = ?", santriID, startOfMonth, "absent").Count(&dashboard.AttendanceStats.Absent)
	s.db.Model(&models.Attendance{}).Where("santri_id = ? AND date >= ? AND status = ?", santriID, startOfMonth, "sick").Count(&dashboard.AttendanceStats.Sick)
	s.db.Model(&models.Attendance{}).Where("santri_id = ? AND date >= ? AND status = ?", santriID, startOfMonth, "late").Count(&dashboard.AttendanceStats.Late)
	s.db.Model(&models.Attendance{}).Where("santri_id = ? AND date >= ? AND status = ?", santriID, startOfMonth, "permission").Count(&dashboard.AttendanceStats.Permission)
	if dashboard.AttendanceStats.TotalDays > 0 {
		dashboard.AttendanceStats.Rate = float64(dashboard.AttendanceStats.Present+dashboard.AttendanceStats.Late) / float64(dashboard.AttendanceStats.TotalDays) * 100
	}

	// Payment stats
	s.db.Model(&models.Payment{}).Where("santri_id = ?", santriID).Select("COALESCE(SUM(amount), 0)").Scan(&dashboard.PaymentStats.TotalBilled)
	s.db.Model(&models.Payment{}).Where("santri_id = ? AND status = ?", santriID, "paid").Select("COALESCE(SUM(paid_amount), 0)").Scan(&dashboard.PaymentStats.TotalPaid)
	dashboard.PaymentStats.TotalDebt = dashboard.PaymentStats.TotalBilled - dashboard.PaymentStats.TotalPaid
	s.db.Model(&models.Payment{}).Where("santri_id = ? AND status = ?", santriID, "pending").Count(&dashboard.PaymentStats.PendingCount)
	s.db.Model(&models.Payment{}).Where("santri_id = ? AND status = ?", santriID, "overdue").Count(&dashboard.PaymentStats.OverdueCount)

	// Recent notes
	s.db.Where("santri_id = ?", santriID).Order("created_at desc").Limit(5).Preload("Author").Find(&dashboard.RecentNotes)

	// Active leaves
	s.db.Where("santri_id = ? AND status IN ?", santriID, []string{"pending", "approved"}).Order("created_at desc").Find(&dashboard.ActiveLeaves)

	// Pending payments
	s.db.Where("santri_id = ? AND status IN ?", santriID, []string{"pending", "overdue"}).Order("due_date asc").Find(&dashboard.PendingPayments)

	return dashboard, nil
}

func (s *WaliPortalService) GetAttendanceHistory(santriID, waliUserID uuid.UUID, pq utils.PaginationQuery, month string) ([]models.Attendance, int64, error) {
	// Verify ownership
	var count int64
	s.db.Model(&models.Santri{}).Where("id = ? AND wali_user_id = ?", santriID, waliUserID).Count(&count)
	if count == 0 {
		return nil, 0, fmt.Errorf("unauthorized")
	}

	db := s.db.Model(&models.Attendance{}).Where("santri_id = ?", santriID)
	if month != "" {
		db = db.Where("TO_CHAR(date, 'YYYY-MM') = ?", month)
	}

	var total int64
	db.Count(&total)

	var atts []models.Attendance
	err := pq.Apply(db).Find(&atts).Error
	return atts, total, err
}

func (s *WaliPortalService) GetPaymentHistory(santriID, waliUserID uuid.UUID) ([]models.Payment, error) {
	var count int64
	s.db.Model(&models.Santri{}).Where("id = ? AND wali_user_id = ?", santriID, waliUserID).Count(&count)
	if count == 0 {
		return nil, fmt.Errorf("unauthorized")
	}

	var payments []models.Payment
	err := s.db.Where("santri_id = ?", santriID).Order("created_at desc").Find(&payments).Error
	return payments, err
}
