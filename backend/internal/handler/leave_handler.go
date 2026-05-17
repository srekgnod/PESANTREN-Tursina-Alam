package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/tursinaalam/pesantren-api/internal/service"
	"github.com/tursinaalam/pesantren-api/internal/utils"
)

type LeaveHandler struct {
	svc *service.LeaveService
}

func NewLeaveHandler(svc *service.LeaveService) *LeaveHandler {
	return &LeaveHandler{svc: svc}
}

// @Summary Create leave request
// @Tags Leave
func (h *LeaveHandler) Create(c *gin.Context) {
	var req service.CreateLeaveRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationError(c, err)
		return
	}
	userID := c.MustGet("user_id").(uuid.UUID)
	leave, err := h.svc.Create(req, userID)
	if err != nil {
		utils.BadRequest(c, err.Error())
		return
	}
	utils.Created(c, "Perizinan berhasil diajukan", leave)
}

// @Summary Review leave request (approve/reject)
// @Tags Leave
func (h *LeaveHandler) Review(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.BadRequest(c, "Invalid ID")
		return
	}
	var req service.ReviewLeaveRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationError(c, err)
		return
	}
	approverID := c.MustGet("user_id").(uuid.UUID)
	leave, err := h.svc.Review(id, req, approverID)
	if err != nil {
		utils.BadRequest(c, err.Error())
		return
	}
	utils.Success(c, "Perizinan berhasil di-review", leave)
}

// @Summary Mark leave as returned
// @Tags Leave
func (h *LeaveHandler) MarkReturned(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.BadRequest(c, "Invalid ID")
		return
	}
	if err := h.svc.MarkReturned(id); err != nil {
		utils.InternalError(c, err.Error())
		return
	}
	utils.Success(c, "Santri telah kembali", nil)
}

// @Summary Get all leave requests
// @Tags Leave
func (h *LeaveHandler) GetAll(c *gin.Context) {
	pq := utils.NewPaginationQuery(c)
	status := c.Query("status")
	santriID := c.Query("santri_id")
	leaves, total, err := h.svc.GetAll(pq, status, santriID)
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}
	utils.Paginated(c, leaves, total, pq.Page, pq.PerPage)
}

// @Summary Get leave by ID
// @Tags Leave
func (h *LeaveHandler) GetByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.BadRequest(c, "Invalid ID")
		return
	}
	leave, err := h.svc.GetByID(id)
	if err != nil {
		utils.NotFound(c, "Perizinan tidak ditemukan")
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": leave})
}

// @Summary Get leaves by santri (for wali portal)
// @Tags Leave
func (h *LeaveHandler) GetBySantri(c *gin.Context) {
	santriID, err := uuid.Parse(c.Param("santri_id"))
	if err != nil {
		utils.BadRequest(c, "Invalid santri ID")
		return
	}
	leaves, err := h.svc.GetBySantri(santriID)
	if err != nil {
		utils.InternalError(c, err.Error())
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": leaves})
}
