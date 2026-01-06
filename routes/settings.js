const express = require("express");
const whatsappService = require("../services/whatsapps.service");
const router = express.Router();

// GET /api/whatsapp/settings - Get current whatsapp settings
router.get("/whatsapp/settings", async (req, res) => {
  try {
    const whatsappStatus = whatsappService.getConnectionStatus();

    const settings = {
      whatsappEnabled: whatsappStatus.enabled,
      whatsappConfigured: whatsappStatus.isConnected,
      connectionStatus: whatsappStatus,
    };

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching notification settings:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notification settings",
      error: error.message,
    });
  }
});

// POST /api/whatsapp/test - Send test WhatsApp notification
router.post("/whatsapp/test", async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const sent = await whatsappService.sendTestNotification(phoneNumber);

    if (sent) {
      res.json({
        success: true,
        message: "Test notification sent successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send test notification",
      });
    }
  } catch (error) {
    console.error("Error sending test notification:", error);
    res.status(500).json({
      success: false,
      message: "Error sending test notification",
      error: error.message,
    });
  }
});

// GET /api/notifications/whatsapp/status - Get WhatsApp connection status
router.get("/whatsapp/status", async (req, res) => {
  try {
    const status = whatsappService.getConnectionStatus();
    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error("Error getting WhatsApp status:", error);
    res.status(500).json({
      success: false,
      message: "Error getting WhatsApp status",
      error: error.message,
    });
  }
});

// POST /api/notifications/whatsapp/connect - Initiate WhatsApp connection
router.post("/whatsapp/connect", async (req, res) => {
  try {
    await whatsappService.connectToWhatsApp();
    const status = whatsappService.getConnectionStatus();

    res.json({
      success: true,
      message: "WhatsApp connection initiated",
      data: status,
    });
  } catch (error) {
    console.error("Error connecting to WhatsApp:", error);
    res.status(500).json({
      success: false,
      message: "Error connecting to WhatsApp",
      error: error.message,
    });
  }
});

// POST /api/notifications/whatsapp/disconnect - Disconnect WhatsApp
router.post("/whatsapp/disconnect", async (req, res) => {
  try {
    await whatsappService.disconnect();

    res.json({
      success: true,
      message: "WhatsApp disconnected successfully",
    });
  } catch (error) {
    console.error("Error disconnecting WhatsApp:", error);
    res.status(500).json({
      success: false,
      message: "Error disconnecting WhatsApp",
      error: error.message,
    });
  }
});

// POST /api/notifications/whatsapp/reconnect - Force reconnect WhatsApp
router.post("/whatsapp/reconnect", async (req, res) => {
  try {
    await whatsappService.forceReconnect();
    const status = whatsappService.getConnectionStatus();

    res.json({
      success: true,
      message: "WhatsApp reconnection initiated",
      data: status,
    });
  } catch (error) {
    console.error("Error reconnecting WhatsApp:", error);
    res.status(500).json({
      success: false,
      message: "Error reconnecting WhatsApp",
      error: error.message,
    });
  }
});

// POST /api/notifications/whatsapp/clear-session - Clear saved session
router.post("/whatsapp/clear-session", async (req, res) => {
  try {
    await whatsappService.disconnect(true); // Disconnect and clear session

    res.json({
      success: true,
      message:
        "WhatsApp session cleared successfully. Please reconnect with new QR code.",
    });
  } catch (error) {
    console.error("Error clearing WhatsApp session:", error);
    res.status(500).json({
      success: false,
      message: "Error clearing WhatsApp session",
      error: error.message,
    });
  }
});

module.exports = router;
