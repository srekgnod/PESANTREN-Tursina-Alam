package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/tursinaalam/pesantren-api/internal/service"
	"github.com/tursinaalam/pesantren-api/internal/utils"
)

type WaliHandler struct {
	svc *service.WaliPortalService
}

func NewWaliHandler(svc *service.WaliPortalService) *WaliHandler {
	return &WaliHandler{svc: svc}
}

// @Summary Get wali's children list
// @Tags Wali Portal
func (h *WaliHandler) GetChildren(c *gin.Context) {
	waliID := c.MustGet("user_id").(uuid.UUID)
	children, err := h.svc.GetChildren(waliID)
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": children})
}

// @Summary Get child dashboard with aggregated stats
// @Tags Wali Portal
func (h *WaliHandler) GetChildDashboard(c *gin.Context) {
	santriID, err := uuid.Parse(c.Param("santri_id"))
	if err != nil {
		utils.BadRequest(c, "Invalid santri ID")
		return
	}
	waliID := c.MustGet("user_id").(uuid.UUID)
	dashboard, err := h.svc.GetChildDashboard(santriID, waliID)
	if err != nil {
		utils.NotFound(c, err.Error())
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": dashboard})
}

// @Summary Get child attendance history
// @Tags Wali Portal
func (h *WaliHandler) GetAttendanceHistory(c *gin.Context) {
	santriID, err := uuid.Parse(c.Param("santri_id"))
	if err != nil {
		utils.BadRequest(c, "Invalid santri ID")
		return
	}
	waliID := c.MustGet("user_id").(uuid.UUID)
	pq := utils.NewPaginationQuery(c)
	month := c.Query("month")

	data, total, err := h.svc.GetAttendanceHistory(santriID, waliID, pq, month)
	if err != nil {
		utils.BadRequest(c, err.Error())
		return
	}
	utils.Paginated(c, data, total, pq.Page, pq.PerPage)
}

// @Summary Get child payment history
// @Tags Wali Portal
func (h *WaliHandler) GetPaymentHistory(c *gin.Context) {
	santriID, err := uuid.Parse(c.Param("santri_id"))
	if err != nil {
		utils.BadRequest(c, "Invalid santri ID")
		return
	}
	waliID := c.MustGet("user_id").(uuid.UUID)
	payments, err := h.svc.GetPaymentHistory(santriID, waliID)
	if err != nil {
		utils.BadRequest(c, err.Error())
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": payments})
}
