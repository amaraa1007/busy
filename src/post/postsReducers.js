import * as feedTypes from '../feed/feedActions';
import * as bookmarksActions from '../bookmarks/bookmarksActions';
import * as postsActions from './postActions';

const postItem = (state = {}, action) => {
  switch (action.type) {
    case postsActions.LIKE_POST_START:
      const optimisticActiveVotes = [
        ...state.active_votes.filter(vote => vote.voter !== action.meta.voter),
        {
          voter: action.meta.voter,
          percent: action.meta.weight,
        },
      ];
      const optimisticNetVotes = action.meta.weight > 0
        ? parseInt(state.net_votes) + 1
        : parseInt(state.net_votes) - 1;

      return {
        ...state,
        active_votes: optimisticActiveVotes,
        net_votes: optimisticNetVotes,
      };
    default:
      return state;
  }
};

const posts = (state = {}, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT_SUCCESS:
    case feedTypes.GET_MORE_USER_FEED_CONTENT_SUCCESS:
    case bookmarksActions.GET_BOOKMARKS_SUCCESS:
      const posts = {};
      action.payload.postsData.forEach(post => posts[post.id] = post);
      return {
        ...state,
        ...posts,
      };
    case postsActions.GET_CONTENT_SUCCESS:
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };
    case postsActions.LIKE_POST_START:
      return {
        ...state,
        [action.meta.postId]: postItem(state[action.meta.postId], action),
      };
    default:
      return state;
  }
};


export default posts;
