const router = require("express").Router();
const c = require("../controllers/announcementController");
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");
router.use(auth);
router.get("/", c.list);
router.post("/", roles("admin", "faculty"), c.create);
router.delete("/:id", roles("admin"), c.remove);
module.exports = router;
