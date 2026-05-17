package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/tursinaalam/pesantren-api/internal/models"
	"github.com/tursinaalam/pesantren-api/internal/utils"
)

// RoleGuard checks if the authenticated user has one of the allowed roles
func RoleGuard(roles ...models.Role) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role")
		if !exists {
			utils.ResUnauthorized(c, "Authentication required")
			return
		}

		roleStr, ok := userRole.(string)
		if !ok {
			utils.ResInternalError(c, "Invalid role type in context")
			return
		}

		for _, allowed := range roles {
			if models.Role(roleStr) == allowed {
				c.Next()
				return
			}
		}

		utils.ResForbidden(c, "You do not have permission to access this resource")
	}
}

// AdminOnly is a shortcut for super_admin and admin roles
func AdminOnly() gin.HandlerFunc {
	return RoleGuard(models.RoleSuperAdmin, models.RoleAdmin)
}

// StaffOnly allows admin, pengurus, and ustadz
func StaffOnly() gin.HandlerFunc {
	return RoleGuard(models.RoleSuperAdmin, models.RoleAdmin, models.RolePengurus, models.RoleUstadz)
}
