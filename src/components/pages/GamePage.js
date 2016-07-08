import React from 'react';

import PartBar from '../bars/PartBar';
import SkillBar from '../bars/SkillBar';
import Page from './Page';


export default class GamePage extends Page {

  render() {

    const _createCards = (count, className) => {
      return Array.from({ length: count }).map((notUsed, index) => {
        return <div key={ `card-${ index }` } className={ className }>
          <Card />
        </div>;
      });
    };

    return (
      <div className="game-page">
        <div className="game-page__header">
          Header
        </div>
        <div className="game-page__field">
          Field
        </div>
        <div className="game-page__messages">
          Messages
        </div>
        <div className="game-page__controller">
          <div className="status-button">Stat</div>
          <div className="next-button">Next</div>
          <div className="system-button">Sys</div>
        </div>
        <ul className="game-page__parts-and-skills">
          <li className="category-partition">Parts</li>
          <PartBar />
          <PartBar />
          <PartBar />
          <PartBar />
          <PartBar />
          <li className="category-partition">Skills</li>
          <SkillBar />
          <SkillBar />
          <SkillBar />
          <SkillBar />
          <SkillBar />
        </ul>
      </div>
    );
  }
}
