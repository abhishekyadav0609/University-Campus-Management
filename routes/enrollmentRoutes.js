const router = require("express").Router();
const c = require("../controllers/academicController");
const auth = require("../middleware/auth");
const roles = require("../middleware/roles");
router.use(auth);
router.get("/mine", c.myCourses);
router.post("/", roles("admin"), c.enroll);
router.delete("/:id", roles("admin"), c.deleteEnrollment);
module.exports = router;
