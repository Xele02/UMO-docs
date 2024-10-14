import React from 'react';
import DocSidebarItem from '@theme-original/DocSidebarItem';

export default function DocSidebarItemWrapper(props) {
  if(props.item.customProps?.sb_hide)
    return null;
  return (
    <>
      <DocSidebarItem {...props} />
    </>
  );
}
