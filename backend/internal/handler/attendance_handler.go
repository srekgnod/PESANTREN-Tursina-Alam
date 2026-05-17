package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/tursinaalam/pesantren-api/internal/dto"
	"github.com/tursinaalam/pesantren-api/internal/service"
	"github.com/tursinaalam/pesantren-api/internal/utils"
)

type AttendanceHandler struct {
	svc *service.AttendanceService
}

func NewAttendanceHandler(svc *service.AttendanceService) *AttendanceHandler {
	return &AttendanceHandler{svc: svc}
}

// ScanQR godoc
// @Summary QR attendance scan
// @Tags Attendance
// @Security BearerAuth
// @Param body body dto.QRAttendanceRequest true "QR data"
// @Success 200 {object} utils.StandardResponse
// @Router /api/v1/attendance/qr [post]
func (h *AttendanceHandler) ScanQR(c *gin.Context) {
	var req dto.QRAttendanceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResBadRequest(c, "Validation failed", err.Error())
		return
	}
	userID := c.MustGet("user_id").(uuid.UUID)
	att, err := h.svc.ScanQR(req, userID)
	if err != nil {
		utils.ResBadRequest(c, err.Error(), nil)
		return
	}
	utils.ResOK(c, "Attendance recorded", att)
}

// ManualRecord godoc
// @Summary Manual attendance record
// @Tags Attendance
// @Security BearerAuth
// @Param body body dto.ManualAttendanceRequest true "Attendance data"
// @Success 201 {object} utils.StandardResponse
// @Router /api/v1/attendance/manual [post]
func (h *AttendanceHandler) ManualRecord(c *gin.Context) {
	var req dto.ManualAttendanceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResBadRequest(c, "Validation failed", err.Error())
		return
	}
	userID := c.MustGet("user_id").(uuid.UUID)
	att, err := h.svc.ManualRecord(req, userID)
	if err != nil {
		utils.ResBadRequest(c, err.Error(), nil)
		return
	}
	utils.ResCreated(c, "Attendance recorded", att)
}

// GetAll godoc
// @Summary List attendance with filters
// @Tags Attendance
// @Security BearerAuth
// @Param page query int false "Page"
// @Param per_page query int false "Per page"
// @Param santri_id query string false "Santri ID"
// @Param status query string false "Status"
// @Param date_from query string false "Date from"
// @Param date_to query string false "Date to"
// @Success 200 {object} utils.StandardResponse
// @Router /api/v1/attendance [get]
func (h *AttendanceHandler) GetAll(c *gin.Context) {
	pq := utils.NewPaginationQuery(c)
	var filters dto.AttendanceFilter
	_ = c.ShouldBindQuery(&filters)
	atts, total, err := h.svc.GetAll(pq, filters)
	if err != nil {
		utils.ResInternalError(c, "Failed to fetch attendance")
		return
	}
	utils.ResPaginated(c, "Attendance retrieved", atts, pq.BuildMeta(total))
}
