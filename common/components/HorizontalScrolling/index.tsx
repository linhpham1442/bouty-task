import classNames from "classnames";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

function outerWidth(el: any) {
  var width = el.offsetWidth;
  var style = getComputedStyle(el);

  width += parseInt(style.marginLeft) + parseInt(style.marginRight);
  return width;
}

const ArrowLeft = () => <ArrowLeft2 size={20} />;
const ArrowRight = () => <ArrowRight2 size={20} />;

interface HorizontalScrollingProps {
  data: React.ReactNode[];
  arrowLeft?: React.ReactNode;
  arrowRight?: React.ReactNode;
  scrollDuration?: number;
  isAutoHiddenArrow?: boolean;
  initScrollItem?: number;
}

const HorizontalScrolling: React.FC<HorizontalScrollingProps> = (props) => {
  const { data, scrollDuration, isAutoHiddenArrow, initScrollItem } = props;
  const [itemSize, setItemSize] = useState<number>(0);
  const [menuWrapperSize, setMenuWapperSize] = useState<number>(0);
  const [isShowLeftPaddle, setShowLeftPaddle] = useState<boolean>(false);
  const [isShowRightPaddle, setShowRightPaddle] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const itemsLength = data.length;
  const paddleMargin = 0;

  const getMenuWrapperSize = useCallback(() => {
    return wrapperRef?.current?.offsetWidth ?? 0;
  }, [wrapperRef]);

  const setMenuWrapperSize = useCallback(() => {
    setMenuWapperSize(getMenuWrapperSize());
  }, [getMenuWrapperSize]);

  const getMenuPosition = useCallback(() => {
    return menuRef?.current?.scrollLeft ?? 0;
  }, []);

  const handleScrollMenu = useCallback(() => {
    let menuSize = itemsLength * itemSize;
    let menuInvisibleSize = menuSize - menuWrapperSize;

    // get how much have we scrolled so far
    let menuPosition = getMenuPosition();

    let menuEndOffset = menuInvisibleSize - paddleMargin;

    // show & hide the paddles
    // depending on scroll position
    if (menuPosition <= paddleMargin) {
      setShowLeftPaddle(false);
      setShowRightPaddle(true);
    } else if (menuPosition < menuEndOffset) {
      // show both paddles in the middle
      setShowLeftPaddle(true);
      setShowRightPaddle(true);
    } else if (menuPosition >= menuEndOffset) {
      setShowLeftPaddle(true);
      setShowRightPaddle(false);
    }
  }, [getMenuPosition, itemsLength, itemSize, menuWrapperSize]);

  const handleClickLeft = useCallback(() => {
    let menuPosition = getMenuPosition();
    menuRef.current.scrollTo({ left: menuPosition - scrollDuration, behavior: "smooth" });
  }, [getMenuPosition, scrollDuration]);

  const handleClickRight = useCallback(() => {
    let menuPosition = getMenuPosition();
    menuRef.current.scrollTo({ left: menuPosition + scrollDuration, behavior: "smooth" });
  }, [getMenuPosition, scrollDuration]);

  useEffect(() => {
    setMenuWrapperSize();
    window.addEventListener("resize", setMenuWrapperSize);

    if (isAutoHiddenArrow) {
      handleScrollMenu();
      menuRef?.current?.addEventListener("scroll", handleScrollMenu);
    }

    return () => {
      window.removeEventListener("resize", setMenuWrapperSize);
      if (isAutoHiddenArrow) {
        menuRef?.current?.removeEventListener("scroll", handleScrollMenu);
      }
    };
  }, [setMenuWrapperSize, handleScrollMenu, isAutoHiddenArrow]);

  useEffect(() => {
    setTimeout(() => {
      if (itemRef.current) {
        let itemSize = outerWidth(itemRef.current);
        setItemSize(itemSize);
      }
    }, 500);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (itemRef.current) {
        let itemSize = outerWidth(itemRef.current);
        if (initScrollItem !== null && initScrollItem !== undefined) {
          menuRef.current.scrollTo({ left: itemSize * initScrollItem, behavior: "smooth" });
        }
      }
    }, 500);
  }, [initScrollItem]);

  return (
    <div ref={wrapperRef} className="horizontal-scrolling-container">
      <div ref={menuRef} className="horizontal-scrolling-menu">
        {data.map((item, index) => (
          <div ref={itemRef} key={index} className="horizontal-scrolling-item">
            {item}
          </div>
        ))}
      </div>
      <div className="paddles">
        <div
          className={classNames("left-paddle paddle", {
            hidden: isAutoHiddenArrow && !isShowLeftPaddle,
          })}
          onClick={handleClickLeft}
        >
          <ArrowLeft />
        </div>
        <div
          className={classNames("right-paddle paddle", {
            hidden: isAutoHiddenArrow && !isShowRightPaddle,
          })}
          onClick={handleClickRight}
        >
          <ArrowRight />
        </div>
      </div>
    </div>
  );
};

HorizontalScrolling.defaultProps = {
  scrollDuration: 150,
  isAutoHiddenArrow: false,
};

export default HorizontalScrolling;
