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

type SantriService struct {
	repo      *repository.SantriRepository
	userRepo  *repository.UserRepository
	auditRepo *repository.AuditRepository
}

func NewSantriService(
	repo *repository.SantriRepository,
	userRepo *repository.UserRepository,
	auditRepo *repository.AuditRepository,
) *SantriService {
	return &SantriService{repo: repo, userRepo: userRepo, auditRepo: auditRepo}
}

func (s *SantriService) Create(req dto.CreateSantriRequest, creatorID uuid.UUID) (*models.Santri, error) {
	// Check NIS uniqueness
	if _, err := s.repo.FindByNIS(req.NIS); err == nil {
		return nil, errors.New("NIS already exists")
	}

	dob, err := time.Parse("2006-01-02", req.DateOfBirth)
	if err != nil {
		return nil, errors.New("invalid date_of_birth format, use YYYY-MM-DD")
	}

	// Generate QR code data
	qrData := fmt.Sprintf("TURSINA-%s-%s", req.NIS, uuid.New().String()[:8])

	santri := &models.Santri{
		NIS:          req.NIS,
		FullName:     req.FullName,
		Gender:       models.Gender(req.Gender),
		PlaceOfBirth: req.PlaceOfBirth,
		DateOfBirth:  dob,
		Address:      req.Address,
		Phone:        req.Phone,
		ParentName:   req.ParentName,
		ParentPhone:  req.ParentPhone,
		EntryYear:    req.EntryYear,
		Class:        req.Class,
		Dormitory:    req.Dormitory,
		Status:       "active",
		QRCode:       qrData,
	}

	if err := s.repo.Create(santri); err != nil {
		return nil, err
	}

	// Create user account for santri
	hash, _ := utils.HashPassword("santri123") // default password
	santriUser := &models.User{
		Email:    fmt.Sprintf("%s@tursina.sch.id", req.NIS),
		Username: req.NIS,
		Password: hash,
		FullName: req.FullName,
		Role:     models.RoleSantri,
		IsActive: true,
	}
	if err := s.userRepo.Create(santriUser); err == nil {
		santri.UserID = &santriUser.ID
		_ = s.repo.Update(santri)
	}

	// Audit
	s.logAudit(creatorID, "create", "santri", santri.ID.String())

	return santri, nil
}

func (s *SantriService) GetByID(id uuid.UUID) (*models.Santri, error) {
	return s.repo.FindByID(id)
}

func (s *SantriService) GetAll(pq utils.PaginationQuery, filters map[string]string) ([]models.Santri, int64, error) {
	db := s.repo.DB()

	// Apply filters
	if v, ok := filters["status"]; ok && v != "" {
		db = db.Where("status = ?", v)
	}
	if v, ok := filters["class"]; ok && v != "" {
		db = db.Where("class = ?", v)
	}
	if v, ok := filters["entry_year"]; ok && v != "" {
		db = db.Where("entry_year = ?", v)
	}
	if v, ok := filters["dormitory"]; ok && v != "" {
		db = db.Where("dormitory = ?", v)
	}

	// Search
	if pq.Search != "" {
		search := "%" + pq.Search + "%"
		db = db.Where("full_name ILIKE ? OR nis ILIKE ?", search, search)
	}

	return s.repo.FindAll(pq.Apply(db))
}

func (s *SantriService) Update(id uuid.UUID, req dto.UpdateSantriRequest, updaterID uuid.UUID) (*models.Santri, error) {
	santri, err := s.repo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("santri not found")
		}
		return nil, err
	}

	if req.FullName != "" {
		santri.FullName = req.FullName
	}
	if req.Phone != "" {
		santri.Phone = req.Phone
	}
	if req.Address != "" {
		santri.Address = req.Address
	}
	if req.ParentName != "" {
		santri.ParentName = req.ParentName
	}
	if req.ParentPhone != "" {
		santri.ParentPhone = req.ParentPhone
	}
	if req.Class != "" {
		santri.Class = req.Class
	}
	if req.Dormitory != "" {
		santri.Dormitory = req.Dormitory
	}
	if req.Status != "" {
		santri.Status = req.Status
	}

	if err := s.repo.Update(santri); err != nil {
		return nil, err
	}

	s.logAudit(updaterID, "update", "santri", santri.ID.String())
	return santri, nil
}

func (s *SantriService) Delete(id uuid.UUID, deleterID uuid.UUID) error {
	s.logAudit(deleterID, "delete", "santri", id.String())
	return s.repo.Delete(id)
}

func (s *SantriService) logAudit(userID uuid.UUID, action, module, entityID string) {
	trail := &models.AuditTrail{UserID: userID, Action: action, Module: module, EntityID: entityID}
	_ = s.auditRepo.Create(trail)
}
