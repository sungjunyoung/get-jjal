import React, {Component} from 'react';

import './style.css';

export default class WhoMake extends Component {

    render() {
        return (
            <div className="WhoMake"
                 style={{marginTop: 90}}>
                <div style={{
                    position: 'fixed', width: 300, height: 300,
                    top: '50%', left: '50%', marginLeft: -150, marginTop: -150,

                }}>
                    <div className="who">
                        FRONTEND : 성준영
                    </div>
                    <div className="who">
                        BACKEND : 김성주
                    </div>
                    <div className="who">
                        서버지원 : 임병훈
                    </div>
                    <div className="who">
                        도움 : 황보동규
                    </div>
                </div>
            </div>
        );
    }
}