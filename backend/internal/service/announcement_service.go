package service

import (
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/tursinaalam/pesantren-api/internal/dto"
	"github.com/tursinaalam/pesantren-api/internal/models"
	"github.com/tursinaalam/pesantren-api/internal/repository"
	"github.com/tursinaalam/pesantren-api/internal/utils"
	"gorm.io/gorm"
)

// ===================== ANNOUNCEMENT =====================

type AnnouncementService struct {
	repo      *repository.AnnouncementRepository
	auditRepo *repository.AuditRepository
}

func NewAnnouncementService(repo *repository.AnnouncementRepository, auditRepo *repository.AuditRepository) *AnnouncementService {
	return &AnnouncementService{repo: repo, auditRepo: auditRepo}
}

func (s *AnnouncementService) Create(req dto.CreateAnnouncementRequest, authorID uuid.UUID) (*models.Announcement, error) {
	isPublic := true
	if req.IsPublic != nil {
		isPublic = *req.IsPublic
	}
	a := &models.Announcement{
		Title: req.Title, Content: req.Content, Category: req.Category,
		IsPublic: isPublic, AuthorID: authorID,
	}
	return a, s.repo.Create(a)
}

func (s *AnnouncementService) GetByID(id uuid.UUID) (*models.Announcement, error) {
	return s.repo.FindByID(id)
}

func (s *AnnouncementService) Update(id uuid.UUID, req dto.UpdateAnnouncementRequest) (*models.Announcement, error) {
	a, err := s.repo.FindByID(id)
	if err != nil {
		return nil, errors.New("announcement not found")
	}
	if req.Title != "" { a.Title = req.Title }
	if req.Content != "" { a.Content = req.Content }
	if req.Category != "" { a.Category = req.Category }
	if req.IsPublic != nil { a.IsPublic = *req.IsPublic }
	return a, s.repo.Update(a)
}

func (s *AnnouncementService) Delete(id uuid.UUID) error {
	return s.repo.Delete(id)
}

func (s *AnnouncementService) GetAll(pq utils.PaginationQuery) ([]models.Announcement, int64, error) {
	db := s.repo.DB()
	if pq.Search != "" {
		db = db.Where("title ILIKE ?", "%"+pq.Search+"%")
	}
	return s.repo.FindAll(pq.Apply(db))
}

func (s *AnnouncementService) GetPublic(pq utils.PaginationQuery) ([]models.Announcement, int64, error) {
	db := s.repo.DB().Where("is_public = ?", true)
	if pq.Search != "" {
		db = db.Where("title ILIKE ?", "%"+pq.Search+"%")
	}
	return s.repo.FindPublic(pq.Apply(db))
}

// ===================== PPDB =====================

type PPDBService struct {
	repo *repository.PPDBRepository
}

func NewPPDBService(repo *repository.PPDBRepository) *PPDBService {
	return &PPDBService{repo: repo}
}

func (s *PPDBService) Register(req dto.PPDBRegisterRequest) (*models.PPDBRegistration, error) {
	dob, err := time.Parse("2006-01-02", req.DateOfBirth)
	if err != nil {
		return nil, errors.New("invalid date_of_birth format")
	}
	regNum := fmt.Sprintf("PPDB-%d-%s", time.Now().Year(), uuid.New().String()[:8])
	p := &models.PPDBRegistration{
		RegistrationNumber: regNum, FullName: req.FullName,
		Gender: models.Gender(req.Gender), PlaceOfBirth: req.PlaceOfBirth,
		DateOfBirth: dob, Address: req.Address, PreviousSchool: req.PreviousSchool,
		ParentName: req.ParentName, ParentPhone: req.ParentPhone,
		ParentEmail: req.ParentEmail, Status: models.PPDBRegistered,
		AcademicYear: fmt.Sprintf("%d/%d", time.Now().Year(), time.Now().Year()+1),
	}
	return p, s.repo.Create(p)
}

func (s *PPDBService) Review(id uuid.UUID, req dto.PPDBReviewRequest, reviewerID uuid.UUID) (*models.PPDBRegistration, error) {
	p, err := s.repo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("registration not found")
		}
		return nil, err
	}
	now := time.Now()
	p.Status = models.PPDBStatus(req.Status)
	p.Notes = req.Notes
	p.ReviewedBy = &reviewerID
	p.ReviewedAt = &now
	return p, s.repo.Update(p)
}

func (s *PPDBService) GetByID(id uuid.UUID) (*models.PPDBRegistration, error) {
	return s.repo.FindByID(id)
}

func (s *PPDBService) CheckStatus(regNum string) (*models.PPDBRegistration, error) {
	return s.repo.FindByRegNumber(regNum)
}

func (s *PPDBService) GetAll(pq utils.PaginationQuery, status string) ([]models.PPDBRegistration, int64, error) {
	db := s.repo.DB()
	if status != "" {
		db = db.Where("status = ?", status)
	}
	if pq.Search != "" {
		db = db.Where("full_name ILIKE ? OR registration_number ILIKE ?", "%"+pq.Search+"%", "%"+pq.Search+"%")
	}
	return s.repo.FindAll(pq.Apply(db))
}

// ===================== DASHBOARD =====================

type DashboardService struct {
	santriRepo     *repository.SantriRepository
	attendanceRepo *repository.AttendanceRepository
	paymentRepo    *repository.PaymentRepository
	ppdbRepo       *repository.PPDBRepository
}

func NewDashboardService(
	santriRepo *repository.SantriRepository,
	attendanceRepo *repository.AttendanceRepository,
	paymentRepo *repository.PaymentRepository,
	ppdbRepo *repository.PPDBRepository,
) *DashboardService {
	return &DashboardService{santriRepo: santriRepo, attendanceRepo: attendanceRepo, paymentRepo: paymentRepo, ppdbRepo: ppdbRepo}
}

func (s *DashboardService) GetStats() (*dto.DashboardStats, error) {
	stats := &dto.DashboardStats{}

	stats.TotalSantri, _ = s.santriRepo.CountAll()
	stats.TotalActive, _ = s.santriRepo.CountByStatus("active")
	stats.TodayPresent, _ = s.attendanceRepo.CountTodayByStatus(models.AttendancePresent)
	stats.TodayAbsent, _ = s.attendanceRepo.CountTodayByStatus(models.AttendanceAbsent)
	stats.TodaySick, _ = s.attendanceRepo.CountTodayByStatus(models.AttendanceSick)
	stats.TodayPermission, _ = s.attendanceRepo.CountTodayByStatus(models.AttendancePermission)
	stats.PendingPayments, _ = s.paymentRepo.CountByStatus(models.PaymentPending)
	stats.OverduePayments, _ = s.paymentRepo.CountByStatus(models.PaymentOverdue)
	stats.MonthlyRevenue, _ = s.paymentRepo.SumMonthlyRevenue()
	stats.PPDBRegistrations, _ = s.ppdbRepo.CountAll()

	if stats.TotalActive > 0 {
		stats.AttendanceRate = float64(stats.TodayPresent) / float64(stats.TotalActive) * 100
	}

	return stats, nil
}
