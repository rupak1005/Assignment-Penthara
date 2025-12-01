import * as React from 'react';

/**
 * Utility to create a React Context with strict type safety and error handling.
 * 
 * Problem:
 * Standard React.createContext() requires a default value. If you use 'undefined',
 * you have to check for undefined every time you use the context.
 * 
 * Solution:
 * This helper creates a Context and a custom Hook.
 * The hook throws a meaningful error if used outside its Provider.
 * This guarantees that the context value is always defined when used.
 * 
 * @template T - The type of the context value
 * @param {string} name - The name of the context (used in error messages)
 * @returns {Array} [Provider, useContextHook]
 */
function getStrictContext<T>(
  name?: string,
): readonly [
  ({
    value,
    children,
  }: {
    value: T;
    children?: React.ReactNode;
  }) => React.JSX.Element,
  () => T,
] {
  // Create context with undefined as default
  // We handle the undefined check in the hook below
  const Context = React.createContext<T | undefined>(undefined);

  // The Provider component
  // It's a simple wrapper around Context.Provider
  const Provider = ({
    value,
    children,
  }: {
    value: T;
    children?: React.ReactNode;
  }) => <Context.Provider value={value}>{children}</Context.Provider>;

  // The custom hook to consume the context
  const useSafeContext = () => {
    const ctx = React.useContext(Context);
    
    // Runtime check: ensure context is used within a Provider
    if (ctx === undefined) {
      throw new Error(`useContext must be used within ${name ?? 'a Provider'}`);
    }
    
    // Return the context value (guaranteed to be T, not T | undefined)
    return ctx;
  };

  return [Provider, useSafeContext] as const;
}

export { getStrictContext };
