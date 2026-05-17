package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/tursinaalam/pesantren-api/internal/utils"
)

func AuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" {
			utils.ResUnauthorized(c, "Authorization header is required")
			return
		}

		parts := strings.SplitN(header, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			utils.ResUnauthorized(c, "Invalid authorization header format")
			return
		}

		claims, err := utils.ValidateAccessToken(parts[1], jwtSecret)
		if err != nil {
			utils.ResUnauthorized(c, "Invalid or expired token")
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("username", claims.Username)
		c.Set("role", claims.Role)
		c.Next()
	}
}
