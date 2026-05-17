package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/tursinaalam/pesantren-api/internal/dto"
	"github.com/tursinaalam/pesantren-api/internal/service"
	"github.com/tursinaalam/pesantren-api/internal/utils"
)

// ===================== PAYMENT =====================

type PaymentHandler struct {
	svc *service.PaymentService
}

func NewPaymentHandler(svc *service.PaymentService) *PaymentHandler {
	return &PaymentHandler{svc: svc}
}

func (h *PaymentHandler) Create(c *gin.Context) {
	var req dto.CreatePaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResBadRequest(c, "Validation failed", err.Error())
		return
	}
	userID := c.MustGet("user_id").(uuid.UUID)
	payment, err := h.svc.Create(req, userID)
	if err != nil {
		utils.ResBadRequest(c, err.Error(), nil)
		return
	}
	utils.ResCreated(c, "Payment created", payment)
}

func (h *PaymentHandler) GetAll(c *gin.Context) {
	pq := utils.NewPaginationQuery(c)
	filters := map[string]string{
		"status": c.Query("status"), "type": c.Query("type"), "period": c.Query("period"),
	}
	payments, total, err := h.svc.GetAll(pq, filters)
	if err != nil {
		utils.ResInternalError(c, "Failed to fetch payments")
		return
	}
	utils.ResPaginated(c, "Payments retrieved", payments, pq.BuildMeta(total))
}

func (h *PaymentHandler) GetByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ResBadRequest(c, "Invalid ID", nil)
		return
	}
	payment, err := h.svc.GetByID(id)
	if err != nil {
		utils.ResNotFound(c, "Payment not found")
		return
	}
	utils.ResOK(c, "Payment retrieved", payment)
}

func (h *PaymentHandler) Confirm(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ResBadRequest(c, "Invalid ID", nil)
		return
	}
	var req dto.ConfirmPaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResBadRequest(c, "Validation failed", err.Error())
		return
	}
	userID := c.MustGet("user_id").(uuid.UUID)
	payment, err := h.svc.ConfirmPayment(id, req, userID)
	if err != nil {
		utils.ResBadRequest(c, err.Error(), nil)
		return
	}
	utils.ResOK(c, "Payment confirmed", payment)
}

func (h *PaymentHandler) GetBySantri(c *gin.Context) {
	santriID, err := uuid.Parse(c.Param("santri_id"))
	if err != nil {
		utils.ResBadRequest(c, "Invalid santri ID", nil)
		return
	}
	payments, err := h.svc.GetBySantri(santriID)
	if err != nil {
		utils.ResInternalError(c, "Failed to fetch payments")
		return
	}
	utils.ResOK(c, "Payments retrieved", payments)
}

// ===================== ANNOUNCEMENT =====================

type AnnouncementHandler struct {
	svc *service.AnnouncementService
}

func NewAnnouncementHandler(svc *service.AnnouncementService) *AnnouncementHandler {
	return &AnnouncementHandler{svc: svc}
}

func (h *AnnouncementHandler) Create(c *gin.Context) {
	var req dto.CreateAnnouncementRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResBadRequest(c, "Validation failed", err.Error())
		return
	}
	userID := c.MustGet("user_id").(uuid.UUID)
	a, err := h.svc.Create(req, userID)
	if err != nil {
		utils.ResBadRequest(c, err.Error(), nil)
		return
	}
	utils.ResCreated(c, "Announcement created", a)
}

func (h *AnnouncementHandler) GetAll(c *gin.Context) {
	pq := utils.NewPaginationQuery(c)
	items, total, err := h.svc.GetAll(pq)
	if err != nil {
		utils.ResInternalError(c, "Failed to fetch announcements")
		return
	}
	utils.ResPaginated(c, "Announcements retrieved", items, pq.BuildMeta(total))
}

