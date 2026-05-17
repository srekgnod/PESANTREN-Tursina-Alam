package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/tursinaalam/pesantren-api/internal/config"
	"github.com/tursinaalam/pesantren-api/internal/database"
	"github.com/tursinaalam/pesantren-api/internal/handler"
	"github.com/tursinaalam/pesantren-api/internal/logger"
	"github.com/tursinaalam/pesantren-api/internal/middleware"
	"github.com/tursinaalam/pesantren-api/internal/models"
	"github.com/tursinaalam/pesantren-api/internal/repository"
	"github.com/tursinaalam/pesantren-api/internal/routes"
	"github.com/tursinaalam/pesantren-api/internal/service"
)

// @title           Pesantren Tursina Alam API
// @version         1.0
// @description     Enterprise API for Sistem Informasi Pondok Pesantren Tursina Alam
// @host            localhost:8080
// @BasePath        /api/v1
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {
	// Load config
	cfg := config.Load()

	// Init logger
	logger.Init(cfg.Log.Level, cfg.Log.File)
	logger.Log.Info("Starting Pesantren Tursina Alam API...")

	// Database
	db := database.NewPostgres(&cfg.DB)
	_ = database.NewRedis(&cfg.Redis)

	// Auto-migrate
	if err := db.AutoMigrate(models.AllModels()...); err != nil {
		log.Fatalf("failed to auto-migrate: %v", err)
	}
	logger.Log.Info("Database migrated successfully")

	// Repositories
	userRepo := repository.NewUserRepository(db)
	sessionRepo := repository.NewSessionRepository(db)
	auditRepo := repository.NewAuditRepository(db)
	santriRepo := repository.NewSantriRepository(db)
	attendanceRepo := repository.NewAttendanceRepository(db)
	paymentRepo := repository.NewPaymentRepository(db)
	announcementRepo := repository.NewAnnouncementRepository(db)
	ppdbRepo := repository.NewPPDBRepository(db)

	// Services
	authSvc := service.NewAuthService(userRepo, sessionRepo, auditRepo, &cfg.JWT)
	santriSvc := service.NewSantriService(santriRepo, userRepo, auditRepo)
	attendanceSvc := service.NewAttendanceService(attendanceRepo, santriRepo, auditRepo)
	paymentSvc := service.NewPaymentService(paymentRepo, auditRepo)
	announcementSvc := service.NewAnnouncementService(announcementRepo, auditRepo)
	ppdbSvc := service.NewPPDBService(ppdbRepo)
	dashboardSvc := service.NewDashboardService(santriRepo, attendanceRepo, paymentRepo, ppdbRepo)
	leaveSvc := service.NewLeaveService(db, auditRepo)
	waliSvc := service.NewWaliPortalService(db)
	waSvc := service.NewWAService(db, cfg.WhatsApp.APIURL, cfg.WhatsApp.APIToken)

	// Handlers
	handlers := &routes.Handlers{
		Auth:         handler.NewAuthHandler(authSvc),
		Santri:       handler.NewSantriHandler(santriSvc),
		Attendance:   handler.NewAttendanceHandler(attendanceSvc),
		Payment:      handler.NewPaymentHandler(paymentSvc),
		Announcement: handler.NewAnnouncementHandler(announcementSvc),
		PPDB:         handler.NewPPDBHandler(ppdbSvc),
		Dashboard:    handler.NewDashboardHandler(dashboardSvc),
		Leave:        handler.NewLeaveHandler(leaveSvc),
		Wali:         handler.NewWaliHandler(waliSvc),
		WA:           handler.NewWAHandler(waSvc),
	}

	// Gin engine
	if cfg.IsProduction() {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.New()

	// Global middleware
	r.Use(middleware.RecoveryMiddleware())
	r.Use(middleware.ErrorHandler())
	r.Use(middleware.LoggerMiddleware())
	r.Use(middleware.CORSMiddleware(cfg.CORS.Origins))

	// Static files
	r.Static("/uploads", cfg.Upload.Dir)

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": cfg.App.Name})
	})

	// Routes
	routes.Setup(r, handlers, cfg.JWT.Secret)

	// Start server
	addr := fmt.Sprintf(":%s", cfg.App.Port)
	logger.Log.Infof("Server running on %s", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
