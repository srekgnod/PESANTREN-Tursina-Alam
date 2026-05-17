package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/tursinaalam/pesantren-api/internal/dto"
	"github.com/tursinaalam/pesantren-api/internal/service"
	"github.com/tursinaalam/pesantren-api/internal/utils"
)

type SantriHandler struct {
	svc *service.SantriService
}

func NewSantriHandler(svc *service.SantriService) *SantriHandler {
	return &SantriHandler{svc: svc}
}

// Create godoc
// @Summary Create santri
// @Tags Santri
// @Security BearerAuth
// @Param body body dto.CreateSantriRequest true "Santri data"
// @Success 201 {object} utils.StandardResponse
// @Router /api/v1/santri [post]
func (h *SantriHandler) Create(c *gin.Context) {
	var req dto.CreateSantriRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResBadRequest(c, "Validation failed", err.Error())
		return
	}
	userID := c.MustGet("user_id").(uuid.UUID)
	santri, err := h.svc.Create(req, userID)
	if err != nil {
		utils.ResBadRequest(c, err.Error(), nil)
		return
	}
	utils.ResCreated(c, "Santri created", santri)
}

// GetAll godoc
// @Summary List santri with pagination
// @Tags Santri
// @Security BearerAuth
// @Param page query int false "Page"
// @Param per_page query int false "Per page"
// @Param search query string false "Search"
// @Param status query string false "Filter status"
// @Param class query string false "Filter class"
// @Success 200 {object} utils.StandardResponse
// @Router /api/v1/santri [get]
func (h *SantriHandler) GetAll(c *gin.Context) {
	pq := utils.NewPaginationQuery(c)
	filters := map[string]string{
		"status":    c.Query("status"),
		"class":     c.Query("class"),
		"entry_year": c.Query("entry_year"),
		"dormitory": c.Query("dormitory"),
	}
	santris, total, err := h.svc.GetAll(pq, filters)
	if err != nil {
		utils.ResInternalError(c, "Failed to fetch santri")
		return
	}
	utils.ResPaginated(c, "Santri retrieved", santris, pq.BuildMeta(total))
}

// GetByID godoc
// @Summary Get santri by ID
// @Tags Santri
// @Security BearerAuth
// @Param id path string true "Santri ID"
// @Success 200 {object} utils.StandardResponse
// @Router /api/v1/santri/{id} [get]
func (h *SantriHandler) GetByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ResBadRequest(c, "Invalid ID", nil)
		return
	}
	santri, err := h.svc.GetByID(id)
	if err != nil {
		utils.ResNotFound(c, "Santri not found")
		return
	}
	utils.ResOK(c, "Santri retrieved", santri)
}

// Update godoc
// @Summary Update santri
// @Tags Santri
// @Security BearerAuth
// @Param id path string true "Santri ID"
// @Param body body dto.UpdateSantriRequest true "Update data"
// @Success 200 {object} utils.StandardResponse
// @Router /api/v1/santri/{id} [put]
func (h *SantriHandler) Update(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ResBadRequest(c, "Invalid ID", nil)
		return
	}
	var req dto.UpdateSantriRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ResBadRequest(c, "Validation failed", err.Error())
		return
	}
	userID := c.MustGet("user_id").(uuid.UUID)
	santri, err := h.svc.Update(id, req, userID)
	if err != nil {
		utils.ResBadRequest(c, err.Error(), nil)
		return
	}
	utils.ResOK(c, "Santri updated", santri)
}

// Delete godoc
// @Summary Delete santri
// @Tags Santri
// @Security BearerAuth
// @Param id path string true "Santri ID"
// @Success 200 {object} utils.StandardResponse
// @Router /api/v1/santri/{id} [delete]
func (h *SantriHandler) Delete(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.ResBadRequest(c, "Invalid ID", nil)
		return
	}
	userID := c.MustGet("user_id").(uuid.UUID)
	if err := h.svc.Delete(id, userID); err != nil {
		utils.ResInternalError(c, "Failed to delete santri")
		return
	}
	utils.ResOK(c, "Santri deleted", nil)
}
