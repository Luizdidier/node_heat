import { Request, Response } from "express";
import { CreateMessageService } from "../services/CreateMessageService";
 
class CreateMessageControler {
    async handle(request: Request, response: Response) {
        const { message, countryCode } = request.body;
        const { user_id } = request;

        const service = new CreateMessageService();
        const result = await service.execute(message, user_id, countryCode);

        return response.json(result);
    }
}

export { CreateMessageControler }