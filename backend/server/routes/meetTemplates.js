const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  createMeetTemplate,
  getMeetTemplatesForOrg,
  getMeetTemplateById,
  updateMeetTemplate,
  deleteMeetTemplate,
} = require("../controllers/meet_templates");

// All meet template routes require authentication
router
  .post("/", requireAuth, createMeetTemplate) // POST /meet-templates
  .get("/", requireAuth, getMeetTemplatesForOrg) // GET /meet-templates
  .get("/:template_rk", requireAuth, getMeetTemplateById) // GET /meet-templates/:template_rk
  .put("/:template_rk", requireAuth, updateMeetTemplate) // PUT /meet-templates/:template_rk
  .delete("/:template_rk", requireAuth, deleteMeetTemplate); // DELETE /meet-templates/:template_rk

module.exports = router;
