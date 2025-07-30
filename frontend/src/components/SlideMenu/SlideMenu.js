import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './SlideMenu.module.scss';

const SlideMenu = ({activeIndex, setActiveIndex}) => {
  //const [activeIndex, setActiveIndex] = useState(0);
  const lineRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (itemsRef.current[activeIndex] && lineRef.current) {
      const activeItem = itemsRef.current[activeIndex];
      const leftPosition = activeItem.offsetLeft;
      const width = activeItem.offsetWidth;
      lineRef.current.style.width = `${width}px`;
      lineRef.current.style.left = `${leftPosition}px`;
    }
  }, [activeIndex]);

  const menuItems = [
    {
        title: 'New',
        url: '/',
    },
    
    {

        title: 'Trending',
        url: '/',
    },

    {

        title: 'Old',
        url: '/',
    }


];

  return (
    <div className={styles.menu}>
      {menuItems.map((item, index) => (
        <Link
          to={item.url}
          key={index}
          className={`${styles['menu-item']} ${index === activeIndex ? styles['active'] : ''}`}
          onClick={(e) => {
            e.preventDefault();
            setActiveIndex(index);
          }}
          ref={(el) => (itemsRef.current[index] = el)}
        >
          {item.title}
        </Link>
      ))}
      <div className={styles.line} ref={lineRef}></div>
    </div>
  );
};

export default SlideMenu;
