package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tursinaalam/pesantren-api/internal/logger"
)

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) > 0 {
			for _, e := range c.Errors {
				logger.Log.Errorw("unhandled error", "error", e.Error())
			}
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Internal server error",
			})
		}
	}
}

func RecoveryMiddleware() gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
		logger.Log.Errorw("panic recovered", "error", recovered)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Internal server error",
		})
	})
}
