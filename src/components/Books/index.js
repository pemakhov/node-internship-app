const BooksService = require('./service');

/**
 * Gets the number of books per country and passes it in the JSON format
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 * @returns {Promise < void >}
 */
const chart = async (req, res, next) => {
    try {
        const data = await BooksService.getChartData();
        return res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        return next(error);
    }
};

/**
 * Sends the html file responsible for a world map view
 * @function
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const map = (req, res, next) => {
    try {
        res.status(200).sendFile('public/index.html', { root: `${__dirname}/../../..` });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    chart,
    map,
};
