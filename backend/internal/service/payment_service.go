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

type PaymentService struct {
	repo      *repository.PaymentRepository
	auditRepo *repository.AuditRepository
}

func NewPaymentService(repo *repository.PaymentRepository, auditRepo *repository.AuditRepository) *PaymentService {
	return &PaymentService{repo: repo, auditRepo: auditRepo}
}

func (s *PaymentService) Create(req dto.CreatePaymentRequest, creatorID uuid.UUID) (*models.Payment, error) {
	santriID, _ := uuid.Parse(req.SantriID)
	dueDate, err := time.Parse("2006-01-02", req.DueDate)
	if err != nil {
		return nil, errors.New("invalid due_date format")
	}
	invoice := fmt.Sprintf("INV-%s-%s", time.Now().Format("20060102"), uuid.New().String()[:8])
	payment := &models.Payment{
		SantriID: santriID, InvoiceNumber: invoice, Type: req.Type,
		Amount: req.Amount, Status: models.PaymentPending, DueDate: dueDate,
		Period: req.Period, Notes: req.Notes,
	}
	if err := s.repo.Create(payment); err != nil {
		return nil, err
	}
	return payment, nil
}

func (s *PaymentService) ConfirmPayment(id uuid.UUID, req dto.ConfirmPaymentRequest, confirmerID uuid.UUID) (*models.Payment, error) {
	payment, err := s.repo.FindByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("payment not found")
		}
		return nil, err
	}
	if payment.Status == models.PaymentPaid {
		return nil, errors.New("payment already confirmed")
	}
	now := time.Now()
	payment.PaidAmount = req.PaidAmount
	payment.PaymentMethod = req.PaymentMethod
	payment.Status = models.PaymentPaid
	payment.PaidAt = &now
	return payment, s.repo.Update(payment)
}

func (s *PaymentService) GetByID(id uuid.UUID) (*models.Payment, error) {
	return s.repo.FindByID(id)
}

func (s *PaymentService) GetBySantri(santriID uuid.UUID) ([]models.Payment, error) {
	return s.repo.FindBySantriID(santriID)
}

func (s *PaymentService) GetAll(pq utils.PaginationQuery, filters map[string]string) ([]models.Payment, int64, error) {
	db := s.repo.DB()
	if v := filters["status"]; v != "" {
		db = db.Where("status = ?", v)
	}
	if v := filters["type"]; v != "" {
		db = db.Where("type = ?", v)
	}
	if v := filters["period"]; v != "" {
		db = db.Where("period = ?", v)
	}
	if pq.Search != "" {
		db = db.Where("invoice_number ILIKE ?", "%"+pq.Search+"%")
	}
	return s.repo.FindAll(pq.Apply(db))
}
