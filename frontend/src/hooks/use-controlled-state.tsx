import * as React from 'react';

interface CommonControlledStateProps<T> {
  value?: T;
  defaultValue?: T;
}

/**
 * Hook to manage controlled vs uncontrolled state.
 * 
 * This pattern is common in React component libraries (like Radix UI or MUI).
 * It allows a component to handle both modes:
 * 1. Controlled: Parent provides `value` and `onChange`. Parent manages state.
 * 2. Uncontrolled: Parent provides `defaultValue`. Component manages state internally.
 * 
 * @template T - The type of the state value
 * @template Rest - Additional arguments for the onChange callback
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useControlledState<T, Rest extends any[] = []>(
  props: CommonControlledStateProps<T> & {
    onChange?: (value: T, ...args: Rest) => void;
  },
): readonly [T, (next: T, ...args: Rest) => void] {
  const { value, defaultValue, onChange } = props;

  // Internal state to track value when uncontrolled
  // If 'value' (controlled) is provided, we use it. Otherwise, we use 'defaultValue' (uncontrolled).
  const [state, setInternalState] = React.useState<T>(
    value !== undefined ? value : (defaultValue as T),
  );

  // Sync internal state with controlled value prop
  // If the parent updates the 'value' prop, we must update our internal state to match.
  React.useEffect(() => {
    if (value !== undefined) setInternalState(value);
  }, [value]);

  // Handler to update state
  // This is what the component calls when it wants to change the value.
  const setState = React.useCallback(
    (next: T, ...args: Rest) => {
      // Always update internal state (for immediate UI feedback in uncontrolled mode)
      setInternalState(next);
      
      // Notify parent if onChange callback is provided
      // This is crucial for both controlled (to let parent update state) and uncontrolled (for side effects) modes.
      onChange?.(next, ...args);
    },
    [onChange],
  );

  return [state, setState] as const;
}
