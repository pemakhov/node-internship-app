/**
 * The interface describing the result of database search.
 * An array of objects containing country code and the appropriate number of books.
 */
export default interface Books {
    [index: number]: { code3: string; value: number };
// ? two opposite eslint rules (!)
// eslint-disable-next-line semi
}
