import * as Headless from '@headlessui/react';
import { forwardRef } from 'react';
import { useNavigate } from "react-router";

export const Link = forwardRef(function Link({ onClick, href, ...props }, ref) {
  const navigate = useNavigate();
  const handleClick = (event) => {
    if (href) {
      // Prevent default link behavior
      event.preventDefault();

      navigate(href);
      
      // Trigger custom navigation or SPA-specific logic if needed
      if (onClick) {
        onClick(event);
      }
    }
  };

  return (
    <Headless.DataInteractive>
      <a {...props} ref={ref} href={href} onClick={handleClick} />
    </Headless.DataInteractive>
  );
});

