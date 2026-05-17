package main

import (
	"fmt"
	"log"

	"github.com/tursinaalam/pesantren-api/internal/config"
	"github.com/tursinaalam/pesantren-api/internal/database"
	"github.com/tursinaalam/pesantren-api/internal/models"
	"github.com/tursinaalam/pesantren-api/internal/utils"
	"gorm.io/gorm"
)

func main() {
	cfg := config.Load()
	db := database.NewPostgres(&cfg.DB)

	// Auto-migrate first
	if err := db.AutoMigrate(models.AllModels()...); err != nil {
		log.Fatalf("migration failed: %v", err)
	}

	seedUsers(db)
	seedSantri(db)
	seedAnnouncements(db)
	log.Println("Seeding completed successfully!")
}

func seedUsers(db *gorm.DB) {
	users := []struct {
		Email    string
		Username string
		Password string
		FullName string
		Phone    string
		Role     models.Role
	}{
		{"superadmin@tursina.sch.id", "superadmin", "Admin@123", "Super Administrator", "081200000001", models.RoleSuperAdmin},
		{"admin@tursina.sch.id", "admin", "Admin@123", "Administrator Pondok", "081200000002", models.RoleAdmin},
		{"pengurus@tursina.sch.id", "pengurus01", "Staff@123", "Ust. Ahmad Fauzi", "081200000003", models.RolePengurus},
		{"ustadz@tursina.sch.id", "ustadz01", "Staff@123", "Ust. Muhammad Rizki", "081200000004", models.RoleUstadz},
		{"wali01@tursina.sch.id", "wali01", "Wali@123", "Bapak Hasan", "081200000005", models.RoleWali},
		{"wali02@tursina.sch.id", "wali02", "Wali@123", "Ibu Fatimah", "081200000006", models.RoleWali},
	}

	for _, u := range users {
		var count int64
		db.Model(&models.User{}).Where("username = ?", u.Username).Count(&count)
		if count > 0 {
			continue
		}
		hash, _ := utils.HashPassword(u.Password)
		user := models.User{
			Email: u.Email, Username: u.Username, Password: hash,
			FullName: u.FullName, Phone: u.Phone, Role: u.Role, IsActive: true,
		}
		db.Create(&user)
		log.Printf("Created user: %s (%s)", u.Username, u.Role)
	}
}

func seedSantri(db *gorm.DB) {
	// Get wali users
	var wali1, wali2 models.User
	db.Where("username = ?", "wali01").First(&wali1)
	db.Where("username = ?", "wali02").First(&wali2)

	santris := []models.Santri{
		{NIS: "2026001", FullName: "Muhammad Abdullah", Gender: "L", PlaceOfBirth: "Jakarta", Address: "Jl. Merdeka 1", ParentName: "Bapak Hasan", ParentPhone: "081200000005", EntryYear: 2026, Class: "7A", Dormitory: "Al-Fatih", Status: "active", QRCode: "TURSINA-2026001-a1b2c3d4", WaliUserID: &wali1.ID},
		{NIS: "2026002", FullName: "Aisyah Zahra", Gender: "P", PlaceOfBirth: "Bandung", Address: "Jl. Melati 5", ParentName: "Ibu Fatimah", ParentPhone: "081200000006", EntryYear: 2026, Class: "7A", Dormitory: "Khadijah", Status: "active", QRCode: "TURSINA-2026002-e5f6g7h8", WaliUserID: &wali2.ID},
		{NIS: "2026003", FullName: "Umar Faruq", Gender: "L", PlaceOfBirth: "Surabaya", Address: "Jl. Ahmad Yani 10", ParentName: "Bapak Ibrahim", ParentPhone: "081200000007", EntryYear: 2026, Class: "7B", Dormitory: "Al-Fatih", Status: "active", QRCode: "TURSINA-2026003-i9j0k1l2"},
		{NIS: "2025001", FullName: "Khadijah Nur", Gender: "P", PlaceOfBirth: "Yogyakarta", Address: "Jl. Malioboro 3", ParentName: "Ibu Siti", ParentPhone: "081200000008", EntryYear: 2025, Class: "8A", Dormitory: "Khadijah", Status: "active", QRCode: "TURSINA-2025001-m3n4o5p6"},
		{NIS: "2025002", FullName: "Ali Imran", Gender: "L", PlaceOfBirth: "Semarang", Address: "Jl. Pandanaran 7", ParentName: "Bapak Yusuf", ParentPhone: "081200000009", EntryYear: 2025, Class: "8B", Dormitory: "Al-Fatih", Status: "active", QRCode: "TURSINA-2025002-q7r8s9t0"},
	}

	for _, s := range santris {
		var count int64
		db.Model(&models.Santri{}).Where("nis = ?", s.NIS).Count(&count)
		if count > 0 {
			continue
		}
		db.Create(&s)
		log.Printf("Created santri: %s (%s)", s.FullName, s.NIS)
	}
}

func seedAnnouncements(db *gorm.DB) {
	var admin models.User
	db.Where("username = ?", "admin").First(&admin)

	announcements := []models.Announcement{
		{Title: "Pendaftaran Santri Baru T.A. 2026/2027 Dibuka", Content: "Pondok Pesantren Tursina Alam membuka pendaftaran santri baru. Pendaftaran dilakukan secara online melalui portal PPDB.", Category: "ppdb", IsPublic: true, AuthorID: admin.ID},
		{Title: "Jadwal Ujian Akhir Semester Genap", Content: "Ujian akhir semester genap dilaksanakan tanggal 1-12 Juni 2026 untuk seluruh jenjang.", Category: "akademik", IsPublic: true, AuthorID: admin.ID},
		{Title: "Workshop Teknologi Digital untuk Tenaga Pengajar", Content: "Pondok mengadakan workshop integrasi teknologi digital dalam proses belajar mengajar.", Category: "umum", IsPublic: true, AuthorID: admin.ID},
	}

	for _, a := range announcements {
		var count int64
		db.Model(&models.Announcement{}).Where("title = ?", a.Title).Count(&count)
		if count > 0 {
			continue
		}
		db.Create(&a)
		fmt.Printf("Created announcement: %s\n", a.Title)
	}
}
