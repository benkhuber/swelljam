import React from 'react';

function Header() {
  return (
    <div className="header">
      <h1>SwellJam</h1>
      <div>
        <a href="/">About</a>
        <a href="/surfreport">Local Surf Report</a>
        <a href="/regionalreport">Regional Report</a>
      </div>
    </div>
  );
}

export default Header;
