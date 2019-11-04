'use strict';

const { createElement } = require('preact');
const { useCallback, useMemo, useState } = require('preact/hooks');
const propTypes = require('prop-types');

const uiConstants = require('../ui-constants');
const useStore = require('../store/use-store');
const VersionData = require('../util/version-data');
const { withServices } = require('../util/service-context');

const SidebarPanel = require('./sidebar-panel');
const SvgIcon = require('./svg-icon');
const Tutorial = require('./tutorial');
const VersionInfo = require('./version-info');

/**
 * External link "tabs" inside of the help panel.
 */
function HelpPanelTab({ linkText, url }) {
  return (
    <div className="help-panel-tabs__tab">
      <a
        href={url}
        className="help-panel-tabs__link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {linkText}{' '}
        <SvgIcon
          name="external"
          className="help-panel-tabs__icon"
          inline={true}
        />
      </a>
    </div>
  );
}

HelpPanelTab.propTypes = {
  /* What the tab's link should say */
  linkText: propTypes.string.isRequired,
  /* Where the tab's link should go */
  url: propTypes.string.isRequired,
};

/**
 * A help sidebar panel with two sub-panels: tutorial and version info.
 */
function HelpPanel({ auth, session }) {
  const mainFrame = useStore(store => store.mainFrame());

  // Should this panel be auto-opened at app launch? Note that the actual
  // auto-open triggering of this panel is owned by the `hypothesis-app` component.
  // This reference is such that we know whether we should "dismiss" the tutorial
  // (permanently for this user) when it is closed.
  const hasAutoDisplayPreference = useStore(
    store => !!store.getState().session.preferences.show_sidebar_tutorial
  );

  // The "Tutorial" (getting started) subpanel is the default panel shown
  const [activeSubPanel, setActiveSubPanel] = useState('tutorial');

  // Build version details about this session/app
  const versionData = useMemo(() => {
    const userInfo = auth || {};
    const documentInfo = mainFrame || {};
    return new VersionData(userInfo, documentInfo);
  }, [auth, mainFrame]);

  // The support ticket URL encodes some version info in it to pre-fill in the
  // create-new-ticket form
  const supportTicketURL = `https://web.hypothes.is/get-help/?sys_info=${versionData.asEncodedURLString()}`;

  const subPanelTitles = {
    tutorial: 'Getting started',
    versionInfo: 'About this version',
  };

  const openSubPanel = (e, panelName) => {
    e.preventDefault();
    setActiveSubPanel(panelName);
  };

  const dismissFn = session.dismissSidebarTutorial; // Reference for useCallback dependency
  const onActiveChanged = useCallback(
    active => {
      if (!active && hasAutoDisplayPreference) {
        // If the tutorial is currently being auto-displayed, update the user
        // preference to disable the auto-display from happening on subsequent
        // app launches
        dismissFn();
      }
    },
    [dismissFn, hasAutoDisplayPreference]
  );

  return (
    <SidebarPanel
      title="Need some help?"
      panelName={uiConstants.PANEL_HELP}
      onActiveChanged={onActiveChanged}
    >
      <h3 className="help-panel__sub-panel-title">
        {subPanelTitles[activeSubPanel]}
      </h3>
      <div className="help-panel__content">
        {activeSubPanel === 'tutorial' && <Tutorial />}
        {activeSubPanel === 'versionInfo' && (
          <VersionInfo versionData={versionData} />
        )}
        <div className="help-panel__footer">
          {activeSubPanel === 'versionInfo' && (
            <a
              href="#"
              className="help-panel__sub-panel-link help-panel__sub-panel-link--left"
              onClick={e => openSubPanel(e, 'tutorial')}
            >
              <SvgIcon name="arrow-left" className="help-panel__icon" />
              <div>Getting started</div>
            </a>
          )}
          {activeSubPanel === 'tutorial' && (
            <a
              href="#"
              className="help-panel__sub-panel-link help-panel__sub-panel-link--right"
              onClick={e => openSubPanel(e, 'versionInfo')}
            >
              <div>About this version</div>
              <SvgIcon name="arrow-right" className="help-panel__icon" />
            </a>
          )}
        </div>
      </div>
      <div className="help-panel-tabs">
        <HelpPanelTab
          linkText="Help topics"
          url="https://web.hypothes.is/help/"
        />
        <HelpPanelTab linkText="New support ticket" url={supportTicketURL} />
      </div>
    </SidebarPanel>
  );
}

HelpPanel.propTypes = {
  /* Object with auth and user information */
  auth: propTypes.object.isRequired,
  session: propTypes.object.isRequired,
};

HelpPanel.injectedProps = ['session'];
module.exports = withServices(HelpPanel);
