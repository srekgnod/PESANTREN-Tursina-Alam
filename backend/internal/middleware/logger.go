package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/tursinaalam/pesantren-api/internal/logger"
)

func LoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		raw := c.Request.URL.RawQuery

		c.Next()

		latency := time.Since(start)
		status := c.Writer.Status()
		method := c.Request.Method
		clientIP := c.ClientIP()

		if raw != "" {
			path = path + "?" + raw
		}

		if status >= 500 {
			logger.Log.Errorw("request",
				"status", status, "method", method, "path", path,
				"ip", clientIP, "latency", latency.String(),
				"error", c.Errors.ByType(gin.ErrorTypePrivate).String(),
			)
		} else if status >= 400 {
			logger.Log.Warnw("request",
				"status", status, "method", method, "path", path,
				"ip", clientIP, "latency", latency.String(),
			)
		} else {
			logger.Log.Infow("request",
				"status", status, "method", method, "path", path,
				"ip", clientIP, "latency", latency.String(),
			)
		}
	}
}
