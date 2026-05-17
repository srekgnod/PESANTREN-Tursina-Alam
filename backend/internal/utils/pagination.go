package utils

import (
	"math"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PaginationQuery struct {
	Page    int    `form:"page"`
	PerPage int    `form:"per_page"`
	Sort    string `form:"sort"`
	Order   string `form:"order"`
	Search  string `form:"search"`
}

func NewPaginationQuery(c *gin.Context) PaginationQuery {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "15"))

	if page < 1 {
		page = 1
	}
	if perPage < 1 || perPage > 100 {
		perPage = 15
	}

	sort := c.DefaultQuery("sort", "created_at")
	order := c.DefaultQuery("order", "desc")
	if order != "asc" && order != "desc" {
		order = "desc"
	}

	return PaginationQuery{
		Page:    page,
		PerPage: perPage,
		Sort:    sort,
		Order:   order,
		Search:  c.Query("search"),
	}
}

func (pq PaginationQuery) Apply(db *gorm.DB) *gorm.DB {
	offset := (pq.Page - 1) * pq.PerPage
	return db.Offset(offset).Limit(pq.PerPage).Order(pq.Sort + " " + pq.Order)
}

func (pq PaginationQuery) BuildMeta(total int64) *Meta {
	totalPages := int(math.Ceil(float64(total) / float64(pq.PerPage)))
	return &Meta{
		Page:       pq.Page,
		PerPage:    pq.PerPage,
		Total:      total,
		TotalPages: totalPages,
	}
}