func (h *AnnouncementHandler) GetPublic(c *gin.Context) {
	pq := utils.NewPaginationQuery(c)
	items, total, err := h.svc.GetPublic(pq)
	if err != nil {
		utils.ResInternalError(c, "Failed to fetch announcements")
		return
	}
	utils.ResPaginated(c, "Announcements retrieved", items, pq.BuildMeta(total))
}

func (h *AnnouncementHandler) GetByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ResBadRequest(c, "Invalid ID", nil)
		return
	}
	a, err := h.svc.GetByID(id)
	if err != nil {
		utils.ResNotFound(c, "Announcement not found")
		return
	}
	utils.ResOK(c, "Announcement retrieved", a)
}

func (h *AnnouncementHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ResBadRequest(c, "Invalid ID", nil)
		return
	}
	var req dto.UpdateAnnouncementRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResBadRequest(c, "Validation failed", err.Error())
		return
	}
	a, err := h.svc.Update(id, req)
	if err != nil {
		utils.ResBadRequest(c, err.Error(), nil)
		return
	}
	utils.ResOK(c, "Announcement updated", a)
}

func (h *AnnouncementHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ResBadRequest(c, "Invalid ID", nil)
		return
	}
	if err := h.svc.Delete(id); err != nil {
		utils.ResInternalError(c, "Failed to delete")
		return
	}
	utils.ResOK(c, "Announcement deleted", nil)
}

// ===================== PPDB =====================

type PPDBHandler struct {
	svc *service.PPDBService
}

func NewPPDBHandler(svc *service.PPDBService) *PPDBHandler {
	return &PPDBHandler{svc: svc}
}

func (h *PPDBHandler) Register(c *gin.Context) {
	var req dto.PPDBRegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResBadRequest(c, "Validation failed", err.Error())
		return
	}
	p, err := h.svc.Register(req)
	if err != nil {
		utils.ResBadRequest(c, err.Error(), nil)
		return
	}
	utils.ResCreated(c, "Registration successful", p)
}

func (h *PPDBHandler) GetAll(c *gin.Context) {
	pq := utils.NewPaginationQuery(c)
	items, total, err := h.svc.GetAll(pq, c.Query("status"))
	if err != nil {
		utils.ResInternalError(c, "Failed to fetch registrations")
		return
	}
	utils.ResPaginated(c, "Registrations retrieved", items, pq.BuildMeta(total))
}

func (h *PPDBHandler) GetByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ResBadRequest(c, "Invalid ID", nil)
		return
	}
	p, err := h.svc.GetByID(id)
	if err != nil {
		utils.ResNotFound(c, "Registration not found")
		return
	}
	utils.ResOK(c, "Registration retrieved", p)
}

func (h *PPDBHandler) CheckStatus(c *gin.Context) {
	regNum := c.Query("registration_number")
	if regNum == "" {
		utils.ResBadRequest(c, "registration_number is required", nil)
		return
	}
	p, err := h.svc.CheckStatus(regNum)
	if err != nil {
		utils.ResNotFound(c, "Registration not found")
		return
	}
	utils.ResOK(c, "Status retrieved", p)
}

func (h *PPDBHandler) Review(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ResBadRequest(c, "Invalid ID", nil)
		return
	}
	var req dto.PPDBReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResBadRequest(c, "Validation failed", err.Error())
		return
	}
	userID := c.MustGet("user_id").(uuid.UUID)
	p, err := h.svc.Review(id, req, userID)
	if err != nil {
		utils.ResBadRequest(c, err.Error(), nil)
		return
	}
	utils.ResOK(c, "Registration reviewed", p)
}

// ===================== DASHBOARD =====================

type DashboardHandler struct {
	svc *service.DashboardService
}

func NewDashboardHandler(svc *service.DashboardService) *DashboardHandler {
	return &DashboardHandler{svc: svc}
}

func (h *DashboardHandler) GetStats(c *gin.Context) {
	stats, err := h.svc.GetStats()
	if err != nil {
		utils.ResInternalError(c, "Failed to fetch dashboard stats")
		return
	}
	utils.ResOK(c, "Dashboard stats retrieved", stats)
}
