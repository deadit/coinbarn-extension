import React from 'react';

interface IHomeHeaderProps {
  toggleSettings: () => void
  toggleMenuBlock: () => void
  settingsOn: boolean
  aboutOn: boolean
}

export default class HomeHeader extends React.Component<IHomeHeaderProps, {}> {

  public render() {
    const menuBtn = this.props.aboutOn ? 'closeBtn' : 'menuBtn';
    const settingsBtn = this.props.settingsOn ? 'closeBtn' : 'settingsBtn';

    return (
      <div className='homeHeader'>
        <button className={menuBtn} onClick={this.props.toggleMenuBlock}/>
        <button className={settingsBtn} onClick={this.props.toggleSettings}/>
      </div>
    );
  }
}
