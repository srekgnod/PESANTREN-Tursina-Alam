package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/tursinaalam/pesantren-api/internal/handler"
	"github.com/tursinaalam/pesantren-api/internal/middleware"
	"github.com/tursinaalam/pesantren-api/internal/models"
)

type Handlers struct {
	Auth         *handler.AuthHandler
	Santri       *handler.SantriHandler
	Attendance   *handler.AttendanceHandler
	Payment      *handler.PaymentHandler
	Announcement *handler.AnnouncementHandler
	PPDB         *handler.PPDBHandler
	Dashboard    *handler.DashboardHandler
	Leave        *handler.LeaveHandler
	Wali         *handler.WaliHandler
	WA           *handler.WAHandler
}

func Setup(r *gin.Engine, h *Handlers, jwtSecret string) {
	api := r.Group("/api/v1")

	// ==================== PUBLIC ====================
	auth := api.Group("/auth")
	{
		auth.POST("/login", h.Auth.Login)
		auth.POST("/refresh", h.Auth.RefreshToken)
	}

	// Public announcements
	api.GET("/public/announcements", h.Announcement.GetPublic)

	// PPDB public
	ppdbPublic := api.Group("/ppdb")
	{
		ppdbPublic.POST("/register", h.PPDB.Register)
		ppdbPublic.GET("/status", h.PPDB.CheckStatus)
	}

	// ==================== AUTHENTICATED ====================
	protected := api.Group("")
	protected.Use(middleware.AuthMiddleware(jwtSecret))
	{
		// Auth
		protected.POST("/auth/logout", h.Auth.Logout)
		protected.GET("/auth/profile", h.Auth.GetProfile)
		protected.PUT("/auth/change-password", h.Auth.ChangePassword)

		// Dashboard — all authenticated users
		protected.GET("/dashboard/stats", h.Dashboard.GetStats)

		// ==================== WALI SANTRI PORTAL ====================
		wali := protected.Group("/wali")
		wali.Use(middleware.RoleGuard(models.RoleWali, models.RoleSuperAdmin, models.RoleAdmin))
		{
			wali.GET("/children", h.Wali.GetChildren)
			wali.GET("/children/:santri_id/dashboard", h.Wali.GetChildDashboard)
			wali.GET("/children/:santri_id/attendance", h.Wali.GetAttendanceHistory)
			wali.GET("/children/:santri_id/payments", h.Wali.GetPaymentHistory)
			wali.GET("/children/:santri_id/leaves", h.Leave.GetBySantri)
			wali.POST("/leaves", h.Leave.Create)
		}

		// ==================== STAFF ONLY ====================
		staff := protected.Group("")
		staff.Use(middleware.StaffOnly())
		{
			// Santri management
			santri := staff.Group("/santri")
			{
				santri.POST("", h.Santri.Create)
				santri.GET("", h.Santri.GetAll)
				santri.GET("/:id", h.Santri.GetByID)
				santri.PUT("/:id", h.Santri.Update)
			}

			// Attendance
			attendance := staff.Group("/attendance")
			{
				attendance.POST("/qr", h.Attendance.ScanQR)
				attendance.POST("/manual", h.Attendance.ManualRecord)
				attendance.GET("", h.Attendance.GetAll)
			}

			// Announcements
			announcements := staff.Group("/announcements")
			{
				announcements.POST("", h.Announcement.Create)
				announcements.GET("", h.Announcement.GetAll)
				announcements.GET("/:id", h.Announcement.GetByID)
				announcements.PUT("/:id", h.Announcement.Update)
			}

			// Leave management (staff)
			leave := staff.Group("/leaves")
			{
				leave.GET("", h.Leave.GetAll)
				leave.GET("/:id", h.Leave.GetByID)
				leave.POST("", h.Leave.Create)
				leave.PUT("/:id/review", h.Leave.Review)
				leave.PUT("/:id/returned", h.Leave.MarkReturned)
			}
		}

		// ==================== ADMIN ONLY ====================
		admin := protected.Group("")
		admin.Use(middleware.AdminOnly())
		{
			// Santri delete
			admin.DELETE("/santri/:id", h.Santri.Delete)

			// Payments
			payments := admin.Group("/payments")
			{
				payments.POST("", h.Payment.Create)
				payments.GET("", h.Payment.GetAll)
				payments.GET("/:id", h.Payment.GetByID)
				payments.PUT("/:id/confirm", h.Payment.Confirm)
				payments.GET("/santri/:santri_id", h.Payment.GetBySantri)
			}

			// Announcements delete
			admin.DELETE("/announcements/:id", h.Announcement.Delete)

			// PPDB admin
			ppdbAdmin := admin.Group("/ppdb")
			{
				ppdbAdmin.GET("", h.PPDB.GetAll)
				ppdbAdmin.GET("/:id", h.PPDB.GetByID)
				ppdbAdmin.PUT("/:id/review", h.PPDB.Review)
			}

			// WhatsApp management
			wa := admin.Group("/whatsapp")
			{
				wa.POST("/send", h.WA.SendTest)
				wa.POST("/broadcast", h.WA.Broadcast)
				wa.GET("/logs", h.WA.GetLogs)
				wa.POST("/retry", h.WA.RetryFailed)
			}
		}
	}
}
