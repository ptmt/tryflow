/* @flow */
import React from 'react'
import ReactDOM from 'react-dom'

/*************
 * types.js
 *************/
/*:: // The example of Flow comments

type CommentBoxState = {
  author1: ?string; // TYPO
  text: string;
  data: Array<any>;
}

type ActionCreator = Function;
type Action = {
    type: string;
    author?: string;
    text?: string;
    data1?: Array<any>; // TYPO
}

type Actions = {
  handleAuthorChange: ActionCreator;
  handleTextChange: ActionCreator;
  // FORGOT ABOUT handleSubmit
}
*/

/***************
 * actions.js
 ***************/

function fetchComments() {
  return dispatch => {
    dispatch({ type: 'LOAD_COMMENTS' })
    fetch('/some/url')
      .then(res => res.json())
      .then(json => dispatch({ type: 'LOAD_COMMENTS_FINISHED', data: json }))
      .catch(err => dispatch({ type: 'LOAD_COMMENTS_ERROR', err }))
  }
}

const authorChange = (author) => ({ type: 'AUTHOR_CHANGED', author })
const textChange = (text) => ({ type: 'TEXT_CHANGED', text })

/***************
 * reducer.js
 ***************/

const INITIAL_STATE = {
  author: '',
  text: '',
  data: [],
}

const commentReducer = (state = INITIAL_STATE, action: Action): CommentBoxState => {
  switch (action.type) {
    case 'LOAD_COMMENTS_FINISHED':
      return {
        ...state,
        data: action.data,
      };
    case 'AUTHOR_CHANGED':
      return {
        ...state,
        author: action.author,
      }
    case 'TEXT_CHANGED':
      return {
        ...state,
        text: action.text,
      }
    default:
      return state;
  }
}

/***************
 * Comment.js
 ***************/
const Comment = ({ author, children }) => (
  <div className="comment">
    <h2 className="commentAuthor">
      {author}
    </h2>
    {children}
  </div>
)

/***************
 * CommentList.js
 ***************/
const CommentList = ({ data }) => (
  <div className="commentList">
    {data.map(comment =>
      <Comment author={comment.author} key={comment.id}>
        {comment.text}
      </Comment>
    )}
  </div>
)

/***************
 * CommentForm.js
 ***************/
const CommentFrom = ({
    author,
    text,
    handleAuthorChange,
    handleTextChange,
    handleSubmit
}: (Actions & CommentBoxState)) => (
  <form className="commentForm" onSubmit={handleSubmit}>
    <input
      type="text"
      placeholder="Your name"
      value={author}
      onChange={handleAuthorChange}
    />
    <input
      type="text"
      placeholder="Say something..."
      value={text}
      onChange={handleTextChange}
    />
    <input type="submit" value="Post" />
  </form>
)

/***************
 * CommentBox.js
 ***************/
const CommentBox = (props: Actions & CommentBoxState) => (
  <div className="commentBox">
    <h1>Comments</h1>
    <CommentList data={props.data1} />
    <CommentFrom {...props} />
  </div>
)

// from redux
const bindActionCreators = () => {}
const connect = (mapStateToProps, mapDispatchToProps) =>
    (ReactComponent) =>
    () =>
    <ReactComponent {...mapStateToProps()} {...mapDispatchToProps()} />

const commandAction = {
  authorChange,
  textChange,
  fetchComments,
}
/***************
 * CommentBoxContainer.js
 ***************/
const CommentBoxContainer = connect(
  state => state,
  dispatch => bindActionCreators(commandAction, dispatch)
)(CommentBox)

ReactDOM.render(
  <CommentBoxContainer />,
  document.getElementById('content')
);
