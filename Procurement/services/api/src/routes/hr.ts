import { Router } from "express";
const router = Router();
router.get("/", (req, res) => {
  res.json({ message: "HR endpoint" });
});
export default router;