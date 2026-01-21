// Generic type-safe action helper wrapper

/**
 * Generic type-safe wrapper for server actions
 * Provides consistent error handling and return type across all actions
 */

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Wraps an async action with try-catch error handling
 * @param action - Async function to execute
 * @returns ActionResult with success/error state
 */
export async function safeAction<T>(
  action: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const data = await action()
    return { success: true, data }
  } catch (error) {
    console.error('Action error:', error)

    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: 'An unexpected error occurred' }
  }
}
