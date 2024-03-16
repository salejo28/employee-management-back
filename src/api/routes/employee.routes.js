import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  searchEmployee,
  updateEmployee,
} from "../controllers/employee.controller.js";

export const employeeRoutes = () => {
  const router = Router({ strict: true });

  router.get("/", searchEmployee);
  router.post("/", createEmployee);
  router.patch("/:id", updateEmployee);
  router.delete("/:id", deleteEmployee);

  return router;
};
