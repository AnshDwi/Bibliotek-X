import { Router } from "express";

import { analyticsRouter } from "./analytics.routes.js";
import { assignmentRouter } from "./assignment.routes.js";
import { authRouter } from "./auth.routes.js";
import { collaborationRouter } from "./collaboration.routes.js";
import { contentRouter } from "./content.routes.js";
import { courseRouter } from "./course.routes.js";
import { focusRouter } from "./focus.routes.js";
import { notificationRouter } from "./notification.routes.js";
import { portalRouter } from "./portal.routes.js";
import { quizRouter } from "./quiz.routes.js";
import { teacherRouter } from "./teacher.routes.js";
import { voiceRouter } from "./voice.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/courses", courseRouter);
apiRouter.use("/content", contentRouter);
apiRouter.use("/analytics", analyticsRouter);
apiRouter.use("/assignments", assignmentRouter);
apiRouter.use("/quiz", quizRouter);
apiRouter.use("/focus", focusRouter);
apiRouter.use("/notifications", notificationRouter);
apiRouter.use("/portal", portalRouter);
apiRouter.use("/voice", voiceRouter);
apiRouter.use("/collaboration", collaborationRouter);
apiRouter.use("/teacher", teacherRouter);
