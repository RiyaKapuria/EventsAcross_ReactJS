import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { WithContext as ReactTags } from 'react-tag-input';

export default class Tag extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      i: 0
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  handleDelete(i) {
    let tags = this.state.tags;
    tags.splice(i, 1);
    this.setState({tags: tags});
  }

  handleAddition(tag) {
    let tags = this.state.tags;
    tags.push({
      id: this.state.i + 1,
      text: tag
    });
    this.setState({
      tags: tags,
      i: this.state.i + 1
    });
    this.props.onLoad(tags);
  }

  handleDrag(tag, currPos, newPos) {
    let tags = this.state.tags;
    // mutate array
    tags.splice(currPos, 1);
    tags.splice(newPos, 0, tag);
    // re-render
    this.setState({ tags: tags });
  }

  render() {
    const { tags, suggestions } = this.state;
    return (
      <div>
        <ReactTags tags={tags}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleDrag={this.handleDrag} />
      </div>
    );
  }
}
