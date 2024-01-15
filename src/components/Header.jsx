import React from 'react';

function Header() {
  return (
    <div className="header">
      <h1 className="homeHeader">SwellJam</h1>
      <div className="headerLinkMenu">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/addsession">Add Session</a>
        <a href="/viewsessions">View Sessions</a>
      </div>
    </div>
  );
}

export default Header;
