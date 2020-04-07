import express from 'express';
import Service from './Service';

export default class BooksComponet {
    private booksService: Service;

    constructor() {
        this.booksService = new Service();
    }

    /**
     * Gets the number of books per country and passes it in the JSON format
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     * @returns {Promise < void >}
     */
    public chart = async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction): Promise<any> => {
        try {
            const data = await this.booksService.getChartData();
            return res.status(200).json({ data });
        } catch (error) {
            res.status(500).json({
                message: error.name,
                details: error.message,
            });

            return next(error);
        }
    }
}
