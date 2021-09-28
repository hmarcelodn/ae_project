import { Service } from "typedi";
import BaseController from "./base";

@Service()
export class ReservationController extends BaseController {
    public path: string = '/';

    constructor() {
        super();
    }

    protected initializeRouter(): void {
        throw new Error("Method not implemented.");
    }
}
