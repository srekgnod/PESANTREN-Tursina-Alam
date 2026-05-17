package service

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/tursinaalam/pesantren-api/internal/models"
	"github.com/tursinaalam/pesantren-api/internal/repository"
	"github.com/tursinaalam/pesantren-api/internal/utils"
	"gorm.io/gorm"
)

type LeaveService struct {
	db        *gorm.DB
	auditRepo *repository.AuditRepository
}

func NewLeaveService(db *gorm.DB, auditRepo *repository.AuditRepository) *LeaveService {
	return &LeaveService{db: db, auditRepo: auditRepo}
}

type CreateLeaveRequest struct {
	SantriID string `json:"santri_id" binding:"required,uuid"`
	Type     string `json:"type" binding:"required,oneof=pulang sakit keperluan lainnya"`
	Reason   string `json:"reason" binding:"required,min=5"`
	DateFrom string `json:"date_from" binding:"required"`
	DateTo   string `json:"date_to" binding:"required"`
}

type ReviewLeaveRequest struct {
	Status     string `json:"status" binding:"required,oneof=approved rejected"`
	RejectNote string `json:"reject_note"`
}

func (s *LeaveService) Create(req CreateLeaveRequest, requestedBy uuid.UUID) (*models.SantriLeave, error) {
	santriID, _ := uuid.Parse(req.SantriID)
	dateFrom, err := time.Parse("2006-01-02", req.DateFrom)
	if err != nil {
		return nil, errors.New("invalid date_from format")
	}
	dateTo, err := time.Parse("2006-01-02", req.DateTo)
	if err != nil {
		return nil, errors.New("invalid date_to format")
	}
	if dateTo.Before(dateFrom) {
		return nil, errors.New("date_to cannot be before date_from")
	}

	leave := &models.SantriLeave{
		SantriID:    santriID,
		Type:        req.Type,
		Reason:      req.Reason,
		DateFrom:    dateFrom,
		DateTo:      dateTo,
		Status:      models.LeavePending,
		RequestedBy: requestedBy,
	}
	if err := s.db.Create(leave).Error; err != nil {
		return nil, err
	}
	s.db.Preload("Santri").First(leave, leave.ID)
	return leave, nil
}

func (s *LeaveService) Review(id uuid.UUID, req ReviewLeaveRequest, approverID uuid.UUID) (*models.SantriLeave, error) {
	var leave models.SantriLeave
	if err := s.db.Preload("Santri").Where("id = ?", id).First(&leave).Error; err != nil {
		return nil, errors.New("leave request not found")
	}
	if leave.Status != models.LeavePending {
		return nil, errors.New("leave already reviewed")
	}

	now := time.Now()
	leave.Status = models.LeaveStatus(req.Status)
	leave.ApprovedBy = &approverID
	leave.ApprovedAt = &now
	if req.Status == "rejected" {
		leave.RejectNote = req.RejectNote
	}
	s.db.Save(&leave)
	return &leave, nil
}

func (s *LeaveService) MarkReturned(id uuid.UUID) error {
	now := time.Now()
	return s.db.Model(&models.SantriLeave{}).Where("id = ?", id).
		Updates(map[string]interface{}{"status": models.LeaveCompleted, "returned_at": now}).Error
}

func (s *LeaveService) GetByID(id uuid.UUID) (*models.SantriLeave, error) {
	var leave models.SantriLeave
	err := s.db.Preload("Santri").Preload("Approver").Where("id = ?", id).First(&leave).Error
	return &leave, err
}

func (s *LeaveService) GetAll(pq utils.PaginationQuery, status, santriID string) ([]models.SantriLeave, int64, error) {
	db := s.db.Model(&models.SantriLeave{})
	if status != "" {
		db = db.Where("status = ?", status)
	}
	if santriID != "" {
		db = db.Where("santri_id = ?", santriID)
	}
	if pq.Search != "" {
		db = db.Joins("JOIN santris ON santris.id = santri_leaves.santri_id").
			Where("santris.full_name ILIKE ?", "%"+pq.Search+"%")
	}

	var total int64
	db.Count(&total)

	var leaves []models.SantriLeave
	err := pq.Apply(db).Preload("Santri").Preload("Approver").Find(&leaves).Error
	return leaves, total, err
}

func (s *LeaveService) GetBySantri(santriID uuid.UUID) ([]models.SantriLeave, error) {
	var leaves []models.SantriLeave
	err := s.db.Where("santri_id = ?", santriID).Order("created_at desc").Preload("Approver").Find(&leaves).Error
	return leaves, err
}
