package service

import (
	"bytes"
	"encoding/json"
	"net/http"
	"time"

	"github.com/tursinaalam/pesantren-api/internal/logger"
	"github.com/tursinaalam/pesantren-api/internal/models"
	"gorm.io/gorm"
)

type WAService struct {
	db       *gorm.DB
	apiURL   string
	apiToken string
}

func NewWAService(db *gorm.DB, apiURL, apiToken string) *WAService {
	return &WAService{db: db, apiURL: apiURL, apiToken: apiToken}
}

func (s *WAService) Send(phone, message, notifType, entityID, entityType string) error {
	notif := &models.WANotification{
		Phone:      phone,
		Message:    message,
		Type:       notifType,
		Status:     models.WAPending,
		EntityID:   entityID,
		EntityType: entityType,
	}
	s.db.Create(notif)

	if err := s.sendHTTP(phone, message); err != nil {
		notif.Status = models.WAFailed
		notif.Error = err.Error()
		notif.RetryCount++
		s.db.Save(notif)
		return err
	}

	now := time.Now()
	notif.Status = models.WASent
	notif.SentAt = &now
	s.db.Save(notif)
	return nil
}

func (s *WAService) SendPaymentReminder(phone, santriName, invoiceNumber string, amount float64, dueDate string) {
	msg := "Assalamualaikum Bapak/Ibu,\n\n" +
		"Ini adalah pengingat pembayaran dari Pondok Pesantren Tursina Alam.\n\n" +
		"Santri: " + santriName + "\n" +
		"Invoice: " + invoiceNumber + "\n" +
		"Jumlah: Rp " + formatIDR(amount) + "\n" +
		"Jatuh Tempo: " + dueDate + "\n\n" +
		"Mohon segera melakukan pembayaran.\n" +
		"Jazakallahu khairan."

	go s.Send(phone, msg, "payment_reminder", invoiceNumber, "payment")
}

func (s *WAService) SendAttendanceNotif(phone, santriName, status, date string) {
	statusMap := map[string]string{"absent": "Tidak Hadir (Alpha)", "sick": "Sakit", "late": "Terlambat", "permission": "Izin"}
	statusText := statusMap[status]
	if statusText == "" {
		statusText = status
	}

	msg := "Assalamualaikum Bapak/Ibu,\n\n" +
		"Informasi kehadiran hari ini:\n\n" +
		"Santri: " + santriName + "\n" +
		"Tanggal: " + date + "\n" +
		"Status: " + statusText + "\n\n" +
		"Pondok Pesantren Tursina Alam"

	go s.Send(phone, msg, "attendance", "", "attendance")
}

func (s *WAService) SendLeaveNotif(phone, santriName, status, leaveType string) {
	statusText := map[string]string{"approved": "DISETUJUI", "rejected": "DITOLAK"}[status]
	msg := "Assalamualaikum Bapak/Ibu,\n\n" +
		"Perizinan santri telah di-" + statusText + ".\n\n" +
		"Santri: " + santriName + "\n" +
		"Jenis: " + leaveType + "\n" +
		"Status: " + statusText + "\n\n" +
		"Pondok Pesantren Tursina Alam"

	go s.Send(phone, msg, "permission", "", "leave")
}

func (s *WAService) SendBroadcast(phones []string, message string) {
	for _, phone := range phones {
		go s.Send(phone, message, "announcement", "", "broadcast")
	}
}

func (s *WAService) GetLogs(page, perPage int, status, notifType string) ([]models.WANotification, int64, error) {
	db := s.db.Model(&models.WANotification{})
	if status != "" {
		db = db.Where("status = ?", status)
	}
	if notifType != "" {
		db = db.Where("type = ?", notifType)
	}
	var total int64
	db.Count(&total)

	var notifs []models.WANotification
	offset := (page - 1) * perPage
	err := db.Offset(offset).Limit(perPage).Order("created_at desc").Find(&notifs).Error
	return notifs, total, err
}

func (s *WAService) RetryFailed() int {
	var failed []models.WANotification
	s.db.Where("status = ? AND retry_count < 3", models.WAFailed).Find(&failed)

	retried := 0
	for _, n := range failed {
		if err := s.sendHTTP(n.Phone, n.Message); err != nil {
			n.RetryCount++
			n.Error = err.Error()
			s.db.Save(&n)
			continue
		}
		now := time.Now()
		n.Status = models.WASent
		n.SentAt = &now
		s.db.Save(&n)
		retried++
	}
	return retried
}

func (s *WAService) sendHTTP(phone, message string) error {
	if s.apiURL == "" || s.apiToken == "" {
		logger.Log.Warnw("WA API not configured, message logged only", "phone", phone)
		return nil // Don't fail if not configured
	}

	payload, _ := json.Marshal(map[string]string{
		"target":  phone,
		"message": message,
	})
	req, _ := http.NewRequest("POST", s.apiURL, bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", s.apiToken)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return nil
}

func formatIDR(amount float64) string {
	s := ""
	i := int64(amount)
	for i > 0 {
		if s != "" {
			s = "." + s
		}
		if i < 1000 {
			s = string(rune('0'+i%10)) + s
			i /= 10
			for i > 0 {
				s = string(rune('0'+i%10)) + s
				i /= 10
			}
			break
		}
		chunk := i % 1000
		i /= 1000
		if i > 0 {
			s = pad3(chunk) + s
		} else {
			s = itoa(chunk) + s
		}
	}
	if s == "" {
		s = "0"
	}
	return s
}

func pad3(n int64) string { return itoa(n/100) + itoa(n%100/10) + itoa(n%10) }
func itoa(n int64) string { return string(rune('0' + n)) }
