import * as React from "react";

import { composeRefs } from "@shared/utils/compose-refs";

// Types
interface SlottableProps {
  children: React.ReactNode;
}

interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

interface SlotCloneProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

type EventHandler = (...args: unknown[]) => void;

interface ReactElementWithRef extends React.ReactElement {
  ref?: React.Ref<HTMLElement>;
}

interface CloneElementProps {
  [key: string]: unknown;
  ref?: React.Ref<HTMLElement>;
}

function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>,
): Record<string, unknown> {
  const overrideProps = { ...childProps };

  // eslint-disable-next-line
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          (childPropValue as EventHandler)(...args);
          (slotPropValue as EventHandler)(...args);
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = {
        ...(typeof slotPropValue === "object" && slotPropValue !== null
          ? slotPropValue
          : {}),
        ...(typeof childPropValue === "object" && childPropValue !== null
          ? childPropValue
          : {}),
      };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue]
        .filter(Boolean)
        .join(" ");
    }
  }

  return { ...slotProps, ...overrideProps };
}

function isSlottable(
  child: React.ReactNode,
): child is React.ReactElement<SlottableProps> {
  return React.isValidElement(child) && child.type === Slottable;
}

const Slottable: React.FC<SlottableProps> = ({ children }) => {
  // eslint-disable-next-line
  return <>{children}</>;
};

const Slot = React.forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = React.Children.toArray(children);
  const slottable = childrenArray.find(isSlottable);

  if (slottable) {
    const newElement = slottable.props.children;

    const newChildren = childrenArray.map((child) => {
      if (child === slottable) {
        if (React.Children.count(newElement) > 1)
          return React.Children.only(null);

        return React.isValidElement(newElement)
          ? (newElement.props as { children?: React.ReactNode }).children
          : null;
      }
      return child;
    });

    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {React.isValidElement(newElement)
          ? React.cloneElement(newElement, undefined, newChildren)
          : null}
      </SlotClone>
    );
  }

  return (
    <SlotClone {...slotProps} ref={forwardedRef}>
      {children}
    </SlotClone>
  );
});

Slot.displayName = "Slot";

const SlotClone = (props: SlotCloneProps) => {
  const { children, ref, ...slotProps } = props;

  if (React.isValidElement(children)) {
    const elementWithRef = children as ReactElementWithRef;
    const mergedProps = mergeProps(
      slotProps,
      children.props as Record<string, unknown>,
    );
    const cloneProps: CloneElementProps = {
      ...mergedProps,
      ref: ref ? composeRefs(ref, elementWithRef.ref) : elementWithRef.ref,
    };
    return React.cloneElement(elementWithRef, cloneProps);
  }

  return React.Children.count(children) > 1 ? React.Children.only(null) : null;
};

SlotClone.displayName = "SlotClone";

export { Slot, Slottable };
