"use strict";

import * as p from 'babel-core/polyfill'
import React from 'react';
import Tile from './components/Tile';
import Controls from './components/Controls';
import * as constants from './constants/AppConstants';
import {addons} from 'react/addons';
import LogoStore from './stores/LogoStore';
import AppDispatcher from './dispatchers/AppDispatcher';

var getNextKey = function *() {
    let id = 0;
    while (true) {
        yield id++;
    }
};

var store = new LogoStore;
var dispatcher = new AppDispatcher;
dispatcher.register(store.performAction.bind(store));

//Scramble to start with
dispatcher.handleViewAction(constants.Actions.SCRAMBLE);

dispatcher.handleViewAction(constants.Actions.ORGANIZE);

class Logo extends React.Component {
    componentWillMount() {
        this.state = {
            logo: store.getState()
        };

        store.addChangeListener(this.adjust.bind(this));
        store.addOrganizeListener(this.adjust.bind(this));
        store.addScrambleListener(this.adjust.bind(this));

    }

    componentWillUnmount() {
        store.removeChangeListener(this.adjust.bind(this));
        store.removeOrganizeListener(this.adjust.bind(this));
        store.removeScrambleListener(this.adjust.bind(this));
    }

    adjust() {
        this.setState({logo: store.getState()});
    }

    render() {
        var ReactCSSTransitionGroup = addons.CSSTransitionGroup;
        var tiles = this.state.logo.map(function (rows, rowIndex) {
            let letters = rows.map(function(tile, columnIndex) {
                return <Tile row={rowIndex} column={columnIndex} dispatcher={dispatcher} value={tile.letter} style={tile.style} key={Logo.makeKey.next().value} type={tile.type} />;
            });
            return (
                <div>
                    <div key={Logo.makeKey.next().value}>
                        <ReactCSSTransitionGroup transitionName="animate">
                            {letters}
                        </ReactCSSTransitionGroup>
                    </div>
                </div>
            );
        });

        return (
            <div>
                <div className="div-center">
                    <Controls dispatcher={dispatcher} store={store}/>
                </div>
                <div className="logo" key={Logo.makeKey.next().value}>
                    {tiles}
                </div>
            </div>
        );
    }
}

Logo.makeKey = getNextKey();

React.render(<Logo />, document.getElementById('content'));
