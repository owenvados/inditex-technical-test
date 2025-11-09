import React from 'react';

import './Sidebar.css';

/**
 * Props for the `Sidebar` component.
 */
export interface SidebarProps {
  children: React.ReactNode;
}

/**
 * Shared sidebar layout component wrapping content in an aside container.
 *
 * @param props Children to render inside the sidebar.
 * @returns Aside element with the shared sidebar styling applied.
 */
export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const content = <div className="sidebar__content">{children}</div>;
  return <aside className="sidebar">{content}</aside>;
};

Sidebar.displayName = 'Sidebar';

export default Sidebar;
