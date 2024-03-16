import { Router } from "express";
import {
  createRequest,
  deleteRequest,
  searchRequests,
  updateRequest,
} from "../controllers/request.controller.js";

export const requestRoutes = () => {
  const router = Router({ strict: true });

  router.get("/", searchRequests);
  router.post("/", createRequest);
  router.patch("/:id", updateRequest);
  router.delete("/:id", deleteRequest);

  return router;
};
