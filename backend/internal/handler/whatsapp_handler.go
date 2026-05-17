package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/tursinaalam/pesantren-api/internal/service"
	"github.com/tursinaalam/pesantren-api/internal/utils"
)

type WAHandler struct {
	svc *service.WAService
}

func NewWAHandler(svc *service.WAService) *WAHandler {
	return &WAHandler{svc: svc}
}

// @Summary Send test WhatsApp message
// @Tags WhatsApp
func (h *WAHandler) SendTest(c *gin.Context) {
	var req struct {
		Phone   string `json:"phone" binding:"required"`
		Message string `json:"message" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationError(c, err)
		return
	}
	if err := h.svc.Send(req.Phone, req.Message, "test", "", ""); err != nil {
		utils.InternalError(c, err.Error())
		return
	}
	utils.Success(c, "Pesan WhatsApp terkirim", nil)
}

// @Summary Send broadcast to multiple phones
// @Tags WhatsApp
func (h *WAHandler) Broadcast(c *gin.Context) {
	var req struct {
		Phones  []string `json:"phones" binding:"required"`
		Message string   `json:"message" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationError(c, err)
		return
	}
	h.svc.SendBroadcast(req.Phones, req.Message)
	utils.Success(c, "Broadcast dijadwalkan", gin.H{"total": len(req.Phones)})
}

// @Summary Get notification logs
// @Tags WhatsApp
func (h *WAHandler) GetLogs(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "20"))
	status := c.Query("status")
	notifType := c.Query("type")

	logs, total, err := h.svc.GetLogs(page, perPage, status, notifType)
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}
	utils.Paginated(c, logs, total, page, perPage)
}

// @Summary Retry failed notifications
// @Tags WhatsApp
func (h *WAHandler) RetryFailed(c *gin.Context) {
	retried := h.svc.RetryFailed()
	utils.Success(c, "Retry selesai", gin.H{"retried": retried})
}
