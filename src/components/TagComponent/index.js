import React, {Component} from 'react';

import './style.css';

export default class TagComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="TagComponent">
                #{this.props.tag.name}
                {this.props.listView ?
                    null :
                    <span onClick={() => this.props.deleteTag(this.props.tag)} className="deleteTag">X</span>
                }
            </div>
        );
    }
}