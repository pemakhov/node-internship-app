const COLLECTION_NAME = 'booksmodel';

module.exports = {
    async up(db) {
        try {
            await db.collection(COLLECTION_NAME).updateMany(
                {},
                {
                    $set: {
                        titleLength: { $strLenCP: '$title' },
                        updatedAt: '$$NOW',
                    },
                },
            );
        } catch (error) {
            console.error(error);
        }
    },

    async down(db) {

    },
};
