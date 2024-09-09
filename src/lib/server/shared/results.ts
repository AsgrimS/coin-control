export type Ok<T> = { ok: true; data: T }
export type Err<E> = { ok: false; error: E }

/** A type that can be either null or a value */
export type Some<T> = T | null

/** A result of an operation that can be either successful or failed */
export type Result<T, E> = Ok<T> | Err<E>

/** Result of a successful operation
 * @param data - The data to be wrapped in an Ok
 * @returns An Ok with the given data
 */
// @ts-expect-error - The type of the data parameter is inferred from the given argument
export const ok = <T>(data?: T): Ok<T> => ({ ok: true, data })

/** Result of a failed operation
 * @param error - The error to be wrapped in an Err
 * @returns An Err with the given error
 */
export const err = <E>(error: E): Err<E> => ({ ok: false, error })
