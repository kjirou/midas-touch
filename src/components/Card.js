import React from 'react';


export default class Card extends React.Component {

  render() {
    return (
      <div className="card">
        <div className="card__header">
          <div className="card__header__symbol">E</div>
          <div className="card__header__name">
            <div className="card__header__name__text">Goblin</div>
          </div>
        </div>
        <div className="card__picture">
          picture
        </div>
        <div className="card__description">
          description
        </div>
      </div>
    );
  }
}
