import React from 'react';

import { cn } from '~/lib/utils';

export interface HeaderProps extends React.ComponentPropsWithoutRef<'div'> {}

export interface HeaderTitleProps
  extends React.ComponentPropsWithoutRef<'div'> {}

export interface HeaderDescriptionProps
  extends React.ComponentPropsWithoutRef<'p'> {}

const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  ({ className, ...props }, ref) => {
    return <div className={cn('py-2', className)} ref={ref} {...props} />;
  }
);

const HeaderTitle = React.forwardRef<HTMLInputElement, HeaderTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('text-lg font-semibold uppercase', className)}
        ref={ref}
        {...props}
      />
    );
  }
);

const HeaderDescription = React.forwardRef<
  HTMLInputElement,
  HeaderDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p
      className={cn(
        'text-xs font-medium text-neutral-500 dark:text-neutral-300',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Header.displayName = 'Header';
HeaderTitle.displayName = 'HeaderTitle';
HeaderDescription.displayName = 'HeaderDescription';

export { Header, HeaderTitle, HeaderDescription };
