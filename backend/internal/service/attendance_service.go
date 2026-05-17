package service

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/tursinaalam/pesantren-api/internal/dto"
	"github.com/tursinaalam/pesantren-api/internal/models"
	"github.com/tursinaalam/pesantren-api/internal/repository"
	"github.com/tursinaalam/pesantren-api/internal/utils"
	"gorm.io/gorm"
)

type AttendanceService struct {
	repo      *repository.AttendanceRepository
	santriRepo *repository.SantriRepository
	auditRepo *repository.AuditRepository
}

func NewAttendanceService(
	repo *repository.AttendanceRepository,
	santriRepo *repository.SantriRepository,
	auditRepo *repository.AuditRepository,
) *AttendanceService {
	return &AttendanceService{repo: repo, santriRepo: santriRepo, auditRepo: auditRepo}
}

func (s *AttendanceService) ScanQR(req dto.QRAttendanceRequest, scannedBy uuid.UUID) (*models.Attendance, error) {
	santri, err := s.santriRepo.FindByQRCode(req.QRCode)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("QR code not recognized")
		}
		return nil, err
	}

	// Check if already checked in today
	existing, err := s.repo.FindTodayBySantri(santri.ID)
	if err == nil && existing != nil {
		// Already checked in, this is checkout
		if existing.CheckOut == nil {
			now := time.Now()
			existing.CheckOut = &now
			if err := s.repo.Update(existing); err != nil {
				return nil, err
			}
			return existing, nil
		}
		return nil, errors.New("already checked in and out today")
	}

	// Create new check-in
	now := time.Now()
	att := &models.Attendance{
		SantriID:  santri.ID,
		Date:      time.Now().Truncate(24 * time.Hour),
		Status:    models.AttendancePresent,
		CheckIn:   &now,
		Method:    "qr",
		ScannedBy: &scannedBy,
	}

	// Check if late (after 07:00)
	hour := now.Hour()
	if hour >= 7 {
		att.Status = models.AttendanceLate
	}

	if err := s.repo.Create(att); err != nil {
		return nil, err
	}

	att.Santri = *santri
	return att, nil
}

func (s *AttendanceService) ManualRecord(req dto.ManualAttendanceRequest, recorderID uuid.UUID) (*models.Attendance, error) {
	santriID, err := uuid.Parse(req.SantriID)
	if err != nil {
		return nil, errors.New("invalid santri_id")
	}

	santri, err := s.santriRepo.FindByID(santriID)
	if err != nil {
		return nil, errors.New("santri not found")
	}

	// Check duplicate
	if existing, err := s.repo.FindTodayBySantri(santriID); err == nil && existing != nil {
		return nil, errors.New("attendance already recorded for today")
	}

	now := time.Now()
	att := &models.Attendance{
		SantriID:  santriID,
		Date:      now.Truncate(24 * time.Hour),
		Status:    models.AttendanceStatus(req.Status),
		CheckIn:   &now,
		Method:    "manual",
		Notes:     req.Notes,
		ScannedBy: &recorderID,
	}

	if err := s.repo.Create(att); err != nil {
		return nil, err
	}

	att.Santri = *santri
	return att, nil
}

func (s *AttendanceService) GetAll(pq utils.PaginationQuery, filters dto.AttendanceFilter) ([]models.Attendance, int64, error) {
	db := s.repo.DB()

	if filters.SantriID != "" {
		db = db.Where("santri_id = ?", filters.SantriID)
	}
	if filters.Status != "" {
		db = db.Where("status = ?", filters.Status)
	}
	if filters.DateFrom != "" {
		db = db.Where("date >= ?", filters.DateFrom)
	}
	if filters.DateTo != "" {
		db = db.Where("date <= ?", filters.DateTo)
	}

	return s.repo.FindAll(pq.Apply(db))
}
