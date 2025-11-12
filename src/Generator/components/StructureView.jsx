import React, { useState } from 'react';
import {
  BsSquare, BsCardHeading, BsTextParagraph, BsLayoutSplit,
  BsLayoutThreeColumns, BsCodeSlash, BsBricks, BsLayoutTextSidebarReverse,
  BsListUl, BsInputCursorText, BsInputCursor,
  BsMenuButtonWide, BsTextareaT, BsTag, BsImage,
  BsTable, BsLink45Deg
} from 'react-icons/bs';
import { CiBoxList } from "react-icons/ci";
import { FaWpforms } from "react-icons/fa6";
import { TbSvg } from "react-icons/tb";
import { IoLogoJavascript } from "react-icons/io";
import { IoText } from "react-icons/io5";
import { DiMarkdown } from "react-icons/di";

import { RxButton } from "react-icons/rx";
import { BsTypeH1, BsTypeH2, BsTypeH3, BsTypeH4, BsTypeH5, BsTypeH6 } from "react-icons/bs";

import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import './StructureView.scss';

const ICONS = {
  // Layout
  section: <BsLayoutSplit />,
  container: <BsLayoutThreeColumns />,
  div: <BsSquare />,
  block: <BsBricks />,

  // Typography
  heading: <BsTypeH1 />,
  h1: <BsTypeH1 />,
  h2: <BsTypeH2 />,
  h3: <BsTypeH3 />,
  h4: <BsTypeH4 />,
  h5: <BsTypeH5 />,
  h6: <BsTypeH6 />,
  p: <BsTextParagraph />,
  span: <BsTextParagraph />,
  'text': <BsTextareaT />,
  'text-basic': <IoText />,
  'mark': <DiMarkdown />,

  // Navigation
  nav: <BsLayoutTextSidebarReverse />,
  menu: <BsListUl />,

  // Forms
  form: <FaWpforms />,

  // Media
  img: <BsImage />,
  image: <BsImage />,
  picture: <BsImage />,
  figure: <BsImage />,

  list: <CiBoxList />,
  li: <CiBoxList />,

  // Tables
  table: <BsTable />,
  thead: <BsTable />,
  tbody: <BsTable />,
  tr: <BsTable />,
  th: <BsTable />,
  td: <BsTable />,

  // Interactive
  a: <BsLink45Deg />,
  button: <RxButton />,

  // Code
  code: <BsCodeSlash />,
  script: <IoLogoJavascript />,
  pre: <BsCodeSlash />,
  svg: <TbSvg />,

  // Default
  default: <BsSquare />,
};

const StructureView = ({ data, globalClasses, activeIndex, showNodeClass }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Build tree structure from Elementor elements
  const elementsById = data.reduce((acc, el) => {
    acc[el.id] = { ...el, children: [] };
    return acc;
  }, {});

  // For Elementor format, all elements are at root level
  // We need to build hierarchy based on elements array
  const roots = [];
  data.forEach(el => {
    // If element has elements array, populate children
    if (el.elements && Array.isArray(el.elements)) {
      el.elements.forEach(childId => {
        if (elementsById[childId]) {
          elementsById[el.id].children.push(elementsById[childId]);
        }
      });
    }
    // Add to roots if it's not referenced as a child anywhere
    const isChild = data.some(parent => 
      parent.elements && Array.isArray(parent.elements) && parent.elements.includes(el.id)
    );
    if (!isChild) {
      roots.push(elementsById[el.id]);
    }
  });

  const getElementInfo = (element) => {
    // Determine element type from Elementor structure
    let label = 'Element';
    let iconKey = 'default';

    if (element.widgetType) {
      // Widget element
      const widgetMap = {
        'e-button': { label: 'Button', icon: 'button' },
        'e-heading': { label: 'Heading', icon: 'heading' },
        'e-paragraph': { label: 'Paragraph', icon: 'p' },
        'e-image': { label: 'Image', icon: 'image' },
        'e-divider': { label: 'Divider', icon: 'div' },
        'e-svg': { label: 'SVG', icon: 'svg' },
      };
      const widget = widgetMap[element.widgetType] || { label: element.widgetType, icon: 'default' };
      label = widget.label;
      iconKey = widget.icon;
    } else if (element.elType === 'e-div-block') {
      const tag = element.settings?.tag?.value || 'div';
      label = tag.charAt(0).toUpperCase() + tag.slice(1);
      iconKey = tag;
    } else if (element.elType === 'e-flexbox') {
      label = 'Flexbox';
      iconKey = 'container';
    } else {
      label = element.elType || 'Element';
    }

    const info = {
      icon: ICONS[iconKey] || ICONS.default,
      label: label,
      className: '',
    };

    // Get class name if exists
    if (element.settings?.classes?.value?.length > 0) {
      const classId = element.settings.classes.value[0];
      info.className = `.${classId}`;
    }

    return info;
  };

  const TreeNode = ({ node }) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = node.children.length > 0;
    const { icon, label, className } = getElementInfo(node);
    const isActive = node._order === activeIndex;

    return (
      <li className={isActive ? 'active' : ''}>
        <div className={`node-content${isActive ? ' active' : ''}`} onClick={() => hasChildren && setIsOpen(!isOpen)}>
          <span className="node-toggle">
            {hasChildren ? (isOpen ? <FiChevronDown /> : <FiChevronRight />) : <span className="no-toggle"></span>}
          </span>
          <span className="node-icon">{icon}</span>
          {showNodeClass ? (
            <span className="node-class">{className}</span>
          ) : (
            <span className="node-tag">{label}</span>
          )}
        </div>
        {hasChildren && isOpen && (
          <ul>
            {node.children.map(child => (
              <TreeNode key={child.id} node={child} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="structure-view">
      <ul>
        {roots.map(node => (
          <TreeNode key={node.id} node={node} />
        ))}
      </ul>
    </div>
  );
};

export default StructureView;