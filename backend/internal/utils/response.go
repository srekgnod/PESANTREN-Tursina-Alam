package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// StandardResponse is the unified API response format
type StandardResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Meta    *Meta       `json:"meta,omitempty"`
	Errors  interface{} `json:"errors,omitempty"`
}

type Meta struct {
	Page       int   `json:"page"`
	PerPage    int   `json:"per_page"`
	Total      int64 `json:"total"`
	TotalPages int   `json:"total_pages"`
}

func ResOK(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, StandardResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func ResCreated(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusCreated, StandardResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func ResPaginated(c *gin.Context, message string, data interface{}, meta *Meta) {
	c.JSON(http.StatusOK, StandardResponse{
		Success: true,
		Message: message,
		Data:    data,
		Meta:    meta,
	})
}

func ResError(c *gin.Context, code int, message string, errors interface{}) {
	c.AbortWithStatusJSON(code, StandardResponse{
		Success: false,
		Message: message,
		Errors:  errors,
	})
}

func ResBadRequest(c *gin.Context, message string, errors interface{}) {
	ResError(c, http.StatusBadRequest, message, errors)
}

func ResUnauthorized(c *gin.Context, message string) {
	ResError(c, http.StatusUnauthorized, message, nil)
}

func ResForbidden(c *gin.Context, message string) {
	ResError(c, http.StatusForbidden, message, nil)
}

func ResNotFound(c *gin.Context, message string) {
	ResError(c, http.StatusNotFound, message, nil)
}

func ResInternalError(c *gin.Context, message string) {
	ResError(c, http.StatusInternalServerError, message, nil)
}

// ============ Shorthand Aliases ============

func Success(c *gin.Context, message string, data interface{}) { ResOK(c, message, data) }
func Created(c *gin.Context, message string, data interface{}) { ResCreated(c, message, data) }
func BadRequest(c *gin.Context, message string)                { ResBadRequest(c, message, nil) }
func NotFound(c *gin.Context, message string)                  { ResNotFound(c, message) }
func InternalError(c *gin.Context, message string)             { ResInternalError(c, message) }
func Unauthorized(c *gin.Context, message string)              { ResUnauthorized(c, message) }

func ValidationError(c *gin.Context, err error) {
	ResBadRequest(c, "Validation failed", err.Error())
}

func Paginated(c *gin.Context, data interface{}, total int64, page, perPage int) {
	totalPages := int(total) / perPage
	if int(total)%perPage > 0 {
		totalPages++
	}
	ResPaginated(c, "Data retrieved", data, &Meta{
		Page:       page,
		PerPage:    perPage,
		Total:      total,
		TotalPages: totalPages,
	})
}
