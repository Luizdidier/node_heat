import { Router } from "express";
import { AuthenticateUserController } from './controllers/AuthenticateUserController'
import { CreateMessageControler } from "./controllers/CreateMessageControler";
import { GetLast3MessagesController } from "./controllers/GetLast3MessagesController";
import { ProfileUserControler } from "./controllers/ProfileUserControler";
import { ensureAuthenticated } from "./middleware/ensureAuthenticated";

const router = Router();

router.post("/authenticate", new AuthenticateUserController().handle);
router.get("/messages/last3", new GetLast3MessagesController().handle)
//Authenticada
router.post("/messages", ensureAuthenticated, new CreateMessageControler().handle);
router.get("/profile", ensureAuthenticated, new ProfileUserControler().handle)

export { router }