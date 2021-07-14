import React, { useState, useMemo } from "react";
import classNames from "classnames";
import DWChart from "react-datawrapper-chart";
import TabBar from "components/_shared/TabBar/TabBar";
import Slider from "components/_shared/Slider/Slider"
import RangeSlider from "components/_shared/RangeSlider/RangeSlider"

import "./TabbedView.css";
import { useLayoutEffect } from "react";
import { useRef } from "react";
import { useEffect } from "react";

const Frame = ({ tab, isFixedHeight, ...props }) => {
  if (isFixedHeight) {
    return (
      <iframe
        src={tab.url}
        title={tab.frameTitle}
        aria-label={tab.ariaLabel}
        frameBorder="0"
        scrolling="no"
        {...props}
      />
    );
  } else {
    return (
      <DWChart
        src={tab.url}
        title={tab.frameTitle}
        aria-label={tab.ariaLabel}
        frameBorder="0"
        scrolling="no"
        loading="lazy"
        {...props}
      />
    );
  }
};

function Navigation({
  id,
  tabs,
  currentTabIdx,
  setCurrentTabIdx,
  format = (value) => value,
  disabled = () => false,
  type = "tabs",
  className = "nav",
}) {
  const selectedTab = tabs[currentTabIdx];
  if (!selectedTab) return null;

  switch (type) {
    case "tabs":
      return (
        <TabBar
          id={id}
          className={className}
          tabs={tabs}
          format={format}
          selectedTab={selectedTab}
          onChange={(tab) => {
            setCurrentTabIdx(tab.idx);
          }}
          disabled={disabled}
        />
      )
    
    case "slider":
      const getTab = (idx) => (idx >= 0 && idx < tabs.length) ? tabs[idx] : null;
      const prevTab = getTab(currentTabIdx - 1);
      const nextTab = getTab(currentTabIdx + 1);
          
      // this is what is rendered as tab title
      const tabTitle = (tab) => tab ? <span className="slider--tab-title">{tab.title}</span> : null
      
      return (
        <Slider
          onBackwardNavigation={() => { setCurrentTabIdx(prevTab.idx) }}
          onForwardNavigation={() => { setCurrentTabIdx(nextTab.idx) }}
          className={className}
        >
          {() => tabTitle(prevTab)}
          {() => tabTitle(selectedTab)}
          {() => tabTitle(nextTab)}
        </Slider>
      )

    case 'range-slider':
      return (
        <RangeSlider
          id="datawrapper-switcher"
          className={className}
          items={tabs}
          getValue={(tab) => +tab.title}
          format={(tab) => tab.title}
          selectedItem={selectedTab}
          onChange={(tab) => {
            setCurrentTabIdx(tab.idx);
          }}
        />
      )
    
    default:
      return <></>;
  }
}

function TabbedView({ uuid, tabs, type = "tabs", height = "auto", background = "#fff" }) {
  const [currentTopTabIdx, setCurrentTopTabIdx] = useState(0);
  const [currentBottomTabIdx, setCurrentBottomTabIdx] = useState(0);
  const [appHeight, setAppHeight] = useState();
  const appRef = useRef();

  const isFixedHeight = useMemo(() => height !== "auto", [height]);

  useLayoutEffect(() => {
    if (!uuid || isFixedHeight) {
      return;
    }

    const handle = setInterval(async () => {
      if (!appRef.current) return;
      const app = appRef.current;
      setAppHeight(app.clientHeight);
    }, 100);
    return () => {
      clearInterval(handle);
    };
  }, [isFixedHeight, uuid]);

  useEffect(() => {
    if (!appHeight || !uuid) return;

    const command = {
      "set-height": {
        value: `${appHeight}`,
      },
    };
    window.parent.postMessage({ "data-tabs-command": command, "data-tabs-target": uuid }, "*");
  }, [uuid, appHeight]);

  const [frames, topTabs, bottomTabs] = useMemo(() => {
    const enumerate = (arr) => arr.map((item, idx) => ({ ...item, idx }));

    // if not every tab has a subtitle, ignore all subtitles
    // and render a single tab bar only
    if (tabs.filter((tab) => tab.subTitle).length !== tabs.length) {
      return [
        tabs.map((tab, idx) => ({ ...tab, topIdx: idx, bottomIdx: 0 })),
        enumerate(tabs),
        []
      ];
    }

    const titles = tabs.map((tab) => tab.title);
    const subTitles = tabs.map((tab) => tab.subTitle);

    // extract unique lists of tabs
    let topTabs = enumerate(tabs.filter((tab, idx) => titles.indexOf(tab.title) === idx));
    let bottomTabs = enumerate(tabs.filter((tab, idx) => subTitles.indexOf(tab.subTitle) === idx));
    
    const topTitles = topTabs.map((ttab) => ttab.title);
    const bottomTitles = bottomTabs.map((ttab) => ttab.subTitle);

    // assign every datawrapper frame to a tab combination
    const frames = tabs.map((tab) => ({
      ...tab,
      topIdx: topTitles.indexOf(tab.title),
      bottomIdx: bottomTitles.indexOf(tab.subTitle)
    }))

    // sync with frames
    topTabs = topTabs.map((tab) => ({ ...tab, idx: topTitles.indexOf(tab.title) }))
    bottomTabs = bottomTabs.map((tab) => ({ ...tab, idx: bottomTitles.indexOf(tab.subTitle) }))

    return [ frames, topTabs, bottomTabs ];
  }, [tabs]);

  // check for invalid tab combinations
  useEffect(() => {
    if (!frames.some((frame) => frame.topIdx === currentTopTabIdx && frame.bottomIdx === currentBottomTabIdx)) {
      const validFrame = frames.find((frame) => frame.topIdx === currentTopTabIdx)
      if (validFrame) setCurrentBottomTabIdx(validFrame.bottomIdx)
    }
  }, [frames, currentTopTabIdx, currentBottomTabIdx])

  return (
    <div
      className={classNames("app", isFixedHeight && "app-fixed")}
      ref={appRef}
      style={{ background }}
    >
      <Navigation
        id="datawrapper-switcher-top"
        tabs={topTabs}
        format={(tab) => tab?.title}
        currentTabIdx={currentTopTabIdx}
        setCurrentTabIdx={setCurrentTopTabIdx}
        type={type}
      />

      {bottomTabs && <Navigation
        id="datawrapper-switcher-bottom"
        tabs={bottomTabs}
        format={(tab) => tab?.subTitle}
        currentTabIdx={currentBottomTabIdx}
        setCurrentTabIdx={setCurrentBottomTabIdx}
        type={type}
        disabled={(tab) => !frames.some((frame) => frame.topIdx === currentTopTabIdx && frame.bottomIdx === tab.idx)}
      />}

      <div className="panel-container">
        {frames.map((tab) => (
          <Frame
            key={[tab.topIdx, tab.bottomIdx].join('-')}
            tab={tab}
            isFixedHeight={isFixedHeight}
            className={classNames(
              "frame",
              isFixedHeight && "frame-fixed",
              (currentTopTabIdx === tab.topIdx && currentBottomTabIdx === tab.bottomIdx) && "is-selected"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default TabbedView;
